import standingScene from '@/assets/mockup-standing-scene.jpg';
import handScene from '@/assets/mockup-hand-scene.jpg';
import deskScene from '@/assets/mockup-desk-oak-scene.jpg';
import deskModernScene from '@/assets/mockup-desk-modern-scene.jpg';
import deskWalnutScene from '@/assets/mockup-desk-walnut-scene.jpg';
import readerScene from '@/assets/mockup-reader-scene.jpg';
import stackScene from '@/assets/mockup-stack-scene.jpg';

export type MockupModel = 'standing' | 'hand' | 'desk' | 'desk-modern' | 'desk-walnut' | 'reader' | 'stack';
type Point = [number, number];
type Quad = [Point, Point, Point, Point];
// Coordinates measured on the photographs at 1024 × 768, clockwise from top left.
type Scene = { src: string; faces: Quad[] };
export const MOCKUP_MODELS: { id: MockupModel; label: string; desc: string; preview: string }[] = [
  { id: 'standing', label: 'Livre broché debout', desc: 'Pierre claire · lumière naturelle', preview: standingScene },
  { id: 'hand', label: 'Livre tenu en main', desc: 'Portrait de lecteur · maille et papier', preview: handScene },
  { id: 'desk', label: 'Table en chêne clair', desc: 'Coin lecture cosy · lumière du jour', preview: deskScene },
  { id: 'desk-modern', label: 'Bureau d’écrivain', desc: 'Bois clair · style épuré moderne', preview: deskModernScene },
  { id: 'desk-walnut', label: 'Table en noyer', desc: 'Bibliothèque élégante · lumière chaude', preview: deskWalnutScene },
  { id: 'reader', label: 'Liseuse Kindle', desc: 'Coin lecture · lin et céramique', preview: readerScene },
  { id: 'stack', label: 'Duo de livres', desc: 'Collection · atelier éditorial', preview: stackScene },
];
const deskFace: Quad = [[297, 109], [684, 96], [683, 663], [297, 638]];
const scenes: Record<MockupModel, Scene> = {
  standing: { src: standingScene, faces: [[[286, 64], [696, 42], [697, 678], [287, 658]]] },
  hand: { src: handScene, faces: [[[384, 126], [681, 123], [681, 588], [385, 572]]] },
  desk: { src: deskScene, faces: [deskFace] },
  'desk-modern': { src: deskModernScene, faces: [deskFace] },
  'desk-walnut': { src: deskWalnutScene, faces: [deskFace] },
  reader: { src: readerScene, faces: [[[359, 142], [670, 142], [670, 569], [360, 569]]] },
  stack: { src: stackScene, faces: [[[172, 200], [448, 196], [449, 642], [172, 628]], [[552, 133], [878, 116], [877, 667], [552, 641]]] },
};

export async function loadCover(src: string): Promise<HTMLImageElement> {
  let objectUrl: string | undefined;
  if (!src.startsWith('data:') && !src.startsWith('blob:')) {
    const response = await fetch(src);
    if (!response.ok) throw new Error('Impossible de charger cette image.');
    objectUrl = URL.createObjectURL(await response.blob());
  }
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Image illisible.'));
      image.src = objectUrl || src;
    });
  } finally { if (objectUrl) URL.revokeObjectURL(objectUrl); }
}
const sceneCache = new Map<string, Promise<HTMLImageElement>>();
function loadScene(src: string) {
  const cached = sceneCache.get(src);
  if (cached) return cached;
  const pending = loadCover(src).catch((error) => { sceneCache.delete(src); throw error; });
  sceneCache.set(src, pending);
  return pending;
}

