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
import { DEFAULT_TYPOGRAPHY, loadTypography, type EbookExportTypography, hexNoHash, marginToDxa } from './ebookExportOptions';

/** Parse very simple inline markdown (_italic_ / *italic*) into TextRun array. */
const parseInline = (
  text: string,
  baseSize: number,
  fontFamily: string,
  color: string,
  forceItalic = false,
): TextRun[] => {
  const runs: TextRun[] = [];
  const re = /(_([^_\n]+)_|\*([^*\n]+)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), size: baseSize, font: fontFamily, color, italics: forceItalic }));
    }
    const inner = m[2] || m[3] || '';
    runs.push(new TextRun({ text: inner, size: baseSize, font: fontFamily, color, italics: true }));
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), size: baseSize, font: fontFamily, color, italics: forceItalic }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text, size: baseSize, font: fontFamily, color, italics: forceItalic }));
  }
  return runs;
};

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

const textToParagraphs = (
  text: any,
  bodyHalfPt: number,
  fontFamily: string,
  justify: boolean,
  bodyColor: string,
  italicQuotes: boolean,
  lineHeight: number,
): Paragraph[] => {
  const str = toText(text);
  if (!str) return [];
  // 240 = ligne simple en docx → multiplier par lineHeight
  const lineRule = Math.round(240 * lineHeight);
  return str.split(/\n+/).map(line => {
    const isQuote = italicQuotes && /^\s*>\s+/.test(line);
    const cleanLine = isQuote ? line.replace(/^\s*>\s+/, '') : line.replace(/^[-•]\s*/, '• ');
    return new Paragraph({
      alignment: justify ? AlignmentType.JUSTIFIED : AlignmentType.LEFT,
      indent: isQuote ? { left: 360 } : undefined,
      children: parseInline(cleanLine, bodyHalfPt, fontFamily, bodyColor, isQuote),
      spacing: { after: 120, line: lineRule },
    });
  });
};

const buildCalloutTable = (
  variant: string,
  title: string | undefined,
  body: string,
  bodyHalfPt: number,
  fontFamily: string,
  justify: boolean,
  bodyColor: string,
  italicQuotes: boolean,
  lineHeight: number,
): Table => {
  const meta = CALLOUT_STYLE[variant] || CALLOUT_STYLE['point-cle'];
  const innerChildren: Paragraph[] = [
    new Paragraph({
      spacing: { after: 80 },
      children: [new TextRun({ text: meta.label, bold: true, size: Math.max(20, bodyHalfPt - 2), color: '1F2937', font: fontFamily })],
    }),
  ];
  if (title) {
    innerChildren.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: title, bold: true, size: bodyHalfPt + 2, color: '111827', font: fontFamily })],
      })
    );
  }
  innerChildren.push(...textToParagraphs(body, bodyHalfPt, fontFamily, justify, bodyColor, italicQuotes, lineHeight));

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

const buildDataTable = (
  headers: string[],
  rows: string[][],
  bodyHalfPt: number,
  fontFamily: string
): Table => {
  const colCount = Math.max(headers.length, 1);
  const totalWidth = 9360;
  // Distribute width EXACTLY (avoid trailing whitespace columns)
  const baseW = Math.floor(totalWidth / colCount);
  const remainder = totalWidth - baseW * colCount;
  const columnWidths = Array(colCount).fill(0).map((_, i) => baseW + (i < remainder ? 1 : 0));
  const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' };
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

  const headerSize = Math.max(18, bodyHalfPt - 2);
  const cellSize = Math.max(18, bodyHalfPt - 2);

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        width: { size: columnWidths[i], type: WidthType.DXA },
        shading: { fill: '008296', type: ShadingType.CLEAR },
        borders,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: toText(h), bold: true, size: headerSize, color: 'FFFFFF', font: fontFamily })] })],
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
          margins: { top: 60, bottom: 60, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: toText(r[ci] ?? ''), size: cellSize, font: fontFamily })] })],
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
  typography?: Partial<EbookExportTypography>;
}) => {
  const typo: EbookExportTypography = { ...loadTypography(), ...(opts.typography || {}) };
  const fontFamily = typo.fontFamily;
  // docx-js sizes are in HALF-POINTS
  const bodyHalfPt = typo.bodySize * 2;
  const headingHalfPt = typo.headingSize * 2;
  const subHeadingHalfPt = Math.max(bodyHalfPt + 2, typo.headingSize * 2 - 4);
  const justify = typo.justify;
  const headingColor = hexNoHash(typo.headingColor);
  const bodyColor = hexNoHash(typo.bodyColor);
  const italicQuotes = typo.italicQuotes;
  const lineHeight = typo.lineHeight;
  const marginDxa = marginToDxa(typo.margin);

  const children: (Paragraph | Table)[] = [];

  // Cover
  children.push(
    new Paragraph({
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 240 },
      children: [new TextRun({ text: opts.documentTitle, bold: true, size: 48, font: fontFamily })],
    })
  );
  if (opts.documentSubtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: opts.documentSubtitle, size: 28, italics: true, font: fontFamily })],
      })
    );
  }
  children.push(new Paragraph({ children: [new PageBreak()] }));

  for (let i = 0; i < opts.sections.length; i++) {
    const s = opts.sections[i];
    // Chapter title — Heading 6 (small, no thick underline / no separator line)
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_6,
        spacing: { before: 200, after: 160 },
        children: [new TextRun({ text: s.title, bold: true, size: headingHalfPt, font: fontFamily, color: headingColor })],
      })
    );
    if (s.subtitle) {
      children.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: s.subtitle, italics: true, size: bodyHalfPt, color: '666666', font: fontFamily })],
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
        children.push(buildCalloutTable(cb.variant, cb.title, cb.body, bodyHalfPt, fontFamily, justify, bodyColor, italicQuotes, lineHeight));
        children.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
      } else if ((b as any).kind === 'table') {
        const tb = b as Extract<DocxBlock, { kind: 'table' }>;
        children.push(buildDataTable(tb.headers || [], tb.rows || [], bodyHalfPt, fontFamily));
        if (tb.caption) {
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 80, after: 200 },
              children: [new TextRun({ text: tb.caption, italics: true, size: Math.max(16, bodyHalfPt - 4), color: '6B7280', font: fontFamily })],
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
              children: [new TextRun({ text: pb.heading, bold: true, size: subHeadingHalfPt, font: fontFamily, color: headingColor })],
            })
          );
        }
        children.push(...textToParagraphs(pb.text, bodyHalfPt, fontFamily, justify, bodyColor, italicQuotes, lineHeight));
      }
    }
    if (i < opts.sections.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  const doc = new Document({
    styles: {
      default: { document: { run: { font: fontFamily, size: bodyHalfPt } } },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: marginDxa, right: marginDxa, bottom: marginDxa, left: marginDxa },
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
