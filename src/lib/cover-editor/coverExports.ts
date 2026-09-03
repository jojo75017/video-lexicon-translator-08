/**
 * Exports complets de la première de couverture.
 *
 * Rendu 100 % local dans le navigateur :
 *  - aucun appel IA, aucun crédit débité, aucune copie publique ;
 *  - aucun repère, aucune poignée, aucune bordure de sélection : le canevas
 *    d'export est reconstruit de zéro, il n'emprunte rien au DOM de l'éditeur ;
 *  - l'URL signée du fond n'est utilisée qu'en mémoire, jamais persistée ;
 *  - les polices sont attendues avant chaque rendu (`ensureFontsReady`).
 */
import { jsPDF } from 'jspdf';

import {
  drawFrontComposition,
  type FrontComposition,
} from '@/lib/cover-editor/frontComposition';
import { ensureFontsReady } from '@/lib/cover-editor/coverFonts';
import { kindleFileName } from '@/lib/cover-editor/kindleExport';

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

/** Nom de fichier sûr : sans accent, sans espace, sans caractère spécial. */
export function safeFileName(title: string | null | undefined, suffix: string, ext: string): string {
  const base = (title ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
  return `${base || 'couverture'}-${suffix}.${ext}`;
}

/** Reconstruit un canevas propre aux dimensions demandées. */
export async function renderFrontCanvas(
  composition: FrontComposition,
  backgroundUrl: string | null,
  width: number,
  height: number,
): Promise<HTMLCanvasElement> {
  await ensureFontsReady(composition.layers.map((l) => l.fontFamily));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');

  const img = backgroundUrl ? await loadImage(backgroundUrl) : null;
  const sx = width / (composition.canvas.width || width);
  const sy = height / (composition.canvas.height || height);
  drawFrontComposition(ctx, composition, img, sx, sy);
  return canvas;
}

export interface CoverExportResult {
  blob: Blob;
  fileName: string;
  width: number;
  height: number;
  bytes: number;
}

/** PNG haute définition aux dimensions réelles de la composition. */
export async function exportFrontPng(
  composition: FrontComposition,
  backgroundUrl: string | null,
  bookTitle?: string | null,
): Promise<CoverExportResult> {
  const width = composition.canvas.width;
  const height = composition.canvas.height;
  const canvas = await renderFrontCanvas(composition, backgroundUrl, width, height);
  const blob = await toBlob(canvas, 'image/png');
  return {
    blob,
    fileName: safeFileName(bookTitle, 'couverture-hd', 'png'),
    width,
    height,
    bytes: blob.size,
  };
}

/**
 * PDF 300 DPI de la première de couverture, textes aplatis dans l'image
 * (aucun problème de police à l'impression). Fond perdu optionnel.
 */
export async function exportFrontPdf(
  composition: FrontComposition,
  backgroundUrl: string | null,
  options: { bookTitle?: string | null; bleedIn?: number } = {},
): Promise<CoverExportResult> {
  const dpi = 300;
  const bleedIn = options.bleedIn ?? 0.125;
  const bleedPx = Math.round(bleedIn * dpi);
  const width = composition.canvas.width + bleedPx * 2;
  const height = composition.canvas.height + bleedPx * 2;

  // Rendu agrandi pour que l'image couvre le fond perdu sans bande blanche.
  const canvas = await renderFrontCanvas(composition, backgroundUrl, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);

  const widthIn = width / dpi;
  const heightIn = height / dpi;
  const pdf = new jsPDF({
    orientation: widthIn > heightIn ? 'landscape' : 'portrait',
    unit: 'in',
    format: [widthIn, heightIn],
    compress: true,
  });
  pdf.addImage(dataUrl, 'JPEG', 0, 0, widthIn, heightIn, undefined, 'FAST');
  const blob = pdf.output('blob');
  return {
    blob,
    fileName: safeFileName(options.bookTitle, 'couverture-300dpi', 'pdf'),
    width,
    height,
    bytes: blob.size,
  };
}

/**
 * Mockup de présentation : le livre en perspective sur un fond neutre,
 * destiné aux pages de vente et aux réseaux sociaux.
 */
export async function exportFrontMockup(
  composition: FrontComposition,
  backgroundUrl: string | null,
  bookTitle?: string | null,
): Promise<CoverExportResult> {
  const source = await renderFrontCanvas(
    composition,
    backgroundUrl,
    composition.canvas.width,
    composition.canvas.height,
  );

  const W = 1600;
  const H = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');

  // Fond studio
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f6f7f9');
  bg.addColorStop(1, '#dfe3e8');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Géométrie du livre
  const bookH = Math.round(H * 0.74);
  const bookW = Math.round((bookH * source.width) / source.height);
  const x = Math.round((W - bookW) / 2 + 30);
  const y = Math.round((H - bookH) / 2);
  const spineW = Math.round(bookW * 0.09);

  // Ombre portée au sol
  ctx.save();
  ctx.filter = 'blur(18px)';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.beginPath();
  ctx.ellipse(x + bookW / 2, y + bookH + 26, bookW * 0.62, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tranche (perspective légère)
  const spine = ctx.createLinearGradient(x - spineW, 0, x, 0);
  spine.addColorStop(0, '#8d959f');
  spine.addColorStop(1, '#e9edf1');
  ctx.fillStyle = spine;
  ctx.beginPath();
  ctx.moveTo(x - spineW, y + 22);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + bookH);
  ctx.lineTo(x - spineW, y + bookH - 22);
  ctx.closePath();
  ctx.fill();

  // Première de couverture
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.35)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetX = 18;
  ctx.shadowOffsetY = 18;
  ctx.drawImage(source, x, y, bookW, bookH);
  ctx.restore();

  // Reflet vertical discret
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

export { kindleFileName };
