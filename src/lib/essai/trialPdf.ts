import { jsPDF } from 'jspdf';

export interface TrialPdfInput {
  title: string;
  subtitle?: string;
  outline: { title: string; summary: string }[];
  chapterTitle: string;
  chapterText: string;
}

const clean = (s: string) => s.replace(/[\u2014\u2013]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2026/g, '...');

export function slugify(s: string): string {
  return (s || 'mon-livre').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'mon-livre';
}

/** Construit le PDF personnel du visiteur : garde, sommaire, chapitre 1, page offre. */
export function buildTrialPdf(input: TrialPdfInput): Blob {
  const doc = new jsPDF({ unit: 'mm', format: 'a5' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const maxW = W - M * 2;
  let y = M;

  const ensure = (h: number) => { if (y + h > H - M) { doc.addPage(); y = M; } };
  const para = (text: string, size: number, style: 'normal' | 'bold' | 'italic' = 'normal', gap = 3) => {
    doc.setFont('times', style); doc.setFontSize(size);
    const lines = doc.splitTextToSize(clean(text), maxW) as string[];
    const lh = size * 0.45;
    for (const l of lines) { ensure(lh); doc.text(l, M, y); y += lh; }
    y += gap;
  };

  // Garde
  doc.setFillColor(15, 23, 42); doc.rect(0, 0, W, H, 'F');
  doc.setTextColor(255, 158, 45); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  doc.text('MAQUETTE EDITORIALE', W / 2, 40, { align: 'center' });
  doc.setTextColor(255, 255, 255); doc.setFont('times', 'bold'); doc.setFontSize(24);
  const tl = doc.splitTextToSize(clean(input.title || 'Mon livre'), maxW) as string[];
  doc.text(tl, W / 2, 70, { align: 'center' });
  if (input.subtitle) {
    doc.setFont('times', 'italic'); doc.setFontSize(12); doc.setTextColor(203, 213, 225);
    doc.text(doc.splitTextToSize(clean(input.subtitle), maxW - 10), W / 2, 72 + tl.length * 10, { align: 'center' });
  }
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(0, 130, 150);
  doc.text('Préparé avec EbookStudio V3 - ebookstudio.fr', W / 2, H - 18, { align: 'center' });

  // Sommaire
  doc.addPage(); y = M; doc.setTextColor(35, 47, 62);
  para('Sommaire', 18, 'bold', 5);
  input.outline.forEach((c) => { para(c.title, 11, 'bold', 1); if (c.summary) para(c.summary, 9.5, 'normal', 3); });

  // Chapitre 1
  doc.addPage(); y = M;
  para(input.chapterTitle || 'Chapitre 1', 16, 'bold', 6);
  input.chapterText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).forEach((p) => para(p, 11, 'normal', 3));

  // Page offre
  doc.addPage(); y = 30; doc.setTextColor(35, 47, 62);
  para('Et maintenant, la suite de votre livre ?', 16, 'bold', 6);
  para("Vous venez de lire le chapitre 1. Avec EbookStudio V3, vous écrivez les chapitres suivants, créez votre couverture et préparez votre publication sur Amazon KDP.", 11, 'normal', 6);
  para('Débutant 19 €/mois  |  Auteur 29 €/mois  |  Édition VIP 59 €/mois', 10.5, 'bold', 3);
  para('Sans engagement. Vous utilisez votre propre clé IA (Gemini ou OpenAI).', 9.5, 'italic', 8);
  ensure(14);
  doc.setFillColor(0, 130, 150); doc.roundedRect(M, y, maxW, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
  doc.text('Découvrir les formules : ebookstudio.fr/formules', W / 2, y + 7.8, { align: 'center' });
  doc.link(M, y, maxW, 12, { url: 'https://ebookstudio.fr/formules?src=essai-pdf' });

  return doc.output('blob');
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
