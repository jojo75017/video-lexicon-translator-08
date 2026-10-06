/**
 * Reconnaissance automatique des dimensions d'un livre pour la couverture brochée/reliée.
 * - PDF : nombre de pages exact + format de coupe lu sur la 1re page.
 * - Word : format de page du document + estimation des pages à partir du nombre de mots.
 * - Livre enregistré (même titre) : estimation à partir des chapitres rédigés.
 * Aucune donnée inventée : sans texte trouvé, on ne renvoie rien.
 */
import { supabase } from '@/integrations/supabase/client';
import { KDP_TRIM_SIZES } from './kdpPaperbackSpecs';

export interface DetectedDimensions {
  pageCount: number;
  trimId?: string;
  words?: number;
  exact: boolean;
  source: string;
}

const countWords = (text: string) => (text.match(/[\p{L}\p{N}’']+/gu) ?? []).length;

/** Mots par page selon la surface du format (référence : 6 × 9 po ≈ 300 mots). */
const wordsPerPage = (trimId: string) => {
  const t = KDP_TRIM_SIZES.find((x) => x.id === trimId) ?? { widthIn: 6, heightIn: 9 };
  return Math.max(150, Math.round((300 * (t.widthIn * t.heightIn)) / 54));
};

export const estimatePages = (words: number, trimId: string, chapters = 0) => {
  const raw = Math.ceil(words / wordsPerPage(trimId)) + Math.ceil(chapters * 0.5) + 8;
  const even = raw % 2 === 0 ? raw : raw + 1;
  return Math.max(24, even);
};

/** Format KDP le plus proche (tolérance 0,08 po). */
export const matchTrim = (widthIn: number, heightIn: number): string | undefined => {
  let best: { id: string; d: number } | null = null;
  for (const t of KDP_TRIM_SIZES) {
    const d = Math.abs(t.widthIn - widthIn) + Math.abs(t.heightIn - heightIn);
    if (!best || d < best.d) best = { id: t.id, d };
  }
  return best && best.d <= 0.16 ? best.id : undefined;
};

const normalize = (v: string) =>
  v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();

/** Cherche le livre enregistré portant ce titre et estime son nombre de pages. */
export async function detectFromSavedBook(title: string, trimId: string): Promise<DetectedDimensions | null> {
  const target = normalize(title);
  if (!target) return null;
  const { data } = await supabase
    .from('ebook_projects')
    .select('title, chapters, preface, conclusion, updated_at')
    .order('updated_at', { ascending: false })
    .limit(80);
  const book = (data ?? []).find((b) => {
    const n = normalize(String(b.title ?? ''));
    return n && (n === target || n.startsWith(target) || target.startsWith(n));
  });
  if (!book) return null;
  const chapters = Array.isArray(book.chapters) ? (book.chapters as Array<{ content?: unknown }>) : [];
  const written = chapters.filter((c) => typeof c?.content === 'string' && c.content.trim());
  const words =
    written.reduce((s, c) => s + countWords(String(c.content)), 0) +
    countWords(String(book.preface ?? '')) +
    countWords(String(book.conclusion ?? ''));
  if (words < 500) return null;
  return {
    pageCount: estimatePages(words, trimId, written.length),
    words,
    exact: false,
    source: `livre « ${book.title} » (${written.length} chapitres)`,
  };
}

/** Lit un manuscrit importé (PDF, Word, texte). */
export async function detectFromFile(file: File, trimId: string): Promise<DetectedDimensions> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) {
    const { loadPdfjs } = await import('@/lib/import/pdfjsLoader');
    const pdfjs = await loadPdfjs();
    const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const page = await doc.getPage(1);
    const [x0, y0, x1, y1] = page.view as number[];
    const detectedTrim = matchTrim((x1 - x0) / 72, (y1 - y0) / 72);
    const pages = doc.numPages % 2 === 0 ? doc.numPages : doc.numPages + 1;
    return { pageCount: Math.max(24, pages), trimId: detectedTrim, exact: true, source: `fichier ${file.name}` };
  }
  if (name.endsWith('.docx')) {
    const buffer = await file.arrayBuffer();
    let detectedTrim: string | undefined;
    try {
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync(buffer);
      const xml = (await zip.file('word/document.xml')?.async('string')) ?? '';
      const m = xml.match(/<w:pgSz[^>]*w:w="(\d+)"[^>]*w:h="(\d+)"/);
      if (m) detectedTrim = matchTrim(Number(m[1]) / 1440, Number(m[2]) / 1440);
    } catch {
      /* format de page illisible : on garde le format choisi */
    }
    const mammoth = await import('mammoth');
    const { value } = await mammoth.extractRawText({ arrayBuffer: buffer });
    const words = countWords(value);
    const chapters = (value.match(/^\s*(chapitre|chapter)\b/gim) ?? []).length;
    return {
      pageCount: estimatePages(words, detectedTrim ?? trimId, chapters),
      trimId: detectedTrim,
      words,
      exact: false,
      source: `fichier ${file.name}`,
    };
  }
  const text = await file.text();
  const words = countWords(text);
  return { pageCount: estimatePages(words, trimId), words, exact: false, source: `fichier ${file.name}` };
}
