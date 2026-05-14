import jsPDF from 'jspdf';

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
}) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 50;
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

  const writeText = (text: any, size: number, opts2: { bold?: boolean; color?: [number, number, number]; spacingAfter?: number; align?: 'left' | 'center'; x?: number; maxW?: number } = {}) => {
    const str = toText(text);
    if (!str) return;
    doc.setFont('helvetica', opts2.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(opts2.color || [35, 47, 62]));
    const w = opts2.maxW ?? contentW;
    const lines = doc.splitTextToSize(str, w);
    const lineH = size * 1.35;
    for (const line of lines) {
      ensureSpace(lineH);
      if (opts2.align === 'center') {
        doc.text(line, pageW / 2, y + size * 0.9, { align: 'center' });
      } else {
        doc.text(line, opts2.x ?? margin, y + size * 0.9);
      }
      y += lineH;
    }
    y += opts2.spacingAfter ?? 6;
  };

  const drawCallout = (variant: string, title: string | undefined, body: string) => {
    const meta = CALLOUT_COLORS[variant] || CALLOUT_COLORS['point-cle'];
    const padding = 12;
    const innerW = contentW - padding * 2;
    doc.setFontSize(10);
    const labelLines = 1;
    doc.setFontSize(11);
    const titleLines = title ? doc.splitTextToSize(title, innerW).length : 0;
    doc.setFontSize(10);
    const bodyLines = doc.splitTextToSize(body || '', innerW);
    const lineH = 13;
    const boxH = padding * 2 + (labelLines + titleLines + bodyLines.length) * lineH + 4;
    ensureSpace(boxH + 8);
    // background + border
    doc.setFillColor(...meta.fill);
    doc.setDrawColor(...meta.border);
    doc.setLineWidth(1.2);
    doc.roundedRect(margin, y, contentW, boxH, 6, 6, 'FD');
    let yy = y + padding;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(meta.label, margin + padding, yy + 8);
    yy += lineH;
    if (title) {
      doc.setFontSize(11);
      doc.setTextColor(17, 24, 39);
      const tl = doc.splitTextToSize(title, innerW);
      tl.forEach((l: string) => { doc.text(l, margin + padding, yy + 8); yy += lineH; });
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    bodyLines.forEach((l: string) => { doc.text(l, margin + padding, yy + 8); yy += lineH; });
    y += boxH + 10;
  };

  const drawDataTable = (headers: string[], rows: string[][], caption?: string) => {
    const colCount = Math.max(headers.length, 1);
    const colW = contentW / colCount;
    const cellPad = 5;
    const lineH = 11;
    const measureRowH = (cells: string[]) => {
      doc.setFontSize(9);
      let maxLines = 1;
      cells.forEach((c, i) => {
        const lines = doc.splitTextToSize(toText(c), colW - cellPad * 2);
        maxLines = Math.max(maxLines, lines.length);
      });
      return maxLines * lineH + cellPad * 2;
    };
    // header
    const headerH = measureRowH(headers);
    ensureSpace(headerH);
    doc.setFillColor(0, 130, 150);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentW, headerH, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    headers.forEach((h, i) => {
      const lines = doc.splitTextToSize(toText(h), colW - cellPad * 2);
      lines.forEach((l: string, li: number) => {
        doc.text(l, margin + i * colW + cellPad, y + cellPad + (li + 1) * lineH - 2);
      });
      if (i > 0) doc.line(margin + i * colW, y, margin + i * colW, y + headerH);
    });
    y += headerH;
    // body
    doc.setFont('helvetica', 'normal');
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
      writeText(caption, 9, { color: [107, 114, 128], align: 'center', spacingAfter: 10 });
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
    writeText(s.title, 20, { bold: true, color: [0, 130, 150], spacingAfter: 6 });
    if (s.subtitle) writeText(s.subtitle, 11, { color: [120, 120, 120], spacingAfter: 8 });

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
        if (pb.heading) writeText(pb.heading, 13, { bold: true, color: [255, 158, 45], spacingAfter: 4 });
        if (pb.text) writeText(pb.text, 11, { spacingAfter: 8 });
      }
    }
  }

  const fn = opts.filename.endsWith('.pdf') ? opts.filename : `${opts.filename}.pdf`;
  doc.save(fn);
};
