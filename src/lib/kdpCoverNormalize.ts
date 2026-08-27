/**
 * Normalise une image de couverture générée par l'IA au format exigé par Amazon KDP.
 *
 * Les modèles d'image ne respectent pas toujours le ratio demandé dans le prompt
 * (ex. 1312×816 en paysage). On recadre donc l'image (cover-crop centré, léger
 * biais vers le haut pour préserver le titre) dans un canvas aux dimensions KDP.
 *
 * Kindle : 1600 × 2560 px (ratio 1.6:1)
 * Broché : 3300 × 2100 px (wrap complet, ratio ~1.57:1 paysage)
 */
export const KDP_COVER_TARGETS = {
  kindle: { width: 1600, height: 2560 },
  paperback: { width: 3300, height: 2100 },
} as const;

export type KdpCoverTarget = keyof typeof KDP_COVER_TARGETS;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image de couverture illisible'));
    img.src = src;
  });
}

/**
 * Recadre l'image au ratio KDP. Retourne un data URL PNG,
 * ou l'URL d'origine si le recadrage est impossible (CORS, canvas indisponible).
 */
export async function normalizeCoverToKdp(
  imageUrl: string,
  format: KdpCoverTarget = 'kindle',
): Promise<string> {
  const target = KDP_COVER_TARGETS[format] ?? KDP_COVER_TARGETS.kindle;
  try {
    const img = await loadImage(imageUrl);
    if (!img.naturalWidth || !img.naturalHeight) return imageUrl;

    // Déjà au bon ratio et résolution suffisante → on ne touche pas.
    const targetRatio = target.width / target.height;
    const srcRatio = img.naturalWidth / img.naturalHeight;
    const ratioOk = Math.abs(srcRatio - targetRatio) < 0.02;
    if (ratioOk && img.naturalWidth >= target.width && img.naturalHeight >= target.height) {
      return imageUrl;
    }

    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageUrl;

    // cover-crop : on remplit tout le canvas sans déformer
    const scale = Math.max(target.width / img.naturalWidth, target.height / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const dx = (target.width - drawW) / 2;
    // biais vers le haut (0.35 au lieu de 0.5) : garde le titre et le sujet visibles
    const dy = (target.height - drawH) * 0.35;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, drawW, drawH);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('normalizeCoverToKdp: recadrage impossible, image conservée telle quelle', err);
    return imageUrl;
  }
}
