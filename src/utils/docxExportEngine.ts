/**
 * Moteur d'export DOCX professionnel – Standard éditorial
 * 
 * Garantit un document Word prêt-publication :
 * - Hiérarchie claire des titres (HeadingLevel natifs Word)
 * - Propreté typographique (doubles espaces, sauts cassés, orphelins)
 * - Paragraphes équilibrés et fluides
 * - Page de titre, copyright, TDM, chapitres, conclusion
 * - Compatible KDP sans restructuration
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  convertInchesToTwip,
  UnderlineType,
  TabStopType,
  Tab,
  LevelFormat,
  SectionType,
} from 'docx';
import { saveAs } from 'file-saver';
import { cleanGeneratedText } from '@/utils/textCleaner';
import { applyFrenchTypography } from '@/utils/frenchTypography';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface DocxChapter {
  title: string;
  content?: string;
  subChapters: Array<{
    title: string;
    content?: string;
  }>;
}

export interface DocxCharacter {
  name: string;
  role?: string;
  description?: string;
}

export interface DocxExportOptions {
  title: string;
  authorName?: string;
  preface?: string;
  conclusion?: string;
  epilogue?: string;
  chapters: DocxChapter[];
  characters?: DocxCharacter[];
  fontFamily?: string;
  fontSize?: number; // in pt (e.g. 12)
  includeTableOfContents?: boolean;
  includeCoverPage?: boolean;
  includePageNumbers?: boolean;
  includeCopyrightPage?: boolean;
  pageFormat?: '6x9' | 'a4' | 'letter';
}

// ═══════════════════════════════════════════════════════════
// NETTOYAGE TYPOGRAPHIQUE ÉDITORIAL
// ═══════════════════════════════════════════════════════════

/**
 * Décide si un saut de ligne simple doit être conservé
 * (vrai paragraphe/transition) ou fusionné (ligne orpheline cassée).
 */
