/**
 * BookPerfect AI — Exports.
 * Export Word (.docx) + PDF prêt-à-imprimer du manuscrit CORRIGÉ : applique
 * uniquement les corrections VALIDÉES par l'auteur (status 'applied'), de façon
 * non-destructive (l'original en mémoire n'est jamais muté), puis applique la
 * typographie française et une mise en page professionnelle Amazon KDP
 * (format, marges officielles selon le nombre de pages, police roman,
 * chapitres sur nouvelle page, table des matières, pagination, en-têtes).
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Footer, Header, PageNumber, PositionalTab, PositionalTabAlignment, PositionalTabLeader, PositionalTabRelativeTo,
} from 'docx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import { applyFrenchTypography } from '@/utils/frenchTypography';
import type { Analysis, Chapter, Issue, Manuscript } from './types';
import { CATEGORY_LABELS } from './types';

/** Formats de page pour l'export (Amazon KDP + formats de travail). */
export type KdpFormatId = '5x8' | '5.5x8.5' | '6x9' | 'a4' | 'a5';

export interface KdpFormat {
  id: KdpFormatId;
  label: string;
  description: string;
  recommended?: boolean;
  /** Dimensions en DXA (1 pouce = 1440). */
  width: number;
  height: number;
  /** Marge (extérieure/haut/bas) en DXA. La marge intérieure (reliure) est
   *  calculée automatiquement selon le nombre de pages. */
  margin: number;
}

export const KDP_FORMATS: KdpFormat[] = [
  { id: '5x8',     label: '5 × 8 pouces',     description: 'Format poche compact', width: 7200,  height: 11520, margin: 360 },
  { id: '5.5x8.5', label: '5,5 × 8,5 pouces', description: 'Format standard non-fiction', width: 7920,  height: 12240, margin: 360 },
  { id: '6x9',     label: '6 × 9 pouces',     description: 'Recommandé pour les romans (15,24 × 22,86 cm)', recommended: true, width: 8640, height: 12960, margin: 360 },
  { id: 'a4',      label: 'A4 (travail)',     description: 'Relecture / impression bureau', width: 11906, height: 16838, margin: 1440 },
  { id: 'a5',      label: 'A5 (lecture)',     description: 'Format lecture agréable', width: 8419,  height: 11906, margin: 1080 },
];

export const getKdpFormat = (id: KdpFormatId): KdpFormat =>
  KDP_FORMATS.find((f) => f.id === id) ?? KDP_FORMATS[2];

/** Polices adaptées aux romans (serif). La 1re est la valeur par défaut. */
export const KDP_FONTS = ['Garamond', 'Georgia', 'Times New Roman', 'Book Antiqua', 'Palatino Linotype'];

export interface KdpExportOptions {
  formatId: KdpFormatId;
  /** Police du corps de texte. */
  fontFamily: string;
  /** Taille en points (pt). */
  fontSize: number;
  /** Table des matières générée automatiquement. */
  toc: boolean;
  /** Numérotation des pages (pied de page). */
  pageNumbers: boolean;
  /** En-têtes (titre du livre en haut de page). */
  headers: boolean;
}

export const DEFAULT_KDP_OPTIONS: KdpExportOptions = {
  formatId: '6x9',
  fontFamily: 'Garamond',
  fontSize: 11,
  toc: true,
  pageNumbers: true,
  headers: false,
};

/**
 * Marge intérieure (reliure / gouttière) officielle Amazon KDP selon le
 * nombre de pages. Source : barème officiel KDP.
 * Renvoie la valeur en pouces.
 */
export function kdpInsideMarginInches(pageCount: number): number {
  if (pageCount <= 150) return 0.375;
  if (pageCount <= 300) return 0.5;
  if (pageCount <= 500) return 0.625;
  if (pageCount <= 700) return 0.75;
  return 0.875;
}

const TWIPS_PER_INCH = 1440;
const POINTS_PER_INCH = 72;
const MM_PER_INCH = 25.4;
const KDP_OUTSIDE_MARGIN_INCHES = 0.25;

const inchesToTwips = (inches: number) => Math.round(inches * TWIPS_PER_INCH);
const twipsToInches = (twips: number) => twips / TWIPS_PER_INCH;

