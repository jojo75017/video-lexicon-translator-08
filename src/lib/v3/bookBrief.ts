/**
 * Pont partagé entre le wizard V3, l'outil « Sommaire Ultime » et la page d'accueil V3.
 * Tout est stocké en localStorage : le wizard écrit un instantané du brief à chaque
 * modification, l'accueil le lit pour l'afficher avant le lancement du workflow.
 */

export type BriefOutlineChapter = {
  numero: number;
  titre: string;
  objectif?: string;
};

export type BookBrief = {
  savedAt?: string;
  title?: string;
  subtitle?: string;
  author?: string;
  category?: string;
  description?: string;
  tone?: string;
  chapters?: number;
  wordsPerChapter?: number;
  outline?: BriefOutlineChapter[];
  /** Vrai quand l'auteur a explicitement validé le sommaire utilisé par le workflow. */
  outlineValidated?: boolean;
  /** L'abonné souhaite des illustrations IA à l'intérieur du livre. */
  wantsIllustrations?: boolean;
  characters?: Array<{ name?: string; role?: string; description?: string; traits?: string }>;
  cibleProfil?: string;
  cibleNiveau?: string;
  cibleBesoins?: string;
  cibleFrustrations?: string;
  promesseCentrale?: string;
  promesseBenefices?: string;
  promesseDifferenciation?: string;
  promesseEmotion?: string;
  projectId?: string | null;
  /** Langue de rédaction du livre (code ISO court : fr, en, es…). */
  language?: string;
  /** Ambiance d'écriture choisie (voir src/data/writingAmbiances.ts). */
  ambianceId?: string;
  /** Étapes de l'entretien guidé volontairement passées. */
  interviewSkipped?: number[];
};


export const WIZARD_BRIEF_KEY = 'v3_create_wizard_config_v1';
/** Sommaire envoyé depuis l'outil « Sommaire Ultime » vers le workflow. */
export const TOC_FOR_WORKFLOW_KEY = 'v3_toc_for_workflow_v1';
const TOC_HISTORY_KEY = 'toc_ultimate_history_v1';
const TOC_PINNED_KEY = 'toc_ultimate_pinned_v1';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readBookBrief(): BookBrief | null {
  const brief = readJSON<BookBrief | null>(WIZARD_BRIEF_KEY, null);
  if (!brief) return null;
  const hasSomething = Boolean((brief.title || '').trim() || (brief.description || '').trim());
  return hasSomething ? brief : null;
}

/** Événement émis à chaque écriture : les panneaux (sommaire, boutons) se resynchronisent. */
export const BOOK_BRIEF_EVENT = 'v3:book-brief-updated';

