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
  cloudSavedAt?: string;
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
  /** Dernier texte qui doit être corrigé automatiquement après son enregistrement. */
  pendingPolishIndex?: number;
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
  /** Faits confirmés que la correction, le sommaire et la rédaction doivent respecter. */
  factMemory?: string[];
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

export function updateCorrectedPassage(brief: BookBrief, index: number, corrected: string): BookBrief {
  const entry = (brief.polished || []).find((passage) => passage.index === index);
  if (!entry || !corrected.trim()) return brief;
  return {
    ...brief,
    polished: upsertPolished(brief, { ...entry, corrected: corrected.trim(), validatedAt: undefined }),
  };
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

  // Déjà présent à l'identique : on n'ajoute rien.
  if (existingKeys.includes(addedKey)) return base;

  /** Un passage n'est « absorbé » que s'il est assez long pour ne pas être
   *  une phrase d'ouverture réutilisée par hasard (au moins 12 mots). */
  const substantial = (key: string) => key.split(' ').filter(Boolean).length >= 12;

  // Le nouvel envoi est déjà contenu, mot pour mot, dans un passage plus complet.
  if (substantial(addedKey) && existingKeys.some((key) => key.includes(addedKey))) return base;

  // Le nouvel envoi est une version enrichie d'un passage déjà là : il le remplace.
  // Les textes courts (première réponse, précision d'une ligne) ne sont jamais effacés.
  const kept = existing.filter(
    (_, i) => !(substantial(existingKeys[i]) && addedKey.includes(existingKeys[i])),
  );
  return [...kept, clean].join('\n\n');
}

/** Remplace explicitement un texte. Cette action de l'auteur ne passe jamais par le dédoublonnage. */
export function replaceSourcePassage(brief: BookBrief, index: number, value: string): BookBrief {
  const passages = listSourcePassages(brief.sourceText || '');
  if (!passages[index - 1] || !value.trim()) return brief;
  passages[index - 1] = stripAuthorPrefix(value);
  return {
    ...brief,
    sourceText: passages.join('\n\n'),
    polished: (brief.polished || []).filter((entry) => entry.index !== index),
    outlineValidated: false,
  };
}

/** Insère un oubli à l'endroit choisi et décale les corrections suivantes sans les perdre. */
export function insertSourcePassage(brief: BookBrief, afterIndex: number, value: string): BookBrief {
  const clean = stripAuthorPrefix(value);
  if (!clean) return brief;
  const passages = listSourcePassages(brief.sourceText || '');
  const position = Math.min(passages.length, Math.max(0, afterIndex));
  passages.splice(position, 0, clean);
  const polished = (brief.polished || []).map((entry) =>
    entry.index > position ? { ...entry, index: entry.index + 1 } : entry,
  );
  return { ...brief, sourceText: passages.join('\n\n'), polished, outlineValidated: false };
}

/** Noms, dates et liens familiaux qui ne doivent jamais disparaître d'une correction. */
export function protectedTerms(text: string): string[] {
  const ignoredSentenceWords = new Set([
    'Alors', 'Après', 'Avant', 'Avec', 'Cette', 'Comme', 'Dans', 'Depuis', 'Elle', 'Encore',
    'Ensuite', 'Il', 'Lorsque', 'Mais', 'Mon', 'Nous', 'Puis', 'Quand', 'Reste', 'Sans',
    'Son', 'Sous', 'Sur', 'Tous', 'Une', 'Votre', 'Vous', 'Né', 'Née',
  ].map((word) => word.toLocaleLowerCase('fr-FR')));
  const names = (String(text || '').match(/\b[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{2,}(?:-[A-ZÀ-ÖØ-Ýa-zà-öø-ÿ]+)*\b/g) || [])
    .filter((word) => !ignoredSentenceWords.has(word.toLocaleLowerCase('fr-FR')));
  const dates = String(text || '').match(/\b(?:18|19|20)\d{2}\b|\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/g) || [];
  const family = String(text || '').match(/\b(?:frère|sœur|soeur|mère|père|grand-mère|grand-père|fils|fille|mari|femme)\b/gi) || [];
  return Array.from(new Set([...names, ...dates, ...family]));
}

export function missingProtectedTerms(original: string, corrected: string): string[] {
  const haystack = corrected.toLocaleLowerCase('fr-FR');
  return protectedTerms(original).filter((term) => !haystack.includes(term.toLocaleLowerCase('fr-FR')));
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
      ...item,
      numero: 0,
      titre: String(item?.titre || '').trim(),
      objectif: String(item?.objectif || '').trim(),
      period: String(item?.period || '').trim() || undefined,
      points: Array.isArray(item?.points)
        ? item!.points!.map((p) => String(p || '').trim()).filter(Boolean)
        : undefined,
      note: String(item?.note || '').trim() || undefined,
      keyword: String(item?.keyword || '').trim() || undefined,
      readerQuestion: String(item?.readerQuestion || '').trim() || undefined,
      tone: String(item?.tone || '').trim() || undefined,
      wordsTarget: Number(item?.wordsTarget) > 0 ? Math.round(Number(item!.wordsTarget)) : undefined,
      blocks: Array.isArray(item?.blocks) ? (item!.blocks!.filter(Boolean) as OutlineBlockId[]) : undefined,
      locked: item?.locked ? true : undefined,
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

/** Nombre de mots réellement écrits par l'auteur (matière brute, sans doublon). */
export function sourceWordCount(brief: BookBrief | null | undefined): number {
  return listSourcePassages(brief?.sourceText || '').reduce((total, p) => total + countWords(p), 0);
}

export const CHAPTER_MIN = 3;
export const CHAPTER_MAX = 40;
export const CHAPTER_WARN = 30;
/** Longueur de chapitre par défaut quand l'auteur n'a rien réglé. */
export const DEFAULT_WORDS_PER_CHAPTER = 3000;

/**
 * Nombre de chapitres déduit de ce que l'auteur a VRAIMENT écrit.
 * On ne demande plus le nombre de chapitres à l'avance : il se calcule à
 * partir du volume réel de récit, borné entre 3 et 40 chapitres.
 */
export function suggestChapterCount(sourceWords: number, wordsPerChapter?: number): number {
  const per = Math.min(3500, Math.max(1200, Number(wordsPerChapter) || DEFAULT_WORDS_PER_CHAPTER));
  const words = Math.max(0, Number(sourceWords) || 0);
  const raw = Math.round(words / per);
  return Math.min(CHAPTER_MAX, Math.max(CHAPTER_MIN, raw || CHAPTER_MIN));
}

/**
 * Passages du récit qui ne sont encore rattachés à aucun chapitre du sommaire :
 * c'est la matière ajoutée après la construction du sommaire.
 */
export function uncoveredPassages(brief: BookBrief | null | undefined): number[] {
  const total = listSourcePassages(brief?.sourceText || '').length;
  const covered = new Set(
    (brief?.outline || []).flatMap((c) => (Array.isArray(c.sources) ? c.sources : [])),
  );
  const out: number[] = [];
  for (let i = 1; i <= total; i++) if (!covered.has(i)) out.push(i);
  return out;
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
