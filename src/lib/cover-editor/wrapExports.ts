/**
 * Rendu et téléchargements de la COUVERTURE COMPLÈTE brochée (quatrième · dos · première).
 *
 * 100 % local dans le navigateur :
 *  - aucun appel IA, aucun crédit débité, aucune copie publique ;
 *  - aucun repère ni poignée : le canevas est reconstruit de zéro ;
 *  - l'URL signée de l'illustration n'existe qu'en mémoire, jamais persistée ;
 *  - la géométrie provient exclusivement du moteur KDP déjà validé.
 */
import { jsPDF } from 'jspdf';

import { ensureFontsReady } from '@/lib/cover-editor/coverFonts';
import { safeFileName, type CoverExportResult } from '@/lib/cover-editor/coverExports';
import type { KdpPaperbackGeometry } from '@/lib/cover-editor/kdpPaperbackSpecs';
import {
  clampBrightness,
  clampOverlay,
  zoneBox,
  type WrapComposition,
} from '@/lib/cover-editor/wrapComposition';

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('illustration illisible'));
    el.src = url;
  });

const toBlob = (canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Le fichier n’a pas pu être créé.'))),
      type,
      quality,
    );
  });

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push('');
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const candidate = `${current} ${words[i]}`;
      if (ctx.measureText(candidate).width <= maxWidth) current = candidate;
      else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
  }
  return lines;
};

/**
 * Dessine la couverture complète : fonds, illustration (première + fond perdu
 * extérieur), luminosité, voile de contraste, puis tous les textes.
 * Exactement le même ordre que l'aperçu de l'éditeur.
 */
