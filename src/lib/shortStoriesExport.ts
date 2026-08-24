/**
 * Exports du Générateur d'Histoires Courtes & Contes Illustrés :
 * TXT, DOCX et PDF (mise en page KDP 6"×9").
 */
import { saveAs } from 'file-saver';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { jsPDF } from 'jspdf';

export interface ShortStory {
  numero: number;
  title: string;
  synopsis: string;
  content: string;
  illustrationPromptEn: string;
  moral: string;
  imageUrl?: string;
}

export interface ShortStoriesBookData {
  bookTitle: string;
  authorName: string;
  stories: ShortStory[];
}

const clean = (s: string) => s.trim();

// ---------------------------------------------------------------- TXT
export function exportShortStoriesTxt(data: ShortStoriesBookData) {
  const lines: string[] = [];
  lines.push(data.bookTitle.toUpperCase());
  if (data.authorName) lines.push(`par ${data.authorName}`);
  lines.push('');
  lines.push('TABLE DES MATIÈRES');
  data.stories.forEach((s) => lines.push(`${s.numero}. ${s.title}`));
  lines.push('');
  lines.push('=== LES HISTOIRES ===');
  data.stories.forEach((s) => {
    lines.push('');
    lines.push(`Histoire n°${s.numero} — ${s.title}`);
    if (clean(s.synopsis)) lines.push(`Synopsis : ${s.synopsis}`);
    lines.push('');
    lines.push(s.content);
    if (clean(s.moral)) lines.push(`\nMorale : ${s.moral}`);
    if (clean(s.illustrationPromptEn)) lines.push(`\nPrompt illustration (EN) : ${s.illustrationPromptEn}`);
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${slugify(data.bookTitle)}.txt`);
}

// ---------------------------------------------------------------- DOCX
export async function exportShortStoriesDocx(data: ShortStoriesBookData) {
  const children: Paragraph[] = [];

  // Page de titre
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 4000, after: 400 },
      children: [new TextRun({ text: data.bookTitle, bold: true, size: 56 })],
    }),
  );
  if (data.authorName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `par ${data.authorName}`, italics: true, size: 28 })],
      }),
    );
  }

  // Sommaire
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      children: [new TextRun('Table des matières')],
    }),
  );
  data.stories.forEach((s) => {
    children.push(
      new Paragraph({
        numbering: { reference: 'stories-toc', level: 0 },
        children: [new TextRun(`${s.numero}. ${s.title}`)],
      }),
    );
  });

  // Histoires
  data.stories.forEach((s) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [new TextRun(s.title)],
      }),
    );
    if (clean(s.synopsis)) {
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: s.synopsis, italics: true })],
        }),
      );
    }
    children.push(
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun(s.content)],
      }),
    );
    if (clean(s.moral)) {
      children.push(
        new Paragraph({
          spacing: { before: 200, after: 200 },
          children: [new TextRun({ text: `Morale : ${s.moral}`, bold: true })],
        }),
      );
    }
    if (clean(s.illustrationPromptEn)) {
      children.push(
        new Paragraph({
          spacing: { before: 200 },
          children: [new TextRun({ text: 'Prompt illustration (EN) :', bold: true })],
        }),
      );
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: s.illustrationPromptEn, italics: true, size: 20 })],
        }),
      );
    }
  });

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'stories-toc',
          levels: [{ level: 0, format: LevelFormat.NONE, text: '', alignment: AlignmentType.LEFT }],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            // Format KDP 6" x 9"
            size: { width: 8640, height: 12960 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${slugify(data.bookTitle)}.docx`);
}

// ---------------------------------------------------------------- PDF (KDP 6"×9")
export function exportShortStoriesPdf(data: ShortStoriesBookData) {
  // 6 x 9 pouces en points : 432 x 648
  const pdf = new jsPDF({ unit: 'pt', format: [432, 648] });
  const pageW = 432;
  const margin = 54;
  const contentW = pageW - margin * 2;
  let y = 0;

  const newPage = () => {
    pdf.addPage([432, 648]);
    y = margin;
  };
  const ensureSpace = (needed: number) => {
    if (y + needed > 648 - margin) newPage();
  };
  const writeText = (text: string, size: number, opts: { bold?: boolean; italic?: boolean; gap?: number } = {}) => {
    pdf.setFont('times', opts.bold ? 'bold' : opts.italic ? 'italic' : 'normal');
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(text, contentW) as string[];
    const lineH = size * 1.35;
    lines.forEach((ln) => {
      ensureSpace(lineH);
      pdf.text(ln, margin, y);
      y += lineH;
    });
    y += opts.gap ?? 6;
  };

  // Page de titre
  y = 200;
  pdf.setFont('times', 'bold');
  pdf.setFontSize(24);
  const titleLines = pdf.splitTextToSize(data.bookTitle, contentW) as string[];
  titleLines.forEach((ln, i) => pdf.text(ln, pageW / 2, y + i * 30, { align: 'center' }));
  if (data.authorName) {
    pdf.setFont('times', 'italic');
    pdf.setFontSize(13);
    pdf.text(`par ${data.authorName}`, pageW / 2, y + titleLines.length * 30 + 24, { align: 'center' });
  }

  // Sommaire
  newPage();
  writeText('Table des matières', 16, { bold: true, gap: 12 });
  data.stories.forEach((s) => writeText(`${s.numero}. ${s.title}`, 10, { gap: 2 }));

  // Histoires
  data.stories.forEach((s) => {
    newPage();
    writeText(s.title, 15, { bold: true, gap: 8 });
    if (clean(s.synopsis)) writeText(s.synopsis, 10, { italic: true, gap: 10 });
    writeText(s.content, 10.5, { gap: 10 });
    if (clean(s.moral)) writeText(`Morale : ${s.moral}`, 10, { bold: true, gap: 10 });
    if (clean(s.illustrationPromptEn)) {
      writeText('Prompt illustration (EN) :', 9, { bold: true, gap: 3 });
      writeText(s.illustrationPromptEn, 9, { italic: true, gap: 8 });
    }
  });

  pdf.save(`${slugify(data.bookTitle)}.pdf`);
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'histoires-illustrees'
  );
}
