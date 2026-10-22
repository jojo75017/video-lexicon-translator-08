/** Exports VC Books : Word modifiable et PDF intérieur aux dimensions KDP du format choisi. */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx';
import { jsPDF } from 'jspdf';
import type { VCPause } from './vcBooksWriter';

/** Dimensions en mm et marges du modèle (intérieur 18, extérieur 15, haut/bas 17). */
export const VC_FORMATS: Record<string, { w: number; h: number; label: string }> = {
  poche: { w: 127, h: 203.2, label: 'Poche 12,7 × 20,3 cm' },
  'demi-lettre': { w: 139.7, h: 215.9, label: 'Demi-lettre 14 × 21,6 cm' },
  '6x9': { w: 152.4, h: 228.6, label: '6 × 9 pouces' },
};
export const VC_MARGINS = { inside: 18, outside: 15, top: 17, bottom: 17 };

export interface VCExportBook { title: string; subtitle: string; author_name: string; format: string; pauses: VCPause[] }

const mmToTwip = (mm: number) => Math.round((mm / 25.4) * 1440);
const safeName = (t: string) => (t || 'livre').replace(/[^\p{L}\p{N} _-]+/gu, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'livre';

export async function buildVCDocx(book: VCExportBook): Promise<Blob> {
  const f = VC_FORMATS[book.format] ?? VC_FORMATS['6x9'];
  const children: Paragraph[] = [
    new Paragraph({ heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, children: [new TextRun(book.title)] }),
  ];
  if (book.subtitle) children.push(new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: book.subtitle, italics: true })] }));
  if (book.author_name) children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun(book.author_name)] }));
  book.pauses.forEach((p, i) => {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(`Pause n°${i + 1} — ${p.title}`)] }));
    p.text.split(/\n+/).forEach((para) => children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 160 }, children: [new TextRun(para)] })));
    if (p.encart) children.push(new Paragraph({ spacing: { before: 240 }, border: { top: { style: 'single', size: 6, color: '008296', space: 4 }, bottom: { style: 'single', size: 6, color: '008296', space: 4 } }, children: [new TextRun({ text: p.encart, italics: true })] }));
  });
  const doc = new Document({
    sections: [{
      properties: { page: { size: { width: mmToTwip(f.w), height: mmToTwip(f.h) }, margin: { top: mmToTwip(VC_MARGINS.top), bottom: mmToTwip(VC_MARGINS.bottom), left: mmToTwip(VC_MARGINS.inside), right: mmToTwip(VC_MARGINS.outside), gutter: 0 } } },
      children,
    }],
  });
  return Packer.toBlob(doc);
}

export function buildVCPdf(book: VCExportBook): Blob {
  const f = VC_FORMATS[book.format] ?? VC_FORMATS['6x9'];
  const pdf = new jsPDF({ unit: 'mm', format: [f.w, f.h] });
  const width = f.w - VC_MARGINS.inside - VC_MARGINS.outside;
  const maxY = f.h - VC_MARGINS.bottom;
  let page = 1;
  // Pages impaires (recto) : intérieur à gauche ; paires : intérieur à droite.
  const left = () => (page % 2 === 1 ? VC_MARGINS.inside : VC_MARGINS.outside);
  const newPage = () => { pdf.addPage([f.w, f.h]); page += 1; };

  pdf.setFont('times', 'bold'); pdf.setFontSize(20);
  pdf.text(pdf.splitTextToSize(book.title, width), f.w / 2, f.h / 3, { align: 'center' });
  pdf.setFont('times', 'italic'); pdf.setFontSize(12);
  if (book.subtitle) pdf.text(pdf.splitTextToSize(book.subtitle, width), f.w / 2, f.h / 3 + 20, { align: 'center' });
  pdf.setFont('times', 'normal');
  if (book.author_name) pdf.text(book.author_name, f.w / 2, f.h / 3 + 40, { align: 'center' });

  book.pauses.forEach((p, i) => {
    newPage();
    let y = VC_MARGINS.top + 4;
    pdf.setFont('times', 'bold'); pdf.setFontSize(14);
    const head = pdf.splitTextToSize(`Pause n°${i + 1} — ${p.title}`, width);
    pdf.text(head, left(), y); y += head.length * 6 + 3;
    pdf.setFont('times', 'normal'); pdf.setFontSize(11);
    for (const para of p.text.split(/\n+/)) {
      const lines: string[] = pdf.splitTextToSize(para, width);
      for (const line of lines) {
        if (y > maxY) { newPage(); y = VC_MARGINS.top + 4; }
        pdf.text(line, left(), y, line === lines[lines.length - 1] ? {} : { align: 'justify', maxWidth: width });
        y += 5;
      }
      y += 2;
    }
    if (p.encart) {
      pdf.setFont('times', 'italic');
      const lines: string[] = pdf.splitTextToSize(p.encart, width - 6);
      const h = lines.length * 5 + 6;
      if (y + h > maxY) { newPage(); y = VC_MARGINS.top + 4; }
      pdf.setDrawColor(0, 130, 150); pdf.rect(left(), y, width, h);
      pdf.text(lines, left() + 3, y + 6);
    }
    pdf.setFont('times', 'normal'); pdf.setFontSize(9);
    pdf.text(String(page), f.w / 2, f.h - 8, { align: 'center' });
  });
  return pdf.output('blob');
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export const vcFileName = (title: string, ext: string) => `${safeName(title)}.${ext}`;
