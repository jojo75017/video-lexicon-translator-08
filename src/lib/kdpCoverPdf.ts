/**
 * Génère un PDF de COUVERTURE COMPLÈTE (wrap) aux dimensions EXACTES KDP :
 *   [ 4e de couverture | dos (tranche) | 1re de couverture ]
 * Une seule page, en pouces (unit: 'in') → dimensions physiques réelles à 300 DPI.
 *
 * Formules identiques à KdpCoverStudio :
 *   spineWidth  = pages × facteur_papier
 *   totalWidth  = 2 × (trim_w + bleed) + spineWidth
 *   totalHeight = trim_h + 2 × bleed
 */
import { jsPDF } from 'jspdf';

export interface KdpCoverPdfOptions {
  /** Largeur de coupe en pouces */
  trimW: number;
  /** Hauteur de coupe en pouces */
  trimH: number;
  /** Nombre de pages (doit être pair) */
  pageCount: number;
  /** Facteur d'épaisseur du papier (in/page) — ex: 0.002252 papier blanc */
  paperFactor: number;
  /** Fond perdu activé (0.125") */
  hasBleed: boolean;
  /** Image de la 1re de couverture (URL http(s) ou dataURL) */
  frontCoverImage?: string | null;
  /** Image de fond pour la 4e de couverture (sinon couleur unie) */
  backCoverImage?: string | null;
  ebookTitle: string;
  authorName?: string;
  /** Texte de la 4e de couverture */
  backText?: string;
  /** Couleur de fond du dos + 4e (hex) */
  backgroundColor?: string;
  /** Couleur du texte sur fond (hex) */
  textColor?: string;
}

const BLEED_INCH = 0.125;
const ISBN_W = 2.0; // pouces
const ISBN_H = 1.2; // pouces

const slugify = (s: string) =>
  (s || 'couverture')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .toLowerCase()
    .slice(0, 60) || 'couverture';

const hexToRgb = (hex: string): [number, number, number] => {
  const h = (hex || '#232F3E').replace('#', '').padEnd(6, '0').slice(0, 6);
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0,
  ];
};

/** Charge une image (URL ou dataURL) en {dataUrl, width, height, format}. */
const loadImage = (
  src: string,
): Promise<{ dataUrl: string; width: number; height: number; format: 'PNG' | 'JPEG' }> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('canvas context indisponible'));
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight, format: 'JPEG' });
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error('Impossible de charger l’image (CORS ?)'));
    img.src = src;
  });

/** Dessine une image en mode "cover" (remplit la zone, recadre le surplus). */
const drawImageCover = (
  doc: jsPDF,
  imgData: string,
  imgW: number,
  imgH: number,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  const targetRatio = w / h;
  const imgRatio = imgW / imgH;
  let drawW = w;
  let drawH = h;
  if (imgRatio > targetRatio) {
    // image trop large → on la cale en hauteur
    drawH = h;
    drawW = h * imgRatio;
  } else {
    drawW = w;
    drawH = w / imgRatio;
  }
  const dx = x - (drawW - w) / 2;
  const dy = y - (drawH - h) / 2;
  doc.addImage(imgData, 'JPEG', dx, dy, drawW, drawH, undefined, 'FAST');
};