export function estimateKdpPageCount(manuscript: Manuscript, options: KdpExportOptions = DEFAULT_KDP_OPTIONS): number {
  const format = getKdpFormat(options.formatId);
  const inside = kdpInsideMarginInches(manuscript.pageEstimate);
  const contentWidthIn = twipsToInches(format.width) - inside - KDP_OUTSIDE_MARGIN_INCHES;
  const contentHeightIn = twipsToInches(format.height) - (KDP_OUTSIDE_MARGIN_INCHES * 2);
  const avgCharsPerLine = Math.max(24, Math.floor((contentWidthIn * POINTS_PER_INCH) / (options.fontSize * 0.48)));
  const linesPerPage = Math.max(12, Math.floor((contentHeightIn * POINTS_PER_INCH) / (options.fontSize * 1.45)));
  const wordsPerLine = Math.max(4, avgCharsPerLine / 5.6);
  const wordsPerPage = wordsPerLine * linesPerPage * 0.86;
  const chapterBreakAllowance = Math.max(1, Math.ceil(manuscript.chapters.length * 0.45));
  return Math.max(manuscript.pageEstimate, Math.ceil(manuscript.wordCount / Math.max(120, wordsPerPage)) + chapterBreakAllowance);
}

export function getKdpMargins(options: KdpExportOptions, pageCount: number) {
  const format = getKdpFormat(options.formatId);
  const insideInches = kdpInsideMarginInches(pageCount);
  const outsideInches = options.formatId === 'a4' ? 1 : (options.formatId === 'a5' ? 0.75 : KDP_OUTSIDE_MARGIN_INCHES);
  const verticalInches = options.formatId === 'a4' ? 1 : (options.formatId === 'a5' ? 0.75 : KDP_OUTSIDE_MARGIN_INCHES);
  return {
    format,
    pageCount,
    insideInches,
    outsideInches,
    topInches: verticalInches,
    bottomInches: verticalInches,
    insideTwips: inchesToTwips(insideInches),
    outsideTwips: inchesToTwips(outsideInches),
    topTwips: inchesToTwips(verticalInches),
    bottomTwips: inchesToTwips(verticalInches),
  };
}

const inchesToMm = (inches: number) => inches * MM_PER_INCH;

/** Applique les corrections validées à un texte (1re occurrence par issue). */
function applyCorrections(text: string, issues: Issue[]): string {
  let out = text;
  for (const issue of issues) {
    if (issue.status !== 'applied' || !issue.original || !issue.suggestion) continue;
    const idx = out.indexOf(issue.original);
    if (idx >= 0) {
      out = out.slice(0, idx) + issue.suggestion + out.slice(idx + issue.original.length);
    }
  }
  return out;
}

/** Construit le texte corrigé d'un chapitre (non destructif). */
export function correctedChapterText(chapter: Chapter, analysis: Analysis, applyTypography = true): string {
  const chapterIssues = analysis.issues.filter((i) => i.chapterId === chapter.id);
  let text = applyCorrections(chapter.content, chapterIssues);
  if (applyTypography) text = applyFrenchTypography(text);
  return text;
}

/** Contrôle final KDP avant export : renvoie les blocages/avertissements. */
export interface KdpFinalCheck {
  ready: boolean;
  blockers: string[];
  warnings: string[];
}

export function runKdpFinalCheck(manuscript: Manuscript, analysis: Analysis): KdpFinalCheck {
  const blockers: string[] = [];
  const warnings: string[] = [];

  const failed = analysis.chapterResults.filter((r) => r.status === 'failed').length;
  if (failed > 0) warnings.push(`${failed} chapitre(s) n'ont pas pu être analysés par l'IA.`);

  const pendingTraces = analysis.issues.filter((i) => i.category === 'traces-ia' && i.status !== 'applied' && i.status !== 'ignored').length;
  if (pendingTraces > 0) warnings.push(`${pendingTraces} trace(s) IA / provisoire(s) non traitée(s).`);

  const badTitle = !manuscript.title.trim() || /provisoire|untitled|sans titre/i.test(manuscript.title);
  if (badTitle) blockers.push('Titre du livre manquant ou provisoire.');

  if (manuscript.chapters.length < 2) warnings.push('Le manuscrit contient moins de 2 chapitres.');
  if (manuscript.wordCount < 5000) warnings.push(`Manuscrit court (${manuscript.wordCount.toLocaleString('fr-FR')} mots).`);

  return { ready: blockers.length === 0, blockers, warnings };
}

