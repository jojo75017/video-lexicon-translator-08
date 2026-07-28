import { useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, LayoutTemplate, Wand2, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  COVER_FORMATS,
  computeWrapFormat,
  type CoverFormatId,
} from '@/config/coverFormats';
import { CoverCanvas, type CoverCanvasHandle } from '@/components/cover-studio-pro/CoverCanvas';
import { CoverToolbar } from '@/components/cover-studio-pro/CoverToolbar';
import { TemplatesPanel } from '@/components/cover-studio-pro/TemplatesPanel';
import { AiBackgroundPanel } from '@/components/cover-studio-pro/AiBackgroundPanel';
import { cn } from '@/lib/utils';

type SidePanel = 'templates' | 'ai' | null;

export default function CoverEditorPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef<CoverCanvasHandle>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const [sidePanel, setSidePanel] = useState<SidePanel>('templates');

  const formatId = (params.get('format') as CoverFormatId) || 'ebook-kindle';
  const format = COVER_FORMATS[formatId] ?? COVER_FORMATS['ebook-kindle'];

  const [pageCount, setPageCount] = useState(120);

  const layout = useMemo(() => {
    if (format.id === 'broche-wrap' || format.id === 'hardcover') {
      const trimW = 6;
      const trimH = 9;
      return computeWrapFormat(pageCount, trimW, trimH, 0.125);
    }
    return {
      width: format.width,
      height: format.height,
      bleed: format.bleed,
      spineWidth: 0,
      zones: undefined,
    };
  }, [format, pageCount]);

  const guides = layout.zones
    ? [
        { ...layout.zones.back, label: 'DOS (back)', color: '#3b82f6' },
        { ...layout.zones.spine, label: 'TRANCHE', color: '#f59e0b' },
        { ...layout.zones.front, label: 'FRONT (avant)', color: '#10b981' },
      ]
    : undefined;

  // Pour les wraps, les templates s'appliquent sur la zone FRONT uniquement
  const templateTarget = layout.zones ? layout.zones.front : undefined;

  const handleExportPNG = () => {
    const dataUrl = canvasRef.current?.exportPNG(1);
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `couverture-${format.id}-${Date.now()}.png`;
    a.click();
    toast.success('PNG 300 DPI téléchargé');
  };

  const handleExportPDF = () => {
    const dataUrl = canvasRef.current?.exportPNG(1);
    if (!dataUrl) return;
    const widthMm = (layout.width / 300) * 25.4;
    const heightMm = (layout.height / 300) * 25.4;
    const pdf = new jsPDF({
      orientation: widthMm > heightMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [widthMm, heightMm],
      compress: true,
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, widthMm, heightMm, undefined, 'FAST');
    pdf.save(`couverture-${format.id}-${Date.now()}.pdf`);
    toast.success('PDF print-ready téléchargé (bleed inclus)');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/v3/cover-studio-pro')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour
          </Button>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="font-semibold">{format.label}</h1>
            <Badge variant="outline" className="text-xs">
              {layout.width} × {layout.height} px @ 300 DPI
            </Badge>
          </div>

          {(format.id === 'broche-wrap' || format.id === 'hardcover') && (
            <div className="flex items-center gap-2 ml-auto">
              <Label htmlFor="pages" className="text-sm whitespace-nowrap">
                Nombre de pages :
              </Label>
              <Input
                id="pages"
                type="number"
                min={24}
                max={800}
                value={pageCount}
                onChange={(e) => setPageCount(Math.max(24, Number(e.target.value) || 24))}
                className="w-24"
              />
              <Badge variant="secondary" className="text-xs">
                Tranche : {((layout.spineWidth / 300) * 25.4).toFixed(1)} mm
              </Badge>
            </div>
          )}
        </div>
      </div>

      <CoverToolbar canvas={fabricCanvas} onExportPNG={handleExportPNG} onExportPDF={handleExportPDF} />

      <div className="max-w-[1600px] mx-auto p-4 flex gap-4">
        {/* Barre latérale gauche : gros boutons visibles */}
        <aside className="w-14 shrink-0 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setSidePanel(sidePanel === 'templates' ? null : 'templates')}
            className={cn(
              'h-24 rounded-lg flex flex-col items-center justify-center gap-1 text-xs font-semibold border-2 transition shadow-sm',
              sidePanel === 'templates'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-amber-400 hover:bg-amber-50',
            )}
            title="Templates KDP"
          >
            <LayoutTemplate className="w-6 h-6" />
            <span className="leading-tight text-center">Templates</span>
          </button>

          <button
            type="button"
            onClick={() => setSidePanel(sidePanel === 'ai' ? null : 'ai')}
            className={cn(
              'h-24 rounded-lg flex flex-col items-center justify-center gap-1 text-xs font-semibold border-2 transition shadow-sm',
              sidePanel === 'ai'
                ? 'bg-gradient-to-b from-fuchsia-500 to-violet-600 text-white border-fuchsia-600 shadow-md'
                : 'bg-white text-neutral-700 border-neutral-200 hover:border-fuchsia-400 hover:bg-fuchsia-50',
            )}
            title="Fond IA"
          >
            <Wand2 className="w-6 h-6" />
            <span className="leading-tight text-center">Fond IA</span>
          </button>
        </aside>

        {/* Panneau contextuel */}
        {sidePanel && (
          <aside className="w-80 shrink-0 bg-white rounded-lg border shadow-sm p-4 relative">
            <button
              type="button"
              onClick={() => setSidePanel(null)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-neutral-100"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            {sidePanel === 'templates' && (
              <TemplatesPanel canvas={fabricCanvas} target={templateTarget} />
            )}
            {sidePanel === 'ai' && (
              <AiBackgroundPanel
                canvas={fabricCanvas}
                target={templateTarget}
                defaultPrompt=""
              />
            )}
          </aside>
        )}

        {/* Canvas */}
        <div className="flex-1 min-w-0">
          <CoverCanvas
            key={`${format.id}-${pageCount}`}
            ref={canvasRef}
            width={layout.width}
            height={layout.height}
            bleed={layout.bleed}
            guides={guides}
            onReady={setFabricCanvas}
          />
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Zone rouge pointillée = bleed 3 mm. Les guides dos/tranche/front ne sont pas exportés.
            {templateTarget && ' Les templates et fonds IA s\'appliquent sur la zone FRONT du wrap.'}
          </p>
        </div>
      </div>
    </div>
  );
}
