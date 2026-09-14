import { useCallback, useEffect, useMemo, useState } from 'react';
import { Globe2, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

type EventRow = {
  event_type: string;
  surface: string | null;
  page_path: string | null;
  utm_source: string | null;
  locale: string | null;
};

const isFrancophone = (locale: string | null) => (locale ?? '').toLowerCase().startsWith('fr');

const PCT = (part: number, total: number) =>
  total > 0 ? `${Math.round((part / total) * 1000) / 10} %` : '—';

/**
 * Panneau de lecture seule : où les visiteurs s'arrêtent entre la première
 * visite et le paiement, avec filtre francophone (langue du navigateur,
 * enregistrée sur les nouvelles visites).
 */
export function FunnelConversionPanel() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [trials, setTrials] = useState(0);
  const [paid, setPaid] = useState(0);
  const [francoOnly, setFrancoOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadedAt, setLoadedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const [evRes, trialRes, orderRes] = await Promise.all([
      supabase
        .from('capture_events')
        .select('event_type, surface, page_path, utm_source, locale')
        .gte('created_at', since)
        .limit(10000),
      supabase.from('free_trials').select('id', { count: 'exact', head: true }).gte('started_at', since),
      supabase
        .from('funnel_orders')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'paid')
        .gte('created_at', since),
    ]);
    setEvents((evRes.data as EventRow[] | null) ?? []);
    setTrials(trialRes.count ?? 0);
    setPaid(orderRes.count ?? 0);
    setLoadedAt(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const scoped = francoOnly ? events.filter((e) => isFrancophone(e.locale)) : events;
    const count = (pred: (e: EventRow) => boolean) => scoped.filter(pred).length;
    const views = count((e) => e.event_type === 'view');
    const emails = count((e) => e.event_type === 'email_captured' || e.event_type === 'submit');
    const orderViews = count((e) => e.event_type === 'view' && e.surface === 'commander');
    const payStarts = count((e) => e.event_type === 'checkout_click' || e.event_type === 'checkout_ready');

    const sources = new Map<string, number>();
    for (const e of scoped) {
      if (e.event_type !== 'view') continue;
      const src = e.utm_source || (e.page_path === '/decouverte' ? 'shorts' : null) || 'direct';
      sources.set(src, (sources.get(src) ?? 0) + 1);
    }
    return {
      views,
      emails,
      orderViews,
      payStarts,
      sources: [...sources.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
      unknownLocale: events.filter((e) => !e.locale).length,
    };
  }, [events, francoOnly]);

  const steps = [
    { label: 'Ont vu une page', value: stats.views },
    { label: 'Ont laissé leur email', value: stats.emails, base: stats.views },
    { label: 'Ont commencé un essai', value: trials, base: stats.emails },
    { label: 'Ont ouvert la commande', value: stats.orderViews, base: trials },
    { label: 'Ont lancé le paiement', value: stats.payStarts, base: stats.orderViews },
    { label: 'Ont payé', value: paid, base: stats.payStarts },
  ];

  return (
    <Card className="border-teal-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">Le tunnel en chiffres (30 derniers jours)</h3>
          <p className="text-xs text-muted-foreground">
            Où les visiteurs s'arrêtent, de la première visite au paiement. Lecture seule.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={francoOnly ? 'default' : 'outline'}
            onClick={() => setFrancoOnly((v) => !v)}
          >
            <Globe2 className="mr-1.5 h-4 w-4" />
            {francoOnly ? 'Francophones uniquement' : 'Toutes les visites'}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((s) => (
          <div key={s.label} className="rounded-xl border bg-background p-3 text-center">
            <p className="text-xl font-bold tabular-nums">{s.value}</p>
            <p className="mt-0.5 text-[11px] font-medium leading-tight text-muted-foreground">{s.label}</p>
            {s.base !== undefined && (
              <Badge variant="secondary" className="mt-1.5 text-[10px]">
                {PCT(s.value, s.base)} de l'étape avant
              </Badge>
            )}
          </div>
        ))}
      </div>

      {stats.sources.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          D'où viennent les visites :{' '}
          {stats.sources.map(([src, n]) => `${src} (${n})`).join(' · ')}
        </p>
      )}
      <p className="mt-1 text-[11px] text-muted-foreground">
        {stats.unknownLocale > 0
          ? `${stats.unknownLocale} anciennes visites sans langue enregistrée sont comptées dans « Toutes les visites » seulement. `
          : ''}
        {loadedAt ? `Relevé à ${loadedAt.toLocaleTimeString('fr-FR')}.` : ''}
      </p>
    </Card>
  );
}