const fontSizeHalfPoints = (pt: number) => Math.round(pt * 2);

const safeFileBase = (title: string) =>
  (title || 'manuscrit').replace(/[^\w\sÀ-ÿ-]/g, '').trim().replace(/\s+/g, ' ').slice(0, 60) || 'manuscrit';

const normalizeLine = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/^#{1,3}\s+/, '')
  .replace(/[.·•…\-–—_:;!?'"«»()[\]{}]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const isTocTitle = (line: string) => /^(?:table des matières|table des matieres|sommaire)\s*:?$/i.test(line.trim());

const isChapterLikeLine = (line: string) =>
  /^(?:#{1,3}\s+)?(?:chapitre|partie|prologue|épilogue|epilogue|introduction)\b/i.test(line.trim());

const isLikelyTocEntry = (line: string) => {
  const l = line.trim();
  return /[.·•…]{2,}\s*\d{1,4}$/.test(l) || (isChapterLikeLine(l) && /\s+\d{1,4}$/.test(l));
};

const exportChapterTitle = (chapter: Chapter) =>
  chapter.title.replace(/\s*[.·•…]{2,}\s*\d{1,4}\s*$/, '').trim() || chapter.title;

const stripTocBlock = (text: string) => {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex(isTocTitle);
  if (start < 0) return text;

  let end = start + 1;
  for (; end < lines.length; end += 1) {
    const current = lines[end].trim();
    if (!current || isLikelyTocEntry(current)) continue;
    if (isChapterLikeLine(current)) {
      const nextMeaningful = lines.slice(end + 1).map((l) => l.trim()).find(Boolean) || '';
      if (!isLikelyTocEntry(nextMeaningful) && !isChapterLikeLine(nextMeaningful)) break;
      continue;
    }
    if (end - start > 2) break;
  }
  return [...lines.slice(0, start), ...lines.slice(end)].join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

const stripDuplicatedChapterTitle = (title: string, text: string) => {
  const lines = (text || '').replace(/\r\n/g, '\n').split('\n');
  const out = [...lines];
  const wanted = normalizeLine(title);
  while (out.length > 0 && !out[0].trim()) out.shift();
  const first = out[0]?.trim() || '';
  const firstNorm = normalizeLine(first);
  const titleLooksSame = firstNorm && wanted && (firstNorm === wanted || wanted.startsWith(firstNorm) || firstNorm.startsWith(wanted));
  if (titleLooksSame && first.length < 140) out.shift();
  while (out.length > 0 && !out[0].trim()) out.shift();
  return out.join('\n').trim();
};

const isFrontMatterOrTocChapter = (chapter: Chapter, total: number) => {
  const title = chapter.title.trim();
  const content = chapter.content.trim();
  if (isTocTitle(title)) return true;
  if (chapter.index === 0 && total > 1 && title === 'Manuscrit') {
    const chapterLineCount = content.split('\n').filter(isChapterLikeLine).length;
    return chapter.wordCount <= 120 || isTocTitle(content.split('\n').find(Boolean) || '') || chapterLineCount >= 3;
  }
  return isTocTitle(content.split('\n').find(Boolean) || '');
};

const exportableChapters = (manuscript: Manuscript) =>
  manuscript.chapters.filter((chapter) => !isFrontMatterOrTocChapter(chapter, manuscript.chapters.length));

const correctedExportText = (chapter: Chapter, analysis: Analysis, applyTypography: boolean) =>
  stripDuplicatedChapterTitle(exportChapterTitle(chapter), stripTocBlock(correctedChapterText(chapter, analysis, applyTypography)));

const estimateChapterStartPages = (chapters: Chapter[], manuscript: Manuscript, options: KdpExportOptions) => {
  const pageEstimate = estimateKdpPageCount(manuscript, options);
  const wordsPerPage = Math.max(180, Math.round(manuscript.wordCount / Math.max(1, pageEstimate)) || 260);
  let currentPage = options.toc ? 3 : 2;
  return chapters.map((chapter) => {
    const page = currentPage;
    currentPage += Math.max(1, Math.ceil(chapter.wordCount / wordsPerPage));
    return page;
  });
};

const buildManualTocDocx = (chapters: Chapter[], startPages: number[], opts: KdpExportOptions): Paragraph[] => [
  new Paragraph({
    children: [new TextRun({ text: 'Table des matières', bold: true, size: fontSizeHalfPoints(18), font: opts.fontFamily })],
    spacing: { after: 280 },
  }),
  ...chapters.map((chapter, index) => new Paragraph({
    children: [
      new TextRun({ text: exportChapterTitle(chapter), size: fontSizeHalfPoints(opts.fontSize), font: opts.fontFamily }),
      new TextRun({
        size: fontSizeHalfPoints(opts.fontSize),
        font: opts.fontFamily,
        children: [
          new PositionalTab({
            alignment: PositionalTabAlignment.RIGHT,
            relativeTo: PositionalTabRelativeTo.MARGIN,
            leader: PositionalTabLeader.DOT,
          }),
          String(startPages[index] ?? ''),
        ],
      }),
    ],
    spacing: { after: 100 },
  })),
];

async function patchDocxSettings(blob: Blob): Promise<Blob> {
  const zip = await JSZip.loadAsync(new Uint8Array(await blob.arrayBuffer()));
  const settingsPath = 'word/settings.xml';
  const current = await zip.file(settingsPath)?.async('string');
  if (current) {
    let settings = current;
    if (!settings.includes('<w:mirrorMargins')) {
      settings = settings.replace('</w:settings>', '<w:mirrorMargins/></w:settings>');
    }
    if (!settings.includes('<w:updateFields')) {
      settings = settings.replace('</w:settings>', '<w:updateFields w:val="true"/></w:settings>');
    }
    zip.file(settingsPath, settings);
  }
  return await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

const paragraphsFrom = (text: string, opts: KdpExportOptions): Paragraph[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => new Paragraph({
      children: [new TextRun({ text: p.replace(/\n/g, ' '), size: fontSizeHalfPoints(opts.fontSize), font: opts.fontFamily })],
      spacing: { after: 160, line: Math.round(opts.fontSize * 26) },
      alignment: AlignmentType.JUSTIFIED,
    }));

/** Exporte le manuscrit corrigé en .docx (mise en page Amazon KDP). */
export async function generateCorrectedDocxBlob(
  manuscript: Manuscript,
  analysis: Analysis,
  applyTypography = true,
  optionsOrFormat: KdpExportOptions | KdpFormatId = DEFAULT_KDP_OPTIONS,
): Promise<Blob> {
  const options: KdpExportOptions = typeof optionsOrFormat === 'string'
    ? { ...DEFAULT_KDP_OPTIONS, formatId: optionsOrFormat }
    : optionsOrFormat;

  const pageEstimate = estimateKdpPageCount(manuscript, options);
  const margins = getKdpMargins(options, pageEstimate);
  const { format } = margins;
  const chapters = exportableChapters(manuscript);
  const chapterStartPages = estimateChapterStartPages(chapters, manuscript, options);
  const children: Paragraph[] = [];

  // Page de titre
  children.push(new Paragraph({
    children: [new TextRun({ text: manuscript.title, bold: true, size: fontSizeHalfPoints(28), font: options.fontFamily })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 400 },
  }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Table des matières visible immédiatement dans Word, sans dépendre d'une mise à jour de champs.
  if (options.toc) {
    children.push(...buildManualTocDocx(chapters, chapterStartPages, options));
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  chapters.forEach((chapter, i) => {
    if (i > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: exportChapterTitle(chapter), bold: true, size: fontSizeHalfPoints(18), font: options.fontFamily })],
      spacing: { before: 240, after: 300 },
    }));
    const corrected = correctedExportText(chapter, analysis, applyTypography);
    children.push(...paragraphsFrom(corrected, options));
  });

  const footer = options.pageNumbers
    ? new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], size: fontSizeHalfPoints(9), font: options.fontFamily })],
        })],
      })
    : undefined;

  const header = options.headers
    ? new Header({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: manuscript.title, italics: true, size: fontSizeHalfPoints(9), font: options.fontFamily, color: '666666' })],
        })],
      })
    : undefined;

  const doc = new Document({
    styles: {
      paragraphStyles: [{
        id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: fontSizeHalfPoints(18), bold: true, font: options.fontFamily },
        paragraph: { spacing: { before: 240, after: 300 }, outlineLevel: 0 },
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: format.width, height: format.height },
          margin: {
            top: margins.topTwips,
            right: margins.outsideTwips,
            bottom: margins.bottomTwips,
            left: margins.insideTwips,
            gutter: 0,
          },
        },
      },
      ...(footer ? { footers: { default: footer } } : {}),
      ...(header ? { headers: { default: header } } : {}),
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  return await patchDocxSettings(blob);
}

