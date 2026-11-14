import type { BookBrief } from './bookBrief';

/** Saved editorial fields take precedence over legacy workflow placeholders. */
export function restoreWritingBrief(saved: Record<string, any>, fallback: BookBrief): BookBrief {
  const draft = saved.draft_state?.brief || {};
  const brief: BookBrief = { ...fallback, ...draft };
  const storedOutline = Array.isArray(saved.chapters) ? saved.chapters : [];
  return {
    ...brief,
    projectId: saved.id,
    title: saved.title || brief.title || '',
    subtitle: brief.subtitle || (String(saved.narrative_format || '').startsWith('Sous-titre :') ? String(saved.narrative_format).replace(/^Sous-titre\s*:\s*/i, '') : ''),
    author: saved.author_name || brief.author || '',
    description: brief.synopsis || brief.description || saved.kdp_description || saved.preface || saved.book_summary || '',
    genre: brief.genre || brief.category || saved.kdp_categories || '',
    category: brief.category || brief.genre || saved.kdp_categories || '',
    outline: brief.outline?.length ? brief.outline : storedOutline.map((chapter: any, index: number) => ({ numero: index + 1, titre: chapter.title || chapter.titre || '', objectif: chapter.objectif || chapter.goal || '' })),
    characters: brief.characters?.length ? brief.characters : (saved.characters || []),
  };
}

export function mergeWritingCharacters(current: BookBrief['characters'], edited: NonNullable<BookBrief['characters']>): NonNullable<BookBrief['characters']> {
  return edited.map((character, index) => ({ ...current?.[index], ...character }));
}