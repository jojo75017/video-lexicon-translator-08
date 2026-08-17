/**
 * Pont léger entre le workflow de rédaction (V3CreateWizard) et la colonne
 * « Déjà écrit » affichée à côté du dialogue. Aucune table : localStorage +
 * un événement, comme le brief du livre.
 */

export type WrittenChapter = {
  index: number;
  title: string;
  content: string;
  words: number;
};

export const WRITTEN_CHAPTERS_KEY = 'v3_written_chapters_v1';
export const WRITTEN_CHAPTERS_EVENT = 'v3:written-chapters-updated';

function countWords(text: string): number {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

export function readWrittenChapters(): WrittenChapter[] {
  try {
    const raw = localStorage.getItem(WRITTEN_CHAPTERS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? (list as WrittenChapter[]) : [];
  } catch {
    return [];
  }
}

/** Publie les chapitres réellement rédigés (texte présent uniquement). */
export function publishWrittenChapters(rawChapters: any[]) {
  const list: WrittenChapter[] = (Array.isArray(rawChapters) ? rawChapters : [])
    .map((c: any, index: number) => {
      const content = String(c?.content || c?.contenu || '').trim();
      return {
        index,
        title: String(c?.title || c?.titre || `Chapitre ${index + 1}`),
        content,
        words: countWords(content),
      };
    })
    .filter((c) => c.content.length > 120);

  try {
    localStorage.setItem(WRITTEN_CHAPTERS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(WRITTEN_CHAPTERS_EVENT));
  } catch {
    /* quota / mode privé */
  }
}

/** Remplace le texte d'un chapitre (après correction par le Génie). */
export function replaceWrittenChapter(index: number, content: string) {
  const list = readWrittenChapters().map((c) =>
    c.index === index ? { ...c, content, words: countWords(content) } : c,
  );
  try {
    localStorage.setItem(WRITTEN_CHAPTERS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(WRITTEN_CHAPTERS_EVENT));
  } catch {
    /* noop */
  }
}

export function clearWrittenChapters() {
  try {
    localStorage.removeItem(WRITTEN_CHAPTERS_KEY);
    window.dispatchEvent(new CustomEvent(WRITTEN_CHAPTERS_EVENT));
  } catch {
    /* noop */
  }
}
