import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FolderTree } from 'lucide-react';
import { estimateSalesFromBsr, fmtNum } from './marketShared';

/** Paliers de BSR de référence (Amazon.fr, indicatif) pour situer un livre. */
const TIERS = [
  { max: 100, label: 'Top 100', tag: 'Best-seller', color: 'bg-emerald-100 text-emerald-700' },
  { max: 1000, label: '100 – 1 000', tag: 'Très fort', color: 'bg-emerald-100 text-emerald-700' },
  { max: 5000, label: '1 000 – 5 000', tag: 'Fort', color: 'bg-lime-100 text-lime-700' },
  { max: 20000, label: '5 000 – 20 000', tag: 'Bon', color: 'bg-amber-100 text-amber-700' },
  { max: 50000, label: '20 000 – 50 000', tag: 'Moyen', color: 'bg-amber-100 text-amber-700' },
  { max: 100000, label: '50 000 – 100 000', tag: 'Faible', color: 'bg-orange-100 text-orange-700' },
  { max: Infinity, label: '> 100 000', tag: 'Très faible', color: 'bg-rose-100 text-rose-700' },
];

const CATEGORIES = [
  'Livres', 'Boutique Kindle', 'Développement personnel', 'Cuisine & Vins',
  'Santé & Bien-être', 'Romans & Littérature', 'Enfance & Adolescence',
  'Entreprise & Bourse', 'Loisirs créatifs', 'Informatique & Internet',
];

/** Outil 7 — Explorateur de Catégories & BSR. */
const CategoryBsrExplorer: React.FC = () => {
  const [bsr, setBsr] = useState(8000);

  const current = useMemo(() => TIERS.find((t) => bsr <= t.max)!, [bsr]);
  const daily = estimateSalesFromBsr(bsr);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><FolderTree className="h-5 w-5" /> Explorateur de catégories & BSR</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label>Testez un BSR</Label>
            <Input type="number" value={bsr} onChange={(e) => setBsr(Math.max(1, Number(e.target.value) || 1))} />
          </div>
          <div className="rounded-lg border p-4 bg-muted/30 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Palier : {current.label}</p>
              <p className="text-lg font-semibold">≈ {fmtNum(Math.round(daily))} ventes/jour · {fmtNum(Math.round(daily * 30))}/mois</p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${current.color}`}>{current.tag}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Grille de référence BSR (indicative)</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted-foreground border-b"><th className="py-2">Palier BSR</th><th>Ventes/jour ~</th><th>Ventes/mois ~</th><th>Niveau</th></tr></thead>
              <tbody>
                {TIERS.map((t, i) => {
                  const ref = t.max === Infinity ? 200000 : t.max;
                  const d = estimateSalesFromBsr(ref);
                  return (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 font-medium">{t.label}</td>
                      <td>{fmtNum(Math.round(d))}</td>
                      <td>{fmtNum(Math.round(d * 30))}</td>
                      <td><span className={`text-xs px-2 py-0.5 rounded-full ${t.color}`}>{t.tag}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Catégories KDP principales (FR)</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">{CATEGORIES.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}</CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Grille indicative. Le rapport BSR → ventes varie selon la catégorie et la période.</p>
    </div>
  );
};

export default CategoryBsrExplorer;