/** Exporte le manuscrit corrigé en .docx (mise en page Amazon KDP). */
export async function exportCorrectedDocx(
  manuscript: Manuscript,
  analysis: Analysis,
  applyTypography = true,
  optionsOrFormat: KdpExportOptions | KdpFormatId = DEFAULT_KDP_OPTIONS,
) {
  const options: KdpExportOptions = typeof optionsOrFormat === 'string'
    ? { ...DEFAULT_KDP_OPTIONS, formatId: optionsOrFormat }
    : optionsOrFormat;
  const format = getKdpFormat(options.formatId);
  const blob = await generateCorrectedDocxBlob(manuscript, analysis, applyTypography, options);
  saveAs(blob, `${safeFileBase(manuscript.title)} — WORD KDP ${format.label}.docx`);
}

/** Exporte le manuscrit corrigé en PDF prêt-à-imprimer Amazon KDP. */
export async function generateCorrectedPdfBlob(
  manuscript: Manuscript,
  analysis: Analysis,
  options: KdpExportOptions = DEFAULT_KDP_OPTIONS,
  applyTypography = true,
): Promise<Blob> {
  const pageEstimate = estimateKdpPageCount(manuscript, options);
  const margins = getKdpMargins(options, pageEstimate);
  const { format } = margins;
  const pageWidthMm = inchesToMm(twipsToInches(format.width));
  const pageHeightMm = inchesToMm(twipsToInches(format.height));

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pageWidthMm, pageHeightMm], compress: true });
  // Le PDF doit rester parfaitement lisible et stable dans les prévisualiseurs
  // KDP. Le DOCX conserve Garamond ; le PDF utilise une police PDF intégrée
  // fiable pour éviter les lettres capitales visuellement espacées/déformées.
  const pdfFont = 'helvetica';
  doc.setFont(pdfFont, 'normal');

  const insideMm = inchesToMm(margins.insideInches);
  const outsideMm = inchesToMm(margins.outsideInches);
  const topMm = inchesToMm(margins.topInches);
  const bottomMm = inchesToMm(margins.bottomInches);
  const contentW = pageWidthMm - insideMm - outsideMm;
  const bodyFontSize = options.fontSize;
  const lineH = bodyFontSize * 0.352778 * 1.45;
  const paraGap = lineH * 0.7;
  const titleGap = lineH * 2;

  let pageNo = 0;
  let currentLeft = insideMm;
  let currentRight = outsideMm;
  const bottomLimit = pageHeightMm - bottomMm;

  const drawGuides = () => {
    // Repères invisibles désactivés volontairement : aucune image/canvas/rotation,
    // uniquement du texte vectoriel dans une page 6×9 exacte.
  };

  const newPage = (first = false) => {
    if (!first) doc.addPage([pageWidthMm, pageHeightMm], 'portrait');
    pageNo++;
    // Pages impaires : page de droite, reliure à gauche. Pages paires : reliure à droite.
    currentLeft = pageNo % 2 === 0 ? outsideMm : insideMm;
    currentRight = pageNo % 2 === 0 ? insideMm : outsideMm;
    drawGuides();
    if (options.headers && pageNo > 1) {
      doc.setFont(pdfFont, 'italic');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(manuscript.title, pageWidthMm / 2, Math.max(4, topMm - 2), { align: 'center', maxWidth: pageWidthMm - currentLeft - currentRight });
      doc.setTextColor(0);
    }
    if (options.pageNumbers && pageNo > 1) {
      doc.setFont(pdfFont, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(String(pageNo), pageWidthMm / 2, pageHeightMm - Math.max(3, bottomMm / 2), { align: 'center' });
      doc.setTextColor(0);
    }
  };

  const ensureSpace = (y: number, needed = lineH) => {
    if (y + needed <= bottomLimit) return y;
    newPage();
    doc.setFont(pdfFont, 'normal');
    doc.setFontSize(bodyFontSize);
    return topMm + lineH;
  };

  const writeWrapped = (text: string, x: number, y: number, fontSize = bodyFontSize) => {
    doc.setFont(pdfFont, 'normal');
    doc.setFontSize(fontSize);
    const localLineH = fontSize * 0.352778 * 1.45;
    const lines: string[] = doc.splitTextToSize(text, pageWidthMm - currentLeft - currentRight);
    for (const line of lines) {
      y = ensureSpace(y, localLineH);
      doc.text(line, x, y);
      y += localLineH;
    }
    return y;
  };

  // Page de titre
  newPage(true);
  doc.setFont(pdfFont, 'normal');
  doc.setFontSize(24);
  doc.text(doc.splitTextToSize(manuscript.title, pageWidthMm - insideMm - outsideMm), pageWidthMm / 2, pageHeightMm / 2 - 8, { align: 'center' });

  const chapters = exportableChapters(manuscript);
  const chapterStartPages = estimateChapterStartPages(chapters, manuscript, options);

  // Table des matières
  if (options.toc) {
    newPage();
    let y = topMm + lineH;
    y = writeWrapped('Table des matières', currentLeft, y, 16) + titleGap * 0.3;
    doc.setFont(pdfFont, 'normal');
    doc.setFontSize(bodyFontSize);
    chapters.forEach((c, index) => {
      y = writeWrapped(`${exportChapterTitle(c)}  ${chapterStartPages[index] ?? ''}`, currentLeft, y, bodyFontSize) + lineH * 0.2;
    });
  }

  // Chapitres (chacun sur une nouvelle page)
  for (const chapter of chapters) {
    newPage();
    let y = topMm + lineH;
    y = writeWrapped(exportChapterTitle(chapter), currentLeft, y, 16) + titleGap;

    doc.setFont(pdfFont, 'normal');
    doc.setFontSize(bodyFontSize);
    const corrected = correctedExportText(chapter, analysis, applyTypography);
    const paras = corrected.split(/\n\s*\n/).map((p) => p.trim().replace(/\n/g, ' ')).filter(Boolean);
    for (const para of paras) {
      y = writeWrapped(para, currentLeft, y, bodyFontSize) + paraGap;
    }
  }

  return doc.output('blob');
}