export const generateKdpCoverPdf = async (opts: KdpCoverPdfOptions): Promise<Blob> => {
  const bleed = opts.hasBleed ? BLEED_INCH : 0;
  const spineWidth = opts.pageCount * opts.paperFactor;
  const panelWidth = opts.trimW + bleed; // largeur d'un panneau (avec bleed extérieur)
  const totalWidth = panelWidth * 2 + spineWidth;
  const totalHeight = opts.trimH + bleed * 2;

  const [bgR, bgG, bgB] = hexToRgb(opts.backgroundColor || '#232F3E');
  const [txR, txG, txB] = hexToRgb(opts.textColor || '#FFFFFF');

  const doc = new jsPDF({
    orientation: totalWidth >= totalHeight ? 'landscape' : 'portrait',
    unit: 'in',
    format: [totalWidth, totalHeight],
    compress: true,
  });

  // Fond global (couleur unie sur 4e + dos)
  doc.setFillColor(bgR, bgG, bgB);
  doc.rect(0, 0, totalWidth, totalHeight, 'F');

  // ---- Panneau gauche : 4e de couverture (back) ----
  const backX = 0;
  if (opts.backCoverImage) {
    try {
      const { dataUrl, width, height } = await loadImage(opts.backCoverImage);
      drawImageCover(doc, dataUrl, width, height, backX, 0, panelWidth, totalHeight);
      // voile sombre pour lisibilité du texte
      doc.setFillColor(bgR, bgG, bgB);
      doc.setGState(new (doc as any).GState({ opacity: 0.55 }));
      doc.rect(backX, 0, panelWidth, totalHeight, 'F');
      doc.setGState(new (doc as any).GState({ opacity: 1 }));
    } catch {
      /* garde le fond uni */
    }
  }

  // Texte 4e de couverture (dans la safe zone)
  const safe = 0.4 + bleed;
  if (opts.backText) {
    doc.setTextColor(txR, txG, txB);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const maxW = panelWidth - safe * 2;
    const lines = doc.splitTextToSize(opts.backText, maxW);
    doc.text(lines, backX + safe, 1.2 + bleed, { baseline: 'top', lineHeightFactor: 1.4 });
  }

  // Réserve ISBN (rectangle blanc) en bas à droite de la 4e
  const isbnX = backX + panelWidth - ISBN_W - 0.25 - bleed;
  const isbnY = totalHeight - ISBN_H - 0.25 - bleed;
  doc.setFillColor(255, 255, 255);
  doc.rect(isbnX, isbnY, ISBN_W, ISBN_H, 'F');
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.text('Zone code-barres ISBN', isbnX + ISBN_W / 2, isbnY + ISBN_H / 2, {
    align: 'center',
    baseline: 'middle',
  });

  // ---- Dos (spine) ----
  const spineX = panelWidth;
  // si l'épaisseur du dos est suffisante (> ~0.06") on écrit le titre verticalement
  if (spineWidth > 0.06) {
    doc.setTextColor(txR, txG, txB);
    doc.setFont('helvetica', 'bold');
    const spineFont = Math.min(Math.max(spineWidth * 50, 8), 14);
    doc.setFontSize(spineFont);
    const spineCenterX = spineX + spineWidth / 2;
    const spineLabel = opts.authorName
      ? `${opts.ebookTitle}  —  ${opts.authorName}`
      : opts.ebookTitle;
    // texte tourné à 90° (lecture de bas en haut)
    doc.text(spineLabel, spineCenterX, totalHeight / 2, {
      align: 'center',
      baseline: 'middle',
      angle: 90,
    });
  }

  // ---- Panneau droit : 1re de couverture (front) ----
  const frontX = spineX + spineWidth;
  if (opts.frontCoverImage) {
    try {
      const { dataUrl, width, height } = await loadImage(opts.frontCoverImage);
      drawImageCover(doc, dataUrl, width, height, frontX, 0, panelWidth, totalHeight);
    } catch {
      // fallback : titre centré sur fond uni
      doc.setTextColor(txR, txG, txB);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      const lines = doc.splitTextToSize(opts.ebookTitle, panelWidth - safe * 2);
      doc.text(lines, frontX + panelWidth / 2, totalHeight / 2, {
        align: 'center',
        baseline: 'middle',
      });
    }
  } else {
    doc.setTextColor(txR, txG, txB);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    const lines = doc.splitTextToSize(opts.ebookTitle, panelWidth - safe * 2);
    doc.text(lines, frontX + panelWidth / 2, totalHeight / 2 - 0.4, {
      align: 'center',
      baseline: 'middle',
    });
    if (opts.authorName) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.text(opts.authorName, frontX + panelWidth / 2, totalHeight - safe - 0.3, {
        align: 'center',
        baseline: 'middle',
      });
    }
  }

  return doc.output('blob');
};

export const downloadKdpCoverPdf = async (opts: KdpCoverPdfOptions) => {
  const blob = await generateKdpCoverPdf(opts);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `couverture-kdp-${slugify(opts.ebookTitle)}-${opts.trimW}x${opts.trimH}-${opts.pageCount}p.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
