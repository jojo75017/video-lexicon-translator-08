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

/**
 * Beaucoup de livres sont enregistrés avec la formule « Titre : Sous-titre » dans un seul champ.
 * On sépare alors les deux parties, sans rien inventer : seul le texte existant est découpé.
 */
export const splitTitleAndSubtitle = (raw: string): { title: string; subtitle: string } => {
  const value = clean(raw);
  for (const sep of [' : ', ' — ', ' – ', ' - ', ': ']) {
    const at = value.indexOf(sep);
    if (at > 2) {
      const title = value.slice(0, at).trim();
      const subtitle = value.slice(at + sep.length).trim();
      if (title && subtitle) return { title, subtitle };
    }
  }
  return { title: value, subtitle: '' };
};

/** Première valeur non vide parmi plusieurs champs possibles du brouillon. */
const firstOf = (source: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = clean(source[key]);
    if (value) return value;
  }
  return '';
};

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
    const draft = ((row as Record<string, unknown>).draft_state ?? {}) as Record<string, unknown>;
    const brief = (draft.brief ?? {}) as Record<string, unknown>;
    return {
      id: String(row.id),
      kind: 'ebook' as const,
      title: clean(row.title) || firstOf(brief, ['title']) || 'Sans titre',
      subtitle: firstOf(brief, ['subtitle', 'sousTitre', 'sous_titre', 'tagline', 'accroche', 'format']),
      author: clean(row.author_name) || firstOf(brief, ['author', 'authorName']),
      synopsis:
        clean(row.book_summary) ||
        clean(row.kdp_description) ||
        firstOf(brief, ['synopsis', 'hook', 'description', 'pitch', 'resume', 'summary']),
      genre: clean(row.kdp_categories) || firstOf(brief, ['genre', 'category', 'categorie']),
      updatedAt: clean(row.updated_at) || null,
    };
  });

  const fromProjects: MyBookOption[] = (projects.data ?? []).map((row) => ({
    id: String(row.id),
    kind: 'book' as const,
    title: clean(row.title) || 'Sans titre',
    subtitle: clean(row.subtitle),
    author: '',
    synopsis: clean(row.source_notes) || clean(row.target_audience),
    genre: clean(row.genre),
    updatedAt: clean(row.updated_at) || null,
  }));

  return [...fromEbooks, ...fromProjects].sort((a, b) =>
    (b.updatedAt || '').localeCompare(a.updatedAt || ''),
  );
}
