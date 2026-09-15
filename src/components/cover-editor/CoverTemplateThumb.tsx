/**
 * Vignette d'un modèle professionnel : ce n'est plus un simple dégradé, mais une
 * vraie couverture dessinée avec le moteur de rendu partagé
 * (`drawFrontComposition`), sur l'illustration du projet quand elle existe,
 * sinon sur une image de démonstration locale du genre.
 *
 * 100 % local : aucun appel IA, aucun crédit, aucune écriture en base.
 */
import { useEffect, useRef } from 'react';

import demoGuide from '@/assets/cover-demo-guide.jpg';
import demoNonfiction from '@/assets/cover-demo-nonfiction.jpg';
import demoRoman from '@/assets/cover-demo-roman.jpg';
import { ensureFontsReady } from '@/lib/cover-editor/coverFonts';
import { applyTemplate, type CoverGenre, type CoverTemplate } from '@/lib/cover-editor/coverTemplates';
import {
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

interface Props {
  template: CoverTemplate;
  variantIndex: number;
  /** Composition en cours : titres, sous-titre et auteur réels du projet. */
  composition: FrontComposition;
  /** Illustration du projet déjà chargée dans l'éditeur (peut être absente). */
  projectImage: HTMLImageElement | null;
}

export default function CoverTemplateThumb({
  template,
  variantIndex,
  composition,
  projectImage,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let active = true;
    const draw = async () => {
      const canvas = ref.current;
      if (!canvas) return;
      const preview = applyTemplate(composition, template.id, variantIndex);
      const scale = THUMB_WIDTH / preview.canvas.width;
      canvas.width = THUMB_WIDTH;
      canvas.height = Math.round(preview.canvas.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      await ensureFontsReady(preview.layers.map((l) => l.fontFamily)).catch(() => undefined);
      const image = projectImage ?? (await loadImage(DEMO_BY_GENRE[template.genre]));
      if (!active) return;
      drawFrontComposition(ctx, preview, image, scale, scale);
    };
    void draw();
    return () => {
      active = false;
    };
  }, [template, variantIndex, composition, projectImage]);

  return (
    <canvas
      ref={ref}
      className="mb-2 w-full rounded-lg border border-border shadow-sm"
      aria-label={`Aperçu du modèle ${template.label}`}
    />
  );
}
