/**
 * BookPerfect AI — Import & découpage du manuscrit.
 * Supporte DOCX (mammoth), Markdown/TXT (direct). Découpe en chapitres via
 * le parseur partagé manuscriptParser (titres Markdown, « Chapitre X »…).
 */
import mammoth from 'mammoth';
import { parseManuscript } from '@/lib/manuscriptParser';
import type { Chapter, Manuscript } from './types';

const WORDS_PER_PAGE = 300;

const countWords = (t: string) => (t || '').trim().split(/\s+/).filter(Boolean).length;

const isChapterLikeLine = (line: string) => {
  const l = line.trim();
  return /^(?:#{1,3}\s+)?(?:chapitre|partie|prologue|épilogue|epilogue|introduction)\b/i.test(l);
};

const isTocStartLine = (line: string) => /^(?:table des matières|table des matieres|sommaire)\s*:?$/i.test(line.trim());

const isLikelyTocEntry = (line: string) => {
  const l = line.trim();
  return isChapterLikeLine(l) && (/[.·•…]{2,}\s*\d{1,4}$/.test(l) || /\s+\d{1,4}$/.test(l));
};

const stripExistingTableOfContents = (text: string): string => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex(isTocStartLine);
  if (start < 0) return text;

  let end = start + 1;
  for (; end < lines.length; end += 1) {
    const current = lines[end].trim();
    if (!current) continue;
    if (isLikelyTocEntry(current)) continue;

    if (isChapterLikeLine(current)) {
      const nextMeaningful = lines.slice(end + 1).map((l) => l.trim()).find(Boolean) || '';
      if (!isLikelyTocEntry(nextMeaningful) && !isChapterLikeLine(nextMeaningful)) break;
      continue;
    }

    if (end - start > 2) break;
  }

  return [...lines.slice(0, start), ...lines.slice(end)].join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

const isFrontMatterOnly = (chapter: Chapter, allChapters: Chapter[]) => {
  if (chapter.index !== 0 || allChapters.length < 2 || chapter.title !== 'Manuscrit') return false;
  const text = chapter.content.trim();
  const chapterLineCount = text.split('\n').filter(isChapterLikeLine).length;
  return countWords(text) <= 120 || isTocStartLine(text.split('\n').find(Boolean) || '') || chapterLineCount >= 3;
};

const stableManuscriptId = async (fileName: string, rawText: string) => {
  const source = `${fileName}\n${rawText.slice(0, 20000)}\n${rawText.length}`;
  try {
    const data = new TextEncoder().encode(source);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    return `manuscript-${hex.slice(0, 16)}`;
  } catch {
    let hash = 0;
    for (let i = 0; i < source.length; i++) hash = Math.imul(31, hash) + source.charCodeAt(i) | 0;
    return `manuscript-${Math.abs(hash).toString(36)}`;
  }
};

/** Extrait le texte brut d'un fichier selon son extension. */
export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx')) {
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value || '';
  }
  if (name.endsWith('.md') || name.endsWith('.txt')) {
    return await file.text();
  }
  if (name.endsWith('.doc')) {
    throw new Error("Les fichiers .doc (ancien format) ne sont pas pris en charge. Enregistrez votre document au format .docx dans Word puis réimportez-le.");
  }
  throw new Error('Format non pris en charge. Utilisez un fichier .docx, .md ou .txt.');
}

/** Construit un manuscrit structuré à partir d'un fichier. */
export async function importManuscript(file: File): Promise<Manuscript> {
  const rawText = stripExistingTableOfContents((await extractText(file)).replace(/\r\n/g, '\n').trim());
  if (!rawText || countWords(rawText) < 50) {
    throw new Error("Le document semble vide ou trop court. Vérifiez qu'il contient bien du texte.");
  }

  const sections = parseManuscript(rawText, 'Manuscrit');
  const parsedChapters: Chapter[] = sections.map((s, i) => {
    const content = s.blocks.map((b) => b.text).join('\n\n');
    return {
      id: `ch-${i + 1}`,
      index: i,
      title: s.title || `Chapitre ${i + 1}`,
      content,
      wordCount: countWords(content),
    };
  }).filter((c) => c.wordCount > 0);

  const chapters: Chapter[] = parsedChapters
    .filter((c) => !isFrontMatterOnly(c, parsedChapters))
    .map((c, i) => ({ ...c, id: `ch-${i + 1}`, index: i }));

  // Repli : si aucun découpage n'a été détecté, un seul « chapitre ».
  if (chapters.length === 0) {
    chapters.push({ id: 'ch-1', index: 0, title: 'Manuscrit complet', content: rawText, wordCount: countWords(rawText) });
  }

  const wordCount = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  // Titre : 1re ligne non vide courte, sinon nom du fichier.
  const firstLine = rawText.split('\n').map((l) => l.trim()).find((l) => l.length > 0 && l.length < 100);
  const title = (firstLine || file.name.replace(/\.(docx|md|txt)$/i, '')).replace(/^#+\s*/, '');

  return {
    id: await stableManuscriptId(file.name, rawText),
    fileName: file.name,
    title,
    rawText,
    chapters,
    wordCount,
    pageEstimate: Math.max(1, Math.round(wordCount / WORDS_PER_PAGE)),
    importedAt: Date.now(),
  };
}
