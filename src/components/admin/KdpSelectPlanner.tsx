import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarClock, Gift, Tag } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TEAL = '#008296';
const ORANGE = '#FF9E2D';

const KdpSelectPlanner: React.FC = () => {
  const [start, setStart] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [strategy, setStrategy] = useState('free');

  const plan = useMemo(() => {
    const s = new Date(start + 'T00:00:00');
    const end = addDays(s, 89);
    const events: { date: Date; type: 'free' | 'countdown' | 'milestone'; label: string }[] = [];

    events.push({ date: s, type: 'milestone', label: 'Début de la période KDP Select (90 jours)' });

    if (strategy === 'free') {
      // 5 jours gratuits groupés au lancement pour booster le classement
      const free1 = addDays(s, 3);
      for (let i = 0; i < 5; i++) {
        events.push({ date: addDays(free1, i), type: 'free', label: `Jour gratuit ${i + 1}/5 — promo de lancement` });
      }
    } else if (strategy === 'split') {
      // 2 + 3 jours gratuits répartis
      events.push({ date: addDays(s, 3), type: 'free', label: 'Jour gratuit 1/5 — lancement' });
      events.push({ date: addDays(s, 4), type: 'free', label: 'Jour gratuit 2/5 — lancement' });
      const mid = addDays(s, 50);
      for (let i = 0; i < 3; i++) events.push({ date: addDays(mid, i), type: 'free', label: `Jour gratuit ${i + 3}/5 — relance mi-période` });
    } else {
      // Countdown Deals : 2 promos à prix réduit progressif
      events.push({ date: addDays(s, 20), type: 'countdown', label: 'Countdown Deal #1 — 7 jours (prix dégressif)' });
      events.push({ date: addDays(s, 60), type: 'countdown', label: 'Countdown Deal #2 — 7 jours (prix dégressif)' });
    }

    events.push({ date: addDays(s, 75), type: 'milestone', label: 'Décision : renouveler ou sortir de KDP Select (J-15)' });
    events.push({ date: end, type: 'milestone', label: 'Fin de la période — renouvellement automatique sauf désactivation' });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [start, strategy]);

  const icon = (t: string) => t === 'free' ? <Gift className="h-4 w-4" style={{ color: TEAL }} />
    : t === 'countdown' ? <Tag className="h-4 w-4" style={{ color: ORANGE }} />
    : <CalendarClock className="h-4 w-4 text-joy-ink/50" />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-joy-ink/70">
        Planifie tes 5 jours promo gratuits et tes Countdown Deals sur la période de 90 jours KDP Select pour maximiser visibilité et ventes.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Date d'inscription KDP Select</Label><Input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></div>
        <div>
          <Label className="text-xs">Stratégie</Label>
          <Select value={strategy} onValueChange={setStrategy}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="free">5 jours gratuits groupés (lancement)</SelectItem>
              <SelectItem value="split">Jours gratuits répartis (2 + 3)</SelectItem>
              <SelectItem value="countdown">Countdown Deals (prix dégressif)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-joy-ink/10"><CardContent className="p-4">
        <div className="text-sm font-bold mb-3">Calendrier recommandé (90 jours)</div>
        <ul className="space-y-2">
          {plan.map((e, i) => (
            <li key={i} className="flex items-start gap-3 text-xs border-b border-joy-ink/5 pb-2">
              {icon(e.type)}
              <span className="font-semibold whitespace-nowrap w-28">{format(e.date, 'EEE d MMM', { locale: fr })}</span>
              <span className="text-joy-ink/70">{e.label}</span>
            </li>
          ))}
        </ul>
      </CardContent></Card>

      <p className="text-[11px] text-joy-ink/50">
        Rappel : KDP Select impose l'exclusivité Amazon. Les 5 jours gratuits ou Countdown Deals sont valables une fois par période de 90 jours.
      </p>
    </div>
  );
};

export default KdpSelectPlanner;
