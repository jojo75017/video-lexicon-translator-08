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
  Footer, Header, PageNumber, TableOfContents,
} from 'docx';
import { saveAs } from 'file-saver';
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
  { id: '5x8',     label: '5 × 8 pouces',     description: 'Format poche compact', width: 7200,  height: 11520, margin: 1080 },
  { id: '5.5x8.5', label: '5,5 × 8,5 pouces', description: 'Format standard non-fiction', width: 7920,  height: 12240, margin: 1080 },
  { id: '6x9',     label: '6 × 9 pouces',     description: 'Recommandé pour les romans (15,24 × 22,86 cm)', recommended: true, width: 8640, height: 12960, margin: 1080 },
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
  const gutter = Math.round(kdpInsideMarginInches(manuscript.pageEstimate) * 1440);
  const children: (Paragraph | TableOfContents)[] = [];

  // Page de titre
  children.push(new Paragraph({
    children: [new TextRun({ text: manuscript.title, bold: true, size: fontSizeHalfPoints(28), font: options.fontFamily })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 400 },
  }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  // Table des matières (mise à jour par Word à l'ouverture).
  if (options.toc) {
    children.push(new Paragraph({
      children: [new TextRun({ text: 'Table des matières', bold: true, size: fontSizeHalfPoints(18), font: options.fontFamily })],
      spacing: { after: 240 },
    }));
    children.push(new TableOfContents('Table des matières', { hyperlink: true, headingStyleRange: '1-1' }));
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  manuscript.chapters.forEach((chapter, i) => {
    if (i > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: chapter.title, bold: true, size: fontSizeHalfPoints(18), font: options.fontFamily })],
      spacing: { before: 240, after: 300 },
    }));
    const corrected = correctedChapterText(chapter, analysis, applyTypography);
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
            top: format.margin,
            right: format.margin,
            bottom: format.margin,
            left: format.margin,
            gutter,
          },
        },
      },
      ...(footer ? { footers: { default: footer } } : {}),
      ...(header ? { headers: { default: header } } : {}),
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safe = manuscript.title.replace(/[^\w\sÀ-ÿ-]/g, '').trim().slice(0, 60) || 'manuscrit';
  saveAs(blob, `${safe} — ${format.label} (KDP).docx`);
}

/** Exporte le manuscrit corrigé en PDF prêt-à-imprimer Amazon KDP. */
export async function exportCorrectedPdf(
  manuscript: Manuscript,
  analysis: Analysis,
  options: KdpExportOptions = DEFAULT_KDP_OPTIONS,
  applyTypography = true,
) {
  const format = getKdpFormat(options.formatId);
  const wPt = (format.width / 1440) * 72;
  const hPt = (format.height / 1440) * 72;

  const doc = new jsPDF({ unit: 'pt', format: [wPt, hPt], compress: true });
  // jsPDF ne fournit pas Garamond ; « times » (serif) est le rendu roman le
  // plus proche pour l'impression. Le .docx, lui, conserve la police choisie.
  doc.setFont('times', 'normal');

  const insidePt = kdpInsideMarginInches(manuscript.pageEstimate) * 72; // reliure
  const outsidePt = 0.5 * 72;
  const topPt = 0.75 * 72;
  const botPt = 0.75 * 72;
  const contentW = wPt - insidePt - outsidePt;
  const lineH = options.fontSize * 1.45;
  const left = insidePt;

  let pageNo = 0;
  const newPage = (first = false) => {
    if (!first) doc.addPage([wPt, hPt], 'portrait');
    pageNo++;
    if (options.headers && pageNo > 1) {
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(manuscript.title, wPt / 2, topPt - 18, { align: 'center', maxWidth: contentW });
      doc.setTextColor(0);
    }
    if (options.pageNumbers && pageNo > 1) {
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(String(pageNo), wPt / 2, hPt - botPt + 24, { align: 'center' });
      doc.setTextColor(0);
    }
  };

  // Page de titre
  newPage(true);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text(doc.splitTextToSize(manuscript.title, contentW), wPt / 2, hPt / 2 - 20, { align: 'center' });

  // Table des matières
  if (options.toc) {
    newPage();
    let y = topPt + 10;
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text('Table des matières', left, y);
    y += lineH * 1.6;
    doc.setFont('times', 'normal');
    doc.setFontSize(options.fontSize);
    manuscript.chapters.forEach((c) => {
      if (y > hPt - botPt) { newPage(); y = topPt + 10; }
      doc.text(doc.splitTextToSize(c.title, contentW), left, y);
      y += lineH;
    });
  }

  // Chapitres (chacun sur une nouvelle page)
  for (const chapter of manuscript.chapters) {
    newPage();
    let y = topPt + 10;
    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.text(doc.splitTextToSize(chapter.title, contentW), left, y);
    y += lineH * 1.8;

    doc.setFont('times', 'normal');
    doc.setFontSize(options.fontSize);
    const corrected = correctedChapterText(chapter, analysis, applyTypography);
    const paras = corrected.split(/\n\s*\n/).map((p) => p.trim().replace(/\n/g, ' ')).filter(Boolean);
    for (const para of paras) {
      const lines: string[] = doc.splitTextToSize(para, contentW);
      for (const line of lines) {
        if (y > hPt - botPt) { newPage(); y = topPt + 10; doc.setFont('times', 'normal'); doc.setFontSize(options.fontSize); }
        doc.text(line, left, y);
        y += lineH;
      }
      y += lineH * 0.5; // espace inter-paragraphe
    }
  }

  const safe = manuscript.title.replace(/[^\w\sÀ-ÿ-]/g, '').trim().slice(0, 60) || 'manuscrit';
  doc.save(`${safe} — ${format.label} (KDP impression).pdf`);
}

/** Prépare pour Amazon KDP en un clic : exporte le .docx ET le PDF. */
export async function exportKdpPackage(
  manuscript: Manuscript,
  analysis: Analysis,
  options: KdpExportOptions = DEFAULT_KDP_OPTIONS,
  applyTypography = true,
) {
  await exportCorrectedDocx(manuscript, analysis, applyTypography, options);
  await exportCorrectedPdf(manuscript, analysis, options, applyTypography);
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
