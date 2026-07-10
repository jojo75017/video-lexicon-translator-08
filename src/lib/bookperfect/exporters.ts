/**
 * BookPerfect AI — Exports.
 * Export Word (.docx) du manuscrit CORRIGÉ : applique uniquement les
 * corrections VALIDÉES par l'auteur (status 'applied'), de façon
 * non-destructive (l'original en mémoire n'est jamais muté), puis applique la
 * typographie française et génère un .docx propre pour Amazon KDP.
 * Export d'un rapport .docx récapitulatif.
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Header, Footer, PageNumber,
} from 'docx';
import { saveAs } from 'file-saver';
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
  /** Marge en DXA appliquée sur les 4 côtés. */
  margin: number;
}

export const KDP_FORMATS: KdpFormat[] = [
  { id: '5x8',     label: '5 × 8 pouces',     description: 'Format poche compact', width: 7200,  height: 11520, margin: 1080 },
  { id: '5.5x8.5', label: '5,5 × 8,5 pouces', description: 'Format standard non-fiction', width: 7920,  height: 12240, margin: 1080 },
  { id: '6x9',     label: '6 × 9 pouces',     description: 'Recommandé pour les romans', recommended: true, width: 8640, height: 12960, margin: 1152 },
  { id: 'a4',      label: 'A4 (travail)',     description: 'Relecture / impression bureau', width: 11906, height: 16838, margin: 1440 },
  { id: 'a5',      label: 'A5 (lecture)',     description: 'Format lecture agréable', width: 8419,  height: 11906, margin: 1080 },
];

export const getKdpFormat = (id: KdpFormatId): KdpFormat =>
  KDP_FORMATS.find((f) => f.id === id) ?? KDP_FORMATS[2];

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

const paragraphsFrom = (text: string): Paragraph[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => new Paragraph({
      children: [new TextRun({ text: p.replace(/\n/g, ' '), size: 24, font: 'Georgia' })],
      spacing: { after: 200, line: 320 },
      alignment: AlignmentType.JUSTIFIED,
    }));

/** Exporte le manuscrit corrigé en .docx (prêt pour Amazon KDP). */
export async function exportCorrectedDocx(manuscript: Manuscript, analysis: Analysis, applyTypography = true) {
  const children: Paragraph[] = [];

  // Page de titre
  children.push(new Paragraph({
    children: [new TextRun({ text: manuscript.title, bold: true, size: 56, font: 'Georgia' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 400 },
  }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  manuscript.chapters.forEach((chapter, i) => {
    if (i > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: chapter.title, bold: true, size: 36, font: 'Georgia' })],
      spacing: { before: 240, after: 300 },
    }));
    const corrected = correctedChapterText(chapter, analysis, applyTypography);
    children.push(...paragraphsFrom(corrected));
  });

  const doc = new Document({
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safe = manuscript.title.replace(/[^\w\sÀ-ÿ-]/g, '').trim().slice(0, 60) || 'manuscrit';
  saveAs(blob, `${safe} — corrigé (KDP).docx`);
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
