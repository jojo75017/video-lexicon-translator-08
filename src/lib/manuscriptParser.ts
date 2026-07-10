/**
 * Parseur de manuscrit léger partagé par les modules d'export V3.
 * Découpe un texte collé en sections (chapitres) selon les titres Markdown (#, ##)
 * ou les lignes "Chapitre X". Sans dépendance, déterministe.
 */
export interface ParsedSection {
  title: string;
  blocks: { text: string; type?: 'paragraph' | 'heading'; level?: 2 | 3 }[];
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
    paras.forEach((p) => current!.blocks.push({ text: p.replace(/\n/g, ' '), type: 'paragraph' }));
    buffer = [];
  };

  const isKeywordChapter = (line: string): string | null => {
    const l = line.trim();
    if (/^#\s+/.test(l)) return l.replace(/^#\s+/, '').trim();
    if (/^#{2,3}\s+(?:chapitre|partie|prologue|épilogue|epilogue|introduction)\b/i.test(l) && l.length < 120) {
      return l.replace(/^#{2,3}\s+/, '').trim();
    }
    if (/^(?:chapitre|partie|prologue|épilogue|epilogue|introduction)\b/i.test(l) && l.length < 120) return l.trim();
    return null;
  };

  // Détecte si le manuscrit utilise des titres de chapitre explicites
  // (« Chapitre X », « # Titre »…). Si OUI, les lignes courtes ordinaires
  // sont des SOUS-titres. Si NON, ces mêmes lignes courtes sont considérées
  // comme des TITRES DE CHAPITRE (évite de fusionner tous les chapitres).
  const hasExplicitChapters = lines.some((l) => isKeywordChapter(l) !== null);

  const isPlainTitleLine = (line: string) => {
    const l = line.trim();
    return l.length > 0 && l.length <= 90 && !/[.!?…]$/.test(l) && /^[A-ZÀ-Ÿ0-9][\wÀ-ÿ'’\-\s:;,]+$/.test(l);
  };

  const isChapterHeading = (line: string): string | null => {
    const kw = isKeywordChapter(line);
    if (kw) return kw;
    // Pas de chapitres explicites → une ligne-titre isolée démarre un chapitre.
    if (!hasExplicitChapters && isPlainTitleLine(line)) return line.trim();
    return null;
  };

  const isSubheading = (line: string): { text: string; level: 2 | 3 } | null => {
    const l = line.trim();
    const markdown = l.match(/^(#{2,3})\s+(.+)$/);
    if (markdown) return { text: markdown[2].trim(), level: markdown[1].length === 2 ? 2 : 3 };
    // Sous-titre en clair uniquement si le document a des chapitres explicites.
    if (hasExplicitChapters && isPlainTitleLine(l)) return { text: l, level: 2 };
    return null;
  };

  for (const line of lines) {
    const heading = isChapterHeading(line);
    if (heading) {
      flushParagraphs();
      current = { title: heading, blocks: [] };
      sections.push(current);
    } else {
      if (!current) {
        current = { title: fallbackTitle, blocks: [] };
        sections.push(current);
      }
      const subheading = isSubheading(line);
      if (subheading) {
        flushParagraphs();
        current.blocks.push({ text: subheading.text, type: 'heading', level: subheading.level });
      } else {
        buffer.push(line);
      }
    }
  }
  flushParagraphs();

  return sections.filter((s) => s.blocks.length > 0 || s.title);
};

export const countWords = (raw: string): number =>
  (raw || '').trim().split(/\s+/).filter(Boolean).length;
