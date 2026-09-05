/**
 * Helpers des manuscrits « Version Longue ».
 *
 * Les manuscrits longs réutilisent les tables existantes cs_projects / cs_chapters
 * (aucune modification de schéma). Un marqueur interne stocké dans kdp_categories
 * distingue ces projets de ceux du ContentStudio ; il n'est jamais affiché comme
 * catégorie KDP.
 */
import { supabase } from '@/integrations/supabase/client';

export const LONG_FORM_MARKER = '__version_longue';

export interface LongFormProjectRow {
  id: string;
  user_id: string;
  title: string;
  subtitle: string | null;
  target_audience: string | null;
  tone: string | null;
  language_code: string | null;
  kdp_categories: string[] | null;
  kdp_description: string | null;
  kdp_keywords: string[] | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export function isLongFormProject(project: { kdp_categories?: string[] | null }): boolean {
  return (project.kdp_categories ?? []).includes(LONG_FORM_MARKER);
}

/** Catégories KDP réelles, marqueur interne exclu. */
export function visibleCategories(project: { kdp_categories?: string[] | null }): string[] {
  return (project.kdp_categories ?? []).filter((c) => c !== LONG_FORM_MARKER);
}

export async function createLongFormProject(input: {
  title: string;
  subtitle: string | null;
  target_audience: string | null;
  tone: string;
  language_code: string;
}): Promise<LongFormProjectRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Session expirée, reconnectez-vous.');

  const { data, error } = await supabase
    .from('cs_projects')
    .insert({
      user_id: user.id,
      title: input.title,
      subtitle: input.subtitle,
      target_audience: input.target_audience,
      tone: input.tone,
      language_code: input.language_code,
      kdp_categories: [LONG_FORM_MARKER],
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Création impossible');
  return data as LongFormProjectRow;
}
