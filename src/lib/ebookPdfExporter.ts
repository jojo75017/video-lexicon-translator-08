import jsPDF from 'jspdf';
import { DEFAULT_TYPOGRAPHY, loadTypography, type EbookExportTypography, pdfFontFor, hexToRgb, marginToPt } from './ebookExportOptions';

export type PdfBlock =
  | { kind?: 'paragraph'; heading?: string; text: string }
  | { kind: 'callout'; variant: 'saviez-vous' | 'conseil' | 'exercice' | 'point-cle'; title?: string; body: string }
  | { kind: 'table'; caption?: string; headers: string[]; rows: string[][] };

export interface PdfSection {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  blocks: PdfBlock[];
}

const CALLOUT_COLORS: Record<string, { fill: [number, number, number]; border: [number, number, number]; label: string }> = {
  'saviez-vous': { fill: [254, 243, 199], border: [245, 158, 11], label: '💡 Le saviez-vous ?' },
  'conseil':     { fill: [204, 251, 241], border: [20, 184, 166], label: '✨ Conseil pratique' },
  'exercice':    { fill: [237, 233, 254], border: [139, 92, 246], label: '✍️ Exercice pratique' },
  'point-cle':   { fill: [255, 237, 213], border: [249, 115, 22], label: '⭐ Point clé' },
};

const loadImageDataUrl = async (url: string): Promise<{ data: string; w: number; h: number } | null> => {
  try {
    let dataUrl: string;
    if (url.startsWith('data:')) {
      dataUrl = url;
    } else {
      const res = await fetch(url);
      const blob = await res.blob();
      dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
    }
    const dims: { w: number; h: number } = await new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 1, h: 1 });
      img.src = dataUrl;
    });
    return { data: dataUrl, w: dims.w, h: dims.h };
  } catch {
    return null;
  }
};

