/**
 * Exports du Générateur de Livres de Jeux & Énigmes : TXT, DOCX et PDF (mise en page KDP 6"x9").
 */
import { saveAs } from 'file-saver';
import {
  AlignmentType,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageBreak,
  Paragraph,
  TextRun,
} from 'docx';
import { jsPDF } from 'jspdf';

export interface PuzzleItem {
  numero: number;
  titre: string;
  contexte: string;
  enonce: string;
  indices: string[];
  solution: string;
}

export interface PuzzleBookData {
  bookTitle: string;
  authorName: string;
  puzzles: PuzzleItem[];
}

const clean = (s: string) => s.trim();

// ---------------------------------------------------------------- TXT
export function exportPuzzleBookTxt(data: PuzzleBookData) {
  const lines: string[] = [];
  lines.push(data.bookTitle.toUpperCase());
  if (data.authorName) lines.push(`par ${data.authorName}`);
  lines.push('');
  lines.push('TABLE DES MATIÈRES');
  data.puzzles.forEach((p) => lines.push(`${p.numero}. ${p.titre}`));
  lines.push('Solutions');
  lines.push('');
  lines.push('=== LES ÉNIGMES ===');
  data.puzzles.forEach((p) => {
    lines.push('');
    lines.push(`Énigme n°${p.numero} — ${p.titre}`);
    if (clean(p.contexte)) lines.push(p.contexte);
    if (clean(p.enonce)) lines.push(`À vous de jouer : ${p.enonce}`);
    p.indices.forEach((ind, i) => lines.push(`Indice ${i + 1} : ${ind}`));
  });
  lines.push('');
  lines.push('=== SOLUTIONS ===');
  data.puzzles.forEach((p) => {
    lines.push('');
    lines.push(`Solution n°${p.numero} — ${p.titre}`);
    lines.push(p.solution);
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `${slugify(data.bookTitle)}.txt`);
}

// ---------------------------------------------------------------- DOCX
export async function exportPuzzleBookDocx(data: PuzzleBookData) {
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
  data.puzzles.forEach((p) => {
    children.push(
      new Paragraph({
        numbering: { reference: 'puzzle-toc', level: 0 },
        children: [new TextRun(`${p.numero}. ${p.titre}`)],
      }),
    );
  });
  children.push(new Paragraph({ children: [new TextRun({ text: 'Solutions', bold: true })] }));

  // Énigmes
  data.puzzles.forEach((p) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        children: [new TextRun(`Énigme n°${p.numero} — ${p.titre}`)],
      }),
    );
    if (clean(p.contexte)) {
      children.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun(p.contexte)] }));
    }
    if (clean(p.enonce)) {
      children.push(
        new Paragraph({
          spacing: { after: 240 },
          children: [new TextRun({ text: `À vous de jouer : ${p.enonce}`, bold: true })],
        }),
      );
    }
    p.indices.forEach((ind, i) => {
      children.push(
        new Paragraph({
          numbering: { reference: 'puzzle-hints', level: 0 },
          children: [new TextRun({ text: `Indice ${i + 1} : ${ind}`, italics: true })],
        }),
      );
    });
  });

  // Solutions
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      children: [new TextRun('Solutions')],
    }),
  );
  data.puzzles.forEach((p) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun(`Solution n°${p.numero} — ${p.titre}`)],
      }),
      new Paragraph({ spacing: { after: 240 }, children: [new TextRun(p.solution)] }),
    );
  });

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'puzzle-toc',
          levels: [{ level: 0, format: LevelFormat.NONE, text: '', alignment: AlignmentType.LEFT }],
        },
        {
          reference: 'puzzle-hints',
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: '•',
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
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

// ---------------------------------------------------------------- PDF (KDP 6"x9")
export function exportPuzzleBookPdf(data: PuzzleBookData) {
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
  data.puzzles.forEach((p) => writeText(`${p.numero}. ${p.titre}`, 10, { gap: 2 }));
  writeText('Solutions', 10, { bold: true });

  // Énigmes
  data.puzzles.forEach((p) => {
    newPage();
    writeText(`Énigme n°${p.numero}`, 15, { bold: true, gap: 2 });
    writeText(p.titre, 12, { bold: true, gap: 10 });
    if (clean(p.contexte)) writeText(p.contexte, 10.5, { gap: 8 });
    if (clean(p.enonce)) writeText(`À vous de jouer : ${p.enonce}`, 10.5, { bold: true, gap: 10 });
    p.indices.forEach((ind, i) => writeText(`Indice ${i + 1} : ${ind}`, 9.5, { italic: true, gap: 4 }));
  });

  // Solutions
  newPage();
  writeText('Solutions', 16, { bold: true, gap: 12 });
  data.puzzles.forEach((p) => {
    writeText(`Solution n°${p.numero} — ${p.titre}`, 11, { bold: true, gap: 3 });
    writeText(p.solution, 10, { gap: 10 });
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
      .replace(/^-+|-+$/g, '') || 'livre-enigmes'
  );
}
