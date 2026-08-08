/**
 * Normalisation UNIQUE du manuscrit (source de vérité pour la sauvegarde et tous les exports).
 *
 * Garanties :
 *  - le nombre de chapitres demandé est un plafond dur (jamais 80 chapitres pour 40 demandés) ;
 *  - appariement par numéro : un numéro = un chapitre (les doublons fusionnent) ;
 *  - le titre vient du chapitre puis du sommaire ; jamais du corps du texte ;
 *  - aucun titre répété avec un suffixe « 2 » ni collé au titre du livre.
 */

export interface NormalizedChapter {
  number: number;
  title: string;
  content: string;
  incomplete: boolean;
}

export interface OutlineLike {
  numero?: number;
  number?: number;
  titre?: string;
  title?: string;
}

export function cleanChapterHeading(value: unknown): string {
  return String(value ?? '')
    .replace(/```(?:json)?/gi, '')
    .replace(/[{}[\]`]/g, '')
    .replace(/"(?:numero|numéro|titre|objectif|title|chapterTitle|heading)"\s*:\s*/gi, '')
    .replace(/^['"«»“”]+|['"«»“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Un titre « générique » n'apporte aucune information (Chapitre 4, Partie 2, vide…). */
export function isGenericChapterHeading(value: unknown): boolean {
  const t = cleanChapterHeading(value).toLowerCase();
  if (!t) return true;
  return /^(?:chapitre|chapter|ch\.?|partie|part)\s*\d+$/.test(t);
}

/** Retire le préfixe « Chapitre N — » et le suffixe « — Titre du livre ». */
function stripDecorations(rawTitle: string, bookTitle?: string): string {
  let title = cleanChapterHeading(rawTitle)
    .replace(/^(?:chapitre|chapter|ch\.?|partie|part)\s*\d+\s*[:.–—-]\s*/i, '')
    .trim();

  const book = cleanChapterHeading(bookTitle).toLowerCase();
  if (book && book.length > 3) {
    const suffix = new RegExp(`\\s*[–—-]\\s*${book.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'i');
    title = title.replace(suffix, '').trim();
    const prefix = new RegExp(`^${book.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*[–—-]\\s*`, 'i');
    title = title.replace(prefix, '').trim();
  }

  // Un suffixe de répétition ajouté par un générateur de secours (« Le pacte fragile 2 »).
  title = title.replace(/\s+\d{1,2}$/, (match, offset: number) => (offset > 8 ? '' : match)).trim();

  return title;
}

interface NormalizeOptions {
  expectedCount?: number;
  outline?: OutlineLike[];
  bookTitle?: string;
  /** Texte inséré à la place du contenu manquant (sinon chaîne vide). */
  placeholder?: (num: number) => string;
}

/**
 * Reconstruit une liste de chapitres propre, numérotée de 1 à N sans trou ni doublon.
 */
export function normalizeManuscript(
  rawChapters: any[] | null | undefined,
  options: NormalizeOptions = {},
): NormalizedChapter[] {
  const { outline = [], bookTitle, placeholder } = options;
  const sources = Array.isArray(rawChapters) ? rawChapters.filter(Boolean) : [];

  // 1. Appariement par numéro — un numéro = une entrée. La version la plus riche gagne.
  const byNumber = new Map<number, { title: string; content: string }>();
  sources.forEach((raw, index) => {
    const num = Number(raw?.number ?? raw?.numero) || index + 1;
    const title = cleanChapterHeading(raw?.title ?? raw?.titre ?? raw?.nom);
    const content = String(raw?.content ?? raw?.contenu ?? '').trim();
    const existing = byNumber.get(num);
    if (!existing) {
      byNumber.set(num, { title, content });
      return;
    }
    byNumber.set(num, {
      title: existing.title && !isGenericChapterHeading(existing.title) ? existing.title : title,
      content: content.length > existing.content.length ? content : existing.content,
    });
  });

  const outlineByNumber = new Map<number, string>();
  outline.forEach((item, index) => {
    const num = Number(item?.numero ?? item?.number) || index + 1;
    const title = cleanChapterHeading(item?.titre ?? item?.title);
    if (title && !outlineByNumber.has(num)) outlineByNumber.set(num, title);
  });

  // 2. Plafond dur : jamais plus d'entrées que ce que l'auteur a demandé.
  const distinctNumbers = byNumber.size;
  const expected = Number(options.expectedCount) > 0 ? Number(options.expectedCount) : 0;
  const total = expected > 0
    ? Math.min(expected, Math.max(distinctNumbers, outlineByNumber.size, expected))
    : Math.max(distinctNumbers, outlineByNumber.size);

  const usedTitles = new Set<string>();
  const out: NormalizedChapter[] = [];

  for (let num = 1; num <= total; num++) {
    const entry = byNumber.get(num);
    const outlineTitle = outlineByNumber.get(num) || '';
    const candidate = entry?.title && !isGenericChapterHeading(entry.title) ? entry.title : outlineTitle;
    let title = stripDecorations(candidate, bookTitle);

    // 3. Aucun titre en doublon, aucun titre fabriqué depuis le corps du texte.
    const key = title.toLowerCase();
    if (title && usedTitles.has(key)) title = '';
    if (title) usedTitles.add(key);

    const content = entry?.content || '';
    const incomplete = content.length === 0;

    out.push({
      number: num,
      title,
      content: incomplete && placeholder ? placeholder(num) : content,
      incomplete,
    });
  }

  return out;
}

/** Titre affichable dans un sommaire : « Chapitre 3 – Le pacte fragile » ou « Chapitre 3 ». */
export function tocLabel(chapter: { number: number; title?: string }): string {
  const title = cleanChapterHeading(chapter.title);
  return title && !isGenericChapterHeading(title)
    ? `Chapitre ${chapter.number} – ${title}`
    : `Chapitre ${chapter.number}`;
}
