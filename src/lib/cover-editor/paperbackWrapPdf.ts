import { jsPDF } from 'jspdf';

/** Épaisseur KDP par page (pouces) selon le papier. */
export const PAPER_INCH_PER_PAGE = { blanc: 0.002252, creme: 0.0025, couleur: 0.002347 } as const;
export type Paper = keyof typeof PAPER_INCH_PER_PAGE;
export const TRIMS = { '5x8': [5, 8], '5.5x8.5': [5.5, 8.5], '6x9': [6, 9], '8.5x11': [8.5, 11] } as const;
export type Trim = keyof typeof TRIMS;
const BLEED = 0.125, SLUG = 0.375, DPI = 300;

export function wrapGeometry(trim: Trim, pages: number, paper: Paper) {
  const [tw, th] = TRIMS[trim];
  const spine = Math.max(0, pages) * PAPER_INCH_PER_PAGE[paper];
  return { tw, th, spine, width: 2 * tw + spine + 2 * BLEED, height: th + 2 * BLEED, spineText: pages >= 79 };
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const out: string[] = [];
  for (const para of text.split(/\n+/)) {
    let cur = '';
    for (const w of para.split(/\s+/).filter(Boolean)) { const t = cur ? `${cur} ${w}` : w; if (ctx.measureText(t).width > max && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur); out.push('');
  }
  return out;
}

export interface WrapInput {
  front: HTMLCanvasElement; trim: Trim; pages: number; paper: Paper; marks: boolean;
  title: string; author: string; backText: string; bg: string; textColor: string; accent: string;
}

export function renderWrapCanvas(i: WrapInput): HTMLCanvasElement {
  const g = wrapGeometry(i.trim, i.pages, i.paper);
  const m = i.marks ? SLUG : 0;
  const px = (v: number) => Math.round(v * DPI);
  const c = document.createElement('canvas'); c.width = px(g.width + 2 * m); c.height = px(g.height + 2 * m);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, c.width, c.height);
  const ox = px(m), oy = px(m), W = px(g.width), H = px(g.height);
  ctx.fillStyle = i.bg; ctx.fillRect(ox, oy, W, H);
  // Première de couverture (droite), image recadrée pour remplir zone + fond perdu.
  const fx = ox + px(BLEED + g.tw + g.spine), fw = px(g.tw + BLEED), fh = H;
  const s = Math.max(fw / i.front.width, fh / i.front.height);
  ctx.save(); ctx.beginPath(); ctx.rect(fx, oy, fw, fh); ctx.clip();
  ctx.drawImage(i.front, fx + (fw - i.front.width * s) / 2, oy + (fh - i.front.height * s) / 2, i.front.width * s, i.front.height * s); ctx.restore();
  // Dos
  const sx = ox + px(BLEED + g.tw), sw = px(g.spine);
  ctx.fillStyle = i.accent; ctx.fillRect(sx, oy, sw, H);
  if (g.spineText && sw > 0) {
    ctx.save(); ctx.translate(sx + sw / 2, oy + H / 2); ctx.rotate(Math.PI / 2);
    const fs = Math.min(sw * 0.55, 90); ctx.font = `800 ${fs}px Montserrat, Arial, sans-serif`; ctx.fillStyle = readableOn(i.accent); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // Titre au milieu du dos, nom d'auteur séparé en bas du dos.
    ctx.fillText(i.title.toUpperCase().slice(0, 70), -H * 0.06, 0);
    ctx.font = `600 ${fs * 0.8}px Montserrat, Arial, sans-serif`; ctx.textAlign = 'right';
    ctx.fillText(i.author.toUpperCase().slice(0, 40), H / 2 - px(BLEED + 0.4), 0); ctx.restore();
  }
  // Quatrième (gauche) : texte + emplacement code-barres KDP (2" × 1.2", bas droite).
  const bx = ox + px(BLEED + 0.5), by = oy + px(BLEED + 0.7), bw = px(g.tw - 1);
  ctx.fillStyle = readableOn(i.bg); ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.font = `800 ${px(0.28)}px Montserrat, Arial, sans-serif`;
  wrapLines(ctx, i.title, bw).filter(Boolean).slice(0, 3).forEach((l, k) => ctx.fillText(l, bx, by + k * px(0.36)));
  ctx.font = `400 ${px(0.15)}px Georgia, serif`; let y = by + px(1.4);
  for (const l of wrapLines(ctx, i.backText || '', bw)) { if (y > oy + H - px(BLEED + 2.1)) break; ctx.fillText(l, bx, y); y += px(0.24); }
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(ox + px(BLEED + g.tw - 0.25 - 2), oy + H - px(BLEED + 0.25 + 1.2), px(2), px(1.2));
  // Repères de coupe et de pli (dans la marge, hors fond perdu).
  if (i.marks) {
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 3; const L = px(0.25), gap = px(0.06);
    const xs = [ox + px(BLEED), ox + W - px(BLEED)], ys = [oy + px(BLEED), oy + H - px(BLEED)];
    for (const x of xs) for (const yy of ys) {
      ctx.beginPath(); ctx.moveTo(x, yy < c.height / 2 ? oy - gap : oy + H + gap); ctx.lineTo(x, yy < c.height / 2 ? oy - gap - L : oy + H + gap + L); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x < c.width / 2 ? ox - gap : ox + W + gap, yy); ctx.lineTo(x < c.width / 2 ? ox - gap - L : ox + W + gap + L, yy); ctx.stroke();
    }
    ctx.setLineDash([12, 10]);
    for (const x of [sx, sx + sw]) { ctx.beginPath(); ctx.moveTo(x, oy - gap); ctx.lineTo(x, oy - gap - L); ctx.moveTo(x, oy + H + gap); ctx.lineTo(x, oy + H + gap + L); ctx.stroke(); }
    ctx.setLineDash([]);
  }
  return c;
}

export function buildPaperbackPdf(i: WrapInput): Blob {
  const g = wrapGeometry(i.trim, i.pages, i.paper);
  const m = i.marks ? SLUG : 0;
  const c = renderWrapCanvas(i);
  const wIn = g.width + 2 * m, hIn = g.height + 2 * m;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [wIn, hIn], compress: true });
  pdf.addImage(c.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, wIn, hIn);
  return pdf.output('blob');
}

/** Texte noir ou blanc selon la clarté du fond, pour qu'il reste toujours lisible. */
export function readableOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim()); if (!m) return '#FFFFFF';
  const n = parseInt(m[1], 16); const l = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return l > 0.6 ? '#111111' : '#FFFFFF';
}
