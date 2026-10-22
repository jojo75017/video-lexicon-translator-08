/**
 * Exports VC Books au gabarit du manuscrit modèle « Le Petit Cabinet » :
 * page de titre, mentions, Bienvenue, Comment profiter, parcours des rubriques,
 * pauses (PAUSE 001 / 100, rubrique, titre, 3 paragraphes, encart gris, question,
 * renvoi), Réponses par groupes de dix, mot de l’auteur, remerciements, avis.
 */
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ShadingType, BorderStyle } from 'docx';
import { jsPDF } from 'jspdf';
import type { VCPause } from './vcBooksWriter';

/** Dimensions en mm et marges du modèle (intérieur 18, extérieur 15, haut/bas 17). */
export const VC_FORMATS: Record<string, { w: number; h: number; label: string }> = {
  poche: { w: 127, h: 203.2, label: 'Poche 12,7 × 20,3 cm' },
  'demi-lettre': { w: 139.7, h: 215.9, label: 'Demi-lettre 14 × 21,6 cm' },
  '6x9': { w: 152.4, h: 228.6, label: '6 × 9 pouces' },
};
export const VC_MARGINS = { inside: 18, outside: 15, top: 17, bottom: 17 };

export interface VCExportBook { title: string; subtitle: string; author_name: string; format: string; pauses: VCPause[] }

type Block =
  | { t: 'break' }
  | { t: 'center'; text: string; size: number; bold?: boolean; italic?: boolean; gap?: number }
  | { t: 'h1'; text: string }
  | { t: 'label'; text: string }
  | { t: 'title'; text: string }
  | { t: 'p'; text: string; italic?: boolean }
  | { t: 'box'; label: string; text: string }
  | { t: 'question'; text: string };

const pad = (n: number) => String(n).padStart(3, '0');
const isGame = (p: VCPause, i: number, total: number) => (p.kind ? p.kind === 'jeu' : i >= Math.round(total * 0.6));
const paras = (s: string) => s.split(/\n\s*\n|\n/).map((x) => x.trim()).filter(Boolean);

/** Rubriques consécutives : nom, première et dernière pause. */
export function vcSections(pauses: VCPause[]) {
  const out: { name: string; from: number; to: number }[] = [];
  pauses.forEach((p, i) => {
    const name = p.section || `Pauses ${Math.floor(i / 10) * 10 + 1} à ${Math.floor(i / 10) * 10 + 10}`;
    const last = out[out.length - 1];
    if (last && last.name === name) last.to = i + 1; else out.push({ name, from: i + 1, to: i + 1 });
  });
  return out;
}

