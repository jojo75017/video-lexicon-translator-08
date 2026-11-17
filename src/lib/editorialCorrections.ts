export type EditorialPatch = { chapitre: number; extrait: string; remplacement: string; raison?: string };
export type ManuscriptChapter = Record<string, unknown>;

export function chapterText(chapter: ManuscriptChapter): string {
  return String(chapter.content ?? chapter.contenu ?? '');
}

/** Exact, unique matches only: never guess which repeated passage the author meant. */
export function applyEditorialPatches(chapters: ManuscriptChapter[], patches: EditorialPatch[]): ManuscriptChapter[] {
  const result = chapters.map(c => ({ ...c }));
  for (const patch of patches) {
    const chapter = result[patch.chapitre - 1];
    if (!Number.isInteger(patch.chapitre) || !chapter) throw new Error('Chapitre introuvable.');
    const text = chapterText(chapter);
    const excerpt = patch.extrait;
    if (!excerpt?.trim() || !patch.remplacement?.trim()) throw new Error('Une correction est vide.');
    const position = text.indexOf(excerpt);
    if (position < 0 || text.indexOf(excerpt, position + 1) >= 0) throw new Error(`Chapitre ${patch.chapitre} : passage absent ou ambigu. Relancez l’analyse.`);
    const key = typeof chapter.content === 'string' || typeof chapter.contenu !== 'string' ? 'content' : 'contenu';
    chapter[key] = text.slice(0, position) + patch.remplacement + text.slice(position + excerpt.length);
  }
  return result;
}