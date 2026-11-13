import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Day = { date: string; view: number; generate_click: number; outline_shown: number; email_captured: number };

const DAYS = 14;

export default function EssaiVisitsPanel() {
  const [rows, setRows] = useState<Day[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const since = new Date(Date.now() - DAYS * 86400000).toISOString();
    void (async () => {
      const { data } = await supabase
        .from('capture_events')
        .select('event_type, created_at')
        .eq('surface', 'essai')
        .gte('created_at', since)
        .limit(10000);
      const map = new Map<string, Day>();
      for (let i = 0; i < DAYS; i++) {
        const d = new Date(Date.now() - i * 86400000).toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
        map.set(d, { date: d, view: 0, generate_click: 0, outline_shown: 0, email_captured: 0 });
      }
      for (const e of (data ?? []) as { event_type: string; created_at: string }[]) {
        const d = new Date(e.created_at).toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
        const r = map.get(d);
        if (r && e.event_type in r) (r as unknown as Record<string, number>)[e.event_type] += 1;
      }
      setRows([...map.values()]);
      setLoading(false);
    })();
  }, []);

  const tot = rows.reduce((a, r) => ({ v: a.v + r.view, g: a.g + r.generate_click, e: a.e + r.email_captured }), { v: 0, g: 0, e: 0 });
  const max = Math.max(1, ...rows.map((r) => r.view));
  const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: '2-digit' });

  return (
    <div className="rounded-2xl border-2 border-[#FF9E2D] bg-card p-5 text-foreground">
      <h2 className="text-lg font-bold text-[#FF9E2D]">📊 Visites de la page d'essai (14 derniers jours)</h2>
      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-muted p-3"><div className="text-2xl font-bold">{tot.v}</div><div className="text-xs text-muted-foreground">visites</div></div>
        <div className="rounded-xl bg-muted p-3"><div className="text-2xl font-bold">{tot.g}</div><div className="text-xs text-muted-foreground">idées tapées</div></div>
        <div className="rounded-xl bg-muted p-3"><div className="text-2xl font-bold text-[#FF9E2D]">{tot.e}</div><div className="text-xs text-muted-foreground">emails laissés</div></div>
      </div>
      {loading ? <p className="mt-3 text-sm text-muted-foreground">Chargement…</p> : (
        <table className="mt-4 w-full text-sm">
          <thead><tr className="text-left text-muted-foreground"><th>Jour</th><th>Visites</th><th></th><th className="text-right">Idées</th><th className="text-right">Emails</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.date} className="border-t border-border">
                <td className="py-1 capitalize">{fmt(r.date)}</td>
                <td className="py-1 font-semibold">{r.view}</td>
                <td className="w-1/2 py-1"><div className="h-2 rounded bg-[#008296]" style={{ width: `${(r.view / max) * 100}%` }} /></td>
                <td className="py-1 text-right">{r.generate_click}</td>
                <td className="py-1 text-right font-semibold text-[#FF9E2D]">{r.email_captured}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="mt-2 text-xs text-muted-foreground">Compté directement par votre site sur ebookstudio.fr/essai (l'aperçu Lovable compte aussi).</p>
    </div>
  );
}
