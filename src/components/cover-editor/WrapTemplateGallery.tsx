import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { renderWrapCanvas } from '@/lib/cover-editor/wrapExports';
import { applyWrapTemplate, WRAP_TEMPLATES, type WrapTemplate } from '@/lib/cover-editor/wrapTemplates';
import type { WrapComposition } from '@/lib/cover-editor/wrapComposition';
import type { KdpPaperbackGeometry } from '@/lib/cover-editor/kdpPaperbackSpecs';

interface Props {
  composition: WrapComposition;
  geometry: KdpPaperbackGeometry;
  imageUrl: string | null;
  onApply: (template: WrapTemplate) => void;
}

function Preview({ composition, geometry, imageUrl, template }: Omit<Props, 'onApply'> & { template: WrapTemplate }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setFailed(false);
    void renderWrapCanvas(applyWrapTemplate(composition, geometry, template), geometry, imageUrl, 35)
      .then((rendered) => {
        const canvas = ref.current;
        if (!active || !canvas) return;
        canvas.width = rendered.width;
        canvas.height = rendered.height;
        canvas.getContext('2d')?.drawImage(rendered, 0, 0);
      })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [composition, geometry, imageUrl, template]);
  return failed ? <span className="text-xs text-destructive">Aperçu indisponible</span> : (
    <canvas ref={ref} width={Math.round(geometry.fullWidthIn * 35)} height={Math.round(geometry.fullHeightIn * 35)} className="h-full w-full object-contain" aria-label={`Aperçu de la couverture complète · ${template.label}`} />
  );
}

export default function WrapTemplateGallery(props: Props) {
  return (
    <section aria-label="Modèles de couverture brochée" className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Modèles de couverture · 5 mises en page</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {WRAP_TEMPLATES.map((template) => (
          <Button key={template.id} variant="outline" className="h-auto min-w-0 flex-col gap-2 p-2" onClick={() => props.onApply(template)} data-wrap-template={template.id}>
            <span className="flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded border border-border bg-muted/30">
              <Preview {...props} template={template} />
            </span>
            <span className="text-xs">{template.label}</span>
          </Button>
        ))}
      </div>
    </section>
  );
}