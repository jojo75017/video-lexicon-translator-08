import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Route } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SHORT_LINKS } from '@/data/campagneUnique';

/**
 * Une seule vue : ouvertures → clics par lien court → visites /essai →
 * sommaires → emails captés → commandes payées. La marche qui chute saute
 * aux yeux, c'est la seule chose à regarder chaque matin.
 */
interface Stats {
  opens: number;
  clicksByKey: Record<string, number>;
  clicksTotal: number;
  events: Record<string, number>;
  leads: number;
  ordersPaid: number;
  ordersTotal: number;
}

export function FunnelUnifiedPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [opens, clicks, events, leads, orders] = await Promise.all([
        supabase.from('email_opens').select('id', { count: 'exact', head: true }),
        supabase.from('email_clicks').select('clicked_url, template_name, email_step').limit(10000),
        supabase.from('capture_events').select('event_type').eq('surface', 'essai').limit(10000),
        supabase.from('funnel_leads').select('id', { count: 'exact', head: true }),
        supabase.from('funnel_orders').select('status').limit(5000),
      ]);

      const clicksByKey: Record<string, number> = {};
      let clicksTotal = 0;
      for (const row of clicks.data ?? []) {
        const url = row.clicked_url ?? '';
        const step = row.email_step != null ? String(row.email_step) : '';
        const template = row.template_name ?? '';
        const key = Object.keys(SHORT_LINKS).find(
          (k) =>
            step === k ||
            template === k ||
            template === SHORT_LINKS[k].template ||
            url.includes(`/r/${k}`),
        );

        if (!key) continue;
        clicksByKey[key] = (clicksByKey[key] ?? 0) + 1;
        clicksTotal += 1;
      }

      const eventMap: Record<string, number> = {};
      for (const row of events.data ?? []) {
        eventMap[row.event_type] = (eventMap[row.event_type] ?? 0) + 1;
      }

      const orderRows = orders.data ?? [];
      setStats({
        opens: opens.count ?? 0,
        clicksByKey,
        clicksTotal,
        events: eventMap,
        leads: leads.count ?? 0,
        ordersPaid: orderRows.filter((o) => o.status === 'paid').length,
        ordersTotal: orderRows.length,
      });
    } catch (err) {
      toast.error(`Chargement du tunnel impossible : ${(err as Error).message}`);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const steps = stats
    ? [
        { label: 'Ouvertures enregistrées', value: stats.opens },
        { label: 'Clics sur les liens courts /r', value: stats.clicksTotal },
        { label: "Arrivées sur la page d'essai", value: stats.events.view ?? 0 },
        { label: 'Sommaires générés', value: stats.events.outline_shown ?? 0 },
        { label: 'Emails captés (leads)', value: stats.leads },
        { label: 'Commandes payées', value: stats.ordersPaid },
      ]
    : [];

  const reference = steps.find((s) => s.label.startsWith('Clics'))?.value ?? 0;

  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge className="rounded-full">Tunnel complet</Badge>
          <h2 className="mt-3 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Route className="h-5 w-5" /> De l'email à la commande, en une seule ligne
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Les pourcentages sont calculés à partir des clics : c'est le premier point réellement
            mesurable côté application.
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => void load()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </div>

      {!stats ? (
        <p className="mt-4 text-sm text-muted-foreground">{loading ? 'Chargement…' : 'Aucune donnée.'}</p>
      ) : (
        <>
          <ul className="mt-5 space-y-2 text-sm">
            {steps.map((step) => {
              const pct = reference > 0 ? Math.round((step.value / reference) * 100) : 0;
              return (
                <li
                  key={step.label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-2"
                >
                  <span className="text-muted-foreground">{step.label}</span>
                  <span className="font-semibold text-foreground">
                    {step.value}
                    {reference > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">{pct} %</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6">
            <p className="text-sm font-medium text-foreground">Clics par lien court</p>
            <div className="mt-2 space-y-2">
              {Object.values(SHORT_LINKS).map((link) => (
                <div
                  key={link.key}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-2 text-sm"
                >
                  <span className="text-foreground">
                    <code>/r/{link.key}</code> → {link.destination}
                  </span>
                  <span className="text-muted-foreground">
                    {stats.clicksByKey[link.key] ?? 0} clic(s)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {stats.ordersTotal > stats.ordersPaid && (
            <p className="mt-4 text-xs text-muted-foreground">
              {stats.ordersTotal - stats.ordersPaid} commande(s) commencée(s) mais non payée(s).
            </p>
          )}
        </>
      )}
    </Card>
  );
}