function shouldKeepSingleLineBreak(previousLine: string, nextLine: string): boolean {
  const prev = previousLine.trim();
  const next = nextLine.trim();

  if (!prev || !next) return true;

  // Conserver pour les structures explicites
  if (/^#{1,6}\s/.test(next)) return true;
  if (/^[-–—•●▪▸►]\s+/.test(next)) return true;
  if (/^\d+[.)]\s+/.test(next)) return true;

  // Conserver un vrai changement de bloc narratif
  if (/[.!?…]$/.test(prev) && /^["'«(\[]?[A-ZÀ-ÖØ-Þ]/.test(next)) return true;

  // Conserver les lignes très courtes (souvent titres/interludes)
  if (prev.length <= 40 && !/[.!?…]$/.test(prev)) return true;

  return false;
}

/**
 * Normalise les espaces manquants entre phrases/mots collés.
 */
function normalizeBrokenSpacing(text: string): string {
  return text
    // caractères invisibles pouvant coller les mots
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // "Phrase.suivante" => "Phrase. suivante"
    .replace(/([.!?…])(?=[A-Za-zÀ-ÖØ-öø-ÿ«"'([{])/g, '$1 ')
    // ",mot" ";mot" ":mot" => ajout d'espace après ponctuation
    .replace(/([,;:])(?=[A-Za-zÀ-ÖØ-öø-ÿ«"'([{])/g, '$1 ')
    // Collage type "motSuivant" (heuristique minimale)
    .replace(/([a-zà-öø-ÿ])([A-ZÀ-ÖØ-Þ])/g, '$1 $2')
    // éviter les espaces multiples recréés par les règles ci-dessus
    .replace(/ {2,}/g, ' ');
}

/**
 * Nettoyage éditorial profond du texte avant insertion DOCX.
 * Va au-delà du textCleaner standard pour garantir la propreté typographique.
 */
function editorialClean(raw: string): string {
  if (!raw) return '';

  let text = cleanGeneratedText(raw);

  // 1. Normaliser les retours Windows et les espaces cassés
  text = text.replace(/\r\n/g, '\n');
  text = normalizeBrokenSpacing(text);

  // 2. Fusionner intelligemment les lignes orphelines
  const lines = text.split('\n');
  const rebuilt: string[] = [];

  for (const currentLine of lines) {
    const normalizedLine = currentLine.replace(/^ +| +$/g, '');

    if (rebuilt.length === 0) {
      rebuilt.push(normalizedLine);
      continue;
    }

    const previousLine = rebuilt[rebuilt.length - 1];

    if (!previousLine || !normalizedLine) {
      rebuilt.push(normalizedLine);
      continue;
    }

    if (shouldKeepSingleLineBreak(previousLine, normalizedLine)) {
      rebuilt.push(normalizedLine);
    } else {
      rebuilt[rebuilt.length - 1] = `${previousLine} ${normalizedLine}`;
    }
  }

  text = rebuilt.join('\n');

  // 3. Supprimer les triples+ sauts de ligne
  text = text.replace(/\n{3,}/g, '\n\n');

  // 4. Supprimer les doubles espaces
  text = text.replace(/ {2,}/g, ' ');

  // 5. Supprimer les espaces en début/fin de ligne
  text = text.replace(/^ +| +$/gm, '');

  // 6. Supprimer les lignes ne contenant que des espaces
  text = text.replace(/^\s+$/gm, '');

  // 7. Supprimer les artefacts markdown résiduels qui ne doivent pas apparaître dans le DOCX
  // (les titres # sont traités séparément dans buildContentParagraphs)
  // Supprimer les séparateurs --- *** ===
  text = text.replace(/^[=\-_*]{3,}\s*$/gm, '');
  // Supprimer les balises HTML résiduelles
  text = text.replace(/<\/?(?:br|p|div|span|h[1-6])\s*\/?>/gi, '\n');
  // Supprimer les images markdown résiduelles
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // Supprimer les liens markdown mais garder le texte
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // 8. Typographie française professionnelle
  text = applyFrenchTypography(text);

  return text.trim();
}

/**
 * Découpe le texte nettoyé en paragraphes exploitables.
 * Filtre les paragraphes vides et les artefacts.
 */
function splitIntoParagraphs(text: string): string[] {
  if (!text) return [];

  const cleaned = editorialClean(text);
  const lines = cleaned.split('\n');
  const paragraphs: string[] = [];
  let current = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (current.trim()) paragraphs.push(current.trim());
      current = '';
      continue;
    }

    if (!current) {
      current = line;
      continue;
    }

    // Si une nouvelle phrase forte démarre sur une nouvelle ligne,
    // on considère qu'il s'agit d'un nouveau paragraphe éditorial.
    if (/[.!?…]$/.test(current) && /^["'«(\[]?[A-ZÀ-ÖØ-Þ]/.test(line)) {
      paragraphs.push(current.trim());
      current = line;
      continue;
    }

    current = `${current} ${line}`;
  }

  if (current.trim()) paragraphs.push(current.trim());

  return paragraphs.filter(p => p.length > 0 && p !== '---' && p !== '***' && !p.match(/^[=\-_]{3,}$/));
}

// ═══════════════════════════════════════════════════════════
// PARSEUR MARKDOWN → TEXTRUNS WORD
// ═══════════════════════════════════════════════════════════

function parseToTextRuns(text: string, sizeHalfPt: number, font: string): TextRun[] {
  if (!text || text.trim() === '') {
    return [new TextRun({ text: '', size: sizeHalfPt, font })];
  }

  const runs: TextRun[] = [];
  const tokenRegex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|__[\s\S]+?__|~~[\s\S]+?~~|<u>[\s\S]+?<\/u>|\*[^*\n]+?\*|_[^_\n]+?_)/g;

  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const normal = text.substring(lastIndex, match.index);
      if (normal) runs.push(new TextRun({ text: normal, size: sizeHalfPt, font }));
    }

    const m = match[0];
    if (m.startsWith('***') && m.endsWith('***')) {
      runs.push(new TextRun({ text: m.slice(3, -3), bold: true, italics: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('**') && m.endsWith('**')) {
      runs.push(new TextRun({ text: m.slice(2, -2), bold: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('__') && m.endsWith('__')) {
      runs.push(new TextRun({ text: m.slice(2, -2), bold: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('~~') && m.endsWith('~~')) {
      runs.push(new TextRun({ text: m.slice(2, -2), underline: { type: UnderlineType.SINGLE }, size: sizeHalfPt, font }));
    } else if (m.startsWith('<u>') && m.endsWith('</u>')) {
      runs.push(new TextRun({ text: m.slice(3, -4), underline: { type: UnderlineType.SINGLE }, size: sizeHalfPt, font }));
    } else if (m.startsWith('*') && m.endsWith('*')) {
      runs.push(new TextRun({ text: m.slice(1, -1), italics: true, size: sizeHalfPt, font }));
    } else if (m.startsWith('_') && m.endsWith('_')) {
      runs.push(new TextRun({ text: m.slice(1, -1), italics: true, size: sizeHalfPt, font }));
    }

    lastIndex = match.index + m.length;
  }

  if (lastIndex < text.length) {
    const remaining = text.substring(lastIndex);
    if (remaining) runs.push(new TextRun({ text: remaining, size: sizeHalfPt, font }));
  }

  return runs.length > 0 ? runs : [new TextRun({ text, size: sizeHalfPt, font })];
}

/**
 * Détecte si un paragraphe est une liste à puces ou numérotée.
 */
function detectListItem(text: string): { type: 'bullet' | 'number' | 'none'; content: string; number?: number } {
  // Puces : •, -, –, —, ●, ▪, ▸, ►
  const bulletMatch = text.match(/^[\s]*[-–—•●▪▸►]\s+(.*)/);
  if (bulletMatch) return { type: 'bullet', content: bulletMatch[1] };

  // Numérotées : 1. ou 1)
  const numberMatch = text.match(/^[\s]*(\d+)[.\)]\s+(.*)/);
  if (numberMatch) return { type: 'number', content: numberMatch[2], number: parseInt(numberMatch[1]) };

  return { type: 'none', content: text };
}

// ═══════════════════════════════════════════════════════════
// CONSTRUCTION DES PARAGRAPHES WORD
// ═══════════════════════════════════════════════════════════

function buildContentParagraphs(
  rawContent: string,
  sizeHalfPt: number,
  font: string,
): Paragraph[] {
  const paragraphs = splitIntoParagraphs(rawContent);
  const result: Paragraph[] = [];

  for (const para of paragraphs) {
    // Vérifier si c'est un sous-titre inline (ligne courte en gras ou commençant par #)
    const headingMatch = para.match(/^#{1,3}\s+(.*)/);
    if (headingMatch) {
      result.push(new Paragraph({
        children: [new TextRun({ text: headingMatch[1], bold: true, size: Math.round(sizeHalfPt * 1.2), font })],
        spacing: { before: 360, after: 200 },
      }));
      continue;
    }

    // Traiter les lignes individuelles pour détecter les listes
    const lines = para.split('\n');
    const isMultiLineList = lines.length > 1 && lines.every(l => detectListItem(l).type !== 'none');

    if (isMultiLineList) {
      // Bloc de liste
      for (const line of lines) {
        const item = detectListItem(line);
        const bullet = item.type === 'number' ? `${item.number}. ` : '•  ';
        result.push(new Paragraph({
          children: parseToTextRuns(`${bullet}${item.content}`, sizeHalfPt, font),
          spacing: { after: 80 },
          indent: { left: convertInchesToTwip(0.4), hanging: convertInchesToTwip(0.25) },
        }));
      }
      // Espacement après la liste
      result.push(new Paragraph({ spacing: { after: 120 } }));
    } else {
      // Vérifier si c'est un item de liste isolé
      const singleItem = detectListItem(para);
      if (singleItem.type !== 'none') {
        const bullet = singleItem.type === 'number' ? `${singleItem.number}. ` : '•  ';
        result.push(new Paragraph({
          children: parseToTextRuns(`${bullet}${singleItem.content}`, sizeHalfPt, font),
          spacing: { after: 120 },
          indent: { left: convertInchesToTwip(0.4), hanging: convertInchesToTwip(0.25) },
        }));
      } else {
        // Paragraphe standard avec alinéa et justification
        result.push(new Paragraph({
          children: parseToTextRuns(para, sizeHalfPt, font),
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 360 }, // Interligne 1.5
          indent: { firstLine: convertInchesToTwip(0.3) },
        }));
      }
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════
// GÉNÉRATEUR PRINCIPAL
// ═══════════════════════════════════════════════════════════

export async function generateProfessionalDocx(options: DocxExportOptions): Promise<Blob> {
  const {
    title,
    authorName = '',
    preface = '',
    conclusion = '',
    epilogue = '',
    chapters,
    characters = [],
    fontFamily = 'Georgia',
    fontSize = 12,
    includeTableOfContents = true,
    includeCoverPage = true,
    includePageNumbers = true,
    includeCopyrightPage = true,
    pageFormat = '6x9',
  } = options;

  const font = fontFamily;
  const baseSize = fontSize * 2; // half-points
  const titleSize = 72; // 36pt toujours
  const chapterTitleSize = Math.round(fontSize * 2.5);
  const subTitleSize = Math.round(fontSize * 1.75);

  // Dimensions de page
  const pageDimensions = {
    '6x9': { width: 6, height: 9, marginTop: 0.75, marginBottom: 0.75, marginLeft: 0.75, marginRight: 0.5 },
    'a4': { width: 8.27, height: 11.69, marginTop: 1, marginBottom: 1, marginLeft: 1, marginRight: 1 },
    'letter': { width: 8.5, height: 11, marginTop: 1, marginBottom: 1, marginLeft: 1, marginRight: 1 },
  }[pageFormat];

  const children: Paragraph[] = [];

  // ═══ PAGE DE TITRE ═══
  if (includeCoverPage) {
    children.push(new Paragraph({ spacing: { before: 4000 } }));
    children.push(new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: titleSize, font })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: '─────────────────', size: 24, color: '999999' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }));
    if (authorName) {
      children.push(new Paragraph({
        children: [new TextRun({ text: authorName, italics: true, size: 36, font })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }));
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ PAGE DE COPYRIGHT ═══
  if (includeCopyrightPage) {
    children.push(new Paragraph({ spacing: { before: 6000 } }));
    const year = new Date().getFullYear();
    const copyrightLines = [
      `© ${year} ${authorName || 'Auteur'}. Tous droits réservés.`,
      '',
      'Aucune partie de cette publication ne peut être reproduite, stockée dans un système de récupération ou transmise sous quelque forme ou par quelque moyen que ce soit sans l\'autorisation écrite préalable de l\'auteur.',
      '',
      `Première édition : ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
    ];
    for (const line of copyrightLines) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line, size: 20, font, color: '666666' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: line === '' ? 200 : 80 },
      }));
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ TABLE DES MATIÈRES ═══
  if (includeTableOfContents) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'TABLE DES MATIÈRES', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }));

    if (preface) {
      children.push(new Paragraph({
        children: [new TextRun({ text: 'Préface', size: baseSize, font })],
        spacing: { after: 120 },
      }));
    }

    chapters.forEach((chapter, index) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: `Chapitre ${index + 1} – ${editorialClean(chapter.title)}`, size: baseSize, font })],
        spacing: { after: 80 },
      }));

      chapter.subChapters.forEach((sub, subIdx) => {
        children.push(new Paragraph({
          children: [new TextRun({
            text: `${index + 1}.${subIdx + 1}  ${editorialClean(sub.title)}`,
            size: Math.round(baseSize * 0.9),
            font,
            color: '555555',
          })],
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.4) },
        }));
      });
    });

    if (conclusion) {
      children.push(new Paragraph({
        children: [new TextRun({ text: 'Conclusion', size: baseSize, font })],
        spacing: { after: 120 },
      }));
    }

    if (characters.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: 'Personnages', size: baseSize, font })],
        spacing: { after: 120 },
      }));
    }

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ PRÉFACE ═══
  if (preface) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'PRÉFACE', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));
    children.push(...buildContentParagraphs(preface, baseSize, font));
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ═══ CHAPITRES ═══
  chapters.forEach((chapter, index) => {
    // Numéro du chapitre (discret)
    children.push(new Paragraph({
      children: [new TextRun({ text: `CHAPITRE ${index + 1}`, bold: true, size: subTitleSize, font, color: '888888' })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 },
    }));

    // Titre du chapitre
    children.push(new Paragraph({
      children: [new TextRun({ text: editorialClean(chapter.title).toUpperCase(), bold: true, size: chapterTitleSize, font })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }));

    // Contenu du chapitre
    if (chapter.content && chapter.content.trim().length > 0) {
      children.push(...buildContentParagraphs(chapter.content, baseSize, font));
    }

    // Sous-chapitres
    chapter.subChapters.forEach((sub, subIdx) => {
      // Ne pas afficher les sous-chapitres vides (titre seul sans contenu)
      if (!sub.content || sub.content.trim().length === 0) {
        // Afficher quand même le titre du sous-chapitre comme repère
        children.push(new Paragraph({
          children: [new TextRun({
            text: `${index + 1}.${subIdx + 1}  ${editorialClean(sub.title)}`,
            bold: true,
            size: subTitleSize,
            font,
          })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 480, after: 120 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: '[Contenu à rédiger]', italics: true, size: baseSize, font, color: 'AAAAAA' })],
          spacing: { after: 200 },
        }));
        return;
      }

      // Séparateur visuel subtil avant le sous-chapitre
      children.push(new Paragraph({ spacing: { before: 240 } }));

      children.push(new Paragraph({
        children: [new TextRun({
          text: `${index + 1}.${subIdx + 1}  ${editorialClean(sub.title)}`,
          bold: true,
          size: subTitleSize,
          font,
        })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 480, after: 240 },
      }));

      children.push(...buildContentParagraphs(sub.content, baseSize, font));
    });

    // Saut de page entre chapitres
    if (index < chapters.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  // ═══ CONCLUSION ═══
  if (conclusion) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: 'CONCLUSION', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));
    children.push(...buildContentParagraphs(conclusion, baseSize, font));
  }

  // ═══ ÉPILOGUE ═══
  if (epilogue) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: 'ÉPILOGUE', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));
    children.push(...buildContentParagraphs(epilogue, baseSize, font));
  }

  // ═══ PERSONNAGES ═══
  if (characters.length > 0) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      children: [new TextRun({ text: 'PERSONNAGES', bold: true, size: chapterTitleSize, font })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 400 },
    }));

    for (const character of characters) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: character.name || 'Personnage', bold: true, size: subTitleSize, font }),
          ...(character.role ? [new TextRun({ text: `  (${character.role})`, italics: true, size: baseSize, font, color: '666666' })] : []),
        ],
        spacing: { before: 240, after: 80 },
      }));

      if (character.description) {
        children.push(new Paragraph({
          children: [new TextRun({ text: editorialClean(character.description), size: baseSize, font, color: '444444' })],
          spacing: { after: 200 },
          indent: { left: convertInchesToTwip(0.2) },
        }));
      }
    }
  }

  // ═══ CONSTRUCTION DU DOCUMENT ═══
  const doc = new Document({
    creator: authorName || 'Auteur',
    title: title,
    description: `Ebook – ${title}`,
    styles: {
      default: {
        document: {
          run: {
            size: baseSize,
            font: font,
          },
          paragraph: {
            spacing: { line: 360 },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: chapterTitleSize, bold: true, font },
          paragraph: { spacing: { before: 600, after: 300 } },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          run: { size: subTitleSize, bold: true, font },
          paragraph: { spacing: { before: 400, after: 200 } },
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: {
            width: convertInchesToTwip(pageDimensions.width),
            height: convertInchesToTwip(pageDimensions.height),
          },
          margin: {
            top: convertInchesToTwip(pageDimensions.marginTop),
            right: convertInchesToTwip(pageDimensions.marginRight),
            bottom: convertInchesToTwip(pageDimensions.marginBottom),
            left: convertInchesToTwip(pageDimensions.marginLeft),
          },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: title, size: 18, font, color: 'AAAAAA', italics: true })],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      footers: includePageNumbers ? {
        default: new Footer({
          children: [new Paragraph({
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: 'Georgia' })],
            alignment: AlignmentType.CENTER,
          })],
        }),
      } : undefined,
      children,
    }],
  });

  return Packer.toBlob(doc);
}

/**
 * Export et téléchargement direct.
 */
export async function exportProfessionalDocx(options: DocxExportOptions): Promise<void> {
  const blob = await generateProfessionalDocx(options);
  const safeName = (options.title || 'Mon-Ebook').replace(/[^a-zA-Z0-9àâäéèêëïîôöùûüçÀ-ÿ\s-]/gi, '').trim().replace(/\s+/g, '_');
  saveAs(blob, `${safeName}_KDP.docx`);
}
