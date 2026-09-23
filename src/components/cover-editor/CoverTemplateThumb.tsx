/**
 * Vignette d'un modèle professionnel : c'est un exemple de démonstration, dessiné
 * avec le moteur de rendu partagé (`drawFrontComposition`) sur une image de
 * démonstration locale et avec un titre d'exemple propre au genre du modèle.
 *
 * Le livre de l'abonné n'apparaît jamais dans le catalogue : son titre et son
 * illustration ne reçoivent le style du modèle qu'au moment où il l'applique.
 *
 * 100 % local : aucun appel IA, aucun crédit, aucune écriture en base.
 */
import { useEffect, useRef } from 'react';

import demoGuide from '@/assets/cover-demo-guide.jpg';
import demoNonfiction from '@/assets/cover-demo-nonfiction.jpg';
import demoRoman from '@/assets/cover-demo-roman.jpg';
import { ensureFontsReady } from '@/lib/cover-editor/coverFonts';
import { applyTemplate, type CoverGenre, type CoverTemplate } from '@/lib/cover-editor/coverTemplates';
import { sampleForGenre } from '@/lib/cover-editor/templateSamples';
import {
  DEFAULT_FRONT_BACKGROUND,
  FRONT_COMPOSITION_VERSION,
  defaultLayer,
  drawFrontComposition,
  type FrontComposition,
} from '@/lib/cover-editor/frontComposition';

const THUMB_WIDTH = 320;

/** Image de démonstration cohérente avec le genre du modèle. */
const DEMO_BY_GENRE: Record<CoverGenre, string> = {
  roman: demoRoman,
  thriller: demoRoman,
  romance: demoRoman,
  fantasy: demoRoman,
  biographie: demoRoman,
  jeunesse: demoRoman,
  developpement: demoNonfiction,
  cuisine: demoNonfiction,
  guide: demoGuide,
  business: demoGuide,
};

const imageCache = new Map<string, HTMLImageElement>();

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  const cached = imageCache.get(src);
  if (cached) return cached;
  const image = await new Promise<HTMLImageElement | null>((resolve) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => resolve(null);
    el.src = src;
  });
  if (image) imageCache.set(src, image);
  return image;
}

/** Composition d'exemple : textes fictifs propres au genre du modèle. */
function buildSampleComposition(
  template: CoverTemplate,
  canvas: { width: number; height: number },
): FrontComposition {
  const sample = sampleForGenre(template.genre);
  return {
    version: FRONT_COMPOSITION_VERSION,
    illustrationPath: null,
    canvas,
    backgroundColor: DEFAULT_FRONT_BACKGROUND,
    imageBrightness: 1,
    imageContrast: 1,
    imageSaturation: 1,
    imageWarmth: 0,
    imageScale: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    imageFlipX: false,
    layers: [
      defaultLayer('title', canvas, sample.title),
      defaultLayer('subtitle', canvas, sample.subtitle),
      defaultLayer('author', canvas, sample.author),
    ],
  };
}

interface Props {
  template: CoverTemplate;
  variantIndex: number;
  /** Dimensions du format en cours, pour un aperçu aux bonnes proportions. */
  canvas: { width: number; height: number };
}

export default function CoverTemplateThumb({ template, variantIndex, canvas }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let active = true;
    const draw = async () => {
      const node = ref.current;
      if (!node) return;
      const sample = buildSampleComposition(template, canvas);
      const preview = applyTemplate(sample, template.id, variantIndex);
      const scale = THUMB_WIDTH / preview.canvas.width;
      node.width = THUMB_WIDTH;
      node.height = Math.round(preview.canvas.height * scale);
      const ctx = node.getContext('2d');
      if (!ctx) return;

      await ensureFontsReady(preview.layers.map((l) => l.fontFamily)).catch(() => undefined);
      const image = await loadImage(DEMO_BY_GENRE[template.genre]);
      if (!active) return;
      drawFrontComposition(ctx, preview, image, scale, scale);
    };
    void draw();
    return () => {
      active = false;
    };
  }, [template, variantIndex, canvas]);

  return (
    <canvas
      ref={ref}
      className="mb-2 w-full rounded-lg border border-border shadow-sm"
      aria-label={`Exemple du modèle ${template.label}`}
    />
  );
}
