import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TEAL = '#008296';

// Simulateur de royalties KDP (déterministe)
// Ebook : 70% si prix entre 2,99 et 9,99€ (sinon 35%). Pas de coût de "livraison" simulé ici.
// Broché : royaltie = (prix * 0,60) - coût d'impression.
const fmt = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

const RoyaltiesSimulator: React.FC = () => {
  const [format, setFormat] = useState('ebook');
  const [price, setPrice] = useState('6.99');
  const [pages, setPages] = useState('200');
  const [color, setColor] = useState('bw');

  const result = useMemo(() => {
    const p = parseFloat(price.replace(',', '.')) || 0;
    const pg = parseInt(pages) || 0;
    if (format === 'ebook') {
      const eligible70 = p >= 2.99 && p <= 9.99;
      const r70 = eligible70 ? p * 0.70 : 0;
      const r35 = p * 0.35;
      const best = eligible70 ? Math.max(r70, r35) : r35;
      return {
        rows: [
          { label: 'Royaltie 70 %', value: eligible70 ? fmt(r70) : 'Non éligible (prix hors 2,99€–9,99€)' },
          { label: 'Royaltie 35 %', value: fmt(r35) },
          { label: 'Gain net par vente', value: fmt(best) },
        ],
        note: eligible70
          ? 'À ce prix, l\'option 70 % est la plus rentable.'
          : 'Place le prix entre 2,99€ et 9,99€ pour débloquer la royaltie à 70 %.',
        breakeven: `Pour 1 000€ de revenus : ${Math.ceil(1000 / Math.max(best, 0.01))} ventes.`,
      };
    }
    // Broché : coût impression approx KDP Europe
    const fixed = 0.60;
    const perPage = color === 'color' ? 0.0594 : 0.0102; // €/page (approx EUR marketplace)
    const printCost = fixed + pg * perPage;
    const royalty = p * 0.60 - printCost;
    return {
      rows: [
        { label: 'Coût d\'impression estimé', value: fmt(printCost) },
        { label: 'Royaltie 60 % brute', value: fmt(p * 0.60) },
        { label: 'Gain net par vente', value: fmt(royalty) },
      ],
      note: royalty <= 0
        ? '⚠️ Prix trop bas : la marge est négative. Augmente le prix de vente.'
        : 'Marge positive — prix viable pour le broché.',
      breakeven: royalty > 0 ? `Pour 1 000€ de revenus : ${Math.ceil(1000 / royalty)} ventes.` : '',
    };
  }, [format, price, pages, color]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Compare les gains nets selon le format, le prix et la longueur. Calculs basés sur les barèmes
        KDP (70 %/35 % ebook, 60 % broché moins coût d'impression sur le marché européen).
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs">Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ebook">Ebook Kindle</SelectItem>
              <SelectItem value="paperback">Broché</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label className="text-xs">Prix de vente (€)</Label><Input value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        {format === 'paperback' && (
          <>
            <div><Label className="text-xs">Nombre de pages</Label><Input type="number" value={pages} onChange={(e) => setPages(e.target.value)} /></div>
            <div>
              <Label className="text-xs">Impression</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bw">Noir & blanc</SelectItem>
                  <SelectItem value="color">Couleur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
      <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-2">
        {result.rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-joy-ink/70">{r.label}</span>
            <span className="font-semibold">{r.value}</span>
          </div>
        ))}
        <p className="text-xs pt-2" style={{ color: TEAL }}>{result.note}</p>
        {result.breakeven && <p className="text-xs text-joy-ink/60">{result.breakeven}</p>}
      </CardContent></Card>
    </div>
  );
};

export default RoyaltiesSimulator;
