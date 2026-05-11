import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  PageBreak,
} from 'docx';

export interface DocxSection {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  blocks: Array<{ heading?: string; text: string }>;
}

const fetchImageBytes = async (url: string): Promise<{ data: Uint8Array; type: 'png' | 'jpg' } | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const buf = new Uint8Array(await blob.arrayBuffer());
    const type = blob.type.includes('jpeg') || blob.type.includes('jpg') ? 'jpg' : 'png';
    return { data: buf, type };
  } catch {
    return null;
  }
};

const toText = (v: any): string => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(toText).join('\n');
  if (typeof v === 'object') {
    // Common shapes: { question, answer } or { title, content }
    return Object.values(v).map(toText).filter(Boolean).join('\n');
  }
  return String(v);
};

const textToParagraphs = (text: any): Paragraph[] => {
  const str = toText(text);
  if (!str) return [];
  return str.split(/\n+/).map(
    line =>
      new Paragraph({
        children: [new TextRun({ text: line.replace(/^[-•]\s*/, '• '), size: 22 })],
        spacing: { after: 120 },
      })
  );
};

export const exportEbookToDocx = async (opts: {
  filename: string;
  documentTitle: string;
  documentSubtitle?: string;
  sections: DocxSection[];
}) => {
  const children: Paragraph[] = [];

  // Cover
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 240 },
      children: [new TextRun({ text: opts.documentTitle, bold: true, size: 48 })],
    })
  );
  if (opts.documentSubtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: opts.documentSubtitle, size: 28, italics: true })],
      })
    );
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  for (let i = 0; i < opts.sections.length; i++) {
    const s = opts.sections[i];
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 200 },
        children: [new TextRun({ text: s.title, bold: true, size: 36 })],
      })
    );
    if (s.subtitle) {
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: s.subtitle, italics: true, size: 22, color: '666666' })],
        })
      );
    }
    if (s.imageUrl) {
      const img = await fetchImageBytes(s.imageUrl);
      if (img) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [
              new ImageRun({
                type: img.type,
                data: img.data,
                transformation: { width: 420, height: 300 },
                altText: { title: s.title, description: s.title, name: s.title },
              }),
            ],
          })
        );
      }
    }
    for (const b of s.blocks) {
      if (b.heading) {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
            children: [new TextRun({ text: b.heading, bold: true, size: 28 })],
          })
        );
      }
      children.push(...textToParagraphs(b.text));
    }
    if (i < opts.sections.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: 'Calibri', size: 22 } } },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = opts.filename.endsWith('.docx') ? opts.filename : `${opts.filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
};
