import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BibleContent, BookChapter, ChapterMemory, MasterSheetDraft } from '@/types/studioPro';

const db = supabase as any;

const countWords = (t: string) => t.split(/\s+/).filter(Boolean).length;

interface Args {
  projectId?: string | null;
  sheet: MasterSheetDraft;
  bible: BibleContent | null;
  chapters: BookChapter[];
  geminiKey?: string;
  onChaptersChange?: () => void;
}

/**
 * Phase 2 du Studio Pro : ChatGPT rédige chapitre par chapitre, Gemini analyse
 * chaque chapitre et alimente la mémoire persistante du livre.
 */
export const useChapterWriting = ({ projectId, sheet, bible, chapters, geminiKey, onChaptersChange }: Args) => {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [memories, setMemories] = useState<ChapterMemory[]>([]);
  const [busyChapterId, setBusyChapterId] = useState<string | null>(null);
  const [busyLabel, setBusyLabel] = useState<string>('');
  const [runningAll, setRunningAll] = useState(false);
  const [alerts, setAlerts] = useState<Record<number, string[]>>({});
  const cancelRef = useRef(false);

  const loadWriting = useCallback(async (id: string) => {
    try {
      const [{ data: versions }, { data: mem }] = await Promise.all([
        db.from('book_chapter_versions')
          .select('chapter_id,content,created_at')
          .eq('project_id', id)
          .order('created_at', { ascending: false }),
        db.from('book_memory')
          .select('*')
          .eq('project_id', id)
          .order('chapter_position', { ascending: true }),
      ]);
      const map: Record<string, string> = {};
      (versions || []).forEach((v: any) => {
        if (!map[v.chapter_id]) map[v.chapter_id] = v.content || '';
      });
      setContents(map);
      setMemories((mem || []) as ChapterMemory[]);
    } catch (e) {
      console.error('[StudioPro] loadWriting', e);
    }
  }, []);

  useEffect(() => {
    if (projectId) loadWriting(projectId);
  }, [projectId, loadWriting]);

  /** Enregistre une nouvelle version de chapitre (aucun écrasement). */
  const persistChapter = useCallback(
    async (chapter: BookChapter, content: string, opts: { kind: string; engine?: string; status?: string }) => {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId || !projectId) return;

      const { data: last } = await db
        .from('book_chapter_versions')
        .select('version')
        .eq('chapter_id', chapter.id)
        .order('version', { ascending: false })
        .limit(1)
        .maybeSingle();

      const words = countWords(content);
      await db.from('book_chapter_versions').insert({
        chapter_id: chapter.id,
        project_id: projectId,
        user_id: userId,
        kind: opts.kind,
        version: (last?.version || 0) + 1,
        content,
        engine: opts.engine || null,
        word_count: words,
      });
      await db
        .from('book_chapters')
        .update({ status: opts.status || 'brouillon', word_count: words })
        .eq('id', chapter.id);

      setContents((prev) => ({ ...prev, [chapter.id]: content }));
      onChaptersChange?.();
    },
    [projectId, onChaptersChange],
  );

  /** Gemini analyse le chapitre et met à jour la mémoire du livre. */
  const extractMemory = useCallback(
    async (chapter: BookChapter, content: string) => {
      if (!projectId) return;
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) return;

      const previous = memories.filter((m) => (m.chapter_position || 0) < chapter.position);
      const { data, error } = await supabase.functions.invoke('book-memory-extract', {
        body: {
          content,
          position: chapter.position,
          planned_summary: chapter.planned_summary,
          memory: previous,
          userApiKey: geminiKey || undefined,
        },
      });
      if (error || (data as any)?.error) {
        console.warn('[StudioPro] extractMemory', error || (data as any)?.error);
        return;
      }
      const payload = (data as any).memory || {};
      const row = {
        project_id: projectId,
        chapter_id: chapter.id,
        user_id: userId,
        chapter_position: chapter.position,
        ...payload,
      };
      const existing = memories.find((m) => m.chapter_id === chapter.id);
      if (existing) {
        await db.from('book_memory').update(row).eq('id', existing.id);
      } else {
        await db.from('book_memory').insert(row);
      }
      const list = (data as any).coherence_alerts || [];
      setAlerts((prev) => ({ ...prev, [chapter.position]: list }));
      await loadWriting(projectId);
    },
    [projectId, memories, geminiKey, loadWriting],
  );

  /** ChatGPT rédige (ou polit) un chapitre, puis Gemini met à jour la mémoire. */
  const writeChapter = useCallback(
    async (chapter: BookChapter, opts?: { polish?: boolean; guidance?: string; silent?: boolean }): Promise<boolean> => {
      if (!projectId) {
        toast.error('Enregistrez d’abord la fiche maître');
        return false;
      }
      setBusyChapterId(chapter.id);
      setBusyLabel(opts?.polish ? 'Polissage du style…' : 'Rédaction en cours…');
      try {
        const previous = memories.filter((m) => (m.chapter_position || 0) < chapter.position);
        const { data, error } = await supabase.functions.invoke('book-chapter-write', {
          body: {
            sheet,
            bible,
            chapter: {
              position: chapter.position,
              title: chapter.title,
              objective: chapter.objective,
              planned_summary: chapter.planned_summary,
              subsections: chapter.subsections,
              word_target: chapter.word_target,
            },
            memory: previous,
            task: opts?.polish ? 'polissage' : 'redaction',
            existing: opts?.polish ? contents[chapter.id] || '' : undefined,
            guidance: opts?.guidance,
          },
        });
        if (error) throw error;
        if ((data as any)?.error) throw new Error((data as any).error);
        const content = String((data as any).content || '').trim();
        if (!content) throw new Error('Chapitre vide renvoyé par la plume IA');

        await persistChapter(chapter, content, {
          kind: opts?.polish ? 'polissage' : 'originale',
          engine: (data as any).engine,
          status: 'brouillon',
        });

        setBusyLabel('Analyse de cohérence par Gemini…');
        await extractMemory(chapter, content);

        if (!opts?.silent) toast.success(`Chapitre ${chapter.position} rédigé (${(data as any).word_count} mots)`);
        return true;
      } catch (e: any) {
        console.error('[StudioPro] writeChapter', e);
        toast.error(e?.message || 'La rédaction a échoué');
        return false;
      } finally {
        setBusyChapterId(null);
        setBusyLabel('');
      }
    },
    [projectId, sheet, bible, memories, contents, persistChapter, extractMemory],
  );

  /** Rédige à la chaîne tous les chapitres non encore rédigés. */
  const writeAll = useCallback(async () => {
    cancelRef.current = false;
    setRunningAll(true);
    try {
      const pending = chapters.filter((c) => c.status === 'a_ecrire').sort((a, b) => a.position - b.position);
      if (!pending.length) {
        toast.info('Tous les chapitres sont déjà rédigés');
        return;
      }
      for (const chapter of pending) {
        if (cancelRef.current) {
          toast.info('Rédaction interrompue');
          break;
        }
        const ok = await writeChapter(chapter, { silent: true });
        if (!ok) break;
      }
      if (!cancelRef.current) toast.success('Rédaction terminée');
    } finally {
      setRunningAll(false);
    }
  }, [chapters, writeChapter]);

  const cancelAll = useCallback(() => {
    cancelRef.current = true;
  }, []);

  /** Enregistre une correction manuelle de l'auteur. */
  const saveManual = useCallback(
    async (chapter: BookChapter, content: string, validate?: boolean) => {
      await persistChapter(chapter, content, {
        kind: 'auteur',
        engine: 'auteur',
        status: validate ? 'valide' : 'brouillon',
      });
      toast.success(validate ? `Chapitre ${chapter.position} validé` : 'Modifications enregistrées');
    },
    [persistChapter],
  );

  const setStatus = useCallback(
    async (chapter: BookChapter, status: string) => {
      await db.from('book_chapters').update({ status }).eq('id', chapter.id);
      onChaptersChange?.();
    },
    [onChaptersChange],
  );

  return {
    contents,
    memories,
    alerts,
    busyChapterId,
    busyLabel,
    runningAll,
    writeChapter,
    writeAll,
    cancelAll,
    saveManual,
    setStatus,
    reloadWriting: loadWriting,
  };
};

export default useChapterWriting;