/** Exporte le manuscrit corrigé en PDF prêt-à-imprimer Amazon KDP. */
export async function exportCorrectedPdf(
  manuscript: Manuscript,
  analysis: Analysis,
  options: KdpExportOptions = DEFAULT_KDP_OPTIONS,
  applyTypography = true,
) {
  const format = getKdpFormat(options.formatId);
  const blob = await generateCorrectedPdfBlob(manuscript, analysis, options, applyTypography);
  saveAs(blob, `${safeFileBase(manuscript.title)} — PDF KDP ${format.label}.pdf`);
}

/** Prépare pour Amazon KDP en un clic : exporte le .docx ET le PDF. */
export async function exportKdpPackage(
  manuscript: Manuscript,
  analysis: Analysis,
  options: KdpExportOptions = DEFAULT_KDP_OPTIONS,
  applyTypography = true,
) {
  const format = getKdpFormat(options.formatId);
  const pageEstimate = estimateKdpPageCount(manuscript, options);
  const margins = getKdpMargins(options, pageEstimate);
  const [docxBlob, pdfBlob] = await Promise.all([
    generateCorrectedDocxBlob(manuscript, analysis, applyTypography, options),
    generateCorrectedPdfBlob(manuscript, analysis, options, applyTypography),
  ]);
  const safe = safeFileBase(manuscript.title);
  const zip = new JSZip();
  zip.file(`${safe} — WORD KDP ${format.label}.docx`, docxBlob);
  zip.file(`${safe} — PDF KDP ${format.label}.pdf`, pdfBlob);
  zip.file('MARGES-KDP.txt', [
    `Format trim : ${format.label}`,
    `Estimation pages utilisée pour la reliure : ${pageEstimate}`,
    `Marge intérieure (reliure) : ${margins.insideInches.toFixed(3)} po`,
    `Marge extérieure : ${margins.outsideInches.toFixed(3)} po`,
    `Marge haut : ${margins.topInches.toFixed(3)} po`,
    `Marge bas : ${margins.bottomInches.toFixed(3)} po`,
    'DOCX : marges miroir activées (intérieur/extérieur).',
    'PDF : marges miroir appliquées page impaire/paire.',
  ].join('\n'));
  const zipBlob = await zip.generateAsync({ type: 'blob', mimeType: 'application/zip' });
  saveAs(zipBlob, `${safe} — PACK KDP ${format.label} Word PDF.zip`);
}

