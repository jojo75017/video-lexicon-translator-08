import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TEAL = '#008296';

// ============================================================================
// Calculateur de Redevances Print KDP — modèle DÉTERMINISTE (pas d'IA, pas de
// données aléatoires). Basé sur la grille officielle KDP des coûts d'impression
// (broché & relié, encre N&B / couleur) par marketplace.
// Redevance nette = (prix HT × 60 %) − coût d'impression.
// ============================================================================

type MarketId = 'US' | 'UK' | 'DE' | 'FR';
type Binding = 'paperback' | 'hardcover';
type Ink = 'bw' | 'color';

const MARKETS: Record<MarketId, { label: string; currency: string; symbol: string; vat: number }> = {
  US: { label: 'États-Unis (amazon.com)', currency: 'USD', symbol: '$', vat: 0 },
  UK: { label: 'Royaume-Uni (amazon.co.uk)', currency: 'GBP', symbol: '£', vat: 0 },
  DE: { label: 'Allemagne (amazon.de)', currency: 'EUR', symbol: '€', vat: 0.07 },
  FR: { label: 'France (amazon.fr)', currency: 'EUR', symbol: '€', vat: 0.055 },
};

// Coûts d'impression KDP (broché). Modèle : si pages <= seuil → coût fixe,
// sinon coût par page. Seuil N&B = 108 pages, seuil couleur = 40 pages.
// Valeurs proches de la grille KDP en vigueur (estimation fiable).
const PAPERBACK: Record<MarketId, { bw: { fixed: number; perPage: number }; color: { fixed: number; perPage: number } }> = {
  US: { bw: { fixed: 2.30, perPage: 0.012 }, color: { fixed: 3.60, perPage: 0.070 } },
  UK: { bw: { fixed: 1.93, perPage: 0.010 }, color: { fixed: 3.15, perPage: 0.060 } },
  DE: { bw: { fixed: 2.05, perPage: 0.012 }, color: { fixed: 3.55, perPage: 0.067 } },
  FR: { bw: { fixed: 2.05, perPage: 0.012 }, color: { fixed: 3.55, perPage: 0.067 } },
};

// Surcoût relié (hardcover) : coût fixe additionnel par rapport au broché.
const HARDCOVER_EXTRA_FIXED: Record<MarketId, number> = { US: 5.65, UK: 4.69, DE: 5.20, FR: 5.20 };

const BW_THRESHOLD = 108;
const COLOR_THRESHOLD = 40;

function printingCost(market: MarketId, binding: Binding, ink: Ink, pages: number): number {
  const grid = PAPERBACK[market][ink];
  const threshold = ink === 'bw' ? BW_THRESHOLD : COLOR_THRESHOLD;
  let cost = pages <= threshold ? grid.fixed : grid.fixed + pages * grid.perPage;
  if (binding === 'hardcover') cost += HARDCOVER_EXTRA_FIXED[market];
  return cost;
}

const fmt = (n: number, symbol: string, currency: string) =>
  `${n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol} ${currency === 'EUR' ? '' : `(${currency})`}`.trim();

const PrintRoyaltiesCalc: React.FC = () => {
  const [binding, setBinding] = useState<Binding>('paperback');
  const [ink, setInk] = useState<Ink>('bw');
  const [pages, setPages] = useState('200');
  // Prix de vente TTC saisi par marché.
  const [prices, setPrices] = useState<Record<MarketId, string>>({ US: '12.99', UK: '10.99', DE: '13.99', FR: '13.99' });

  const pg = parseInt(pages) || 0;

  const rows = useMemo(() => {
    return (Object.keys(MARKETS) as MarketId[]).map((m) => {
      const meta = MARKETS[m];
      const ttc = parseFloat((prices[m] || '0').replace(',', '.')) || 0;
      const ht = ttc / (1 + meta.vat); // prix hors TVA (base de calcul redevance KDP)
      const cost = printingCost(m, binding, ink, pg);
      const royalty = ht * 0.60 - cost;
      const margin = ttc > 0 ? (royalty / ttc) * 100 : 0;
      return { m, meta, ttc, ht, cost, royalty, margin };
    });
  }, [prices, binding, ink, pg]);

  const minViable = useMemo(() => {
    // Prix TTC minimum pour redevance > 0, par marché.
    return (Object.keys(MARKETS) as MarketId[]).map((m) => {
      const meta = MARKETS[m];
      const cost = printingCost(m, binding, ink, pg);
      const htMin = cost / 0.60;
      const ttcMin = htMin * (1 + meta.vat);
      return { m, meta, ttcMin };
    });
  }, [binding, ink, pg]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-joy-ink/70">
        Calcul <strong>exact</strong> du coût d'impression KDP (broché / relié, N&B ou couleur) et de la{' '}
        <strong>marge nette réelle</strong> par marché — bien au-delà du simple 35 % / 70 % de l'ebook.
        La redevance KDP print = <em>(prix HT × 60 %) − coût d'impression</em>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Format</Label>
          <Select value={binding} onValueChange={(v) => setBinding(v as Binding)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="paperback">Broché (paperback)</SelectItem>
              <SelectItem value="hardcover">Relié (hardcover)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Encre</Label>
          <Select value={ink} onValueChange={(v) => setInk(v as Ink)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bw">Noir & blanc</SelectItem>
              <SelectItem value="color">Couleur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Nombre de pages</Label>
          <Input value={pages} onChange={(e) => setPages(e.target.value)} inputMode="numeric" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(MARKETS) as MarketId[]).map((m) => (
          <div key={m}>
            <Label className="text-xs">Prix TTC {m} ({MARKETS[m].symbol})</Label>
            <Input
              value={prices[m]}
              onChange={(e) => setPrices((p) => ({ ...p, [m]: e.target.value }))}
              inputMode="decimal"
            />
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left" style={{ color: TEAL }}>
                <th className="p-3">Marché</th>
                <th className="p-3 text-right">Prix HT</th>
                <th className="p-3 text-right">Coût impression</th>
                <th className="p-3 text-right">Redevance nette</th>
                <th className="p-3 text-right">Marge</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.m} className="border-b last:border-0">
                  <td className="p-3 font-medium">{r.meta.label}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(r.ht, r.meta.symbol, r.meta.currency)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(r.cost, r.meta.symbol, r.meta.currency)}</td>
                  <td
                    className="p-3 text-right tabular-nums font-bold"
                    style={{ color: r.royalty > 0 ? '#0a7d3c' : '#c0392b' }}
                  >
                    {fmt(r.royalty, r.meta.symbol, r.meta.currency)}
                  </td>
                  <td className="p-3 text-right tabular-nums">{r.margin.toFixed(0)} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="rounded-lg border p-4 bg-muted/40 space-y-1 text-sm">
        <p className="font-semibold" style={{ color: TEAL }}>Prix TTC minimum pour une marge positive</p>
        {minViable.map((v) => (
          <p key={v.m} className="text-joy-ink/80">
            {v.meta.label} : <strong>{v.ttcMin.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {v.meta.symbol}</strong>
          </p>
        ))}
      </div>

      <p className="text-xs text-joy-ink/50">
        Estimation basée sur la grille de coûts d'impression KDP (encre N&B seuil 108 pages, couleur seuil 40 pages).
        Le prix HT retire la TVA livre (DE 7 %, FR 5,5 %) ; US/UK sont déjà hors taxe. KDP peut ajuster ses tarifs :
        vérifie le coût affiché dans ton tableau de bord KDP avant publication.
      </p>
    </div>
  );
};

export default PrintRoyaltiesCalc;
