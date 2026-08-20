/**
 * Pont partagé entre le wizard V3, l'outil « Sommaire Ultime » et la page d'accueil V3.
 * Tout est stocké en localStorage : le wizard écrit un instantané du brief à chaque
 * modification, l'accueil le lit pour l'afficher avant le lancement du workflow.
 */

/** Blocs de mise en forme imposés à l'IA rédactrice pour un chapitre. */
export type OutlineBlockId =
  | 'bullets'
  | 'numbered'
  | 'keypoints'
  | 'quote'
  | 'callout'
  | 'exercise'
  | 'checklist'
  | 'table'
  | 'summary';

export type BriefOutlineChapter = {
  numero: number;
  titre: string;
  objectif?: string;
  /** Numéros des passages du récit de l'auteur couverts par ce chapitre. */
  sources?: number[];
  /** Période de vie couverte (mode biographie), ex. « 1952-1958 ». */
  period?: string;
  /** Points à traiter obligatoirement dans le chapitre. */
  points?: string[];
  /** Consigne éditoriale libre transmise mot pour mot à l'IA rédactrice. */
  note?: string;
  /** Mot-clé Amazon visé par ce chapitre. */
  keyword?: string;
  /** Question réelle du lecteur à laquelle le chapitre répond. */
  readerQuestion?: string;
  /** Ton spécifique à ce chapitre (sinon : ton du livre). */
  tone?: string;
  /** Objectif de mots pour ce chapitre (sinon : réglage global). */
  wordsTarget?: number;
  /** Blocs de mise en forme demandés (listes, encadrés, exercices…). */
  blocks?: OutlineBlockId[];
  /** Chapitre figé : l'IA ne doit plus le réécrire ni le déplacer. */
  locked?: boolean;
};


export type BookBrief = {
  savedAt?: string;
  /**
   * Nature du projet : livre classique ou biographie (« Le récit de votre vie »).
   * En biographie, la chronologie et les mots de l'auteur sont intouchables.
   */
  mode?: 'book' | 'biography';
  /** Étapes de l'entretien biographique déjà racontées. */
  biographySteps?: number[];
  /**
   * Passages corrigés par le Génie (façon Copilot) : l'original de l'auteur est
   * conservé mot pour mot, la version corrigée n'est utilisée qu'après validation.
   */
  polished?: PolishedPassage[];
  title?: string;
  subtitle?: string;
  author?: string;
  category?: string;
  description?: string;
  /**
   * Matière brute : tout ce que l'auteur a écrit ou dicté, mot pour mot.
   * Elle s'accumule et n'est JAMAIS résumée ni remplacée par l'IA.
   */
  sourceText?: string;
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
  /**
   * Réglages fixés par l'auteur : l'IA ne doit plus jamais les remplacer.
   * Ex. ['title', 'subtitle', 'chapters', 'wordsPerChapter'].
   */
  lockedFields?: LockableField[];
};

/** Champs que l'auteur peut verrouiller depuis la colonne « Réglages du livre ». */
/** Un passage de l'auteur, sa version corrigée et son état de validation. */
export type PolishedPassage = {
  /** Numéro du passage dans le récit (1 = premier). */
  index: number;
  /** Mots exacts de l'auteur : jamais modifiés. */
  original: string;
  /** Version corrigée et développée proposée par le Génie. */
  corrected: string;
  /** Date de validation par l'auteur ; absent = proposition en attente. */
  validatedAt?: string;
};

export function countWords(text: string): number {
  return String(text || '').trim().split(/\s+/).filter(Boolean).length;
}

/** Le passage corrigé s'il est validé, sinon les mots d'origine de l'auteur. */
export function passageForBook(brief: BookBrief | null | undefined, index: number, original: string): string {
  const entry = (brief?.polished || []).find((p) => p.index === index);
  return entry?.validatedAt && entry.corrected.trim() ? entry.corrected : original;
}

/** Enregistre (ou remplace) la correction d'un passage dans la fiche. */
export function upsertPolished(brief: BookBrief, entry: PolishedPassage): PolishedPassage[] {
  const list = (brief.polished || []).filter((p) => p.index !== entry.index);
  return [...list, entry].sort((a, b) => a.index - b.index);
}

/**
 * Le récit tel qu'il entrera dans le livre : chaque passage validé remplace
 * l'original, les passages non validés gardent les mots de l'auteur.
 * Aucune compression : on ne retire jamais un passage.
 */
export function narrativeForBook(brief: BookBrief | null | undefined): string {
  const passages = listSourcePassages(brief?.sourceText || '');
  return passages.map((p, i) => passageForBook(brief, i + 1, p)).join('\n\n');
}

/**
 * Passages explicitement validés par l'auteur, prêts à être affichés sans
 * nouvel appel IA. L'aperçu latéral s'appuie sur cette source sûre tant que le
 * chapitre final n'a pas encore terminé sa correction éditoriale.
 */
export function validatedPassages(brief: BookBrief | null | undefined): PolishedPassage[] {
  return (brief?.polished || [])
    .filter((passage) => Boolean(passage.validatedAt) && Boolean(passage.corrected?.trim()))
    .slice()
    .sort((a, b) => a.index - b.index);
}

