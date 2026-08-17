/**
 * Pont léger entre le workflow de rédaction (V3CreateWizard / agents P4) et la
 * colonne « Déjà écrit » affichée à côté du dialogue. Aucune table :
 * localStorage + un événement, comme le brief du livre.
 */

export type WrittenChapter = {
  index: number;
  title: string;
  content: string;
  words: number;
};

export type WrittenProgress = {
  chapters: WrittenChapter[];
  /** Nombre total de chapitres prévus (sommaire validé). */
  total: number;
  /** Index du chapitre en cours de rédaction (-1 si aucun). */
  activeIndex: number;
};

export const WRITTEN_CHAPTERS_KEY = 'v3_written_chapters_v1';
export const WRITTEN_CHAPTERS_EVENT = 'v3:written-chapters-updated';

function countWords(text: string): number {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

function emit() {
  try {
    window.dispatchEvent(new CustomEvent(WRITTEN_CHAPTERS_EVENT));
  } catch {
    /* noop */
  }
}

function persist(progress: WrittenProgress) {
  try {
    localStorage.setItem(WRITTEN_CHAPTERS_KEY, JSON.stringify(progress));
    emit();
  } catch {
    /* quota / mode privé */
  }
}

export function readWrittenProgress(): WrittenProgress {
  try {
    const raw = localStorage.getItem(WRITTEN_CHAPTERS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    // Ancien format : simple tableau.
    if (Array.isArray(parsed)) {
      return { chapters: parsed as WrittenChapter[], total: parsed.length, activeIndex: -1 };
    }
    if (parsed && Array.isArray(parsed.chapters)) {
      return {
        chapters: parsed.chapters as WrittenChapter[],
        total: Number(parsed.total) || parsed.chapters.length,
        activeIndex: Number.isFinite(parsed.activeIndex) ? Number(parsed.activeIndex) : -1,
      };
    }
  } catch {
    /* noop */
  }
  return { chapters: [], total: 0, activeIndex: -1 };
}

export function readWrittenChapters(): WrittenChapter[] {
  return readWrittenProgress().chapters;
}

/**
 * Publie les chapitres réellement rédigés (texte présent uniquement), au fil de
 * l'eau : dès qu'un seul chapitre est écrit, il apparaît dans la colonne.
 */
export function publishWrittenChapters(
  rawChapters: any[],
  meta?: { total?: number; activeIndex?: number },
) {
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
    .filter((c) => c.content.length > 40);

  if (!list.length && !meta?.total) return;

  const previous = readWrittenProgress();
  persist({
    chapters: list,
    total: Math.max(meta?.total || 0, list.length, previous.total || 0),
    activeIndex:
      typeof meta?.activeIndex === 'number' ? meta.activeIndex : list.length,
  });
}

/** Remplace le texte d'un chapitre (après correction par le Génie). */
export function replaceWrittenChapter(index: number, content: string) {
  const progress = readWrittenProgress();
  persist({
    ...progress,
    chapters: progress.chapters.map((c) =>
      c.index === index ? { ...c, content, words: countWords(content) } : c,
    ),
  });
}

export function clearWrittenChapters() {
  try {
    localStorage.removeItem(WRITTEN_CHAPTERS_KEY);
    emit();
  } catch {
    /* noop */
  }
}
