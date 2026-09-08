/**
 * Composition des textes pour le Studio de couvertures premium.
 *
 * 100 % local : l'illustration vient du moteur d'images, mais le titre,
 * le sous-titre et le nom de l'auteur sont écrits par l'application
 * (typographie nette, jamais déformée). Aucun appel réseau ici.
 */
import {
  createComposition,
  type FrontComposition,
  type FrontTextLayer,
} from '@/lib/cover-editor/frontComposition';

export type TextPlacement = 'top' | 'center' | 'bottom';

export const TEXT_PLACEMENTS: { id: TextPlacement; label: string }[] = [
  { id: 'top', label: 'Titre en haut' },
  { id: 'center', label: 'Titre centré' },
  { id: 'bottom', label: 'Titre en bas' },
];

/** Sortes d'images proposées, indépendantes de la catégorie du livre. */
export const COVER_IMAGE_STYLES: { id: string; label: string; prompt: string }[] = [
  {
    id: 'photo',
    label: '📷 Photo réaliste',
    prompt:
      'Hyperrealistic photography, 50mm lens, f/1.8, cinematic colour grading, natural directional light, fine grain, razor-sharp professional finish, absolutely no cartoon look.',
  },
  {
    id: 'peinte',
    label: '🖌️ Illustration peinte',
    prompt:
      'Richly painted digital illustration, oil-painting texture, warm rim light, deep painterly depth, best-seller book cover craftsmanship.',
  },
  {
    id: 'aquarelle',
    label: '🎨 Aquarelle jeunesse',
    prompt:
      'Gentle children picture-book watercolour, soft washes, visible paper texture, warm friendly palette, rounded shapes, tender storybook mood.',
  },
  {
    id: 'minimal',
    label: '◻️ Minimaliste graphique',
    prompt:
      'Premium minimalist graphic design, bold simple shapes, controlled flat colour fields, one memorable central symbol, high contrast, generous empty space.',
  },
  {
    id: '3d',
    label: '🧊 Rendu 3D',
    prompt:
      'High-end 3D render, physically based materials, soft studio lighting, subtle depth of field, clean product-shot composition, Octane / Blender Cycles quality.',
  },
  {
    id: 'bd',
    label: '💥 Dessin BD / ligne claire',
    prompt:
      'Franco-Belgian comic art, clean confident ink lines, flat vivid colours, expressive characters, dynamic staging, ligne claire tradition.',
  },
  {
    id: 'vintage',
    label: '📜 Vintage rétro',
    prompt:
      'Vintage retro poster style, screen-print texture, limited muted palette, mid-century shapes, aged paper grain, nostalgic editorial feel.',
  },
];

export const getImageStyle = (id: string) =>
  COVER_IMAGE_STYLES.find((s) => s.id === id) ?? COVER_IMAGE_STYLES[0];

export interface StudioCompositionInput {
  title: string;
  subtitle: string;
  author: string;
  placement: TextPlacement;
  formatId?: string;
}

const RATIOS: Record<TextPlacement, { title: number; subtitle: number; author: number }> = {
  top: { title: 0.09, subtitle: 0.3, author: 0.87 },
  center: { title: 0.38, subtitle: 0.58, author: 0.87 },
  bottom: { title: 0.58, subtitle: 0.78, author: 0.9 },
};

/**
 * Construit une composition lisible : voile dégradé pour le contraste,
 * ombre portée sur chaque texte, position choisie par l'abonné.
 */
export function buildStudioComposition(input: StudioCompositionInput): FrontComposition {
  const formatId = input.formatId ?? 'ebook-kindle';
  const composition = createComposition({
    formatId,
    illustrationPath: null,
    bookTitle: input.title || 'Titre du livre',
  });

  const { height } = composition.canvas;
  const ratios = RATIOS[input.placement] ?? RATIOS.top;

  const shadow = { enabled: true, color: 'rgba(0,0,0,0.75)', blur: Math.round(height * 0.012), offsetY: Math.round(height * 0.004) };

  composition.overlay = {
    type: input.placement === 'center' ? 'full' : 'both',
    color: '#000000',
    opacity: input.placement === 'center' ? 0.38 : 0.45,
  };

  composition.layers = composition.layers
    .map((layer): FrontTextLayer => {
      if (layer.role === 'title') {
        return {
          ...layer,
          text: input.title.trim() || 'Titre du livre',
          y: Math.round(height * ratios.title),
          bold: true,
          shadow,
        };
      }
      if (layer.role === 'subtitle') {
        return {
          ...layer,
          text: input.subtitle.trim(),
          y: Math.round(height * ratios.subtitle),
          shadow,
        };
      }
      return {
        ...layer,
        text: input.author.trim(),
        y: Math.round(height * ratios.author),
        shadow,
      };
    })
    .filter((layer) => layer.text.trim().length > 0);

  composition.templateId = `studio-pro-${input.placement}`;
  return composition;
}
