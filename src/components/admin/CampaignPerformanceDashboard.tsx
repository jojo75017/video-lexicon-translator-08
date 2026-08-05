import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MousePointerClick, ShoppingCart, Euro, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ACTIVE_EMAIL_CAMPAIGN } from '@/data/canonicalEmailCampaign';

interface Row {
  campaign: string;
  step: number | null;
  template: string;
  sent: number;
  clickers: number;
  buyers: number;
  revenue: number;
}

const norm = (e?: string | null) => (e || '').trim().toLowerCase();

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

const parseTemplate = (template: string) => {
  const match = template.match(/^(.*?)-(\d+)$/);
  if (match) return { campaign: match[1], step: Number(match[2]) };
  return { campaign: template, step: null as number | null };
};

const campaignLabel = (campaign: string) => {
  if (ACTIVE_EMAIL_CAMPAIGN.steps.some((s) => parseTemplate(s.template).campaign === campaign)) {
    return ACTIVE_EMAIL_CAMPAIGN.name;
  }
  return campaign;
};

const stepLabel = (campaign: string, step: number | null) => {
  const active = ACTIVE_EMAIL_CAMPAIGN.steps.find(
    (s) => parseTemplate(s.template).campaign === campaign && s.step === step
  );
  if (active) return `Step ${step} — ${active.label}`;
  return step === null ? 'Envoi unique' : `Step ${step}`;
};

/** Fetch all rows of a table page by page (Supabase caps at 1000 per request). */
const fetchAll = async (table: string, columns: string): Promise<any[]> => {
  const out: any[] = [];
  const size = 1000;
  for (let page = 0; page < 20; page += 1) {
    const { data, error } = await (supabase as any)
      .from(table)
      .select(columns)
      .range(page * size, page * size + size - 1);
    if (error) throw error;
    if (!data?.length) break;
    out.push(...data);
    if (data.length < size) break;
  }
  return out;
};

