/**
 * Parseur de manuscrit léger partagé par les modules d'export V3.
 * Découpe un texte collé en sections (chapitres) selon les titres Markdown (#, ##)
 * ou les lignes "Chapitre X". Sans dépendance, déterministe.
 */
export interface ParsedSection {
  title: string;
  blocks: { text: string }[];
}

export const parseManuscript = (raw: string, fallbackTitle = 'Contenu'): ParsedSection[] => {
  const text = (raw || '').replace(/\r\n/g, '\n').trim();
  if (!text) return [];

  const lines = text.split('\n');
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;
  let buffer: string[] = [];

  const flushParagraphs = () => {
    if (!current) return;
    const joined = buffer.join('\n');
    const paras = joined.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    paras.forEach((p) => current!.blocks.push({ text: p.replace(/\n/g, ' ') }));
    buffer = [];
  };

  const isHeading = (line: string) => {
    const l = line.trim();
    if (/^#{1,3}\s+/.test(l)) return l.replace(/^#{1,3}\s+/, '').trim();
    if (/^chapitre\s+/i.test(l) && l.length < 80) return l.trim();
    if (/^partie\s+/i.test(l) && l.length < 80) return l.trim();
    return null;
  };

  for (const line of lines) {
    const heading = isHeading(line);
    if (heading) {
      flushParagraphs();
      current = { title: heading, blocks: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { title: fallbackTitle, blocks: [] };
        sections.push(current);
      }
      buffer.push(line);
    }
  }
  flushParagraphs();

  return sections.filter((s) => s.blocks.length > 0 || s.title);
};

export const countWords = (raw: string): number =>
  (raw || '').trim().split(/\s+/).filter(Boolean).length;
