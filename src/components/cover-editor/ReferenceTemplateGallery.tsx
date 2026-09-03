/**
 * Galerie des trois modèles de référence.
 *
 * Chaque miniature est une vraie couverture terminée : elle est dessinée avec
 * le moteur de rendu partagé (`drawFrontComposition`) et une image de
 * démonstration locale. Aucun appel IA, aucun crédit consommé.
 */
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { drawFrontComposition } from '@/lib/cover-editor/frontComposition';
import {
  REFERENCE_TEMPLATES,
  buildReferencePreview,
  type ReferenceTemplate,
  type ReferenceTemplateId,
} from '@/lib/cover-editor/referenceTemplates';
import { ensureFontsReady } from '@/lib/cover-editor/coverFonts';

const THUMB_WIDTH = 260;

function TemplateThumb({ tpl }: { tpl: ReferenceTemplate }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let active = true;
    const draw = async () => {
      const canvas = ref.current;
      if (!canvas) return;
      const composition = buildReferencePreview(tpl);
      const scale = THUMB_WIDTH / composition.canvas.width;
      canvas.width = THUMB_WIDTH;
      canvas.height = Math.round(composition.canvas.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      await ensureFontsReady(composition.layers.map((l) => l.fontFamily)).catch(() => undefined);

      const image = await new Promise<HTMLImageElement | null>((resolve) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => resolve(null);
        el.src = tpl.demoImage;
      });
      if (!active) return;
      drawFrontComposition(ctx, composition, image, scale, scale);
    };
    void draw();
    return () => {
      active = false;
    };
  }, [tpl]);

  return (
    <canvas
      ref={ref}
      className="w-full rounded-lg border border-border shadow-sm"
      aria-label={`Aperçu du modèle ${tpl.label}`}
    />
  );
}

interface Props {
  activeId?: string | null;
  onApply: (id: ReferenceTemplateId) => void;
}

export default function ReferenceTemplateGallery({ activeId, onApply }: Props) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Modèles de référence</p>
          <p className="text-xs text-muted-foreground">
            Chaque modèle crée de vrais calques : illustration, voile, formes, cadres, ornements,
            bandeaux et textes. Tout reste modifiable dans le panneau des calques.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REFERENCE_TEMPLATES.map((tpl) => {
            const active = activeId === tpl.id;
            return (
              <div
                key={tpl.id}
                className={cn(
                  'rounded-xl border p-2 transition',
                  active ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary',
                )}
              >
                <TemplateThumb tpl={tpl} />
                <p className="mt-2 text-sm font-semibold text-foreground">{tpl.label}</p>
                <p className="mb-2 text-xs text-muted-foreground">{tpl.description}</p>
                <Button
                  size="sm"
                  data-reference-template={tpl.id}
                  onClick={() => onApply(tpl.id)}
                  className="w-full bg-[#f47920] text-white hover:bg-[#d96a15]"
                >
                  {active ? 'Réappliquer ce modèle' : 'Appliquer ce modèle'}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