const CampaignPerformanceDashboard: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [onlyActive, setOnlyActive] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sends, clicks, orders, modules] = await Promise.all([
        fetchAll('email_send_log', 'template_name, recipient_email'),
        fetchAll('email_clicks', 'template_name, email_step, prospect_email'),
        fetchAll('funnel_orders', 'email, amount, status'),
        fetchAll('module_entitlements', 'email, amount, status'),
      ]);

      // Buyers: email -> total revenue (paid only)
      const revenueByEmail = new Map<string, number>();
      const addRevenue = (email: string, amount: unknown, status: string) => {
        if (!email) return;
        if (!['paid', 'active', 'completed'].includes((status || '').toLowerCase())) return;
        revenueByEmail.set(email, (revenueByEmail.get(email) || 0) + Number(amount || 0));
      };
      orders.forEach((o: any) => addRevenue(norm(o.email), o.amount, o.status));
      modules.forEach((m: any) => addRevenue(norm(m.email), m.amount, m.status));

      // Aggregate per template
      const agg = new Map<string, { sent: Set<string>; clickers: Set<string> }>();
      const bucket = (template?: string | null) => {
        const key = template || '(sans template)';
        if (!agg.has(key)) agg.set(key, { sent: new Set(), clickers: new Set() });
        return agg.get(key)!;
      };
      sends.forEach((s: any) => {
        if (!s.template_name) return;
        bucket(s.template_name).sent.add(norm(s.recipient_email));
      });
      clicks.forEach((c: any) => {
        if (!c.template_name) return;
        bucket(c.template_name).clickers.add(norm(c.prospect_email));
      });

      const result: Row[] = Array.from(agg.entries()).map(([template, v]) => {
        const { campaign, step } = parseTemplate(template);
        let buyers = 0;
        let revenue = 0;
        v.clickers.forEach((email) => {
          const r = revenueByEmail.get(email);
          if (r !== undefined) {
            buyers += 1;
            revenue += r;
          }
        });
        return {
          campaign,
          step,
          template,
          sent: v.sent.size,
          clickers: v.clickers.size,
          buyers,
          revenue,
        };
      });

      result.sort((a, b) =>
        a.campaign === b.campaign ? (a.step || 0) - (b.step || 0) : a.campaign.localeCompare(b.campaign)
      );
      setRows(result);
    } catch (e: any) {
      toast.error('Erreur de chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeCampaigns = useMemo(
    () => new Set(ACTIVE_EMAIL_CAMPAIGN.steps.map((s) => parseTemplate(s.template).campaign)),
    []
  );

  const visible = useMemo(
    () => (onlyActive ? rows.filter((r) => activeCampaigns.has(r.campaign)) : rows),
    [rows, onlyActive, activeCampaigns]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Row[]>();
    visible.forEach((r) => {
      if (!map.has(r.campaign)) map.set(r.campaign, []);
      map.get(r.campaign)!.push(r);
    });
    return Array.from(map.entries());
  }, [visible]);

  const totals = visible.reduce(
    (acc, r) => {
      acc.sent += r.sent;
      acc.clickers += r.clickers;
      acc.buyers += r.buyers;
      acc.revenue += r.revenue;
      return acc;
    },
    { sent: 0, clickers: 0, buyers: 0, revenue: 0 }
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          {[
            { label: 'Emails (destinataires)', value: String(totals.sent), icon: Mail },
            { label: 'Taux de clic', value: `${pct(totals.clickers, totals.sent)} %`, icon: MousePointerClick },
            { label: 'Taux d’achat (clics)', value: `${pct(totals.buyers, totals.clickers)} %`, icon: ShoppingCart },
            { label: 'Chiffre d’affaires', value: `${totals.revenue.toFixed(2)} €`, icon: Euro },
          ].map((k) => (
            <div key={k.label} className="rounded-lg bg-background/50 border border-border/50 p-3">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <k.icon className="h-3.5 w-3.5" /> {k.label}
              </div>
              <div className="text-2xl font-bold text-gold-light mt-1">{k.value}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setOnlyActive((v) => !v)}>
            {onlyActive ? 'Voir toutes les campagnes' : 'Campagne active seulement'}
          </Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </Button>
        </div>
      </div>

      {grouped.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center text-muted-foreground text-sm">
            Aucune donnée pour le moment.
          </CardContent>
        </Card>
      )}

      {grouped.map(([campaign, campaignRows]) => {
        const t = campaignRows.reduce(
          (acc, r) => {
            acc.sent += r.sent;
            acc.clickers += r.clickers;
            acc.buyers += r.buyers;
            acc.revenue += r.revenue;
            return acc;
          },
          { sent: 0, clickers: 0, buyers: 0, revenue: 0 }
        );
        return (
          <Card key={campaign} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-gradient-gold text-base flex flex-wrap items-center gap-2">
                {campaignLabel(campaign)}
                <Badge variant="outline" className="text-xs">{campaignRows.length} steps</Badge>
                <Badge variant="outline" className="text-xs">Clic {pct(t.clickers, t.sent)} %</Badge>
                <Badge variant="outline" className="text-xs">Achat {pct(t.buyers, t.clickers)} %</Badge>
                <Badge variant="outline" className="text-xs">{t.revenue.toFixed(2)} €</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs border-b border-border/50">
                    <th className="text-left py-2 pr-3">Step</th>
                    <th className="text-right py-2 px-2">Envoyés</th>
                    <th className="text-right py-2 px-2">Clics uniques</th>
                    <th className="text-right py-2 px-2">Taux de clic</th>
                    <th className="text-right py-2 px-2">Acheteurs</th>
                    <th className="text-right py-2 px-2">Taux d’achat</th>
                    <th className="text-right py-2 pl-2">CA</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignRows.map((r) => (
                    <tr key={r.template} className="border-b border-border/30 last:border-0">
                      <td className="py-2 pr-3 text-foreground">
                        {stepLabel(r.campaign, r.step)}
                        <div className="text-[11px] text-muted-foreground">{r.template}</div>
                      </td>
                      <td className="py-2 px-2 text-right">{r.sent}</td>
                      <td className="py-2 px-2 text-right">{r.clickers}</td>
                      <td className="py-2 px-2 text-right text-gold-light font-semibold">{pct(r.clickers, r.sent)} %</td>
                      <td className="py-2 px-2 text-right">{r.buyers}</td>
                      <td className="py-2 px-2 text-right text-gold-light font-semibold">{pct(r.buyers, r.clickers)} %</td>
                      <td className="py-2 pl-2 text-right font-semibold">{r.revenue.toFixed(2)} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-muted-foreground mt-3">
                Le CA est attribué aux acheteurs ayant cliqué sur ce step (commandes payées et modules actifs).
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CampaignPerformanceDashboard;