/** Exporte un rapport d'analyse récapitulatif en .docx. */
export async function exportReportDocx(manuscript: Manuscript, analysis: Analysis) {
  const s = analysis.scores;
  const children: Paragraph[] = [];
  const line = (text: string, opts: { bold?: boolean; size?: number; heading?: boolean } = {}) =>
    new Paragraph({
      heading: opts.heading ? HeadingLevel.HEADING_2 : undefined,
      children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? 24, font: 'Arial' })],
      spacing: { after: 160 },
    });

  children.push(new Paragraph({
    children: [new TextRun({ text: 'Rapport éditorial — BookPerfect AI', bold: true, size: 40, font: 'Arial' })],
    spacing: { after: 300 },
  }));
  children.push(line(`Manuscrit : ${manuscript.title}`, { bold: true }));
  children.push(line(`${manuscript.wordCount.toLocaleString('fr-FR')} mots · ~${manuscript.pageEstimate} pages · ${manuscript.chapters.length} chapitres`));

  if (s) {
    const verdictLabel = s.verdict === 'green' ? '🟢 Prêt pour publication' : s.verdict === 'orange' ? '🟠 Corrections recommandées' : '🔴 Corrections importantes requises';
    children.push(line('Verdict global', { heading: true }));
    children.push(line(`${verdictLabel} — Score global : ${s.global}/100`, { bold: true }));
    children.push(line(`Orthographe/Typo : ${s.orthographe}/100`));
    children.push(line(`Style/Répétitions : ${s.style}/100`));
    children.push(line(`Amazon KDP : ${s.kdp}/100`));
    children.push(line(`Traces IA / provisoire : ${s.tracesIa}/100`));
  }

  children.push(line('Contrôle Amazon KDP', { heading: true }));
  analysis.kdpReport.forEach((c) => children.push(line(`${c.ok ? '✅' : '⚠️'} ${c.label} — ${c.detail}`)));

  const byCat = (cat: Issue['category']) => analysis.issues.filter((i) => i.category === cat);
  (['traces-ia', 'orthographe', 'style', 'kdp'] as Issue['category'][]).forEach((cat) => {
    const items = byCat(cat);
    children.push(line(`${CATEGORY_LABELS[cat]} — ${items.length} point(s)`, { heading: true }));
    items.slice(0, 100).forEach((i) => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `[${i.chapterTitle}] `, bold: true, size: 22, font: 'Arial' }),
          new TextRun({ text: i.original ? `« ${i.original.slice(0, 120)} » → ` : '', size: 22, font: 'Arial', italics: true }),
          new TextRun({ text: i.suggestion ? `« ${i.suggestion.slice(0, 120)} » ` : '', size: 22, font: 'Arial', bold: true }),
          new TextRun({ text: i.reason, size: 20, font: 'Arial', color: '555555' }),
        ],
        spacing: { after: 100 },
      }));
    });
    if (items.length === 0) children.push(line('Aucun point détecté.'));
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const safe = manuscript.title.replace(/[^\w\sÀ-ÿ-]/g, '').trim().slice(0, 60) || 'manuscrit';
  saveAs(blob, `${safe} — rapport éditorial.docx`);
}
