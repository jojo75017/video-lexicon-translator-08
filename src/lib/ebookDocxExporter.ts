import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx';

export type DocxBlock =
  | { kind?: 'paragraph'; heading?: string; text: string }
  | { kind: 'callout'; variant: 'saviez-vous' | 'conseil' | 'exercice' | 'point-cle'; title?: string; body: string }
  | { kind: 'table'; caption?: string; headers: string[]; rows: string[][] };

export interface DocxSection {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  blocks: DocxBlock[];
}

const CALLOUT_STYLE: Record<string, { fill: string; border: string; label: string }> = {
  'saviez-vous': { fill: 'FEF3C7', border: 'F59E0B', label: '💡 Le saviez-vous ?' },
  'conseil':     { fill: 'CCFBF1', border: '14B8A6', label: '✨ Conseil pratique' },
  'exercice':    { fill: 'EDE9FE', border: '8B5CF6', label: '✍️ Exercice pratique' },
  'point-cle':   { fill: 'FFEDD5', border: 'F97316', label: '⭐ Point clé' },
};

const fetchImageBytes = async (
  url: string
): Promise<{ data: Uint8Array; type: 'png' | 'jpg' } | null> => {
  try {
    let buf: Uint8Array;
    let mime = '';
    if (url.startsWith('data:')) {
      const [meta, b64] = url.split(',');
      mime = meta.match(/data:([^;]+)/)?.[1] || '';
      const bin = atob(b64);
      buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    } else {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      mime = blob.type;
      buf = new Uint8Array(await blob.arrayBuffer());
    }
    const type = mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png';
    return { data: buf, type };
  } catch {
    return null;
  }
};

const toText = (v: any): string => {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.map(toText).join('\n');
  if (typeof v === 'object') return Object.values(v).map(toText).filter(Boolean).join('\n');
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

const buildCalloutTable = (
  variant: string,
  title: string | undefined,
  body: string
): Table => {
  const meta = CALLOUT_STYLE[variant] || CALLOUT_STYLE['point-cle'];
  const innerChildren: Paragraph[] = [
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: meta.label, bold: true, size: 20, color: '1F2937' })],
    }),
  ];
  if (title) {
    innerChildren.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: title, bold: true, size: 22, color: '111827' })],
      })
    );
  }
  innerChildren.push(...textToParagraphs(body));

  const fullBorder = { style: BorderStyle.SINGLE, size: 12, color: meta.border };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: meta.fill, type: ShadingType.CLEAR },
            borders: { top: fullBorder, bottom: fullBorder, left: fullBorder, right: fullBorder },
            margins: { top: 160, bottom: 160, left: 200, right: 200 },
            children: innerChildren,
          }),
        ],
      }),
    ],
  });
};

const buildDataTable = (headers: string[], rows: string[][]): Table => {
  const colCount = Math.max(headers.length, 1);
  const totalWidth = 9360;
  const colW = Math.floor(totalWidth / colCount);
  const columnWidths = Array(colCount).fill(colW);
  // Adjust last col to make sum exact
  columnWidths[colCount - 1] = totalWidth - colW * (colCount - 1);
  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: columnWidths[i], type: WidthType.DXA },
        shading: { fill: '008296', type: ShadingType.CLEAR },
        borders,
        margins: { top: 100, bottom: 100, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: toText(h), bold: true, size: 20, color: 'FFFFFF' })] })],
      })
    ),
  });

  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: Array(colCount).fill(0).map((_, ci) =>
        new TableCell({
          width: { size: columnWidths[ci], type: WidthType.DXA },
          shading: ri % 2 ? { fill: 'F9FAFB', type: ShadingType.CLEAR } : undefined,
          borders,
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun({ text: toText(r[ci] ?? ''), size: 20 })] })],
        })
      ),
    })
  );

  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths,
    rows: [headerRow, ...bodyRows],
  });
};

export const exportEbookToDocx = async (opts: {
  filename: string;
  documentTitle: string;
  documentSubtitle?: string;
  sections: DocxSection[];
}) => {
  const children: (Paragraph | Table)[] = [];

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
      if ((b as any).kind === 'callout') {
        const cb = b as Extract<DocxBlock, { kind: 'callout' }>;
        children.push(buildCalloutTable(cb.variant, cb.title, cb.body));
        children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
      } else if ((b as any).kind === 'table') {
        const tb = b as Extract<DocxBlock, { kind: 'table' }>;
        children.push(buildDataTable(tb.headers || [], tb.rows || []));
        if (tb.caption) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 80, after: 200 },
              children: [new TextRun({ text: tb.caption, italics: true, size: 18, color: '6B7280' })],
            })
          );
        } else {
          children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
        }
      } else {
        const pb = b as Extract<DocxBlock, { kind?: 'paragraph' }>;
        if (pb.heading) {
          children.push(
            new Paragraph({
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 120 },
              children: [new TextRun({ text: pb.heading, bold: true, size: 28 })],
            })
          );
        }
        children.push(...textToParagraphs(pb.text));
      }
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
