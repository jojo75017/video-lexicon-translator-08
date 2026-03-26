/**
 * Statistiques professionnelles de manuscrit
 * Fournit des métriques éditoriales précises pour KDP
 */

export interface ManuscriptStats {
  totalWords: number;
  totalCharacters: number;
  totalCharactersNoSpaces: number;
  totalSentences: number;
  totalParagraphs: number;
  totalPages: number; // Estimation format 6x9 KDP (~250 mots/page)
  averageWordsPerChapter: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
  readingTimeMinutes: number;
  listeningTimeMinutes: number; // TTS ~150 mots/min
  shortestChapter: { index: number; title: string; words: number } | null;
  longestChapter: { index: number; title: string; words: number } | null;
  readabilityLevel: 'facile' | 'moyen' | 'soutenu' | 'académique';
  dialoguePercentage: number;
  chaptersStats: ChapterStat[];
}

export interface ChapterStat {
  index: number;
  title: string;
  words: number;
  sentences: number;
  paragraphs: number;
  pages: number;
  dialogueLines: number;
}

interface ManuscriptInput {
  preface?: string;
  conclusion?: string;
  epilogue?: string;
  chapters: Array<{
    title?: string;
    content?: string;
    subChapters?: Array<{ title?: string; content?: string }>;
  }>;
}

const WORDS_PER_PAGE_KDP = 250;
const READING_WPM = 230; // Average adult reading speed (French)
const LISTENING_WPM = 150;

/**
 * Calcule toutes les statistiques professionnelles d'un manuscrit
 */
export function computeManuscriptStats(input: ManuscriptInput): ManuscriptStats {
  const chaptersStats: ChapterStat[] = [];
  let totalWords = 0;
  let totalChars = 0;
  let totalCharsNoSpaces = 0;
  let totalSentences = 0;
  let totalParagraphs = 0;
  let totalDialogueLines = 0;

  // Compter préface, conclusion, épilogue
  const extraTexts = [input.preface, input.conclusion, input.epilogue].filter(Boolean);
  for (const t of extraTexts) {
    const s = textStats(t!);
    totalWords += s.words;
    totalChars += s.chars;
    totalCharsNoSpaces += s.charsNoSpaces;
    totalSentences += s.sentences;
    totalParagraphs += s.paragraphs;
    totalDialogueLines += s.dialogueLines;
  }

  // Chapitres
  for (let i = 0; i < input.chapters.length; i++) {
    const ch = input.chapters[i];
    const fullContent = [
      ch.content || '',
      ...(ch.subChapters || []).map(s => s.content || '')
    ].join('\n\n');

    const s = textStats(fullContent);
    const stat: ChapterStat = {
      index: i + 1,
      title: ch.title || `Chapitre ${i + 1}`,
      words: s.words,
      sentences: s.sentences,
      paragraphs: s.paragraphs,
      pages: Math.ceil(s.words / WORDS_PER_PAGE_KDP),
      dialogueLines: s.dialogueLines,
    };

    chaptersStats.push(stat);
    totalWords += s.words;
    totalChars += s.chars;
    totalCharsNoSpaces += s.charsNoSpaces;
    totalSentences += s.sentences;
    totalParagraphs += s.paragraphs;
    totalDialogueLines += s.dialogueLines;
  }

  const sorted = [...chaptersStats].sort((a, b) => a.words - b.words);

  const avgWordsPerSentence = totalSentences > 0 ? Math.round(totalWords / totalSentences) : 0;

  return {
    totalWords,
    totalCharacters: totalChars,
    totalCharactersNoSpaces: totalCharsNoSpaces,
    totalSentences,
    totalParagraphs,
    totalPages: Math.ceil(totalWords / WORDS_PER_PAGE_KDP),
    averageWordsPerChapter: chaptersStats.length > 0
      ? Math.round(totalWords / chaptersStats.length)
      : 0,
    averageWordsPerSentence: avgWordsPerSentence,
    averageSentencesPerParagraph: totalParagraphs > 0
      ? Math.round(totalSentences / totalParagraphs)
      : 0,
    readingTimeMinutes: Math.ceil(totalWords / READING_WPM),
    listeningTimeMinutes: Math.ceil(totalWords / LISTENING_WPM),
    shortestChapter: sorted.length > 0 ? sorted[0] : null,
    longestChapter: sorted.length > 0 ? sorted[sorted.length - 1] : null,
    readabilityLevel: getReadabilityLevel(avgWordsPerSentence),
    dialoguePercentage: totalWords > 0
      ? Math.round((totalDialogueLines * 12) / totalWords * 100) // ~12 words avg per dialogue line
      : 0,
    chaptersStats,
  };
}

function textStats(text: string) {
  if (!text || text.trim().length === 0) {
    return { words: 0, chars: 0, charsNoSpaces: 0, sentences: 0, paragraphs: 0, dialogueLines: 0 };
  }

  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[.!?…]+/g) || []).length || 1;
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1;

  // Dialogue lines: starting with — or « or "
  const dialogueLines = (text.match(/^(?:—|«|"|–)\s*/gm) || []).length;

  return { words, chars, charsNoSpaces, sentences, paragraphs, dialogueLines };
}

function getReadabilityLevel(avgWordsPerSentence: number): ManuscriptStats['readabilityLevel'] {
  if (avgWordsPerSentence <= 12) return 'facile';
  if (avgWordsPerSentence <= 18) return 'moyen';
  if (avgWordsPerSentence <= 25) return 'soutenu';
  return 'académique';
}

/**
 * Valide l'ISBN-13 (checksum Modulo 10)
 */
export function validateISBN13(isbn: string): { valid: boolean; message: string } {
  const cleaned = isbn.replace(/[-\s]/g, '');
  if (!/^\d{13}$/.test(cleaned)) {
    return { valid: false, message: 'L\'ISBN-13 doit contenir exactement 13 chiffres' };
  }
  if (!cleaned.startsWith('978') && !cleaned.startsWith('979')) {
    return { valid: false, message: 'L\'ISBN-13 doit commencer par 978 ou 979' };
  }

  // Modulo 10 checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  if (checkDigit !== parseInt(cleaned[12])) {
    return { valid: false, message: `Chiffre de contrôle invalide (attendu : ${checkDigit})` };
  }

  return { valid: true, message: 'ISBN-13 valide' };
}

/**
 * Vérifie les dimensions de couverture KDP
 * Minimum: 625x1000 px, recommandé: 2560x1600 px (ratio 1.6:1)
 */
export function validateCoverDimensions(
  width: number,
  height: number
): { valid: boolean; status: 'pass' | 'warning' | 'fail'; message: string } {
  if (width < 625 || height < 1000) {
    return {
      valid: false,
      status: 'fail',
      message: `${width}×${height} px — Minimum KDP : 625×1000 px`,
    };
  }

  const ratio = height / width;
  if (ratio < 1.4 || ratio > 1.8) {
    return {
      valid: false,
      status: 'warning',
      message: `Ratio ${ratio.toFixed(2)} — Recommandé entre 1.4:1 et 1.8:1`,
    };
  }

  if (width >= 2560 && height >= 1600) {
    return { valid: true, status: 'pass', message: `${width}×${height} px — Qualité optimale` };
  }

  return {
    valid: true,
    status: 'warning',
    message: `${width}×${height} px — Recommandé : 2560×1600 px minimum`,
  };
}
