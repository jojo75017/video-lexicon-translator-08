import { useState } from 'react';
import * as fabric from 'fabric';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { invokeImageFunction } from '@/lib/aiImageInvoke';

interface Props {
  canvas: fabric.Canvas | null;
  /** Zone à remplir (par défaut tout le canvas) */
  target?: { x: number; y: number; w: number; h: number };
  defaultPrompt?: string;
}

export function AiBackgroundPanel({ canvas, target, defaultPrompt = '' }: Props) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!canvas) return;
    if (!prompt.trim()) {
      toast.error('Décris le visuel souhaité (style, ambiance, couleurs…)');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await invokeImageFunction<{ imageUrl?: string; error?: string }>(
        'generate-front-cover',
        {
          prompt: `${prompt}. Fond de couverture de livre KDP, très haute qualité, sans texte, sans mots, sans lettres, composition adaptée à un titre en surimpression.`,
          negative: 'texte, lettres, mots, watermark, logo',
          aspectRatio: '2:3',
        },
      );
      if (error || !data?.imageUrl) {
        throw new Error((error as any)?.message || data?.error || 'Génération impossible');
      }
      const url = data.imageUrl;
      const img = await fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
      const zone = target ?? { x: 0, y: 0, w: canvas.width!, h: canvas.height! };

      // Cover fit dans la zone
      const scale = Math.max(zone.w / img.width!, zone.h / img.height!);
      img.set({
        left: zone.x,
        top: zone.y,
        scaleX: scale,
        scaleY: scale,
        selectable: true,
      });
      img.clipPath = new fabric.Rect({
        left: zone.x,
        top: zone.y,
        width: zone.w,
        height: zone.h,
        absolutePositioned: true,
      });
      canvas.add(img);
      canvas.sendObjectToBack(img);
      canvas.renderAll();
      toast.success('Visuel IA ajouté en fond');
    } catch (e: any) {
      toast.error(e?.message || 'Erreur génération IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-fuchsia-500" />
        <h3 className="font-semibold text-sm">Fond IA (Gemini)</h3>
      </div>
      <Textarea
        placeholder="Ex : aquarelle douce d'une forêt embrumée au lever du soleil, tons ocre et vert profond, style éditorial premium"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        className="text-sm"
      />
      <Button
        onClick={generate}
        disabled={loading || !canvas}
        className="w-full bg-gradient-to-r from-fuchsia-500 to-violet-600 hover:from-fuchsia-600 hover:to-violet-700 text-white"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Génération…
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4 mr-2" /> Générer le fond IA
          </>
        )}
      </Button>
      <p className="text-[11px] text-muted-foreground">
        Astuce : précise le style (aquarelle, peinture numérique, photo réaliste), l'ambiance et les couleurs.
        L'IA n'ajoute pas de texte — tu le poses par-dessus via l'outil « Texte ».
      </p>
    </div>
  );
}
