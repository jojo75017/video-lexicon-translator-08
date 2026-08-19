/**
 * Pont léger entre le workflow de rédaction (V3CreateWizard / agents P4) et la
 * colonne « Mon livre » affichée à côté du dialogue. Aucune table :
 * localStorage + un événement, comme le brief du livre.
 *
 * Trois versions coexistent pour chaque chapitre, sans jamais rien perdre :
 *   rawContent       → le premier jet de la rédaction
 *   correctedContent → le texte passé dans la chaîne « maison d'édition »
 *   editedContent    → le texte réécrit à la main par l'auteur (prioritaire)
 * `content` reste toujours le texte réellement retenu (modifié > corrigé > brut)
 * afin que l'export, l'aperçu, les données KDP et l'audio n'aient rien à changer.
 */

export type ChapterStatus = 'raw' | 'correcting' | 'corrected' | 'failed';

export type WrittenChapter = {
  index: number;
  title: string;
  /** Texte retenu (modifié > corrigé > brut). */
  content: string;
  words: number;
  rawContent: string;
  correctedContent?: string;
  editedContent?: string;
  status: ChapterStatus;
  /** Nombre de corrections relevées par la chaîne éditoriale. */
  corrections?: number;
  error?: string;
  updatedAt?: string;
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

/** Texte réellement retenu pour un chapitre : modifié > corrigé > brut. */
export function effectiveChapterText(chapter: Partial<WrittenChapter>): string {
  const edited = String(chapter?.editedContent || '').trim();
  if (edited) return edited;
  const corrected = String(chapter?.correctedContent || '').trim();
  if (corrected) return corrected;
  return String(chapter?.rawContent || chapter?.content || '');
}

/** Normalise un chapitre (rétro-compatible avec l'ancien format `content` seul). */
function normalizeChapter(raw: any, index: number): WrittenChapter {
  const rawContent = String(raw?.rawContent ?? raw?.content ?? raw?.contenu ?? '').trim();
  const chapter: WrittenChapter = {
    index: Number.isFinite(raw?.index) ? Number(raw.index) : index,
    title: String(raw?.title || raw?.titre || `Chapitre ${index + 1}`),
    rawContent,
    correctedContent: raw?.correctedContent ? String(raw.correctedContent) : undefined,
    editedContent: raw?.editedContent ? String(raw.editedContent) : undefined,
    status: (['raw', 'correcting', 'corrected', 'failed'] as ChapterStatus[]).includes(raw?.status)
      ? (raw.status as ChapterStatus)
      : raw?.correctedContent ? 'corrected' : 'raw',
    corrections: Number.isFinite(raw?.corrections) ? Number(raw.corrections) : undefined,
    error: raw?.error ? String(raw.error) : undefined,
    updatedAt: raw?.updatedAt ? String(raw.updatedAt) : undefined,
    content: '',
    words: 0,
  };
  chapter.content = effectiveChapterText(chapter);
  chapter.words = countWords(chapter.content);
  return chapter;
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
      const chapters = parsed.map(normalizeChapter);
      return { chapters, total: chapters.length, activeIndex: -1 };
    }
    if (parsed && Array.isArray(parsed.chapters)) {
      const chapters = parsed.chapters.map(normalizeChapter);
      return {
        chapters,
        total: Math.max(Number(parsed.total) || 0, chapters.length),
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

/** Met à jour un seul chapitre en préservant tout le reste. */
function updateChapter(index: number, patch: Partial<WrittenChapter>) {
  const progress = readWrittenProgress();
  const chapters = progress.chapters.map((c) => {
    if (c.index !== index) return c;
    const next = { ...c, ...patch, updatedAt: new Date().toISOString() };
    next.content = effectiveChapterText(next);
    next.words = countWords(next.content);
    return next;
  });
  persist({ ...progress, chapters });
}

/**
 * Publie les chapitres réellement rédigés (texte présent uniquement), au fil de
 * l'eau : dès qu'un seul chapitre est écrit, il apparaît dans la colonne.
 * Les corrections et retouches déjà faites sur un chapitre sont conservées.
 */
export function publishWrittenChapters(
  rawChapters: any[],
  meta?: { total?: number; activeIndex?: number },
) {
  const previous = readWrittenProgress();
  const byIndex = new Map(previous.chapters.map((c) => [c.index, c]));

  const list: WrittenChapter[] = (Array.isArray(rawChapters) ? rawChapters : [])
    .map((c: any, index: number) => {
      const rawContent = String(c?.content || c?.contenu || '').trim();
      const before = byIndex.get(index);
      // Le premier jet a changé : les versions dérivées ne valent plus rien.
      const sameSource = before && before.rawContent.trim() === rawContent;
      const merged: WrittenChapter = {
        index,
        title: String(c?.title || c?.titre || `Chapitre ${index + 1}`),
        rawContent,
        correctedContent: sameSource ? before?.correctedContent : undefined,
        editedContent: sameSource ? before?.editedContent : undefined,
        status: sameSource ? (before?.status || 'raw') : 'raw',
        corrections: sameSource ? before?.corrections : undefined,
        error: sameSource ? before?.error : undefined,
        content: '',
        words: 0,
      };
      merged.content = effectiveChapterText(merged);
      merged.words = countWords(merged.content);
      return merged;
    })
    .filter((c) => c.rawContent.length > 40);

  if (!list.length && !meta?.total) return;

  persist({
    chapters: list,
    total: Math.max(meta?.total || 0, list.length, previous.total || 0),
    activeIndex:
      typeof meta?.activeIndex === 'number' ? meta.activeIndex : list.length,
  });
}

/** Marque l'état de correction d'un chapitre. */
export function setChapterStatus(index: number, status: ChapterStatus, error?: string) {
  updateChapter(index, { status, error: status === 'failed' ? error : undefined });
}

/** Enregistre le texte corrigé par la chaîne éditoriale. */
export function setChapterCorrection(index: number, corrected: string, corrections = 0) {
  updateChapter(index, {
    correctedContent: corrected,
    corrections,
    status: 'corrected',
    error: undefined,
  });
}

/** Enregistre le texte réécrit à la main par l'auteur (prioritaire). */
export function setChapterEdited(index: number, edited: string) {
  const value = String(edited || '').trim();
  updateChapter(index, { editedContent: value || undefined });
}

/** Remplace le texte corrigé d'un chapitre (compatibilité). */
export function replaceWrittenChapter(index: number, content: string) {
  setChapterCorrection(index, content);
}

export function clearWrittenChapters() {
  try {
    localStorage.removeItem(WRITTEN_CHAPTERS_KEY);
    emit();
  } catch {
    /* noop */
  }
}