/** Inverse homography sampled once per output pixel: no triangle seams across lettering. */
function projectCover(ctx: CanvasRenderingContext2D, texture: HTMLCanvasElement, quad: Quad) {
  const [p0, p1, p2, p3] = quad;
  const dx1 = p1[0] - p2[0], dx2 = p3[0] - p2[0];
  const dy1 = p1[1] - p2[1], dy2 = p3[1] - p2[1];
  const dx3 = p0[0] - p1[0] + p2[0] - p3[0], dy3 = p0[1] - p1[1] + p2[1] - p3[1];
  const det = dx1 * dy2 - dx2 * dy1;
  const g = det ? (dx3 * dy2 - dx2 * dy3) / det : 0;
  const h = det ? (dx1 * dy3 - dx3 * dy1) / det : 0;
  const a = p1[0] - p0[0] + g * p1[0], b = p3[0] - p0[0] + h * p3[0], c = p0[0];
  const d = p1[1] - p0[1] + g * p1[1], e = p3[1] - p0[1] + h * p3[1], f = p0[1];
  const inverse = [e - f * h, c * h - b, b * f - c * e, f * g - d, a - c * g, c * d - a * f, d * h - e * g, b * g - a * h, a * e - b * d];
  const left = Math.floor(Math.min(...quad.map(p => p[0]))), top = Math.floor(Math.min(...quad.map(p => p[1])));
  const width = Math.ceil(Math.max(...quad.map(p => p[0]))) - left;
  const height = Math.ceil(Math.max(...quad.map(p => p[1]))) - top;
  const layer = document.createElement('canvas'); layer.width = width; layer.height = height;
  const target = layer.getContext('2d'), sourceContext = texture.getContext('2d');
  if (!target || !sourceContext) throw new Error('Dessin indisponible.');
  const source = sourceContext.getImageData(0, 0, texture.width, texture.height).data;
  const result = target.createImageData(width, height), out = result.data;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const X = x + left + 0.5, Y = y + top + 0.5;
    const den = inverse[6] * X + inverse[7] * Y + inverse[8];
    const u = (inverse[0] * X + inverse[1] * Y + inverse[2]) / den;
    const v = (inverse[3] * X + inverse[4] * Y + inverse[5]) / den;
    if (u < 0 || v < 0 || u > 1 || v > 1) continue;
    const sx = u * (texture.width - 1), sy = v * (texture.height - 1);
    const x0 = Math.floor(sx), y0 = Math.floor(sy), x1 = Math.min(x0 + 1, texture.width - 1), y1 = Math.min(y0 + 1, texture.height - 1);
    const fx = sx - x0, fy = sy - y0, index = (y * width + x) * 4;
    for (let channel = 0; channel < 3; channel++) {
      out[index + channel] = source[(y0 * texture.width + x0) * 4 + channel] * (1 - fx) * (1 - fy)
        + source[(y0 * texture.width + x1) * 4 + channel] * fx * (1 - fy)
        + source[(y1 * texture.width + x0) * 4 + channel] * (1 - fx) * fy
        + source[(y1 * texture.width + x1) * 4 + channel] * fx * fy;
    }
    out[index + 3] = 255;
  }
  target.putImageData(result, 0, 0); ctx.drawImage(layer, left, top);
}
function facePath(ctx: CanvasRenderingContext2D, quad: Quad) {
  ctx.beginPath(); quad.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
}
function placeCover(ctx: CanvasRenderingContext2D, cover: HTMLImageElement, scene: HTMLImageElement, quad: Quad) {
  const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const width = (distance(quad[0], quad[1]) + distance(quad[3], quad[2])) / 2;
  const height = (distance(quad[0], quad[3]) + distance(quad[1], quad[2])) / 2;
  const texture = document.createElement('canvas');
  texture.width = Math.round(width * 2); texture.height = Math.round(height * 2);
  const surface = texture.getContext('2d'); if (!surface) throw new Error('Dessin indisponible.');
  surface.drawImage(cover, 0, 0, 1, 1);
  const pixel = surface.getImageData(0, 0, 1, 1).data;
  surface.fillStyle = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
  surface.fillRect(0, 0, texture.width, texture.height);
  const fit = Math.min(texture.width / cover.naturalWidth, texture.height / cover.naturalHeight);
  const w = cover.naturalWidth * fit, h = cover.naturalHeight * fit;
  surface.drawImage(cover, (texture.width - w) / 2, (texture.height - h) / 2, w, h);
  ctx.save(); facePath(ctx, quad); ctx.clip();
  projectCover(ctx, texture, quad);
  // Reuse the photograph's actual paper texture and lighting, rather than painting fake reflections.
  ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.72;
  ctx.drawImage(scene, 0, 0, 1600, 1200);
  ctx.restore();
}

/** Render offscreen first so late image loads never replace a newer model or export stale content. */
export async function renderMockup(canvas: HTMLCanvasElement, cover: HTMLImageElement, model: MockupModel): Promise<void> {
  const spec = scenes[model], photo = await loadScene(spec.src);
  const frame = document.createElement('canvas'); frame.width = 1600; frame.height = 1200;
  const ctx = frame.getContext('2d'); if (!ctx) throw new Error('Dessin indisponible.');
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(photo, 0, 0, 1600, 1200);
  for (const face of spec.faces) {
    const quad = face.map(([x, y]): Point => [x * 1600 / 1024, y * 1200 / 768]) as Quad;
    placeCover(ctx, cover, photo, quad);
  }
  if (model === 'hand') {
    // The photographed supporting thumb is in front of the paper: retain its original pixels.
    ctx.save();
    ctx.beginPath();
    const points: Point[] = [[383, 569], [407, 567], [433, 570], [452, 576], [470, 585], [471, 604], [380, 604]];
    points.forEach(([x, y], i) => i ? ctx.lineTo(x * 1.5625, y * 1.5625) : ctx.moveTo(x * 1.5625, y * 1.5625));
    ctx.closePath(); ctx.clip(); ctx.drawImage(photo, 0, 0, 1600, 1200); ctx.restore();
  }
  canvas.width = 1600; canvas.height = 1200;
  const output = canvas.getContext('2d'); if (!output) throw new Error('Dessin indisponible.');
  output.drawImage(frame, 0, 0);
}
export const canvasToBlob = (canvas: HTMLCanvasElement, type: 'image/png' | 'image/jpeg') =>
  new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Export impossible.')), type, 0.96));
