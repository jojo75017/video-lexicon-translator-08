import { supabase } from '@/integrations/supabase/client';
import { readBookBrief, writeBookBrief, type BookBrief } from '@/lib/v3/bookBrief';
import type { GenieMessage } from '@/lib/v3/genieThread';

export const BOOK_DRAFT_STATUS_EVENT = 'v3:book-draft-status';
export type BookDraftStatus = { state: 'local' | 'saving' | 'saved' | 'error'; at?: string; message?: string; projectId?: string };

function announce(status: BookDraftStatus) {
  window.dispatchEvent(new CustomEvent<BookDraftStatus>(BOOK_DRAFT_STATUS_EVENT, { detail: status }));
}

export async function saveBookDraftToCloud(
  briefInput?: BookBrief,
  options: { messages?: GenieMessage[]; activeStep?: number } = {},
): Promise<{ projectId: string | null; error?: string }> {
  const brief = briefInput || readBookBrief() || {};
  announce({ state: 'saving', projectId: brief.projectId || undefined });
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    announce({ state: 'local', message: 'Connectez-vous pour retrouver ce brouillon sur un autre appareil.' });
    return { projectId: brief.projectId || null, error: 'not-authenticated' };
  }

  const title = (brief.title || '').trim() || `Mon récit du ${new Date().toLocaleDateString('fr-FR')}`;
  const draftState = {
    version: 1,
    brief: { ...brief, title },
    messages: options.messages || [],
    activeStep: options.activeStep || (brief.outlineValidated ? 3 : (brief.outline || []).length ? 2 : 1),
    savedAt: new Date().toISOString(),
  };
  const sharedPayload = {
    title,
    author_name: brief.author || '',
    book_summary: brief.description || '',
    kdp_description: brief.description || '',
    kdp_categories: brief.category || '',
    tone: brief.tone || '',
    number_of_chapters: Number(brief.chapters) || (brief.outline || []).length || 0,
    draft_state: draftState,
    user_id: auth.user.id,
    updated_at: new Date().toISOString(),
  };

  try {
    let id = brief.projectId || null;
    if (id) {
      // Ne jamais remplacer les chapitres déjà rédigés pendant une simple sauvegarde du récit.
      const { data, error } = await supabase.from('ebook_projects').update(sharedPayload as any)
        .eq('id', id).eq('user_id', auth.user.id).select('id').maybeSingle();
      if (error) throw error;
      id = data?.id || null;
    }
    if (!id) {
      const { data, error } = await supabase.from('ebook_projects').insert({
        ...sharedPayload,
        project_type: 'ebook',
        chapters: [],
      } as any).select('id').single();
      if (error) throw error;
      id = data.id;
    }
    const next = { ...brief, title, projectId: id, cloudSavedAt: draftState.savedAt };
    writeBookBrief(next);
    announce({ state: 'saved', at: draftState.savedAt, projectId: id || undefined });
    return { projectId: id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Enregistrement distant impossible.';
    announce({ state: 'error', message, projectId: brief.projectId || undefined });
    return { projectId: brief.projectId || null, error: message };
  }
}

export function restoreDraftState(value: unknown): { brief?: BookBrief; messages?: GenieMessage[]; activeStep?: number } | null {
  if (!value || typeof value !== 'object') return null;
  const draft = value as Record<string, unknown>;
  return {
    brief: draft.brief && typeof draft.brief === 'object' ? draft.brief as BookBrief : undefined,
    messages: Array.isArray(draft.messages) ? draft.messages as GenieMessage[] : undefined,
    activeStep: Number(draft.activeStep) || undefined,
  };
}