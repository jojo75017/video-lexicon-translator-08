/**
 * Moteur d'illustration INCLUS dans toutes les formules (qualité V2).
 *
 * Utilisé quand l'abonné n'a pas Cover Studio Pro : la génération passe par la
 * fonction V2 `generate-ai-cover` (sans droit payant), puis l'image est rangée
 * dans l'espace privé `covers` du projet, exactement comme une image Pro.
 */
import { supabase } from '@/integrations/supabase/client';
import { uploadCoverFile } from '@/lib/coverProjects';

export interface IncludedIllustrationInput {
  projectId: string;
  title: string;
  subtitle?: string | null;
  author?: string | null;
  genre?: string;
  mood?: string;
  palette?: string;
  summary?: string;
  visualPrompt?: string;
  include?: string;
  avoid?: string;
  lighting?: string;
  wrap?: boolean;
}

/**
 * Dimensions minimales pour une impression 300 DPI :
 *  - Kindle 6×9" : 1800×2700 px (on vise 2048×3072 pour la marge) ;
 *  - Broché wrap complet : ~3900 px de large.
 * Si le modèle renvoie plus petit, l'image est agrandie proprement sur canevas
 * avant enregistrement, pour que l'export PDF reste en 300 DPI.
 */
const PRINT_TARGET = {
  kindle: { width: 2048, height: 3072 },
  wrap: { width: 3900, height: 2600 },
} as const;

async function upscaleToPrintSize(blob: Blob, wrap: boolean): Promise<Blob> {
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('illustration illisible'));
      el.src = url;
    });
    const target = wrap ? PRINT_TARGET.wrap : PRINT_TARGET.kindle;
    if (img.naturalWidth >= target.width && img.naturalHeight >= target.height) return blob;

    const scale = Math.max(target.width / img.naturalWidth, target.height / img.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return blob;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (out) => (out ? resolve(out) : reject(new Error('agrandissement impossible'))),
        'image/png',
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function generateIncludedIllustration(input: IncludedIllustrationInput): Promise<string> {
  const scene = [input.visualPrompt, input.summary].map((s) => (s ?? '').trim()).filter(Boolean).join('\n\n');
  const bright = input.lighting === 'dark' ? 'dramatic but readable lighting' : 'bright, luminous, well-exposed lighting (never dark or muddy)';
  const prompt = `Professional book cover ILLUSTRATION ONLY for the book "${input.title}"${input.subtitle ? ` (${input.subtitle})` : ''}.
Scene to depict faithfully: ${scene || `a striking scene that matches the story of "${input.title}"`}.
${input.genre ? `Genre: ${input.genre}. ` : ''}${input.mood ? `Mood: ${input.mood}. ` : ''}${input.palette ? `Palette: ${input.palette}. ` : ''}${input.include ? `Must include: ${input.include}. ` : ''}
Lighting: ${bright}. Magazine-grade detail, art-directed bestseller quality.
${input.wrap ? 'Wide landscape panoramic composition: the main subject on the RIGHT third (front cover), calm continuous background on the left (back cover) and centre (spine).' : 'Vertical portrait composition, main subject in the upper two thirds, calmer area at the bottom for the title.'}
ABSOLUTELY NO TEXT: no letters, no title, no words, no logo, no watermark, no banner${input.avoid ? `, and avoid: ${input.avoid}` : ''}. Full-bleed, no border, no 3D mockup.`;

  const { data, error } = await supabase.functions.invoke('generate-ai-cover', {
    body: {
      title: input.title || 'Couverture',
      subtitle: input.subtitle ?? '',
      author: input.author ?? '',
      genre: input.genre ?? '',
      format: input.wrap ? 'paperback' : 'kindle',
      customPrompt: prompt,
    },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  const imageUrl = data?.imageUrl as string | undefined;
  if (!imageUrl) throw new Error('Aucune image reçue.');

  const blob = await (await fetch(imageUrl)).blob();
  const printBlob = await upscaleToPrintSize(blob, Boolean(input.wrap));
  return uploadCoverFile({ projectId: input.projectId, kind: 'illustration', blob: printBlob });
}
