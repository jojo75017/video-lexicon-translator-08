import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, AlertTriangle, Ruler } from 'lucide-react';

const TEAL = '#008296';

type Paper = 'white' | 'cream' | 'color';

// Épaisseur par page (en pouces) selon le papier KDP
const THICKNESS: Record<Paper, number> = { white: 0.002252, cream: 0.0025, color: 0.002347 };
const PAPER_LABEL: Record<Paper, string> = { white: 'Blanc', cream: 'Crème', color: 'Couleur' };

const TRIM_SIZES = [
  { id: '5x8', label: '5 × 8 po (12,7 × 20,32 cm)', w: 5, h: 8 },
  { id: '5.25x8', label: '5,25 × 8 po', w: 5.25, h: 8 },
  { id: '5.5x8.5', label: '5,5 × 8,5 po', w: 5.5, h: 8.5 },
  { id: '6x9', label: '6 × 9 po (15,24 × 22,86 cm)', w: 6, h: 9 },
  { id: '7x10', label: '7 × 10 po', w: 7, h: 10 },
  { id: '8.5x11', label: '8,5 × 11 po', w: 8.5, h: 11 },
];

// Marge intérieure (gutter) minimale selon le nombre de pages (KDP)
const gutterFor = (pages: number) => {
  if (pages <= 150) return 0.375;
  if (pages <= 300) return 0.5;
  if (pages <= 500) return 0.625;
  if (pages <= 700) return 0.75;
  return 0.875;
};

const inToCm = (v: number) => (v * 2.54).toFixed(2);

const PrintProofChecker: React.FC = () => {
  const [pages, setPages] = useState(200);
  const [paper, setPaper] = useState<Paper>('cream');
  const [trim, setTrim] = useState('6x9');

  const result = useMemo(() => {
    const size = TRIM_SIZES.find((t) => t.id === trim)!;
    const spine = pages * THICKNESS[paper];
    const bleed = 0.125;
    const gutter = gutterFor(pages);
    const outerMargin = 0.25;
    // Largeur totale couverture wrap = 2×(trim+bleed) + spine
    const wrapW = 2 * (size.w + bleed) + spine;
    const wrapH = size.h + 2 * bleed;
    const checks = [
      { ok: pages >= 24, label: `Minimum 24 pages requis par KDP (actuel : ${pages})` },
      { ok: pages <= 828, label: `Maximum ~828 pages selon le papier (actuel : ${pages})` },
      { ok: spine >= 0.06 || pages < 80, label: `Dos imprimable si ≥ 80 pages (dos : ${spine.toFixed(3)} po)` },
      { ok: true, label: `Fond perdu (bleed) de ${bleed} po appliqué sur tous les bords` },
      { ok: true, label: `Marge de reliure (gutter) recommandée : ${gutter} po` },
    ];
    return { size, spine, bleed, gutter, outerMargin, wrapW, wrapH, checks };
  }, [pages, paper, trim]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Calcule le dos, le fond perdu, la marge de reliure et les dimensions exactes de la couverture
        broché avant de commander ton épreuve papier KDP.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <Label className="text-xs">Nombre de pages</Label>
          <Input type="number" min={1} value={pages} onChange={(e) => setPages(Math.max(1, parseInt(e.target.value) || 0))} />
        </div>
        <div>
          <Label className="text-xs">Type de papier</Label>
          <Select value={paper} onValueChange={(v) => setPaper(v as Paper)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{(Object.keys(PAPER_LABEL) as Paper[]).map((p) => <SelectItem key={p} value={p}>{PAPER_LABEL[p]}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Format (trim size)</Label>
          <Select value={trim} onValueChange={setTrim}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{TRIM_SIZES.map((t) => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-joy-ink/10">
          <CardContent className="p-4 space-y-2">
            <h4 className="text-sm font-bold flex items-center gap-1.5" style={{ color: TEAL }}>
              <Ruler className="h-4 w-4" /> Dimensions calculées
            </h4>
            <Row label="Épaisseur du dos" value={`${result.spine.toFixed(3)} po (${inToCm(result.spine)} cm)`} />
            <Row label="Couverture wrap (L × H)" value={`${result.wrapW.toFixed(3)} × ${result.wrapH.toFixed(3)} po`} />
            <Row label="Wrap en cm" value={`${inToCm(result.wrapW)} × ${inToCm(result.wrapH)} cm`} />
            <Row label="Fond perdu (bleed)" value={`${result.bleed} po`} />
            <Row label="Marge de reliure (gutter)" value={`${result.gutter} po`} />
            <Row label="Marge extérieure mini" value={`${result.outerMargin} po`} />
          </CardContent>
        </Card>

        <Card className="border-joy-ink/10">
          <CardContent className="p-4 space-y-2">
            <h4 className="text-sm font-bold mb-1">Contrôles avant épreuve</h4>
            {result.checks.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {c.ok
                  ? <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                  : <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#E94E77' }} />}
                <span className={c.ok ? '' : 'text-red-600 font-medium'}>{c.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-xs border-b border-joy-ink/5 py-1">
    <span className="text-joy-ink/60">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

export default PrintProofChecker;
