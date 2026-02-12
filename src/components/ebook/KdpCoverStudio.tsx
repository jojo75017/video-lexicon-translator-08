import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Ruler, FileText, Copy, Download, Info, Calculator, Palette } from 'lucide-react';
import { toast } from 'sonner';

// KDP trim sizes (inches)
const KDP_FORMATS = [
  { id: '5x8', label: '5" x 8"', w: 5, h: 8, category: 'KDP' },
  { id: '5.06x7.81', label: '5.06" x 7.81"', w: 5.06, h: 7.81, category: 'KDP' },
  { id: '5.25x8', label: '5.25" x 8"', w: 5.25, h: 8, category: 'KDP' },
  { id: '5.5x8.5', label: '5.5" x 8.5"', w: 5.5, h: 8.5, category: 'KDP' },
  { id: '6x9', label: '6" x 9"', w: 6, h: 9, category: 'KDP' },
  { id: '6.14x9.21', label: '6.14" x 9.21"', w: 6.14, h: 9.21, category: 'KDP' },
  { id: '6.69x9.61', label: '6.69" x 9.61"', w: 6.69, h: 9.61, category: 'KDP' },
  { id: '7x10', label: '7" x 10"', w: 7, h: 10, category: 'KDP' },
  { id: '7.44x9.69', label: '7.44" x 9.69"', w: 7.44, h: 9.69, category: 'KDP' },
  { id: '7.5x9.25', label: '7.5" x 9.25"', w: 7.5, h: 9.25, category: 'KDP' },
  { id: '8x10', label: '8" x 10"', w: 8, h: 10, category: 'KDP' },
  { id: '8.5x11', label: '8.5" x 11" (Letter)', w: 8.5, h: 11, category: 'KDP' },
  { id: '8.25x6', label: '8.25" x 6"', w: 8.25, h: 6, category: 'KDP Paysage' },
  { id: '8.25x8.25', label: '8.25" x 8.25"', w: 8.25, h: 8.25, category: 'KDP Carré' },
  // French pocket formats
  { id: '11x17.5cm', label: '11 x 17.5 cm', w: 4.33, h: 6.89, category: 'Poche FR' },
  { id: '12x19cm', label: '12 x 19 cm', w: 4.72, h: 7.48, category: 'Poche FR' },
  { id: '13x20cm', label: '13 x 20 cm', w: 5.12, h: 7.87, category: 'Poche FR' },
  { id: '14x21cm', label: '14 x 21 cm', w: 5.51, h: 8.27, category: 'Poche FR' },
];

const PAPER_TYPES = [
  { id: 'white', label: 'Papier blanc', factor: 0.002252 },
  { id: 'cream', label: 'Papier crème', factor: 0.0025 },
  { id: 'color', label: 'Papier couleur (premium)', factor: 0.002347 },
];

const BLEED_INCH = 0.125; // 3.175mm standard bleed

function inToMm(inches: number) { return Math.round(inches * 25.4 * 100) / 100; }
function mmToIn(mm: number) { return Math.round(mm / 25.4 * 1000) / 1000; }