export const exportEbookToPdf = async (opts: {
  filename: string;
  documentTitle: string;
  documentSubtitle?: string;
  sections: PdfSection[];
  typography?: Partial<EbookExportTypography>;
}) => {
  const typo: EbookExportTypography = { ...loadTypography(), ...(opts.typography || {}) };
  const pdfFont = pdfFontFor(typo.fontFamily);
  const headingSize = typo.headingSize;
  const bodySize = typo.bodySize;
  const justifyBody = typo.justify;
  const headingRgb = hexToRgb(typo.headingColor);
  const bodyRgb = hexToRgb(typo.bodyColor);
  const italicQuotes = typo.italicQuotes;
  const lineHeightMul = typo.lineHeight;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = marginToPt(typo.margin);
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const toText = (v: any): string => {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return v.map(toText).join('\n');
    if (typeof v === 'object') return Object.values(v).map(toText).filter(Boolean).join('\n');
    return String(v);
  };

  // Justified rendering for a single line of words.
  const drawJustifiedLine = (words: string[], xLeft: number, yBaseline: number, lineWidth: number) => {
    if (words.length === 0) return;
    if (words.length === 1) {
      doc.text(words[0], xLeft, yBaseline);
      return;
    }
    const totalWordsW = words.reduce((acc, w) => acc + doc.getTextWidth(w), 0);
    const gap = (lineWidth - totalWordsW) / (words.length - 1);
    let x = xLeft;
    for (let i = 0; i < words.length; i++) {
      doc.text(words[i], x, yBaseline);
      x += doc.getTextWidth(words[i]) + gap;
    }
  };

  const writeText = (
    text: any,
    size: number,
    opts2: {
      bold?: boolean;
      color?: [number, number, number];
      spacingAfter?: number;
      align?: 'left' | 'center' | 'justify';
      x?: number;
      maxW?: number;
      fontOverride?: 'helvetica' | 'times' | 'courier';
    } = {}
  ) => {
    const str = toText(text);
    if (!str) return;
    doc.setFont(opts2.fontOverride || pdfFont, opts2.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(opts2.color || [35, 47, 62]));
    const w = opts2.maxW ?? contentW;
    const lineH = size * 1.45;
    const xLeft = opts2.x ?? margin;

    // Split by paragraphs first to preserve line breaks
    const paragraphs = str.split(/\n+/);
    paragraphs.forEach((para, pi) => {
      const lines: string[] = doc.splitTextToSize(para, w);
      for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        ensureSpace(lineH);
        const baseline = y + size * 0.9;
        if (opts2.align === 'center') {
          doc.text(line, pageW / 2, baseline, { align: 'center' });
        } else if (opts2.align === 'justify' && li < lines.length - 1 && line.trim().includes(' ')) {
          // Don't justify the last line of a paragraph
          const words = line.split(/\s+/).filter(Boolean);
          drawJustifiedLine(words, xLeft, baseline, w);
        } else {
          doc.text(line, xLeft, baseline);
        }
        y += lineH;
      }
      if (pi < paragraphs.length - 1) y += size * 0.3;
    });
    y += opts2.spacingAfter ?? 6;
  };

  const drawCallout = (variant: string, title: string | undefined, body: string) => {
    const meta = CALLOUT_COLORS[variant] || CALLOUT_COLORS['point-cle'];
    const padding = 12;
    const innerW = contentW - padding * 2;
    const labelLines = 1;
    doc.setFont(pdfFont, 'bold');
    doc.setFontSize(bodySize);
    const titleLines = title ? doc.splitTextToSize(title, innerW).length : 0;
    doc.setFont(pdfFont, 'normal');
    doc.setFontSize(bodySize - 1);
    const bodyLines = doc.splitTextToSize(body || '', innerW);
    const lineH = (bodySize - 1) * 1.35;
    const boxH = padding * 2 + (labelLines + titleLines + bodyLines.length) * lineH + 4;
    ensureSpace(boxH + 8);
    doc.setFillColor(...meta.fill);
    doc.setDrawColor(...meta.border);
    doc.setLineWidth(1.2);
    doc.roundedRect(margin, y, contentW, boxH, 6, 6, 'FD');
    let yy = y + padding;
    doc.setFont(pdfFont, 'bold');
    doc.setFontSize(bodySize - 1);
    doc.setTextColor(31, 41, 55);
    doc.text(meta.label, margin + padding, yy + 8);
    yy += lineH;
    if (title) {
      doc.setFont(pdfFont, 'bold');
      doc.setFontSize(bodySize);
      doc.setTextColor(17, 24, 39);
      const tl = doc.splitTextToSize(title, innerW);
      tl.forEach((l: string) => { doc.text(l, margin + padding, yy + 8); yy += lineH; });
    }
    doc.setFont(pdfFont, 'normal');
    doc.setFontSize(bodySize - 1);
    doc.setTextColor(31, 41, 55);
    bodyLines.forEach((l: string) => { doc.text(l, margin + padding, yy + 8); yy += lineH; });
    y += boxH + 10;
  };

  const drawDataTable = (headers: string[], rows: string[][], caption?: string) => {
    const colCount = Math.max(headers.length, 1);
    // Distribute width EXACTLY across columns (no rounding gaps)
    const colW = contentW / colCount;
    const cellPad = 5;
    const tableFontSize = Math.max(8, bodySize - 2);
    const lineH = tableFontSize * 1.25;
    const measureRowH = (cells: string[]) => {
      doc.setFontSize(tableFontSize);
      let maxLines = 1;
      cells.forEach((c) => {
        const lines = doc.splitTextToSize(toText(c), colW - cellPad * 2);
        maxLines = Math.max(maxLines, lines.length);
      });
      return maxLines * lineH + cellPad * 2;
    };
    // Header
    const headerH = measureRowH(headers);
    ensureSpace(headerH);
    doc.setFillColor(0, 130, 150);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, headerH, 'FD');
    doc.setFont(pdfFont, 'bold');
    doc.setFontSize(tableFontSize);
    doc.setTextColor(255, 255, 255);
    headers.forEach((h, i) => {
      const lines = doc.splitTextToSize(toText(h), colW - cellPad * 2);
      lines.forEach((l: string, li: number) => {
        doc.text(l, margin + i * colW + cellPad, y + cellPad + (li + 1) * lineH - 2);
      });
      if (i > 0) doc.line(margin + i * colW, y, margin + i * colW, y + headerH);
    });
    y += headerH;
    // Body
    doc.setFont(pdfFont, 'normal');
    doc.setTextColor(31, 41, 55);
    rows.forEach((r, ri) => {
      const cells = Array(colCount).fill(0).map((_, i) => toText(r[i] ?? ''));
      const rowH = measureRowH(cells);
      ensureSpace(rowH);
      if (ri % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, y, contentW, rowH, 'F');
      }
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, y, contentW, rowH, 'S');
      cells.forEach((c, i) => {
        const lines = doc.splitTextToSize(c, colW - cellPad * 2);
        lines.forEach((l: string, li: number) => {
          doc.text(l, margin + i * colW + cellPad, y + cellPad + (li + 1) * lineH - 2);
        });
        if (i > 0) doc.line(margin + i * colW, y, margin + i * colW, y + rowH);
      });
      y += rowH;
    });
    y += 6;
    if (caption) {
      writeText(caption, Math.max(8, bodySize - 3), { color: [107, 114, 128], align: 'center', spacingAfter: 10 });
    } else {
      y += 6;
    }
  };

  // Cover page
  y = pageH / 3;
  writeText(opts.documentTitle, 28, { bold: true, align: 'center', spacingAfter: 12 });
  if (opts.documentSubtitle) {
    writeText(opts.documentSubtitle, 16, { color: [100, 100, 100], align: 'center' });
  }
  doc.addPage();
  y = margin;

  for (let i = 0; i < opts.sections.length; i++) {
    const s = opts.sections[i];
    if (i > 0) {
      doc.addPage();
      y = margin;
    }
    // Chapter title — small dark heading (H6 equivalent), no big colored "chapitre IA"
    writeText(s.title, headingSize, { bold: true, color: [35, 47, 62], spacingAfter: 8 });
    if (s.subtitle) writeText(s.subtitle, bodySize - 1, { color: [120, 120, 120], spacingAfter: 8 });

    if (s.imageUrl) {
      const img = await loadImageDataUrl(s.imageUrl);
      if (img) {
        const maxW = contentW * 0.7;
        const ratio = img.h / img.w;
        const drawW = maxW;
        const drawH = drawW * ratio;
        ensureSpace(drawH + 12);
        const x = margin + (contentW - drawW) / 2;
        try {
          const fmt = img.data.includes('image/jpeg') ? 'JPEG' : 'PNG';
          doc.addImage(img.data, fmt, x, y, drawW, drawH);
          y += drawH + 12;
        } catch {
          /* ignore image errors */
        }
      }
    }

    for (const b of s.blocks) {
      if ((b as any).kind === 'callout') {
        const cb = b as Extract<PdfBlock, { kind: 'callout' }>;
        drawCallout(cb.variant, cb.title, cb.body);
      } else if ((b as any).kind === 'table') {
        const tb = b as Extract<PdfBlock, { kind: 'table' }>;
        drawDataTable(tb.headers || [], tb.rows || [], tb.caption);
      } else {
        const pb = b as Extract<PdfBlock, { kind?: 'paragraph' }>;
        if (pb.heading) writeText(pb.heading, bodySize + 1, { bold: true, color: [35, 47, 62], spacingAfter: 4 });
        if (pb.text) writeText(pb.text, bodySize, { spacingAfter: 8, align: justifyBody ? 'justify' : 'left' });
      }
    }
  }

  const fn = opts.filename.endsWith('.pdf') ? opts.filename : `${opts.filename}.pdf`;
  doc.save(fn);
};
