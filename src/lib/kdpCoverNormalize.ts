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

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Image de couverture illisible'));
    img.src = src;
  });
}

/**
 * Charge d'abord l'image comme Blob local. Cela évite qu'un canvas soit bloqué
 * par CORS pour certains abonnés lorsque le fournisseur renvoie une URL distante.
 */
async function loadImage(src: string): Promise<{ image: HTMLImageElement; cleanup: () => void }> {
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Image inaccessible (${response.status})`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const image = await loadImageElement(objectUrl);
      return { image, cleanup: () => URL.revokeObjectURL(objectUrl) };
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      throw error;
    }
  } catch {
    const image = await loadImageElement(src);
    return { image, cleanup: () => undefined };
  }
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
  let cleanup: () => void = () => undefined;
  try {
    const loaded = await loadImage(imageUrl);
    const img = loaded.image;
    cleanup = loaded.cleanup;
    if (!img.naturalWidth || !img.naturalHeight) return imageUrl;

    // Même si la source semble déjà correcte, on recrée toujours un PNG local
    // aux dimensions exactes. Le fournisseur peut sinon livrer une URL dont les
    // métadonnées ou le fichier changent au téléchargement.
    const targetRatio = target.width / target.height;
    const srcRatio = img.naturalWidth / img.naturalHeight;

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

    const normalized = canvas.toDataURL('image/png');
    if (!normalized.startsWith('data:image/png')) {
      throw new Error('Le fichier KDP final n’a pas pu être créé');
    }
    return normalized;
  } catch (err) {
    console.warn('normalizeCoverToKdp: recadrage impossible, image conservée telle quelle', err);
    return imageUrl;
  } finally {
    cleanup();
  }
}
