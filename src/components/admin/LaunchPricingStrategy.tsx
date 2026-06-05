import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = '#008296';
const fmt = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

interface Step { day: string; price: number; note: string; }

// Stratégie de prix de lancement dynamique (déterministe)
const LaunchPricingStrategy: React.FC = () => {
  const [start, setStart] = useState('0.99');
  const [target, setTarget] = useState('6.99');
  const [days, setDays] = useState('7');

  const plan = useMemo<Step[]>(() => {
    const s = parseFloat(start.replace(',', '.')) || 0.99;
    const t = parseFloat(target.replace(',', '.')) || 6.99;
    const d = Math.max(2, Math.min(14, parseInt(days) || 7));
    const out: Step[] = [];
    for (let i = 0; i < d; i++) {
      const ratio = i / (d - 1);
      let price = s + (t - s) * ratio;
      // arrondi psychologique en .99
      price = Math.max(0.99, Math.round(price) - 0.01);
      if (price < s) price = s;
      let note = '';
      if (i === 0) note = 'Prix d\'appel — maximise les ventes et le ranking initial.';
      else if (i === d - 1) note = 'Prix cible atteint — bascule sur la royaltie 70 %.';
      else if (price >= 2.99 && (s < 2.99)) note = 'Seuil 2,99€ franchi : royaltie 70 % débloquée.';
      else note = 'Montée progressive — préserve la dynamique de ventes.';
      out.push({ day: `Jour ${i + 1}`, price, note });
    }
    return out;
  }, [start, target, days]);

  const copy = () => {
    const txt = plan.map((p) => `${p.day} : ${fmt(p.price)} — ${p.note}`).join('\n');
    navigator.clipboard.writeText(txt); toast.success('Plan copié ✓');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Génère un calendrier de prix montant (du prix d'appel au prix cible) pour maximiser le volume de
        ventes et le ranking pendant la fenêtre de lancement.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div><Label className="text-xs">Prix d'appel (€)</Label><Input value={start} onChange={(e) => setStart(e.target.value)} /></div>
        <div><Label className="text-xs">Prix cible (€)</Label><Input value={target} onChange={(e) => setTarget(e.target.value)} /></div>
        <div><Label className="text-xs">Durée (jours)</Label><Input type="number" value={days} onChange={(e) => setDays(e.target.value)} /></div>
      </div>
      <Card className="border-joy-ink/10"><CardContent className="p-4 space-y-2">
        {plan.map((p) => (
          <div key={p.day} className="flex items-start justify-between gap-3 text-sm border-b border-joy-ink/5 pb-1.5 last:border-0">
            <span className="font-semibold w-16 flex-shrink-0">{p.day}</span>
            <span className="font-bold w-20 flex-shrink-0" style={{ color: TEAL }}>{fmt(p.price)}</span>
            <span className="text-xs text-joy-ink/60 flex-1">{p.note}</span>
          </div>
        ))}
        <Button variant="outline" size="sm" className="gap-1.5 mt-2" onClick={copy}>
          <Copy className="h-3.5 w-3.5" /> Copier le plan
        </Button>
      </CardContent></Card>
    </div>
  );
};

export default LaunchPricingStrategy;