export function writeBookBrief(brief: BookBrief) {
  try {
    localStorage.setItem(WIZARD_BRIEF_KEY, JSON.stringify({ ...brief, savedAt: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent(BOOK_BRIEF_EVENT));
  } catch {
    /* quota / mode privé : on ignore */
  }
}


/** Efface la fiche du livre en cours (titre, synopsis, etc.). */
export function clearBookBrief() {
  try {
    localStorage.removeItem(WIZARD_BRIEF_KEY);
    window.dispatchEvent(new CustomEvent(BOOK_BRIEF_EVENT));
  } catch {
    /* mode privé : on ignore */
  }
}

/**
 * Efface TOUT le brouillon en cours : fiche du Génie, config du workflow,
 * sommaire mis en attente et historiques du Sommaire Ultime.
 * Les livres déjà enregistrés dans « Mes livres » ne sont jamais touchés.
 */
export function resetBookProject() {
  const keys = [
    WIZARD_BRIEF_KEY,
    TOC_FOR_WORKFLOW_KEY,
    TOC_HISTORY_KEY,
    TOC_PINNED_KEY,
    'edition_book_config_v1',
    'v3_genie_thread_v1',
    'v3_written_chapters_v1',
  ];
  for (const key of keys) {
    try { localStorage.removeItem(key); } catch { /* mode privé */ }
  }
  try { window.dispatchEvent(new CustomEvent(BOOK_BRIEF_EVENT)); } catch { /* SSR */ }
}


/** Enregistre un sommaire pour qu'il soit importable dans le wizard. */
export function sendTocToWorkflow(chapters: BriefOutlineChapter[], meta?: { theme?: string; genre?: string; description?: string }) {
  try {
    localStorage.setItem(
      TOC_FOR_WORKFLOW_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        theme: meta?.theme || '',
        genre: meta?.genre || '',
        description: meta?.description || '',
        chapters: chapters.map((c, i) => ({ numero: i + 1, titre: c.titre, objectif: c.objectif || '' })),
      }),
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Récupère le dernier sommaire « Sommaire Ultime » disponible :
 * envoi explicite vers le workflow, sinon épinglé, sinon historique.
 */
export function readLatestUltimateToc(): { chapters: BriefOutlineChapter[]; source: string } | null {
  const sent = readJSON<{ chapters?: BriefOutlineChapter[] } | null>(TOC_FOR_WORKFLOW_KEY, null);
  if (sent?.chapters?.length) return { chapters: normalizeOutline(sent.chapters), source: 'envoyé depuis Sommaire Ultime' };

  const pinned = readJSON<Array<{ chapters?: BriefOutlineChapter[] }>>(TOC_PINNED_KEY, []);
  if (pinned[0]?.chapters?.length) return { chapters: normalizeOutline(pinned[0].chapters), source: 'sommaire épinglé' };

  const history = readJSON<Array<{ chapters?: BriefOutlineChapter[] }>>(TOC_HISTORY_KEY, []);
  if (history[0]?.chapters?.length) return { chapters: normalizeOutline(history[0].chapters), source: 'dernier sommaire généré' };

  return null;
}

export function clearTocForWorkflow() {
  try { localStorage.removeItem(TOC_FOR_WORKFLOW_KEY); } catch { /* noop */ }
}

function cleanLine(raw: string): string {
  return String(raw || '')
    .replace(/```[a-z]*|```/gi, '')
    .replace(/^\s*[#>*\-–—•\d.)\s]+/, '')
    .replace(/^\s*(chapitre|chapter|partie|section)\s*\d*\s*[:–—-]*\s*/i, '')
    .replace(/["{}[\]«»]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Analyse un sommaire collé par l'auteur (Markdown, TXT ou JSON du Sommaire Ultime).
 * Une ligne = un chapitre ; « Titre | Objectif » ou « Titre — Objectif » sont acceptés.
 */
export function parseTocText(text: string): BriefOutlineChapter[] {
  const trimmed = (text || '').trim();
  if (!trimmed) return [];

  // 1) JSON (export du Sommaire Ultime)
  if (/^[[{]/.test(trimmed)) {
    try {
      const parsed = JSON.parse(trimmed);
      const list = Array.isArray(parsed) ? parsed : parsed?.chapters;
      if (Array.isArray(list)) {
        return normalizeOutline(
          list.map((item: any) => ({
            numero: Number(item?.numero) || 0,
            titre: cleanLine(item?.titre || item?.title || ''),
            objectif: String(item?.objectif || item?.goal || item?.description || '').trim(),
          })),
        );
      }
    } catch {
      /* on retombe sur l'analyse texte */
    }
  }

  // 2) Texte / Markdown
  const chapters: BriefOutlineChapter[] = [];
  for (const rawLine of trimmed.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^table des mati|^sommaire\b/i.test(line)) continue;
    if (/^-{3,}$/.test(line)) continue;

    const [head, ...rest] = line.split(/\s*[|]\s*|\s+—\s+|\s+–\s+/);
    const titre = cleanLine(head);
    if (!titre || titre.length < 2) continue;
    chapters.push({ numero: chapters.length + 1, titre, objectif: rest.join(' — ').trim() });
  }
  return normalizeOutline(chapters);
}

export function normalizeOutline(items: BriefOutlineChapter[]): BriefOutlineChapter[] {
  return (items || [])
    .map((item) => ({ numero: 0, titre: String(item?.titre || '').trim(), objectif: String(item?.objectif || '').trim() }))
    .filter((item) => item.titre.length >= 2)
    .map((item, index) => ({ ...item, numero: index + 1 }));
}

/* ------------------------------------------------------------------ */
/* Historique des titres sauvegardés (accueil V3)                      */
/* ------------------------------------------------------------------ */

export type TitleHistoryEntry = { title: string; savedAt: string };

const TITLE_HISTORY_KEY = 'v3_title_history_v1';
const TITLE_HISTORY_MAX = 12;

export function readTitleHistory(): TitleHistoryEntry[] {
  return readJSON<TitleHistoryEntry[]>(TITLE_HISTORY_KEY, []).filter((e) => e && typeof e.title === 'string' && e.title.trim());
}

/** Ajoute (ou remonte) un titre dans l'historique et renvoie la liste à jour. */
export function pushTitleHistory(title: string): TitleHistoryEntry[] {
  const clean = (title || '').trim();
  if (!clean) return readTitleHistory();
  const next = [
    { title: clean, savedAt: new Date().toISOString() },
    ...readTitleHistory().filter((e) => e.title.toLowerCase() !== clean.toLowerCase()),
  ].slice(0, TITLE_HISTORY_MAX);
  try { localStorage.setItem(TITLE_HISTORY_KEY, JSON.stringify(next)); } catch { /* noop */ }
  return next;
}

export function removeTitleFromHistory(title: string): TitleHistoryEntry[] {
  const next = readTitleHistory().filter((e) => e.title.toLowerCase() !== (title || '').trim().toLowerCase());
  try { localStorage.setItem(TITLE_HISTORY_KEY, JSON.stringify(next)); } catch { /* noop */ }
  return next;
}

export function clearTitleHistory(): TitleHistoryEntry[] {
  try { localStorage.removeItem(TITLE_HISTORY_KEY); } catch { /* noop */ }
  return [];
}
