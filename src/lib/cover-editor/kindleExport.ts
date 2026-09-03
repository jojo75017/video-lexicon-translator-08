/**
 * Étape B — export JPEG Kindle de la première de couverture.
 *
 * Rendu 100 % local dans le navigateur :
 *  - aucun appel IA, aucun crédit débité, aucun envoi réseau ;
 *  - dimensions exactes 1600 × 2560 px, image aplatie, MIME image/jpeg ;
 *  - qualité réduite progressivement uniquement si le fichier dépasse 5 Mo ;
 *  - aucun repère, aucune poignée, aucune bordure de sélection : le canevas
 *    d'export est reconstruit de zéro, il n'emprunte rien au DOM de l'éditeur ;
 *  - l'URL signée du fond n'est utilisée qu'en mémoire, jamais persistée.
 */
import {
  DEFAULT_FRONT_BACKGROUND,
  type FrontComposition,
} from '@/lib/cover-editor/frontComposition';

/** Dimensions imposées par Amazon pour une couverture Kindle. */
export const KINDLE_EXPORT_WIDTH = 1600;
export const KINDLE_EXPORT_HEIGHT = 2560;

/** Taille maximale acceptée (5 Mo). */
export const KINDLE_MAX_BYTES = 5 * 1024 * 1024;

const QUALITY_STEPS = [0.95, 0.9, 0.85, 0.78, 0.7, 0.6, 0.5, 0.42];

/**
 * Nom de fichier sûr : sans accent, sans espace, sans emoji ni caractère spécial.
 */
export function kindleFileName(title: string | null | undefined): string {
  const base = (title ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
  return `${base || 'couverture'}-couverture-kindle.jpg`;
}

const loadImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('illustration illisible'));
    el.src = url;
  });

const wrapLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] => {
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

const toBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Le fichier JPEG n’a pas pu être créé.'))),
      'image/jpeg',
      quality,
    );
  });

export interface KindleExportResult {
  blob: Blob;
  fileName: string;
  width: number;
  height: number;
  bytes: number;
  quality: number;
}

/**
 * Compose la couverture aux dimensions Kindle exactes et renvoie un JPEG aplati.
 * `backgroundUrl` est une URL signée temporaire, utilisée uniquement en mémoire.
 */
export async function renderKindleCoverJpeg(
  composition: FrontComposition,
  backgroundUrl: string | null,
  bookTitle?: string | null,
): Promise<KindleExportResult> {
  const canvas = document.createElement('canvas');
  canvas.width = KINDLE_EXPORT_WIDTH;
  canvas.height = KINDLE_EXPORT_HEIGHT;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canevas indisponible dans ce navigateur.');

  // Fond opaque : garantit une image aplatie, jamais de transparence.
  ctx.fillStyle = composition.backgroundColor || DEFAULT_FRONT_BACKGROUND;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (backgroundUrl) {
    const img = await loadImage(backgroundUrl);
    // object-fit: cover, identique à l'aperçu de l'éditeur
    const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * ratio;
    const h = img.height * ratio;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }

  // Mise à l'échelle depuis les coordonnées de composition vers 1600 × 2560.
  const sx = canvas.width / (composition.canvas.width || KINDLE_EXPORT_WIDTH);
  const sy = canvas.height / (composition.canvas.height || KINDLE_EXPORT_HEIGHT);

  ctx.textBaseline = 'top';
  for (const layer of composition.layers) {
    if (!layer.text.trim()) continue;
    const fontSize = layer.fontSize * sy;
    const weight = layer.bold ? '700' : '400';
    const style = layer.italic ? 'italic' : 'normal';
    ctx.font = `${style} ${weight} ${fontSize}px ${layer.fontFamily}`;
    ctx.fillStyle = layer.color;
    ctx.textAlign = layer.align === 'center' ? 'center' : layer.align === 'right' ? 'right' : 'left';

    const boxX = layer.x * sx;
    const boxWidth = layer.width * sx;
    const anchorX =
      layer.align === 'center'
        ? boxX + boxWidth / 2
        : layer.align === 'right'
          ? boxX + boxWidth
          : boxX;

    const lines = wrapLines(ctx, layer.text, boxWidth);
    let y = layer.y * sy;
    for (const line of lines) {
      ctx.fillText(line, anchorX, y);
      y += fontSize * layer.lineHeight;
    }
  }

  // Qualité dégradée progressivement seulement si nécessaire.
  let blob = await toBlob(canvas, QUALITY_STEPS[0]);
  let quality = QUALITY_STEPS[0];
  for (let i = 1; i < QUALITY_STEPS.length && blob.size > KINDLE_MAX_BYTES; i += 1) {
    quality = QUALITY_STEPS[i];
    blob = await toBlob(canvas, quality);
  }
  if (blob.size > KINDLE_MAX_BYTES) {
    throw new Error('Le fichier dépasse 5 Mo même à qualité réduite.');
  }

  return {
    blob,
    fileName: kindleFileName(bookTitle ?? composition.layers.find((l) => l.role === 'title')?.text),
    width: KINDLE_EXPORT_WIDTH,
    height: KINDLE_EXPORT_HEIGHT,
    bytes: blob.size,
    quality,
  };
}

/** Déclenche le téléchargement local du blob. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // laisse le temps au navigateur de démarrer le téléchargement
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
