import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';
import { estimateSalesFromBsr, fmtEur, fmtNum } from './marketShared';

/** Outil 2 — Estimateur de Ventes : BSR → ventes/revenus estimés. */
const SalesEstimatorBsr: React.FC = () => {
  const [bsr, setBsr] = useState(5000);
  const [price, setPrice] = useState(4.99);
  const [royaltyRate, setRoyaltyRate] = useState(70);

  const daily = useMemo(() => estimateSalesFromBsr(bsr), [bsr]);
  const monthly = Math.round(daily * 30);
  const monthlyRevenue = Math.round(monthly * price * (royaltyRate / 100));
  const yearlyRevenue = monthlyRevenue * 12;

  const stat = (label: string, value: React.ReactNode, accent = false) => (
    <div className={`rounded-lg border p-4 ${accent ? 'bg-primary/5 border-primary/30' : ''}`}>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Calculator className="h-5 w-5" /> Estimateur de ventes (BSR)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Best Sellers Rank (BSR) : #{fmtNum(bsr)}</Label>
            <Slider value={[Math.log10(bsr)]} min={0} max={6} step={0.01} onValueChange={([v]) => setBsr(Math.round(10 ** v))} />
            <Input type="number" value={bsr} onChange={(e) => setBsr(Math.max(1, Number(e.target.value) || 1))} className="w-40" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Prix de vente (€)</Label>
              <Input type="number" step="0.5" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Taux de redevance (%)</Label>
              <Input type="number" value={royaltyRate} onChange={(e) => setRoyaltyRate(Number(e.target.value) || 0)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stat('Ventes / jour', fmtNum(Math.round(daily)))}
        {stat('Ventes / mois', fmtNum(monthly))}
        {stat('Revenus / mois', fmtEur(monthlyRevenue), true)}
        {stat('Revenus / an', fmtEur(yearlyRevenue), true)}
      </div>
      <p className="text-xs text-muted-foreground">
        Estimation indicative basée sur la corrélation BSR → ventes du marché Amazon. Les chiffres réels varient selon la catégorie et la saisonnalité.
      </p>
    </div>
  );
};

export default SalesEstimatorBsr;
