import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileUp, Loader2, CheckCircle, AlertTriangle, XCircle,
  Ruler, Sparkles, ZoomIn, ZoomOut, Mouse, Download
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

// KDP minimum margins (in mm) based on page count
const KDP_MARGINS = {
  innerMin: 6.4,   // 0.25" minimum gutter for < 150 pages
  innerMax: 19.1,   // 0.75" gutter for 800+ pages
  outerMin: 6.4,    // 0.25"
  topMin: 6.4,      // 0.25"
  bottomMin: 6.4,   // 0.25"
};

const KDP_FORMATS = [
  { label: '5 x 8"', w: 127, h: 203.2 },
  { label: '5.06 x 7.81"', w: 128.5, h: 198.4 },
  { label: '5.25 x 8"', w: 133.4, h: 203.2 },
  { label: '5.5 x 8.5"', w: 139.7, h: 215.9 },
  { label: '6 x 9"', w: 152.4, h: 228.6 },
  { label: '6.14 x 9.21"', w: 156, h: 233.9 },
  { label: '6.69 x 9.61"', w: 169.9, h: 244.1 },
  { label: '7 x 10"', w: 177.8, h: 254 },
  { label: '7.44 x 9.69"', w: 188.9, h: 246.1 },
  { label: '7.5 x 9.25"', w: 190.5, h: 234.9 },
  { label: '8 x 10"', w: 203.2, h: 254 },
  { label: '8.25 x 6"', w: 209.6, h: 152.4 },
  { label: '8.25 x 8.25"', w: 209.6, h: 209.6 },
  { label: '8.5 x 8.5"', w: 215.9, h: 215.9 },
  { label: '8.5 x 11"', w: 215.9, h: 279.4 },
  { label: 'A4', w: 210, h: 297 },
  { label: 'A5', w: 148, h: 210 },
];

interface PageInfo {
  number: number;
  widthPt: number;
  heightPt: number;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
  thumbnail: string;
}

interface MeasurePoint {
  x: number; // ratio 0-1 on canvas
  y: number;
}

const ptToMm = (pt: number) => pt * 25.4 / 72;
const ptToIn = (pt: number) => pt / 72;

const findClosestKdpFormat = (wMm: number, hMm: number): { format: typeof KDP_FORMATS[0]; isExactMatch: boolean; isClose: boolean; diff: number } => {
  let best = KDP_FORMATS[0];
  let bestDiff = Infinity;
  for (const f of KDP_FORMATS) {
    const diff = Math.abs(f.w - wMm) + Math.abs(f.h - hMm);
    if (diff < bestDiff) { bestDiff = diff; best = f; }
  }
  return { format: best, isExactMatch: bestDiff < 2, isClose: bestDiff < 10, diff: bestDiff };
};

