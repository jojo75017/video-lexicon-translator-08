/**
 * Liste des livres de l'abonné (sa « bibliothèque ») pour les studios de couverture.
 * Aucune donnée inventée : on ne lit que ce que l'abonné a réellement enregistré.
 */
import { supabase } from '@/integrations/supabase/client';

export type MyBookKind = 'ebook' | 'book';

export interface MyBookOption {
  id: string;
  kind: MyBookKind;
  title: string;
  subtitle: string;
  author: string;
  synopsis: string;
  genre: string;
  updatedAt: string | null;
}

const clean = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

/** Livres enregistrés côté ebook_projects + book_projects, les plus récents d'abord. */
export async function listMyBooks(limit = 60): Promise<MyBookOption[]> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return [];

  const [ebooks, projects] = await Promise.all([
    supabase
      .from('ebook_projects')
      .select('id, title, author_name, book_summary, kdp_description, kdp_categories, draft_state, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit),
    supabase
      .from('book_projects')
      .select('id, title, subtitle, genre, target_audience, source_notes, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit),
  ]);

  const fromEbooks: MyBookOption[] = (ebooks.data ?? []).map((row) => {
    const brief = ((row as Record<string, unknown>).draft_state as { brief?: Record<string, unknown> } | null)?.brief ?? {};
    return {
      id: String(row.id),
      kind: 'ebook' as const,
      title: clean(row.title) || 'Sans titre',
      subtitle: clean(brief.subtitle),
      author: clean(row.author_name) || clean(brief.author),
      synopsis: clean(row.book_summary) || clean(row.kdp_description) || clean(brief.description),
      genre: clean(row.kdp_categories) || clean(brief.category),
      updatedAt: clean(row.updated_at) || null,
    };
  });

  const fromProjects: MyBookOption[] = (projects.data ?? []).map((row) => ({
    id: String(row.id),
    kind: 'book' as const,
    title: clean(row.title) || 'Sans titre',
    subtitle: clean(row.subtitle),
    author: '',
    synopsis: clean(row.source_notes),
    genre: clean(row.genre),
    updatedAt: clean(row.updated_at) || null,
  }));

  return [...fromEbooks, ...fromProjects].sort((a, b) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || ''),
  );
}
