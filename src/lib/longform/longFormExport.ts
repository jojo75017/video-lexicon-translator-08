/**
 * Exports locaux du manuscrit « Version Longue » — 100 % navigateur.
 * Aucun appel IA, aucun crédit, aucune copie serveur.
 */
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';

export interface LongFormChapter {
  chapter_number: number;
  title: string;
  content_markdown?: string | null;
}

export interface LongFormBook {
  title: string;
  subtitle?: string | null;
  author?: string | null;
  chapters: LongFormChapter[];
}

export function slugifyFileName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'manuscrit';
}

/** Retire les marques Markdown pour obtenir du texte de lecture. */
function toPlainLines(markdown: string): string[] {
  return markdown
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.replace(/^#{1,6}\s*/, '').replace(/\*\*|__|`/g, '').trimEnd());
}

export function countWords(book: LongFormBook): number {
  return book.chapters.reduce(
    (total, chapter) => total + (chapter.content_markdown?.trim().split(/\s+/).filter(Boolean).length ?? 0),
    0,
  );
}

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function buildMarkdown(book: LongFormBook): string {
  const head = [`# ${book.title}`, book.subtitle ? `## ${book.subtitle}` : '', book.author ? `*${book.author}*` : ''].filter(Boolean);
  const body = book.chapters.map(
    (chapter) => `\n\n## Chapitre ${chapter.chapter_number} — ${chapter.title}\n\n${chapter.content_markdown?.trim() || '_Chapitre non rédigé._'}`,
  );
  return `${head.join('\n\n')}${body.join('')}\n`;
}

export function exportMarkdown(book: LongFormBook) {
  download(
    new Blob([buildMarkdown(book)], { type: 'text/markdown;charset=utf-8' }),
    `${slugifyFileName(book.title)}-manuscrit.md`,
  );
}

export async function exportDocx(book: LongFormBook) {
  const children: Paragraph[] = [
    new Paragraph({ text: book.title, heading: HeadingLevel.TITLE }),
  ];
  if (book.subtitle) children.push(new Paragraph({ text: book.subtitle, heading: HeadingLevel.HEADING_2 }));
  if (book.author) children.push(new Paragraph({ children: [new TextRun({ text: book.author, italics: true })] }));

  for (const chapter of book.chapters) {
    children.push(
      new Paragraph({
        text: `Chapitre ${chapter.chapter_number} — ${chapter.title}`,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
      }),
    );
    const lines = toPlainLines(chapter.content_markdown?.trim() || 'Chapitre non rédigé.');
    for (const line of lines) {
      children.push(new Paragraph({ text: line, spacing: { after: 120 } }));
    }
  }

  const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
  download(blob, `${slugifyFileName(book.title)}-manuscrit.docx`);
}

export function exportPdf(book: LongFormBook) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 56;
  const marginY = 64;
  const width = doc.internal.pageSize.getWidth() - marginX * 2;
  const bottom = doc.internal.pageSize.getHeight() - marginY;
  let y = marginY + 40;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(doc.splitTextToSize(book.title, width), marginX, y);
  y += 40;
  if (book.subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(doc.splitTextToSize(book.subtitle, width), marginX, y);
    y += 26;
  }
  if (book.author) {
    doc.setFontSize(12);
    doc.text(book.author, marginX, y);
  }

  for (const chapter of book.chapters) {
    doc.addPage();
    y = marginY;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    for (const line of doc.splitTextToSize(`Chapitre ${chapter.chapter_number} — ${chapter.title}`, width)) {
      doc.text(line, marginX, y);
      y += 22;
    }
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    for (const paragraph of toPlainLines(chapter.content_markdown?.trim() || 'Chapitre non rédigé.')) {
      if (!paragraph) { y += 8; continue; }
      for (const line of doc.splitTextToSize(paragraph, width)) {
        if (y > bottom) { doc.addPage(); y = marginY; }
        doc.text(line, marginX, y);
        y += 15;
      }
      y += 6;
    }
  }

  doc.save(`${slugifyFileName(book.title)}-manuscrit.pdf`);
}