const PdfKdpAnalyzer: React.FC = () => {
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<MeasurePoint[]>([]);
  const [measurements, setMeasurements] = useState<{ distMm: number; distIn: number }[]>([]);
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('');

  const currentPage = pages[selectedPage];

  // Draw the selected page thumbnail + measurement overlay
  useEffect(() => {
    if (!currentPage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const scale = zoom;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw measurement lines
      if (measurePoints.length >= 2) {
        for (let i = 0; i < measurePoints.length - 1; i += 2) {
          const p1 = measurePoints[i];
          const p2 = measurePoints[i + 1];
          ctx.beginPath();
          ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
          ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw endpoints
          [p1, p2].forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
          });

          // Label
          const m = measurements[Math.floor(i / 2)];
          if (m) {
            const mx = ((p1.x + p2.x) / 2) * canvas.width;
            const my = ((p1.y + p2.y) / 2) * canvas.height - 10;
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText(`${m.distMm.toFixed(1)}mm / ${m.distIn.toFixed(2)}"`, mx, my);
          }
        }
      }

      // Draw pending single point
      if (measurePoints.length % 2 === 1) {
        const p = measurePoints[measurePoints.length - 1];
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
      }

      // Draw KDP safe zone guides
      if (currentPage) {
        const marginPx = (KDP_MARGINS.outerMin / currentPage.widthMm) * canvas.width;
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(marginPx, marginPx, canvas.width - 2 * marginPx, canvas.height - 2 * marginPx);
        ctx.setLineDash([]);
      }
    };
    img.src = currentPage.thumbnail;
  }, [currentPage, measurePoints, measurements, zoom]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!measureMode || !canvasRef.current || !currentPage) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const newPoints = [...measurePoints, { x, y }];
    setMeasurePoints(newPoints);

    if (newPoints.length % 2 === 0) {
      const p1 = newPoints[newPoints.length - 2];
      const p2 = newPoints[newPoints.length - 1];
      const dx = (p2.x - p1.x) * currentPage.widthMm;
      const dy = (p2.y - p1.y) * currentPage.heightMm;
      const distMm = Math.sqrt(dx * dx + dy * dy);
      const distIn = distMm / 25.4;
      setMeasurements(prev => [...prev, { distMm, distIn }]);
      toast.info(`Distance: ${distMm.toFixed(1)} mm (${distIn.toFixed(2)}")`);
    }
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.includes('pdf')) {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    setProgress(0);
    setPages([]);
    setMeasurePoints([]);
    setMeasurements([]);
    setSelectedPage(0);

    try {
      // Dynamically import pdf.js
      const pdfjsLib = await import('pdfjs-dist');
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      
      // Disable worker - use main thread
      pdfjs.GlobalWorkerOptions.workerSrc = '';

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const extracted: PageInfo[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        setProgress(Math.round((i / pdf.numPages) * 100));
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1 });

        // Thumbnail at reasonable size
        const thumbScale = Math.min(800 / vp.width, 800 / vp.height, 2);
        const thumbVp = page.getViewport({ scale: thumbScale });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        canvas.width = thumbVp.width;
        canvas.height = thumbVp.height;
        await page.render({
          canvasContext: ctx,
          viewport: thumbVp,
          // @ts-ignore - pdfjs-dist types issue
          canvas: canvas,
        }).promise;

        extracted.push({
          number: i,
          widthPt: vp.width,
          heightPt: vp.height,
          widthMm: ptToMm(vp.width),
          heightMm: ptToMm(vp.height),
          widthIn: ptToIn(vp.width),
          heightIn: ptToIn(vp.height),
          thumbnail: canvas.toDataURL('image/jpeg', 0.8),
        });
      }

      setPages(extracted);
      toast.success(`${extracted.length} pages analysées !`);
    } catch (error) {
      console.error('Erreur analyse PDF:', error);
      toast.error("Erreur lors de l'analyse du PDF");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getKdpCompliance = () => {
    if (!currentPage) return null;
    return findClosestKdpFormat(currentPage.widthMm, currentPage.heightMm);
  };

  const exportReport = useCallback(() => {
    if (pages.length === 0) return;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport d\'Analyse PDF KDP', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fichier: ${fileName}`, 105, 30, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 105, 36, { align: 'center' });

    let y = 50;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resume', 20, y); y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre de pages: ${pages.length}`, 20, y); y += 6;

    const p1 = pages[0];
    doc.text(`Dimensions page 1: ${p1.widthMm.toFixed(1)} x ${p1.heightMm.toFixed(1)} mm (${p1.widthIn.toFixed(2)} x ${p1.heightIn.toFixed(2)}")`, 20, y); y += 6;

    const { format, isExactMatch } = findClosestKdpFormat(p1.widthMm, p1.heightMm);
    doc.text(`Format KDP le plus proche: ${format.label} ${isExactMatch ? '(CONFORME)' : '(NON CONFORME)'}`, 20, y); y += 6;

    doc.text(`Marges minimales KDP requises: ${KDP_MARGINS.outerMin}mm (ext.), ${KDP_MARGINS.innerMin}mm (gouttiere)`, 20, y); y += 10;

    // Pages with different dimensions
    const uniqueSizes = new Set(pages.map(p => `${p.widthPt}x${p.heightPt}`));
    if (uniqueSizes.size > 1) {
      doc.setFont('helvetica', 'bold');
      doc.text('ATTENTION: Pages de tailles differentes detectees !', 20, y); y += 8;
      doc.setFont('helvetica', 'normal');
      pages.forEach(p => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`  Page ${p.number}: ${p.widthMm.toFixed(1)} x ${p.heightMm.toFixed(1)} mm`, 20, y); y += 5;
      });
    }

    if (measurements.length > 0) {
      y += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Mesures interactives', 20, y); y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      measurements.forEach((m, i) => {
        doc.text(`  Mesure ${i + 1}: ${m.distMm.toFixed(1)} mm (${m.distIn.toFixed(2)}")`, 20, y); y += 5;
      });
    }

    doc.text('Genere par EbookStudio Pro - Analyseur KDP', 105, 285, { align: 'center' });
    doc.save(`analyse-kdp-${fileName.replace(/\.pdf$/i, '')}.pdf`);
    toast.success('Rapport PDF téléchargé !');
  }, [pages, measurements, fileName]);

  const compliance = getKdpCompliance();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-500/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
              <Ruler className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                Analyseur PDF KDP
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  NOUVEAU
                </Badge>
              </CardTitle>
              <CardDescription>
                Mesurez les dimensions, vérifiez la conformité KDP et analysez vos PDF comme Acrobat Reader
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upload */}
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
            <Input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="pdf-analyze-upload" disabled={isProcessing} />
            <label htmlFor="pdf-analyze-upload" className="cursor-pointer">
              <FileUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">{fileName || 'Cliquez pour analyser un PDF'}</p>
              <p className="text-sm text-muted-foreground mt-1">Dimensions, marges, conformité KDP</p>
            </label>
          </div>
          {isProcessing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Analyse en cours...</span></div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {pages.length > 0 && (
        <>
          {/* Compliance Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {compliance?.isExactMatch ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : compliance?.isClose ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                Rapport de conformité KDP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Page Dimensions */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Dimensions page {selectedPage + 1}</h4>
                  <p className="text-2xl font-bold">{currentPage!.widthMm.toFixed(1)} × {currentPage!.heightMm.toFixed(1)} mm</p>
                  <p className="text-sm text-muted-foreground">{currentPage!.widthIn.toFixed(2)} × {currentPage!.heightIn.toFixed(2)} pouces</p>
                  <p className="text-xs text-muted-foreground">{currentPage!.widthPt.toFixed(0)} × {currentPage!.heightPt.toFixed(0)} pts</p>
                </div>

                {/* KDP Match */}
                <div className={`rounded-lg p-4 space-y-2 ${compliance?.isExactMatch ? 'bg-green-500/10 border border-green-500/30' : compliance?.isClose ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Format KDP</h4>
                  <p className="text-xl font-bold">{compliance?.format.label}</p>
                  <p className="text-sm">
                    {compliance?.isExactMatch ? (
                      <span className="text-green-600 font-medium">✅ Conforme KDP</span>
                    ) : compliance?.isClose ? (
                      <span className="text-amber-600 font-medium">⚠️ Proche (écart {compliance.diff.toFixed(1)}mm)</span>
                    ) : (
                      <span className="text-red-600 font-medium">❌ Non conforme (écart {compliance?.diff.toFixed(1)}mm)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Attendu: {compliance?.format.w} × {compliance?.format.h} mm</p>
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Résumé</h4>
                  <p className="text-sm"><strong>{pages.length}</strong> pages</p>
                  <p className="text-sm">Marges min KDP: <strong>{KDP_MARGINS.outerMin}mm</strong></p>
                  <p className="text-sm">Gouttière min: <strong>{KDP_MARGINS.innerMin}mm</strong></p>
                  {new Set(pages.map(p => `${p.widthPt}x${p.heightPt}`)).size > 1 && (
                    <Badge variant="destructive" className="text-xs">⚠️ Tailles différentes détectées</Badge>
                  )}
                </div>
              </div>

              {/* All pages dimensions if mixed */}
              {new Set(pages.map(p => `${p.widthPt}x${p.heightPt}`)).size > 1 && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-red-600 mb-2">Pages de tailles différentes :</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    {pages.map(p => (
                      <div key={p.number} className="bg-background/50 rounded p-2 text-center cursor-pointer hover:ring-2 ring-primary" onClick={() => setSelectedPage(p.number - 1)}>
                        <span className="font-medium">P.{p.number}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{p.widthMm.toFixed(0)}×{p.heightMm.toFixed(0)}mm</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Measure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mouse className="w-5 h-5 text-blue-500" />
                Mesure interactive
              </CardTitle>
              <CardDescription>
                Cliquez 2 points sur la page pour mesurer une distance (comme Acrobat)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Button variant={measureMode ? 'default' : 'outline'} size="sm" onClick={() => { setMeasureMode(!measureMode); setMeasurePoints([]); setMeasurements([]); }}>
                  <Ruler className="w-4 h-4 mr-1" />
                  {measureMode ? 'Mode mesure actif' : 'Activer la mesure'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(z + 0.25, 3))}><ZoomIn className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}><ZoomOut className="w-4 h-4" /></Button>
                <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
                {measurePoints.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => { setMeasurePoints([]); setMeasurements([]); }}>
                    Effacer mesures
                  </Button>
                )}
              </div>

              {/* Page selector */}
              <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
                {pages.map((p, i) => (
                  <Button
                    key={p.number}
                    variant={selectedPage === i ? 'default' : 'outline'}
                    size="sm"
                    className="shrink-0"
                    onClick={() => { setSelectedPage(i); setMeasurePoints([]); setMeasurements([]); }}
                  >
                    P.{p.number}
                  </Button>
                ))}
              </div>

              {/* Canvas */}
              <div className="overflow-auto max-h-[700px] border rounded-lg bg-muted/30 p-2">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className={`mx-auto ${measureMode ? 'cursor-crosshair' : 'cursor-default'}`}
                  style={{ maxWidth: '100%' }}
                />
              </div>

              {/* Measurements list */}
              {measurements.length > 0 && (
                <div className="mt-4 space-y-1">
                  <h4 className="font-semibold text-sm">Mesures effectuées :</h4>
                  {measurements.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 rounded px-3 py-1">
                      <Ruler className="w-3 h-3 text-red-500" />
                      <span>Mesure {i + 1}: <strong>{m.distMm.toFixed(1)} mm</strong> ({m.distIn.toFixed(2)}")</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Report */}
          <Card className="border-2 border-dashed border-orange-500/50">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Télécharger le rapport complet</h3>
                  <p className="text-sm text-muted-foreground">Dimensions, conformité KDP, mesures</p>
                </div>
                <Button onClick={exportReport} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <Download className="w-5 h-5 mr-2" />
                  Rapport PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PdfKdpAnalyzer;
