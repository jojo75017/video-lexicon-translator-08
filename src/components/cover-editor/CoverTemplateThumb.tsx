/**
 * Vignette d'un modèle professionnel : elle montre LA couverture de l'abonné
 * (même illustration, même titre, même auteur) déclinée selon la mise en page
 * et la typographie du modèle. L'abonné compare ainsi plusieurs directions
 * graphiques sur son propre livre avant d'en appliquer une.
 *
 * 100 % local : aucun appel IA, aucun crédit, aucune écriture en base.
 */
import { useEffect, useRef } from 'react';

import { ensureFontsReady } from '@/lib/cover-editor/coverFonts';
import { applyTemplate, type CoverTemplate } from '@/lib/cover-editor/coverTemplates';
import { drawFrontComposition, type FrontComposition } from '@/lib/cover-editor/frontComposition';

const THUMB_WIDTH = 320;

interface Props {
  template: CoverTemplate;
  variantIndex: number;
  /** Composition réelle du projet (illustration, titre, auteur, réglages image). */
  composition: FrontComposition;
  /** Illustration du projet déjà chargée, pour un aperçu fidèle. */
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
      const node = ref.current;
      if (!node) return;
      const preview = applyTemplate(composition, template.id, variantIndex);
      const scale = THUMB_WIDTH / preview.canvas.width;
      node.width = THUMB_WIDTH;
      node.height = Math.round(preview.canvas.height * scale);
      const ctx = node.getContext('2d');
      if (!ctx) return;

      await ensureFontsReady(preview.layers.map((l) => l.fontFamily)).catch(() => undefined);
      if (!active) return;
      drawFrontComposition(ctx, preview, projectImage, scale, scale);
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
      aria-label={`Votre couverture avec le modèle ${template.label}`}
    />
  );
}
