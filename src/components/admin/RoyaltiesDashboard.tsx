import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, AlertTriangle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const TEAL = '#008296';
const ORANGE = '#FF9E2D';
const STORAGE = 'kdp_royalties_months';
const THRESHOLD_KEY = 'kdp_royalties_threshold';

interface MonthRow { month: string; amount: number; }

const RoyaltiesDashboard: React.FC = () => {
  const [months, setMonths] = useState<MonthRow[]>([]);
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [threshold, setThreshold] = useState(1000);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE); if (s) setMonths(JSON.parse(s));
      const t = localStorage.getItem(THRESHOLD_KEY); if (t) setThreshold(Number(t));
    } catch { /* noop */ }
  }, []);

  const persist = (next: MonthRow[]) => {
    setMonths(next);
    try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch { /* noop */ }
  };

  const add = () => {
    if (!month || !amount) return toast.error('Mois et montant requis.');
    const next = [...months.filter((m) => m.month !== month), { month, amount: parseFloat(amount) || 0 }]
      .sort((a, b) => a.month.localeCompare(b.month));
    persist(next);
    setAmount('');
  };

  const remove = (m: string) => persist(months.filter((x) => x.month !== m));

  // Prévision linéaire simple (régression sur les 6 derniers mois)
  const forecast = useMemo(() => {
    if (months.length < 2) return null;
    const recent = months.slice(-6);
    const n = recent.length;
    const xs = recent.map((_, i) => i);
    const ys = recent.map((r) => r.amount);
    const sx = xs.reduce((a, b) => a + b, 0);
    const sy = ys.reduce((a, b) => a + b, 0);
    const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
    const sxx = xs.reduce((a, x) => a + x * x, 0);
    const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1);
    const intercept = (sy - slope * sx) / n;
    const next = slope * n + intercept;
    return Math.max(0, Math.round(next * 100) / 100);
  }, [months]);

  const total = useMemo(() => Math.round(months.reduce((s, m) => s + m.amount, 0) * 100) / 100, [months]);
  const lastAmount = months.length ? months[months.length - 1].amount : 0;
  const belowThreshold = months.length > 0 && lastAmount < threshold;

  const chartData = useMemo(() => {
    const base = months.map((m) => ({ month: m.month, amount: m.amount }));
    if (forecast != null) base.push({ month: 'Prévision', amount: forecast });
    return base;
  }, [months, forecast]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Suis tes royalties mois par mois, obtiens une prévision du mois suivant et une alerte si tu passes sous ton seuil objectif.
      </p>

      <div className="grid gap-3 sm:grid-cols-3 items-end">
        <div><Label className="text-xs">Mois</Label><Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></div>
        <div><Label className="text-xs">Royalties (€)</Label><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <Button onClick={add} style={{ background: TEAL, color: 'white' }} className="gap-1.5"><Plus className="h-4 w-4" /> Ajouter</Button>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs whitespace-nowrap">Seuil d'alerte (€)</Label>
        <Input type="number" value={threshold} className="w-32" onChange={(e) => {
          const v = Number(e.target.value); setThreshold(v);
          try { localStorage.setItem(THRESHOLD_KEY, String(v)); } catch { /* noop */ }
        }} />
      </div>

      {belowThreshold && (
        <div className="flex items-center gap-2 rounded-lg p-3 text-xs font-medium" style={{ background: `${ORANGE}1a`, color: '#b45309' }}>
          <AlertTriangle className="h-4 w-4" /> Dernier mois ({lastAmount} €) sous ton seuil de {threshold} €.
        </div>
      )}

      {months.length > 0 && (
        <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-4 text-xs">
            <span className="font-bold">Total cumulé : {total.toLocaleString('fr-FR')} €</span>
            {forecast != null && <span className="flex items-center gap-1" style={{ color: TEAL }}><TrendingUp className="h-3.5 w-3.5" /> Prévision mois suivant : {forecast.toLocaleString('fr-FR')} €</span>}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(v) => `${v} €`} />
              <ReferenceLine y={threshold} stroke={ORANGE} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="amount" stroke={TEAL} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <ul className="space-y-1">
            {months.map((m) => (
              <li key={m.month} className="flex items-center justify-between text-xs border-b border-joy-ink/5 pb-1">
                <span>{m.month}</span>
                <span className="flex items-center gap-3"><b>{m.amount.toLocaleString('fr-FR')} €</b>
                  <button onClick={() => remove(m.month)} className="text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></span>
              </li>
            ))}
          </ul>
        </CardContent></Card>
      )}
    </div>
  );
};

export default RoyaltiesDashboard;
