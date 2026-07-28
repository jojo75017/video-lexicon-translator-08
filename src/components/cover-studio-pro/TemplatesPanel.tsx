import { useMemo, useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  COVER_TEMPLATES,
  TEMPLATE_CATEGORIES,
  type CoverTemplate,
  type CoverTemplateCategory,
} from '@/config/coverTemplates';

interface Props {
  canvas: fabric.Canvas | null;
  /** Zone où appliquer le template (utile pour wrap : front seulement) */
  target?: { x: number; y: number; w: number; h: number };
}

export function TemplatesPanel({ canvas, target }: Props) {
  const [category, setCategory] = useState<CoverTemplateCategory | 'all'>('all');

  const templates = useMemo(
    () => (category === 'all' ? COVER_TEMPLATES : COVER_TEMPLATES.filter((t) => t.category === category)),
    [category],
  );

  const applyTemplate = (tpl: CoverTemplate) => {
    if (!canvas) return;
    const zone = target ?? { x: 0, y: 0, w: canvas.width!, h: canvas.height! };

    // Retire les objets exportables précédents dans la zone cible
    canvas.getObjects().forEach((o: any) => {
      if (o.excludeFromExport) return;
      const l = o.left ?? 0;
      const t = o.top ?? 0;
      if (l >= zone.x - 5 && t >= zone.y - 5 && l <= zone.x + zone.w && t <= zone.y + zone.h) {
        canvas.remove(o);
      }
    });

    // Fond de la zone
    const bg = new fabric.Rect({
      left: zone.x,
      top: zone.y,
      width: zone.w,
      height: zone.h,
      fill: tpl.background,
      selectable: false,
      evented: false,
    });
    canvas.add(bg);

    // Formes décoratives
    tpl.shapes?.forEach((s) => {
      const rect = new fabric.Rect({
        left: zone.x + s.x * zone.w,
        top: zone.y + s.y * zone.h,
        width: s.w * zone.w,
        height: s.h * zone.h,
        fill: s.fill,
        opacity: s.opacity ?? 1,
        selectable: true,
      });
      canvas.add(rect);
    });

    // Textes
    tpl.texts.forEach((t) => {
      const width = t.w * zone.w;
      const fontSize = Math.round(t.fontSizeRatio * zone.h);
      const textbox = new fabric.Textbox(t.text, {
        left: zone.x + t.x * zone.w - width / 2,
        top: zone.y + t.y * zone.h - fontSize / 2,
        width,
        fontSize,
        fontFamily: t.fontFamily,
        fontWeight: t.fontWeight ?? 'normal',
        fontStyle: (t.fontStyle as any) ?? 'normal',
        fill: t.fill,
        textAlign: t.textAlign ?? 'center',
      });
      canvas.add(textbox);
    });

    canvas.renderAll();
    toast.success(`Template « ${tpl.label} » appliqué`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="font-semibold text-sm">Templates KDP prêts à l'emploi</h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TEMPLATE_CATEGORIES.map((c) => (
          <Badge
            key={c.id}
            variant={category === c.id ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setCategory(c.id as any)}
          >
            {c.label}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[540px] overflow-y-auto pr-1">
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => applyTemplate(tpl)}
            className="group relative rounded-md border overflow-hidden hover:border-primary hover:shadow-md transition text-left"
            style={{ background: tpl.background }}
          >
            <div className="aspect-[2/3] flex flex-col justify-center items-center p-2 relative">
              <div
                className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight px-1"
                style={{ color: tpl.texts[0]?.fill ?? '#111' }}
              >
                {tpl.texts.find((t) => t.role === 'title')?.text.split('\n')[0] || tpl.label}
              </div>
              <div
                className="text-[7px] mt-2 text-center px-1"
                style={{ color: tpl.texts[0]?.fill ?? '#111', opacity: 0.7 }}
              >
                {tpl.texts.find((t) => t.role === 'author')?.text}
              </div>
            </div>
            <div className="p-1.5 bg-white border-t">
              <div className="text-[11px] font-medium truncate">{tpl.label}</div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full h-6 text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition"
              >
                <Wand2 className="w-3 h-3 mr-1" /> Appliquer
              </Button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
