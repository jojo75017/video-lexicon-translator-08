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

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
  const rawText = (await extractText(file)).replace(/\r\n/g, '\n').trim();
  if (!rawText || countWords(rawText) < 50) {
    throw new Error("Le document semble vide ou trop court. Vérifiez qu'il contient bien du texte.");
  }

  const sections = parseManuscript(rawText, 'Manuscrit');
  const chapters: Chapter[] = sections.map((s, i) => {
    const content = s.blocks.map((b) => b.text).join('\n\n');
    return {
      id: `ch-${i + 1}`,
      index: i,
      title: s.title || `Chapitre ${i + 1}`,
      content,
      wordCount: countWords(content),
    };
  }).filter((c) => c.wordCount > 0);

  // Repli : si aucun découpage n'a été détecté, un seul « chapitre ».
  if (chapters.length === 0) {
    chapters.push({ id: 'ch-1', index: 0, title: 'Manuscrit complet', content: rawText, wordCount: countWords(rawText) });
  }

  const wordCount = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  // Titre : 1re ligne non vide courte, sinon nom du fichier.
  const firstLine = rawText.split('\n').map((l) => l.trim()).find((l) => l.length > 0 && l.length < 100);
  const title = (firstLine || file.name.replace(/\.(docx|md|txt)$/i, '')).replace(/^#+\s*/, '');

  return {
    id: genId(),
    fileName: file.name,
    title,
    rawText,
    chapters,
    wordCount,
    pageEstimate: Math.max(1, Math.round(wordCount / WORDS_PER_PAGE)),
    importedAt: Date.now(),
  };
}