const KdpCoverStudio: React.FC = () => {
  const [formatId, setFormatId] = useState('6x9');
  const [pageCount, setPageCount] = useState(172);
  const [paperType, setPaperType] = useState('white');
  const [hasBleed, setHasBleed] = useState(true);
  const [activeTab, setActiveTab] = useState('calculator');

  const format = useMemo(() => KDP_FORMATS.find(f => f.id === formatId) || KDP_FORMATS[4], [formatId]);
  const paper = useMemo(() => PAPER_TYPES.find(p => p.id === paperType) || PAPER_TYPES[0], [paperType]);

  const calculations = useMemo(() => {
    const spineWidth = pageCount * paper.factor;
    const bleed = hasBleed ? BLEED_INCH : 0;
    
    const coverWidth = format.w + bleed;
    const coverHeight = format.h + (bleed * 2);
    const totalWidth = (coverWidth * 2) + spineWidth;
    
    return {
      spineWidth,
      coverWidth,
      coverHeight,
      totalWidth,
      totalHeight: coverHeight,
      bleed,
      barcodeW: 2.0,
      barcodeH: 1.2,
      // mm versions
      spineWidthMm: inToMm(spineWidth),
      coverWidthMm: inToMm(coverWidth),
      coverHeightMm: inToMm(coverHeight),
      totalWidthMm: inToMm(totalWidth),
      totalHeightMm: inToMm(coverHeight),
      trimW: format.w,
      trimH: format.h,
      trimWmm: inToMm(format.w),
      trimHmm: inToMm(format.h),
      // Pixels at 300 DPI
      totalWidthPx: Math.round(totalWidth * 300),
      totalHeightPx: Math.round(coverHeight * 300),
    };
  }, [format, pageCount, paper, hasBleed]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  const acrobatSettings = useMemo(() => ({
    pageWidth: `${calculations.totalWidth.toFixed(3)} in (${calculations.totalWidthMm} mm)`,
    pageHeight: `${calculations.totalHeight.toFixed(3)} in (${calculations.totalHeightMm} mm)`,
    widthPt: Math.round(calculations.totalWidth * 72),
    heightPt: Math.round(calculations.totalHeight * 72),
  }), [calculations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30">
          <Ruler className="w-7 h-7 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">📐 Studio Couverture KDP</h2>
          <p className="text-sm text-muted-foreground">Calculateur de dimensions & paramètres Acrobat Reader</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="calculator" className="text-xs"><Calculator className="w-3 h-3 mr-1" />Calculateur</TabsTrigger>
          <TabsTrigger value="acrobat" className="text-xs"><FileText className="w-3 h-3 mr-1" />Acrobat</TabsTrigger>
          <TabsTrigger value="template" className="text-xs"><BookOpen className="w-3 h-3 mr-1" />Gabarit</TabsTrigger>
          <TabsTrigger value="zones" className="text-xs"><Palette className="w-3 h-3 mr-1" />Zones</TabsTrigger>
          <TabsTrigger value="checklist" className="text-xs"><Info className="w-3 h-3 mr-1" />Checklist</TabsTrigger>
        </TabsList>

        {/* ====== CALCULATEUR ====== */}
        <TabsContent value="calculator" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Format du livre</Label>
              <Select value={formatId} onValueChange={setFormatId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['KDP', 'Poche FR', 'KDP Paysage', 'KDP Carré'].map(cat => {
                    const items = KDP_FORMATS.filter(f => f.category === cat);
                    if (items.length === 0) return null;
                    return (
                      <React.Fragment key={cat}>
                        <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{cat}</div>
                        {items.map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nombre de pages</Label>
              <Input type="number" min={24} max={828} value={pageCount} onChange={e => setPageCount(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Type de papier</Label>
              <Select value={paperType} onValueChange={setPaperType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAPER_TYPES.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="bleed" checked={hasBleed} onChange={e => setHasBleed(e.target.checked)} className="rounded" />
            <Label htmlFor="bleed">Fond perdu (bleed) - 0.125" / 3.175mm</Label>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">📏 Dimensions de coupe (trim)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ResultRow label="Largeur page" value={`${format.w}" (${calculations.trimWmm}mm)`} onCopy={() => copyToClipboard(`${format.w}`)} />
                <ResultRow label="Hauteur page" value={`${format.h}" (${calculations.trimHmm}mm)`} onCopy={() => copyToClipboard(`${format.h}`)} />
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">📐 Largeur du dos (tranche)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ResultRow label="Dos" value={`${calculations.spineWidth.toFixed(3)}" (${calculations.spineWidthMm}mm)`} onCopy={() => copyToClipboard(`${calculations.spineWidth.toFixed(3)}`)} />
                <p className="text-xs text-muted-foreground">Formule : {pageCount} pages × {paper.factor}" = {calculations.spineWidth.toFixed(3)}"</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">📄 Dimensions globales (couverture complète)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ResultRow label="Largeur totale" value={`${calculations.totalWidth.toFixed(3)}" (${calculations.totalWidthMm}mm)`} onCopy={() => copyToClipboard(`${calculations.totalWidth.toFixed(3)}`)} />
                <ResultRow label="Hauteur totale" value={`${calculations.totalHeight.toFixed(3)}" (${calculations.totalHeightMm}mm)`} onCopy={() => copyToClipboard(`${calculations.totalHeight.toFixed(3)}`)} />
                <div className="pt-1 border-t border-border">
                  <ResultRow label="En pixels (300 DPI)" value={`${calculations.totalWidthPx} × ${calculations.totalHeightPx} px`} onCopy={() => copyToClipboard(`${calculations.totalWidthPx}x${calculations.totalHeightPx}`)} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">📊 Code-barres ISBN</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <ResultRow label="Taille" value={`2.000" × 1.200" (50.80 × 30.48mm)`} onCopy={() => copyToClipboard('2.000 x 1.200')} />
                <p className="text-xs text-muted-foreground">Position : coin inférieur droit de la 4ème de couverture</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ====== ACROBAT READER ====== */}
        <TabsContent value="acrobat" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                Paramètres Adobe Acrobat / Acrobat Reader
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <h3 className="font-bold text-sm mb-3">📋 Configuration du document PDF</h3>
                <p className="text-xs text-muted-foreground mb-4">Paramètres pour Acrobat Pro → Fichier → Propriétés → Description / Page</p>
                
                <div className="space-y-3">
                  <AcrobatStep step={1} title="Ouvrir les propriétés" desc="Menu → Fichier → Propriétés (Ctrl+D)" />
                  <AcrobatStep step={2} title="Onglet « Description »" desc="Vérifier que le titre et l'auteur sont renseignés" />
                  <AcrobatStep step={3} title="Vérifier les dimensions de page" desc={`Page size: ${acrobatSettings.pageWidth} × ${acrobatSettings.pageHeight}`} />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold text-sm mb-3">🖨️ Impression / Export PDF (Fichier → Imprimer)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <SettingItem label="Taille du papier" value="Personnalisée" />
                  <SettingItem label="Largeur" value={acrobatSettings.pageWidth} copyable onCopy={() => copyToClipboard(calculations.totalWidth.toFixed(3))} />
                  <SettingItem label="Hauteur" value={acrobatSettings.pageHeight} copyable onCopy={() => copyToClipboard(calculations.totalHeight.toFixed(3))} />
                  <SettingItem label="Points (pts)" value={`${acrobatSettings.widthPt} × ${acrobatSettings.heightPt} pts`} copyable onCopy={() => copyToClipboard(`${acrobatSettings.widthPt} ${acrobatSettings.heightPt}`)} />
                  <SettingItem label="Mise à l'échelle" value="Aucune (100%)" />
                  <SettingItem label="Orientation" value="Paysage (pour couverture complète)" />
                  <SettingItem label="Résolution" value="300 DPI minimum" />
                  <SettingItem label="Espace colorimétrique" value="CMJN (CMYK) recommandé" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <h3 className="font-bold text-sm mb-3">✅ Paramètres Acrobat Pro - Preflight</h3>
                <div className="space-y-2 text-sm">
                  <p>• <strong>Aplatir les transparences</strong> : Oui</p>
                  <p>• <strong>Incorporer toutes les polices</strong> : Oui (100%)</p>
                  <p>• <strong>Convertir les couleurs en CMJN</strong> : Recommandé pour impression</p>
                  <p>• <strong>Supprimer les métadonnées inutiles</strong> : Oui</p>
                  <p>• <strong>PDF/X-1a ou PDF/X-3</strong> : Standard recommandé par KDP</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-sm mb-3">⚠️ Paramètres pour le manuscrit intérieur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <SettingItem label="Taille de page" value={`${format.w}" × ${format.h}" (${calculations.trimWmm} × ${calculations.trimHmm}mm)`} />
                  <SettingItem label="Marges intérieures (gouttière)" value="≥ 0.375&quot; (9.5mm)" />
                  <SettingItem label="Marges extérieures" value="≥ 0.25&quot; (6.35mm)" />
                  <SettingItem label="Marge haut/bas" value="≥ 0.25&quot; (6.35mm)" />
                  <SettingItem label="Fond perdu (si images)" value={hasBleed ? '0.125" (3.175mm) chaque côté' : 'Non activé'} />
                  <SettingItem label="Nombre de pages" value={`${pageCount} (doit être pair)`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== GABARIT VISUEL ====== */}
        <TabsContent value="template" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Gabarit visuel - Livre {format.w}" × {format.h}" - {pageCount} pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <CoverTemplate
                  trimW={format.w}
                  trimH={format.h}
                  spineWidth={calculations.spineWidth}
                  bleed={calculations.bleed}
                  totalWidth={calculations.totalWidth}
                  totalHeight={calculations.totalHeight}
                  totalWidthMm={calculations.totalWidthMm}
                  totalHeightMm={calculations.totalHeightMm}
                  spineWidthMm={calculations.spineWidthMm}
                  trimWmm={calculations.trimWmm}
                  trimHmm={calculations.trimHmm}
                  pageCount={pageCount}
                  paperLabel={paper.label}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== ZONES ====== */}
        <TabsContent value="zones" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-black">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Ligne noire continue = Taille de coupe</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                C'est ici que votre livre sera découpé au format final. Tout élément important doit être à l'intérieur.
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Ligne pointillée bleue = Pliure du dos</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                L'emplacement des pliures est susceptible de varier sensiblement. Prévoir une marge d'erreur.
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-white dark:border-l-gray-300">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Zone blanche = Zone active (safe zone)</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Positionnez les logos, le texte et les images importants UNIQUEMENT dans cette zone.
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Zone rouge = Fond perdu (bleed)</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Les illustrations d'arrière-plan doivent remplir cette zone. Ne placez PAS de logos, texte ou images importants ici.
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-yellow-400 md:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Zone jaune = Code-barres ISBN</CardTitle></CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Emplacement : 2.000" × 1.200" (50.80mm × 30.48mm) — Coin inférieur droit de la 4ème de couverture. Ne rien placer dessus.
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ====== CHECKLIST ====== */}
        <TabsContent value="checklist" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-green-500" />
                ✅ Checklist avant upload KDP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {[
                  { text: 'Dimensions du PDF de couverture correctes', detail: `${calculations.totalWidth.toFixed(3)}" × ${calculations.totalHeight.toFixed(3)}"` },
                  { text: 'Résolution minimum 300 DPI', detail: `${calculations.totalWidthPx} × ${calculations.totalHeightPx} px` },
                  { text: 'Fond perdu inclus (0.125" / 3.175mm)', detail: hasBleed ? '✅ Activé' : '⚠️ Non activé' },
                  { text: 'Polices incorporées à 100%', detail: 'Acrobat → Fichier → Propriétés → Polices' },
                  { text: 'Espace colorimétrique CMJN', detail: 'Recommandé pour impression offset' },
                  { text: 'Aucune transparence non aplatie', detail: 'Acrobat → Preflight → Aplatir' },
                  { text: 'Code-barres ISBN non recouvert', detail: '2" × 1.2" en bas à droite 4ème couv' },
                  { text: 'Texte dans la zone active (safe zone)', detail: 'Min 0.25" des bords de coupe' },
                  { text: 'Nombre de pages pair', detail: pageCount % 2 === 0 ? '✅ Pair' : '⚠️ Impair - ajoutez une page blanche' },
                  { text: 'Format PDF/X-1a ou PDF/X-3', detail: 'Standard impression professionnelle' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <span className="text-lg">☐</span>
                    <div>
                      <p className="font-medium">{item.text}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Sub-components

const ResultRow: React.FC<{ label: string; value: string; onCopy: () => void }> = ({ label, value, onCopy }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <span className="font-mono font-semibold text-foreground">{value}</span>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onCopy}>
        <Copy className="w-3 h-3" />
      </Button>
    </div>
  </div>
);

const AcrobatStep: React.FC<{ step: number; title: string; desc: string }> = ({ step, title, desc }) => (
  <div className="flex items-start gap-3">
    <Badge variant="outline" className="rounded-full w-6 h-6 flex items-center justify-center text-xs shrink-0">{step}</Badge>
    <div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const SettingItem: React.FC<{ label: string; value: string; copyable?: boolean; onCopy?: () => void }> = ({ label, value, copyable, onCopy }) => (
  <div className="flex items-center justify-between p-2 rounded bg-background border border-border">
    <span className="text-xs text-muted-foreground">{label}</span>
    <div className="flex items-center gap-1">
      <span className="text-xs font-mono font-semibold text-foreground">{value}</span>
      {copyable && onCopy && (
        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={onCopy}><Copy className="w-3 h-3" /></Button>
      )}
    </div>
  </div>
);

// Visual template similar to the KDP reference image
const CoverTemplate: React.FC<{
  trimW: number; trimH: number; spineWidth: number; bleed: number;
  totalWidth: number; totalHeight: number;
  totalWidthMm: number; totalHeightMm: number; spineWidthMm: number;
  trimWmm: number; trimHmm: number; pageCount: number; paperLabel: string;
}> = (props) => {
  const scale = 60; // pixels per inch for visualization
  const svgW = props.totalWidth * scale + 40;
  const svgH = props.totalHeight * scale + 40;
  const ox = 20, oy = 20;

  const backX = ox;
  const spineX = ox + (props.trimW + props.bleed) * scale;
  const frontX = spineX + props.spineWidth * scale;
  const fullW = props.totalWidth * scale;
  const fullH = props.totalHeight * scale;
  const bleedPx = props.bleed * scale;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-4xl border rounded-lg bg-white dark:bg-gray-900" style={{ aspectRatio: `${svgW}/${svgH}` }}>
        {/* Bleed zone (red) */}
        <rect x={ox} y={oy} width={fullW} height={fullH} fill="#fecaca" stroke="#ef4444" strokeWidth="1" />
        
        {/* Safe zone - back cover */}
        <rect x={ox + bleedPx} y={oy + bleedPx} width={(props.trimW) * scale} height={(props.trimH) * scale} fill="white" stroke="#000" strokeWidth="2" />
        
        {/* Spine */}
        <rect x={spineX} y={oy} width={props.spineWidth * scale} height={fullH} fill="#e0e7ff" stroke="#3b82f6" strokeWidth="1" strokeDasharray="6 3" />
        
        {/* Safe zone - front cover */}
        <rect x={frontX} y={oy + bleedPx} width={props.trimW * scale} height={props.trimH * scale} fill="white" stroke="#000" strokeWidth="2" />
        
        {/* Barcode area */}
        <rect x={ox + bleedPx + 10} y={oy + fullH - bleedPx - 1.2 * scale - 10} width={2 * scale} height={1.2 * scale} fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
        <text x={ox + bleedPx + 10 + scale} y={oy + fullH - bleedPx - 0.6 * scale - 5} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#000">Code-barres</text>
        <text x={ox + bleedPx + 10 + scale} y={oy + fullH - bleedPx - 0.6 * scale + 7} textAnchor="middle" fontSize="7" fill="#000">2" × 1.2"</text>
        
        {/* Labels */}
        <text x={ox + bleedPx + props.trimW * scale / 2} y={oy + fullH - bleedPx - 5} textAnchor="middle" fontSize="9" fill="#666">
          4ème de couverture {props.trimW}" × {props.trimH}" ({props.trimWmm} × {props.trimHmm}mm)
        </text>
        <text x={frontX + props.trimW * scale / 2} y={oy + fullH - bleedPx - 5} textAnchor="middle" fontSize="9" fill="#666">
          1ère de couverture {props.trimW}" × {props.trimH}" ({props.trimWmm} × {props.trimHmm}mm)
        </text>
        
        {/* Spine label */}
        <text x={spineX + props.spineWidth * scale / 2} y={oy + fullH / 2} textAnchor="middle" fontSize="7" fill="#3b82f6" transform={`rotate(-90, ${spineX + props.spineWidth * scale / 2}, ${oy + fullH / 2})`}>
          Dos {props.spineWidth.toFixed(3)}" ({props.spineWidthMm}mm)
        </text>

        {/* Right side info */}
        <text x={frontX + props.trimW * scale / 2} y={oy + 50} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#000">Livre broché</text>
        <text x={frontX + props.trimW * scale / 2} y={oy + 68} textAnchor="middle" fontSize="9" fill="#666">Modèle de couverture</text>
        <text x={frontX + props.trimW * scale / 2} y={oy + 95} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#000">
          {props.trimW}" × {props.trimH}"
        </text>
        <text x={frontX + props.trimW * scale / 2} y={oy + 112} textAnchor="middle" fontSize="9" fill="#666">
          ({props.trimWmm} × {props.trimHmm}mm)
        </text>
        <text x={frontX + props.trimW * scale / 2} y={oy + 140} textAnchor="middle" fontSize="9" fill="#333">
          Dimensions globales {props.totalWidth.toFixed(3)}" × {props.totalHeight.toFixed(3)}"
        </text>
        <text x={frontX + props.trimW * scale / 2} y={oy + 155} textAnchor="middle" fontSize="9" fill="#666">
          ({props.totalWidthMm} × {props.totalHeightMm}mm)
        </text>
        <text x={frontX + props.trimW * scale / 2} y={oy + 180} textAnchor="middle" fontSize="9" fill="#333">
          {props.pageCount} pages — {props.paperLabel}
        </text>
      </svg>
    </div>
  );
};

export default KdpCoverStudio;
