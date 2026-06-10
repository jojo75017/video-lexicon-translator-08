import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';

// ============================================================================
// Studio Livres à Contenu Faible/Nul (low/no-content KDP).
// Génère un VRAI intérieur PDF (carnets, journaux, planners, cahiers) aux
// dimensions exactes KDP, prêt à uploader. Tracé déterministe (pas d'IA).
// ============================================================================

type TrimId = '6x9' | '8.5x11' | '5x8' | '7x10';
type RulingId = 'lined' | 'dotted' | 'blank' | 'grid' | 'planner';

// Dimensions de coupe KDP en pouces (largeur × hauteur).
const TRIMS: Record<TrimId, { label: string; w: number; h: number }> = {
  '6x9': { label: '6 × 9 po (livre standard)', w: 6, h: 9 },
  '5x8': { label: '5 × 8 po (compact)', w: 5, h: 8 },
  '7x10': { label: '7 × 10 po (carnet)', w: 7, h: 10 },
  '8.5x11': { label: '8,5 × 11 po (grand format)', w: 8.5, h: 11 },
};

const RULINGS: Record<RulingId, string> = {
  lined: 'Lignée (cahier)',
  dotted: 'Pointillés (bullet journal)',
  grid: 'Quadrillée (grille)',
  blank: 'Vierge (croquis)',
  planner: 'Planner journalier',
};

// Marge intérieure KDP (gutter) recommandée selon le nombre de pages.
function gutterFor(pages: number): number {
  if (pages <= 150) return 0.375;
  if (pages <= 300) return 0.5;
  if (pages <= 500) return 0.625;
  return 0.75;
}

const LIGHT = '#c9ccd1';
const DOT = '#b4b8be';

const LowContentBooks: React.FC = () => {
  const [title, setTitle] = useState('Mon Carnet');
  const [trim, setTrim] = useState<TrimId>('6x9');
  const [ruling, setRuling] = useState<RulingId>('lined');
  const [pages, setPages] = useState('120');
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    const t = TRIMS[trim];
    const nPages = Math.max(2, Math.min(800, parseInt(pages) || 120));
    setBusy(true);
    try {
      const doc = new jsPDF({ unit: 'in', format: [t.w, t.h], orientation: 'portrait' });
      const gutter = gutterFor(nPages);
      const outer = 0.25;
      const top = 0.5;
      const bottom = 0.5;

      for (let p = 0; p < nPages; p++) {
        if (p > 0) doc.addPage([t.w, t.h], 'portrait');
        const oddPage = p % 2 === 0; // page de droite (recto) -> gutter à gauche
        const left = oddPage ? gutter : outer;
        const right = oddPage ? outer : gutter;
        const x0 = left;
        const x1 = t.w - right;
        const y0 = top;
        const y1 = t.h - bottom;

        doc.setDrawColor(LIGHT);
        doc.setLineWidth(0.008);

        if (ruling === 'lined') {
          const step = 0.3;
          for (let y = y0 + 0.6; y <= y1; y += step) doc.line(x0, y, x1, y);
          // En-tête date
          doc.setDrawColor(DOT);
          doc.line(x0, y0 + 0.35, x1, y0 + 0.35);
        } else if (ruling === 'grid') {
          const step = 0.2;
          for (let y = y0; y <= y1; y += step) doc.line(x0, y, x1, y);
          for (let x = x0; x <= x1; x += step) doc.line(x, y0, x, y1);
        } else if (ruling === 'dotted') {
          const step = 0.2;
          doc.setFillColor(DOT);
          for (let y = y0; y <= y1; y += step)
            for (let x = x0; x <= x1; x += step) doc.circle(x, y, 0.006, 'F');
        } else if (ruling === 'planner') {
          // En-tête + créneaux horaires
          doc.setDrawColor(DOT);
          doc.setLineWidth(0.012);
          doc.line(x0, y0 + 0.4, x1, y0 + 0.4);
          doc.setFontSize(8);
          doc.setTextColor(140, 144, 150);
          const startHour = 7;
          const step = (y1 - (y0 + 0.7)) / 14;
          doc.setDrawColor(LIGHT);
          doc.setLineWidth(0.008);
          for (let i = 0; i < 14; i++) {
            const y = y0 + 0.7 + i * step;
            doc.text(`${startHour + i}:00`, x0, y - 0.03);
            doc.line(x0 + 0.5, y, x1, y);
          }
        }
        // 'blank' : rien (page vierge)
      }

      const safe = title.trim().replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '-') || 'carnet';
      doc.save(`${safe}-interieur-${trim}-${nPages}p.pdf`);
      toast.success(`Intérieur PDF généré (${nPages} pages, ${TRIMS[trim].label}).`);
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la génération du PDF.');
    } finally {
      setBusy(false);
    }
  };

  const t = TRIMS[trim];
  const nPages = parseInt(pages) || 0;

  return (
    <div className="space-y-5">
      <p className="text-sm text-joy-ink/70">
        Génère un <strong>intérieur PDF prêt pour KDP</strong> (carnets, journaux, planners, cahiers).
        Marge intérieure (gutter) calculée automatiquement selon le nombre de pages, alternance
        recto/verso gérée. Crée ensuite ta couverture avec le module Couverture KDP.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Label className="text-xs">Titre (nom du fichier)</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Format de coupe (trim)</Label>
          <Select value={trim} onValueChange={(v) => setTrim(v as TrimId)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(TRIMS) as TrimId[]).map((k) => (
                <SelectItem key={k} value={k}>{TRIMS[k].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Type d'intérieur</Label>
          <Select value={ruling} onValueChange={(v) => setRuling(v as RulingId)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(RULINGS) as RulingId[]).map((k) => (
                <SelectItem key={k} value={k}>{RULINGS[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Nombre de pages (2–800)</Label>
          <Input value={pages} onChange={(e) => setPages(e.target.value)} inputMode="numeric" />
        </div>
      </div>

      <div className="rounded-lg border p-3 bg-muted/40 text-sm text-joy-ink/80">
        <strong>Aperçu config :</strong> {t.label}, {RULINGS[ruling]}, {nPages} pages — gutter{' '}
        {gutterFor(nPages || 120)} po, marge extérieure 0,25 po.
      </div>

      <button
        onClick={generate}
        disabled={busy}
        className="w-full rounded-xl py-3 font-bold text-white transition-opacity hover:opacity-90 inline-flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: TEAL }}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Générer l'intérieur PDF
      </button>

      <p className="text-xs text-joy-ink/50">
        Le PDF est généré aux dimensions exactes de coupe (sans fond perdu — non requis pour les
        intérieurs N&B standard). Vérifie le rendu dans l'aperçu KDP avant publication.
      </p>
    </div>
  );
};

export default LowContentBooks;
