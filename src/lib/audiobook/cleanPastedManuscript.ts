/**
 * Nettoyage d'un manuscrit collé depuis un PDF / Word.
 * Retire les en-têtes de page répétés, les numéros de page, le sommaire,
 * les titres dupliqués et les coupures de mots, puis rétablit les chapitres.
 * 100 % local et déterministe : aucun appel réseau, aucune IA.
 */

export type CleanResult = {
  text: string;
  removedHeader: string | null;
  removedToc: boolean;
  changed: boolean;
};

const CHAPTER_WORD = '(?:CHAPITRE|PARTIE)';

function detectRunningHeader(lines: string[]): string | null {
  const counts = new Map<string, number>();
  for (const line of lines) {
    const m = line.match(/^\s*(.{8,80}?)\s+\d{1,4}(?:\s|$)/);
    if (m) {
      const key = m[1].trim();
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  let best: string | null = null;
  let bestCount = 0;
  counts.forEach((count, key) => {
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  });
  return bestCount >= 3 ? best : null;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function splitParagraphs(body: string): string {
  const sentences = body.split(/(?<=[.!?…»])\s+/);
  const out: string[] = [];
  let group: string[] = [];
  for (const sentence of sentences) {
    group.push(sentence);
    if (group.length >= 4) {
      out.push(group.join(' '));
      group = [];
    }
  }
  if (group.length) out.push(group.join(' '));
  return out.join('\n\n');
}

export function cleanPastedManuscript(raw: string): CleanResult {
  const original = raw || '';
  if (!original.trim()) {
    return { text: '', removedHeader: null, removedToc: false, changed: false };
  }

  let lines = original.replace(/\r\n/g, '\n').split('\n');

  // 1. En-tête courant répété (« Titre du livre 12 »)
  const header = detectRunningHeader(lines);
  if (header) {
    const re = new RegExp(`${escapeRegExp(header)}\\s*\\d{0,4}`, 'gi');
    lines = lines.map((l) => l.replace(re, ' '));
  }

  // 2. Sommaire / table des matières (une page = une ligne dans un copier-coller PDF)
  const tocIndexes = lines
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => /TABLE\s+DES\s+MATI[ÈE]RES|SOMMAIRE/i.test(l))
    .map(({ i }) => i);
  const removedToc = tocIndexes.length > 0;
  if (removedToc) {
    const skip = new Set(tocIndexes);
    lines = lines.filter((_, i) => !skip.has(i));
  }

  let text = lines.join('\n');

  // 3. Numéros de page isolés
  text = text.replace(/^\s*\d{1,4}\s*$/gm, '');

  // 4. Doublons de titres : « CHAPITRE 1 CHAPITRE 1 : », « 1.1 1.1 »
  text = text.replace(new RegExp(`(${CHAPTER_WORD}\\s+\\d+)\\s*:?\\s*\\1`, 'gi'), '$1');
  text = text.replace(/\b(\d+\.\d+)\s+\1\b/g, '$1');

  // 5. Coupures de mots et espaces parasites issues du PDF
  text = text.replace(/(\p{L})\s+-\s+(\p{L})/gu, '$1-$2');
  text = text.replace(/(\p{L})-\s+(\p{Ll})/gu, '$1$2');
  text = text.replace(/\s+([,.])/g, '$1');
  text = text.replace(/[ \t]{2,}/g, ' ');

  // 6. Rétablir les titres sur leur propre ligne
  text = text.replace(
    new RegExp(`\\s*\\b(${CHAPTER_WORD}\\s+\\d+(?:\\s*:\\s*[^\\n.]{0,70}?)?)(?=\\s+[«"A-ZÀ-Ÿ]?[a-zà-ÿ])`, 'g'),
    '\n\n## $1\n\n',
  );
  text = text.replace(/\s*\b(PR[ÉE]FACE|CONCLUSION|[ÉE]PILOGUE|PROLOGUE|INTRODUCTION)\b\s*/g, '\n\n## $1\n\n');
  text = text.replace(/\s*(#{2,3})\s*(\d+\.\d+[^\n]{0,90}?)(?=\s+[A-ZÀ-Ÿ][a-zà-ÿ])/g, '\n\n### $2\n\n');

  // 7. Paragraphes lisibles
  text = text
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  text = text
    .split(/\n\n+/)
    .map((block) => (/^#{2,3}\s/.test(block) || block.length < 400 ? block : splitParagraphs(block)))
    .join('\n\n')
    .trim();

  return {
    text,
    removedHeader: header,
    removedToc,
    changed: text !== original.trim(),
  };
}
