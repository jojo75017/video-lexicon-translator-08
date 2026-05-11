import jsPDF from 'jspdf';

export interface PdfSection {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  blocks: Array<{ heading?: string; text: string }>;
}

const loadImageDataUrl = async (url: string): Promise<{ data: string; w: number; h: number } | null> => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
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

  const writeText = (text: any, size: number, opts2: { bold?: boolean; color?: [number, number, number]; spacingAfter?: number; align?: 'left' | 'center' } = {}) => {
    const str = toText(text);
    if (!str) return;
    doc.setFont('helvetica', opts2.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(opts2.color || [35, 47, 62]));
    const lines = doc.splitTextToSize(str, contentW);
    const lineH = size * 1.35;
    for (const line of lines) {
      ensureSpace(lineH);
      if (opts2.align === 'center') {
        doc.text(line, pageW / 2, y + size * 0.9, { align: 'center' });
      } else {
        doc.text(line, margin, y + size * 0.9);
      }
      y += lineH;
    }
    y += opts2.spacingAfter ?? 6;
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
          doc.addImage(img.data, 'PNG', x, y, drawW, drawH);
          y += drawH + 12;
        } catch {
          /* ignore image errors */
        }
      }
    }

    for (const b of s.blocks) {
      if (b.heading) writeText(b.heading, 13, { bold: true, color: [255, 158, 45], spacingAfter: 4 });
      if (b.text) writeText(b.text, 11, { spacingAfter: 8 });
    }
  }

  const fn = opts.filename.endsWith('.pdf') ? opts.filename : `${opts.filename}.pdf`;
  doc.save(fn);
};
