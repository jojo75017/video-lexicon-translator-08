import { useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
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

export default function CoverEditorPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef<CoverCanvasHandle>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);

  const formatId = (params.get('format') as CoverFormatId) || 'ebook-kindle';
  const format = COVER_FORMATS[formatId] ?? COVER_FORMATS['ebook-kindle'];

  const [pageCount, setPageCount] = useState(120);

  const layout = useMemo(() => {
    if (format.id === 'broche-wrap' || format.id === 'hardcover') {
      const trimW = format.id === 'hardcover' ? 6 : 6;
      const trimH = format.id === 'hardcover' ? 9 : 9;
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

    // Convertit les dimensions px @ 300 DPI en mm pour jsPDF
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
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
                Tranche : {(layout.spineWidth / 300 * 25.4).toFixed(1)} mm
              </Badge>
            </div>
          )}
        </div>
      </div>

      <CoverToolbar
        canvas={fabricCanvas}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
      />

      <div className="max-w-7xl mx-auto p-4">
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
          Zone rouge pointillée = bleed 3 mm (à ne pas laisser vide, mais rien d'important dedans). Les guides de zone (dos / tranche / front) ne sont pas exportés.
        </p>
      </div>
    </div>
  );
}