export type LockableField = 'title' | 'subtitle' | 'chapters' | 'wordsPerChapter';

export const LOCKABLE_FIELDS: LockableField[] = ['title', 'subtitle', 'chapters', 'wordsPerChapter'];

export function isFieldLocked(brief: BookBrief | null | undefined, field: LockableField): boolean {
  return Array.isArray(brief?.lockedFields) && brief!.lockedFields!.includes(field);
}

/** Ajoute un verrou (l'auteur vient de saisir la valeur lui-même). */
export function lockField(brief: BookBrief, field: LockableField): LockableField[] {
  const current = Array.isArray(brief.lockedFields) ? brief.lockedFields : [];
  return current.includes(field) ? current : [...current, field];
}

export function unlockField(brief: BookBrief, field: LockableField): LockableField[] {
  return (Array.isArray(brief.lockedFields) ? brief.lockedFields : []).filter((f) => f !== field);
}

/**
 * Fusionne la proposition de l'IA avec la fiche courante en respectant
 * strictement les champs verrouillés par l'auteur.
 */
export function mergeRespectingLocks(previous: BookBrief, proposed: Partial<BookBrief>): Partial<BookBrief> {
  const kept: Partial<BookBrief> = { ...proposed };
  for (const field of LOCKABLE_FIELDS) {
    if (isFieldLocked(previous, field)) delete kept[field];
  }
  return kept;
}


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
  const stored = readJSON<BookBrief | null>(WIZARD_BRIEF_KEY, null);
  if (!stored) return null;
  // Auto-réparation : une matière enregistrée en double par une ancienne
  // version est nettoyée à la lecture, pour ne plus jamais afficher le
  // même souvenir plusieurs fois de suite.
  const cleaned = dedupeSourceText(String(stored.sourceText || ''));
  const brief: BookBrief = cleaned !== (stored.sourceText || '') ? { ...stored, sourceText: cleaned } : stored;
  // Un récit peut exister avant que le Génie ait proposé un titre ou un résumé.
  // Ne jamais considérer cette fiche comme vide : sinon la colonne de droite
  // perd la matière reconstruite et affiche « Projet sans titre ».
  const hasSomething = Boolean(
    (brief.title || '').trim()
    || (brief.description || '').trim()
    || (brief.sourceText || '').trim()
    || (brief.outline || []).length,
  );
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


/** Retire les préfixes techniques : seuls les mots de l'auteur sont conservés. */
export function stripAuthorPrefix(text: string): string {
  return String(text || '')
    .replace(/^\s*(?:Précision de l['’]auteur|Complément de l['’]auteur)\s*:\s*/i, '')
    .trim();
}

/** Clé de comparaison : ponctuation et casse ignorées, espaces normalisés. */
function passageKey(text: string): string {
  return stripAuthorPrefix(text)
    .toLowerCase()
    .replace(/[\s\u00A0]+/g, ' ')
    .replace(/[^\p{L}\p{N} ]/gu, '')
    .trim();
}

/** Découpe la matière brute en passages (un passage = un envoi de l'auteur). */
function splitPassages(text: string): string[] {
  return String(text || '')
    .split(/\n{2,}/)
    .map((p) => stripAuthorPrefix(p))
    .filter((p) => p.length > 0);
}

/**
 * Ajoute les mots de l'auteur à la matière brute, sans rien perdre et sans
 * jamais répéter un passage déjà enregistré (même envoyé deux fois avec une
 * ponctuation ou une casse différente).
 */
export function appendSourceText(previous: string | undefined, addition: string): string {
  const clean = stripAuthorPrefix(addition);
  const base = String(previous || '').trim();
  if (!clean) return base;

  const existing = splitPassages(base);
  const existingKeys = existing.map(passageKey);
  const addedKey = passageKey(clean);
  if (!addedKey) return base;

  // Déjà présent à l'identique, ou déjà contenu dans un passage plus complet.
  if (existingKeys.some((key) => key === addedKey || key.includes(addedKey))) return base;

  // Le nouvel envoi est une version enrichie d'un passage déjà là : il le remplace.
  const kept = existing.filter((_, i) => !addedKey.includes(existingKeys[i]));
  return [...kept, clean].join('\n\n');
}

/** Nettoie une matière brute déjà enregistrée : supprime les répétitions. */
export function dedupeSourceText(text: string): string {
  let out = '';
  for (const passage of splitPassages(text)) out = appendSourceText(out, passage);
  return out;
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
    .map((item) => ({
      numero: 0,
      titre: String(item?.titre || '').trim(),
      objectif: String(item?.objectif || '').trim(),
      period: String(item?.period || '').trim() || undefined,
      sources: Array.isArray(item?.sources)
        ? item!.sources!.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0)
        : undefined,
    }))
    .filter((item) => item.titre.length >= 2)
    .map((item, index) => ({ ...item, numero: index + 1 }));
}

/**
 * Découpe le récit de l'auteur en passages numérotés (1, 2, 3…) : c'est la
 * matière que le sommaire doit suivre dans l'ordre, sans rien inventer.
 */
export function listSourcePassages(text: string): string[] {
  return splitPassages(dedupeSourceText(String(text || '')));
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
