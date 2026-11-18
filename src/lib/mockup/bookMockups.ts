/**
 * Mockups 3D dessinés localement à partir de la vraie couverture :
 * aucun appel IA, la couverture (titre, texte) n'est jamais redessinée ni déformée.
 */
export type MockupModel = 'standing' | 'hand' | 'desk' | 'reader' | 'stack';

export const MOCKUP_MODELS: { id: MockupModel; label: string; desc: string }[] = [
  { id: 'standing', label: 'Livre broché debout', desc: 'Vue 3/4 avec tranche et ombre, idéal fiche Amazon' },
  { id: 'hand', label: 'Livre tenu en main', desc: 'Format carré pour publicités Facebook / Instagram' },
  { id: 'desk', label: 'Livre sur table en bois', desc: 'Ambiance bureau d’auteur pour réseaux et newsletters' },
  { id: 'reader', label: 'Liseuse Kindle', desc: 'Couverture affichée sur l’écran pour la version eBook' },
  { id: 'stack', label: 'Duo de livres', desc: 'Effet collection pour pages de vente' },
];

export const loadCover = async (src: string): Promise<HTMLImageElement> => {
  const blob = src.startsWith('data:') || src.startsWith('blob:') ? null : await (await fetch(src)).blob();
  const url = blob ? URL.createObjectURL(blob) : src;
  return await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error('Couverture illisible.'));
    i.src = url;
  });
};

type Ctx = CanvasRenderingContext2D;

function shadow(ctx: Ctx, cx: number, cy: number, rx: number, ry: number, a = 0.35) {
  ctx.save(); ctx.filter = 'blur(26px)'; ctx.fillStyle = `rgba(0,0,0,${a})`;
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}

/** Livre broché : pages côté droit, couverture entière, reflet de dos. */
function book(ctx: Ctx, img: HTMLImageElement, x: number, y: number, bw: number, bh: number) {
  const depth = Math.round(bw * 0.035);
  ctx.fillStyle = '#ebe6db';
  ctx.beginPath(); ctx.moveTo(x + bw, y + 6); ctx.lineTo(x + bw + depth, y + depth); ctx.lineTo(x + bw + depth, y + bh + depth - 6); ctx.lineTo(x + bw, y + bh); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d8d1c2';
  ctx.beginPath(); ctx.moveTo(x + 4, y + bh); ctx.lineTo(x + bw, y + bh); ctx.lineTo(x + bw + depth, y + bh + depth - 6); ctx.lineTo(x + depth + 4, y + bh + depth - 6); ctx.closePath(); ctx.fill();
  ctx.drawImage(img, x, y, bw, bh);
  const spine = bw * 0.06;
  const g = ctx.createLinearGradient(x, 0, x + spine, 0);
  g.addColorStop(0, 'rgba(0,0,0,0.4)'); g.addColorStop(0.5, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x, y, spine, bh);
  const s = ctx.createLinearGradient(x, y, x + bw, y + bh);
  s.addColorStop(0, 'rgba(255,255,255,0.1)'); s.addColorStop(0.5, 'rgba(255,255,255,0)'); s.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = s; ctx.fillRect(x, y, bw, bh);
}

const ratioOf = (img: HTMLImageElement) => (img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 2 / 3);

function bg(ctx: Ctx, W: number, H: number, top: string, bottom: string) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

export function renderMockup(canvas: HTMLCanvasElement, img: HTMLImageElement, model: MockupModel) {
  const W = 1600, H = model === 'hand' || model === 'reader' ? 1600 : 1200;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Dessin indisponible.');
  const r = ratioOf(img);
  ctx.clearRect(0, 0, W, H);

  if (model === 'standing') {
    bg(ctx, W, H, '#f4f1ea', '#d9d3c7');
    const bh = 960, bw = bh * r, x = (W - bw) / 2, y = 90;
    shadow(ctx, x + bw / 2 + 30, y + bh + 30, bw * 0.6, 40);
    book(ctx, img, x, y, bw, bh);
  } else if (model === 'hand') {
    bg(ctx, W, H, '#cfd8cf', '#8a9a88');
    const bh = 1100, bw = bh * r, x = (W - bw) / 2, y = 200;
    shadow(ctx, x + bw / 2, y + bh + 20, bw * 0.55, 50, 0.3);
    book(ctx, img, x, y, bw, bh);
    // mains stylisées (pouces) sur les bords
    ctx.fillStyle = '#e3b894';
    for (const side of [-1, 1]) {
      const hx = side < 0 ? x - 20 : x + bw + 20;
      ctx.beginPath(); ctx.ellipse(hx, y + bh * 0.62, 70, 150, side * 0.15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx - side * 55, y + bh * 0.55, 34, 70, side * -0.35, 0, Math.PI * 2); ctx.fill();
    }
  } else if (model === 'desk') {
    bg(ctx, W, H, '#3b2f28', '#2a211c');
    const wood = ctx.createLinearGradient(0, 700, 0, H); wood.addColorStop(0, '#8a5a36'); wood.addColorStop(1, '#5c3a22');
    ctx.fillStyle = wood; ctx.fillRect(0, 760, W, H - 760);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, 800 + i * 55); ctx.bezierCurveTo(500, 780 + i * 55, 1100, 830 + i * 55, W, 800 + i * 55); ctx.stroke(); }
    const bh = 820, bw = bh * r, x = (W - bw) / 2, y = 160;
    shadow(ctx, x + bw / 2 + 40, y + bh + 20, bw * 0.65, 36, 0.5);
    book(ctx, img, x, y, bw, bh);
  } else if (model === 'reader') {
    bg(ctx, W, H, '#e8eef2', '#b9c6cf');
    const sh = 1080, sw = sh * Math.min(r, 0.75), dw = sw + 120, dh = sh + 220, dx = (W - dw) / 2, dy = (H - dh) / 2;
    shadow(ctx, W / 2, dy + dh + 20, dw * 0.55, 40);
    ctx.fillStyle = '#1b1d21'; ctx.beginPath(); ctx.roundRect(dx, dy, dw, dh, 60); ctx.fill();
    const sx = dx + 60, sy = dy + 90;
    ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, sh);
    const fit = Math.min(sw / img.naturalWidth, sh / img.naturalHeight);
    const iw = img.naturalWidth * fit, ih = img.naturalHeight * fit;
    ctx.drawImage(img, sx + (sw - iw) / 2, sy + (sh - ih) / 2, iw, ih);
    const gl = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh); gl.addColorStop(0, 'rgba(255,255,255,0.18)'); gl.addColorStop(0.4, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl; ctx.fillRect(sx, sy, sw, sh);
  } else {
    bg(ctx, W, H, '#1f2a3a', '#0e141d');
    const bh = 860, bw = bh * r;
    shadow(ctx, W / 2, 120 + bh + 30, bw * 1.1, 46, 0.55);
    book(ctx, img, W / 2 - bw - 10, 170, bw * 0.95, bh * 0.95);
    book(ctx, img, W / 2 - bw * 0.25, 120, bw, bh);
  }
}

export const canvasToBlob = (c: HTMLCanvasElement, type: 'image/png' | 'image/jpeg') =>
  new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Export impossible.'))), type, 0.92));