export function buildVCBlocks(book: VCExportBook): Block[] {
  const n = book.pauses.length;
  const author = book.author_name || 'L’auteur';
  const year = new Date().getFullYear();
  const b: Block[] = [];
  b.push({ t: 'center', text: book.title, size: 22, bold: true, gap: 60 });
  if (book.subtitle) b.push({ t: 'center', text: book.subtitle, size: 12, italic: true, gap: 8 });
  b.push({ t: 'center', text: author, size: 13, gap: 20 });
  b.push({ t: 'center', text: 'Une édition pour les petites pauses', size: 10, italic: true, gap: 40 });
  b.push({ t: 'break' });
  b.push({ t: 'p', text: `Première édition française • ${year}` });
  b.push({ t: 'p', text: `Texte préparé pour ${author}. Les anecdotes sont reformulées ; les scènes humoristiques et les situations de jeu sont imaginaires.` });
  b.push({ t: 'p', text: 'Cette lecture de divertissement ne remplace pas un conseil spécialisé. Les faits, les définitions et les ordres de grandeur peuvent être précisés par de nouvelles recherches.' });
  b.push({ t: 'p', text: 'Pour le plaisir de comprendre, de sourire et de tourner la page.', italic: true });
  b.push({ t: 'break' });
  b.push({ t: 'h1', text: 'Bienvenue dans le petit cabinet' });
  b.push({ t: 'p', text: `Ce livre rassemble ${n} pauses indépendantes. On peut entrer ici avec une question et ressortir avec une découverte inattendue, un sourire ou une bonne raison de ne plus faire confiance à sa première réponse.` });
  b.push({ t: 'p', text: 'Les encarts gris apportent une plaisanterie ou un indice. La question de fin permet de faire durer un peu la curiosité. Ses réponses sont regroupées après les pauses.' });
  b.push({ t: 'p', text: 'Vous n’avez rien à remplir et aucun classement à défendre. Le livre peut rester près d’un fauteuil ou dans les toilettes. La pièce est petite ; le monde à découvrir reste immense.' });
  b.push({ t: 'break' });
  b.push({ t: 'h1', text: `Comment profiter de ces ${n} pauses` });
  b.push({ t: 'p', text: 'Ouvrez à la première page qui vous attire. Chaque numéro possède son propre sujet, sans chapitre précédent à connaître.' });
  b.push({ t: 'p', text: 'Lisez d’abord le texte. Dans l’encart gris, le sourire signale une scène humoristique ; pour les jeux, l’ampoule propose une aide facultative. Vous pouvez cacher cet indice avec la main.' });
  b.push({ t: 'p', text: 'Essayez ensuite la question. Toutes les solutions se trouvent dans la partie Réponses, classées par groupes de dix. Le bon rythme est le vôtre.' });
  b.push({ t: 'break' });
  b.push({ t: 'h1', text: 'Votre parcours' });
  b.push({ t: 'p', text: 'Choisissez votre rubrique ou ouvrez au hasard. Chaque pause se lit indépendamment.', italic: true });
  for (const s of vcSections(book.pauses)) {
    b.push({ t: 'title', text: s.name });
    b.push({ t: 'p', text: `Pauses ${s.from} à ${s.to}` });
  }
  book.pauses.forEach((p, i) => {
    b.push({ t: 'break' });
    b.push({ t: 'label', text: `PAUSE ${pad(i + 1)} / ${pad(n)}` });
    if (p.section) b.push({ t: 'label', text: p.section });
    b.push({ t: 'title', text: p.title });
    paras(p.text).forEach((x) => b.push({ t: 'p', text: x }));
    if (p.encart) b.push({ t: 'box', label: isGame(p, i, n) ? 'Un petit coup de pouce' : 'Le sourire du cabinet', text: p.encart });
    if (p.question) {
      b.push({ t: 'question', text: p.question });
      b.push({ t: 'p', text: `Réponse ${i + 1} dans la partie Réponses.`, italic: true });
    }
  });
  const answered = book.pauses.map((p, i) => ({ i, a: p.answer })).filter((x) => x.a);
  if (answered.length) {
    b.push({ t: 'break' });
    b.push({ t: 'h1', text: 'Réponses' });
    for (let g = 0; g < n; g += 10) {
      const group = answered.filter((x) => x.i >= g && x.i < g + 10);
      if (!group.length) continue;
      b.push({ t: 'title', text: `Les réponses de ${g + 1} à ${Math.min(g + 10, n)}` });
      group.forEach((x) => b.push({ t: 'p', text: `${x.i + 1}. ${x.a}` }));
    }
  }
  b.push({ t: 'break' });
  b.push({ t: 'h1', text: 'Le mot de l’auteur' });
  b.push({ t: 'p', text: 'Merci d’avoir accueilli ces pages dans vos moments de pause. Continuez à poser des questions, y compris celles qui semblent trop petites. Elles réservent parfois les meilleures découvertes.' });
  b.push({ t: 'p', text: author, italic: true });
  b.push({ t: 'h1', text: 'Les remerciements' });
  b.push({ t: 'p', text: 'Merci à vous qui avez ouvert ce livre et décidé de lui accorder un peu de votre temps. Un ouvrage de petites pauses prend vie à chaque fois qu’une page est lue, qu’une question est tentée ou qu’une anecdote trouve une nouvelle conversation.' });
  b.push({ t: 'h1', text: 'Votre avis si vous le souhaitez' });
  b.push({ t: 'p', text: 'Si ce livre a accompagné vos pauses, vous êtes libre de laisser un avis sur sa page Amazon. Cette démarche est entièrement facultative.' });
  return b;
}

const mmToTwip = (mm: number) => Math.round((mm / 25.4) * 1440);
const safeName = (t: string) => (t || 'livre').replace(/[^\p{L}\p{N} _-]+/gu, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'livre';

export async function buildVCDocx(book: VCExportBook): Promise<Blob> {
  const f = VC_FORMATS[book.format] ?? VC_FORMATS['6x9'];
  const children: Paragraph[] = [];
  let pendingBreak = false;
  const add = (p: Omit<ConstructorParameters<typeof Paragraph>[0] & object, 'pageBreakBefore'>) => {
    children.push(new Paragraph({ ...(p as object), pageBreakBefore: pendingBreak }));
    pendingBreak = false;
  };
  for (const x of buildVCBlocks(book)) {
    if (x.t === 'break') { pendingBreak = children.length > 0; continue; }
    if (x.t === 'center') add({ alignment: AlignmentType.CENTER, spacing: { before: (x.gap ?? 0) * 40 }, children: [new TextRun({ text: x.text, size: x.size * 2, bold: x.bold, italics: x.italic })] });
    if (x.t === 'h1') add({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 240 }, children: [new TextRun(x.text)] });
    if (x.t === 'label') add({ spacing: { after: 80 }, children: [new TextRun({ text: x.text, size: 17, bold: true, color: '555555' })] });
    if (x.t === 'title') add({ heading: HeadingLevel.HEADING_2, spacing: { before: 120, after: 200 }, children: [new TextRun(x.text)] });
    if (x.t === 'p') add({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 140 }, children: [new TextRun({ text: x.text, italics: x.italic })] });
    if (x.t === 'box') {
      const border = { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 4 };
      const box = { shading: { type: ShadingType.CLEAR, fill: 'EDEDED', color: 'auto' }, border: { top: border, bottom: border, left: border, right: border } };
      add({ ...box, spacing: { before: 200 }, children: [new TextRun({ text: x.label, bold: true })] });
      add({ ...box, alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 }, children: [new TextRun(x.text)] });
    }
    if (x.t === 'question') add({ spacing: { before: 160, after: 80 }, children: [new TextRun({ text: x.text, bold: true })] });
  }
  const doc = new Document({
    styles: { default: { document: { run: { font: 'Georgia', size: 22 } } } },
    sections: [{
      properties: { page: { size: { width: mmToTwip(f.w), height: mmToTwip(f.h) }, margin: { top: mmToTwip(VC_MARGINS.top), bottom: mmToTwip(VC_MARGINS.bottom), left: mmToTwip(VC_MARGINS.inside), right: mmToTwip(VC_MARGINS.outside), gutter: 0 } } },
      children,
    }],
  });
  return Packer.toBlob(doc);
}

