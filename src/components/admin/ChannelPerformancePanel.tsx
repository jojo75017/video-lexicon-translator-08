import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Performance par canal d'acquisition (utm_source).
 * Croise les inscriptions (funnel_leads), les événements de capture
 * et les commandes payées pour savoir quel canal amène réellement des ventes.
 */

interface ChannelRow {
  source: string;
  visits: number;
  leads: number;
  orders: number;
  revenue: number;
}

const cleanSource = (value?: string | null) => {
  const v = (value || '').trim().toLowerCase();
  if (!v) return 'direct / inconnu';
  return v;
};

const ChannelPerformancePanel = () => {
  const [rows, setRows] = useState<ChannelRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: events }, { data: leads }, { data: orders }] = await Promise.all([
        (supabase as any).from('capture_events').select('utm_source').limit(5000),
        (supabase as any).from('funnel_leads').select('email,utm_source').limit(5000),
        (supabase as any).from('funnel_orders').select('email,amount,status').eq('status', 'paid').limit(5000),
      ]);

      const map = new Map<string, ChannelRow>();
      const ensure = (source: string) => {
        const key = cleanSource(source);
        if (!map.has(key)) map.set(key, { source: key, visits: 0, leads: 0, orders: 0, revenue: 0 });
        return map.get(key)!;
      };

      for (const e of events || []) ensure(e.utm_source).visits += 1;

      const leadSource = new Map<string, string>();
      for (const l of leads || []) {
        const source = cleanSource(l.utm_source);
        ensure(source).leads += 1;
        const email = String(l.email || '').trim().toLowerCase();
        if (email) leadSource.set(email, source);
      }

      for (const o of orders || []) {
        const email = String(o.email || '').trim().toLowerCase();
        const row = ensure(leadSource.get(email) || 'direct / inconnu');
        row.orders += 1;
        row.revenue += Number(o.amount || 0);
      }

      setRows([...map.values()].sort((a, b) => b.orders - a.orders || b.leads - a.leads));
    } catch (err) {
      toast.error('Chargement impossible : ' + ((err as Error).message || ''));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">Canaux d'acquisition — visites, inscrits, ventes</h3>
        <Button variant="ghost" size="sm" onClick={load} className="ml-auto text-muted-foreground">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/80 border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Canal (utm_source)</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Visites captées</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Inscrits</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Ventes</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">CA</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Inscrit → vente</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                  Aucune donnée de canal pour le moment.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.source} className="border-b border-border/50">
                <td className="px-3 py-2 font-medium">{r.source}</td>
                <td className="px-3 py-2 text-center">{r.visits}</td>
                <td className="px-3 py-2 text-center">{r.leads}</td>
                <td className="px-3 py-2 text-center">{r.orders}</td>
                <td className="px-3 py-2 text-center">{r.revenue.toFixed(2)} €</td>
                <td className="px-3 py-2 text-center">
                  {r.leads > 0 ? `${((r.orders / r.leads) * 100).toFixed(1)} %` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Pour que le canal soit reconnu, ajoutez <code>?utm_source=facebook</code> (ou pinterest, email…) à vos liens de campagne.
      </p>
    </div>
  );
};

export default ChannelPerformancePanel;
