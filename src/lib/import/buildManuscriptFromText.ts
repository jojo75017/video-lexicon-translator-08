/**
 * Utilitaire partagé : construit un Manuscript à partir d'un texte brut,
 * quel qu'en soit l'origine (PDF, URL, transcription audio, coller).
 */
import { parseManuscript } from '@/lib/manuscriptParser';
import type { Chapter, Manuscript } from '@/lib/bookperfect/types';

const WORDS_PER_PAGE = 300;
const countWords = (t: string) => (t || '').trim().split(/\s+/).filter(Boolean).length;

export async function buildManuscriptFromText(rawText: string, fileName: string, title?: string): Promise<Manuscript> {
  const clean = (rawText || '').replace(/\r\n/g, '\n').trim();
  if (!clean || countWords(clean) < 30) {
    throw new Error("Le contenu semble vide ou trop court (moins de 30 mots).");
  }
  const sections = parseManuscript(clean, title || fileName || 'Manuscrit');
  const parsedChapters: Chapter[] = sections.map((s, i) => {
    const content = s.blocks.map((b) => b.text).join('\n\n');
    return {
      id: `ch-${i + 1}`,
      index: i,
      title: s.title || `Chapitre ${i + 1}`,
      content,
      blocks: s.blocks,
      wordCount: countWords(content),
    };
  }).filter((c) => c.wordCount > 0);

  const chapters = parsedChapters.length > 0
    ? parsedChapters.map((c, i) => ({ ...c, id: `ch-${i + 1}`, index: i }))
    : [{ id: 'ch-1', index: 0, title: title || 'Contenu importé', content: clean, wordCount: countWords(clean) }];

  const wordCount = chapters.reduce((sum, c) => sum + c.wordCount, 0);
  const firstLine = clean.split('\n').map((l) => l.trim()).find((l) => l.length > 0 && l.length < 120);
  const finalTitle = title || (firstLine || fileName.replace(/\.[a-z0-9]+$/i, '')).replace(/^#+\s*/, '');

  let id = `import-${Date.now()}`;
  try {
    const data = new TextEncoder().encode(`${fileName}\n${clean.slice(0, 20000)}\n${clean.length}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    id = `manuscript-${hex.slice(0, 16)}`;
  } catch { /* ignore */ }

  return {
    id,
    fileName,
    title: finalTitle,
    rawText: clean,
    chapters,
    wordCount,
    pageEstimate: Math.max(1, Math.round(wordCount / WORDS_PER_PAGE)),
    importedAt: Date.now(),
  };
}