export async function renderWrapCanvas(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  backgroundUrl: string | null,
  dpi = 300,
): Promise<HTMLCanvasElement> {
  await ensureFontsReady(composition.elements.map((e) => e.fontFamily));

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(geometry.fullWidthIn * dpi);
  canvas.height = Math.round(geometry.fullHeightIn * dpi);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');

  const px = (inches: number) => inches * dpi;
  const brightness = clampBrightness(composition.imageBrightness);
  const overlay = clampOverlay(composition.overlayOpacity);

  // 1. fond continu
  ctx.fillStyle = composition.background.fullColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (composition.background.mode === 'back-spine-color') {
    ctx.fillStyle = composition.background.backColor;
    ctx.fillRect(0, 0, px(geometry.bleedIn + geometry.trimWidthIn), canvas.height);
    ctx.fillStyle = composition.background.spineColor;
    ctx.fillRect(px(geometry.zones.spine.xIn), 0, px(geometry.spineWidthIn), canvas.height);
  }

  // 2. illustration sur la première + son fond perdu extérieur
  const frontX = px(geometry.zones.front.xIn);
  const frontW = px(geometry.trimWidthIn + geometry.bleedIn);
  if (backgroundUrl) {
    try {
      const img = await loadImage(backgroundUrl);
      const cover = Math.max(frontW / img.width, canvas.height / img.height);
      const w = img.width * cover;
      const h = img.height * cover;
      ctx.save();
      ctx.beginPath();
      ctx.rect(frontX, 0, frontW, canvas.height);
      ctx.clip();
      if (brightness !== 1) ctx.filter = `brightness(${brightness})`;
      ctx.drawImage(img, frontX + (frontW - w) / 2, (canvas.height - h) / 2, w, h);
      ctx.restore();
    } catch {
      /* fond uni conservé */
    }
  }

  // 3. voile de contraste sur la première (lisibilité des textes)
  if (overlay > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,${overlay})`;
    ctx.fillRect(frontX, 0, frontW, canvas.height);
    ctx.restore();
  }

  // 4. textes
  ctx.textBaseline = 'top';
  for (const el of composition.elements) {
    if (el.hidden || !el.text.trim()) continue;
    const box = zoneBox(geometry, el.zone);
    const fontPx = px(el.fontSizeIn);
    ctx.font = `${el.italic ? 'italic' : 'normal'} ${el.bold ? 700 : 400} ${fontPx}px ${el.fontFamily}`;
    ctx.fillStyle = el.color;
    ctx.textAlign = el.align === 'center' ? 'center' : el.align === 'right' ? 'right' : 'left';

    if (el.zone === 'spine') {
      const lengthPx = px(el.nWidth * box.heightIn);
      const cx = px(box.xIn + el.nx * box.widthIn);
      const cy = px(box.yIn + el.ny * box.heightIn);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 2);
      const anchorX =
        el.align === 'center' ? 0 : el.align === 'right' ? lengthPx / 2 : -lengthPx / 2;
      ctx.fillText(el.text.replace(/\n/g, ' '), anchorX, -fontPx / 2);
      ctx.restore();
      continue;
    }

    const boxX = px(box.xIn + el.nx * box.widthIn);
    const boxWidth = px(el.nWidth * box.widthIn);
    const anchorX =
      el.align === 'center' ? boxX + boxWidth / 2 : el.align === 'right' ? boxX + boxWidth : boxX;
    let y = px(box.yIn + el.ny * box.heightIn);
    for (const line of wrapLines(ctx, el.text, boxWidth)) {
      ctx.fillText(line, anchorX, y);
      y += fontPx * el.lineHeight;
    }
  }

  return canvas;
}

/** Découpe la PREMIÈRE de couverture (format fini, sans fond perdu). */
async function renderFrontOnlyCanvas(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  backgroundUrl: string | null,
  dpi = 300,
): Promise<HTMLCanvasElement> {
  const full = await renderWrapCanvas(composition, geometry, backgroundUrl, dpi);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(geometry.trimWidthIn * dpi);
  canvas.height = Math.round(geometry.trimHeightIn * dpi);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');
  ctx.drawImage(
    full,
    Math.round(geometry.zones.front.xIn * dpi),
    Math.round(geometry.bleedIn * dpi),
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  return canvas;
}

/** PDF couverture complète, 300 DPI, fond perdu inclus, textes aplatis. */
export async function exportWrapPdf(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  backgroundUrl: string | null,
  bookTitle?: string | null,
): Promise<CoverExportResult> {
  const canvas = await renderWrapCanvas(composition, geometry, backgroundUrl, 300);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [geometry.fullWidthIn, geometry.fullHeightIn],
    compress: true,
  });
  pdf.addImage(dataUrl, 'JPEG', 0, 0, geometry.fullWidthIn, geometry.fullHeightIn, undefined, 'FAST');
  const blob = pdf.output('blob');
  return {
    blob,
    fileName: safeFileName(bookTitle, 'couverture-complete-kdp-300dpi', 'pdf'),
    width: canvas.width,
    height: canvas.height,
    bytes: blob.size,
  };
}

/** PNG haute définition de la couverture complète. */
export async function exportWrapPng(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  backgroundUrl: string | null,
  bookTitle?: string | null,
): Promise<CoverExportResult> {
  const canvas = await renderWrapCanvas(composition, geometry, backgroundUrl, 300);
  const blob = await toBlob(canvas, 'image/png');
  return {
    blob,
    fileName: safeFileName(bookTitle, 'couverture-complete-hd', 'png'),
    width: canvas.width,
    height: canvas.height,
    bytes: blob.size,
  };
}

/** JPEG haute définition de la première de couverture seule. */
export async function exportWrapFrontJpeg(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  backgroundUrl: string | null,
  bookTitle?: string | null,
): Promise<CoverExportResult> {
  const canvas = await renderFrontOnlyCanvas(composition, geometry, backgroundUrl, 300);
  const blob = await toBlob(canvas, 'image/jpeg', 0.92);
  return {
    blob,
    fileName: safeFileName(bookTitle, 'premiere-de-couverture', 'jpg'),
    width: canvas.width,
    height: canvas.height,
    bytes: blob.size,
  };
}

/** Visuel de présentation : le livre en perspective sur fond studio. */
export async function exportWrapMockup(
  composition: WrapComposition,
  geometry: KdpPaperbackGeometry,
  backgroundUrl: string | null,
  bookTitle?: string | null,
): Promise<CoverExportResult> {
  const source = await renderFrontOnlyCanvas(composition, geometry, backgroundUrl, 150);

  const W = 1600;
  const H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f6f7f9');
  bg.addColorStop(1, '#dfe3e8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const bookH = Math.round(H * 0.74);
  const bookW = Math.round((bookH * source.width) / source.height);
  const x = Math.round((W - bookW) / 2 + 30);
  const y = Math.round((H - bookH) / 2);
  const spineW = Math.round(bookW * 0.09);

  ctx.save();
  ctx.filter = 'blur(18px)';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x + bookW / 2, y + bookH + 26, bookW * 0.62, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const spine = ctx.createLinearGradient(x - spineW, 0, x, 0);
  spine.addColorStop(0, composition.background.spineColor);
  spine.addColorStop(1, '#e9edf1');
  ctx.fillStyle = spine;
  ctx.beginPath();
  ctx.moveTo(x - spineW, y + 22);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + bookH);
  ctx.lineTo(x - spineW, y + bookH - 22);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.35)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetX = 18;
  ctx.shadowOffsetY = 18;
  ctx.drawImage(source, x, y, bookW, bookH);
  ctx.restore();

  const gloss = ctx.createLinearGradient(x, y, x + bookW, y);
  gloss.addColorStop(0, 'rgba(255,255,255,0.20)');
  gloss.addColorStop(0.18, 'rgba(255,255,255,0.04)');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  ctx.fillRect(x, y, bookW, bookH);

  const blob = await toBlob(canvas, 'image/jpeg', 0.92);
  return {
    blob,
    fileName: safeFileName(bookTitle, 'mockup-presentation', 'jpg'),
    width: W,
    height: H,
    bytes: blob.size,
  };
}

/** Déclenche le téléchargement local d'un export. */
export function downloadExport(result: CoverExportResult) {
  const url = URL.createObjectURL(result.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