export function buildVCPdf(book: VCExportBook): Blob {
  const f = VC_FORMATS[book.format] ?? VC_FORMATS['6x9'];
  const pdf = new jsPDF({ unit: 'mm', format: [f.w, f.h] });
  const width = f.w - VC_MARGINS.inside - VC_MARGINS.outside;
  const maxY = f.h - VC_MARGINS.bottom;
  let page = 1;
  let y = VC_MARGINS.top + 4;
  const left = () => (page % 2 === 1 ? VC_MARGINS.inside : VC_MARGINS.outside);
  const footer = () => { if (page > 2) { pdf.setFont('times', 'normal'); pdf.setFontSize(9); pdf.setTextColor(0); pdf.text(String(page), f.w / 2, f.h - 8, { align: 'center' }); } };
  const newPage = () => { footer(); pdf.addPage([f.w, f.h]); page += 1; y = VC_MARGINS.top + 4; };
  const ensure = (h: number) => { if (y + h > maxY) newPage(); };
  const lines = (text: string, w = width) => pdf.splitTextToSize(text, w) as string[];
  let started = false;

  for (const x of buildVCBlocks(book)) {
    if (x.t === 'break') { if (started) newPage(); continue; }
    started = true;
    pdf.setTextColor(0);
    if (x.t === 'center') {
      pdf.setFont('times', x.bold ? 'bold' : x.italic ? 'italic' : 'normal'); pdf.setFontSize(x.size);
      y += x.gap ?? 0; const l = lines(x.text); ensure(l.length * x.size * 0.45);
      pdf.text(l, f.w / 2, y, { align: 'center' }); y += l.length * x.size * 0.45 + 2;
    }
    if (x.t === 'h1') { pdf.setFont('times', 'bold'); pdf.setFontSize(16); const l = lines(x.text); ensure(l.length * 7 + 4); pdf.text(l, left(), y); y += l.length * 7 + 4; }
    if (x.t === 'label') { pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8); pdf.setTextColor(90); ensure(5); pdf.text(x.text.toUpperCase(), left(), y); y += 5; }
    if (x.t === 'title' || x.t === 'question') {
      pdf.setFont('times', 'bold'); pdf.setFontSize(x.t === 'title' ? 13.5 : 11);
      const l = lines(x.text); ensure(l.length * 5.5 + 3); y += x.t === 'question' ? 2 : 1;
      pdf.text(l, left(), y); y += l.length * 5.5 + 2;
    }
    if (x.t === 'p') {
      pdf.setFont('times', x.italic ? 'italic' : 'normal'); pdf.setFontSize(10.5);
      const l = lines(x.text);
      l.forEach((line, k) => { ensure(5); pdf.text(line, left(), y, k === l.length - 1 ? {} : { align: 'justify', maxWidth: width }); y += 4.8; });
      y += 2;
    }
    if (x.t === 'box') {
      pdf.setFont('times', 'normal'); pdf.setFontSize(10);
      const l = lines(x.text, width - 8); const h = l.length * 4.6 + 13;
      ensure(h + 2); y += 1;
      pdf.setFillColor(237, 237, 237); pdf.setDrawColor(190); pdf.rect(left(), y, width, h, 'FD');
      pdf.setFont('times', 'bold'); pdf.text(x.label, left() + 4, y + 6);
      pdf.setFont('times', 'normal'); pdf.text(l, left() + 4, y + 11.5);
      y += h + 4;
    }
  }
  footer();
  return pdf.output('blob');
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export const vcFileName = (title: string, ext: string) => `${safeName(title)}.${ext}`;
