import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Mail, Eye, MousePointerClick, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Les 15 templates de la séquence de vente
const TEMPLATES: { key: string; label: string; group: string }[] = [
  { key: 'standard-1', label: 'Curiosité', group: 'Standard' },
  { key: 'standard-2', label: 'Douleur', group: 'Standard' },
  { key: 'standard-3', label: 'Preuve', group: 'Standard' },
  { key: 'standard-4', label: 'Urgence', group: 'Standard' },
  { key: 'standard-5', label: 'Dernier appel', group: 'Standard' },
  { key: 'standard-6', label: 'Relance finale', group: 'Standard' },
  { key: 'interesse-1', label: 'Démo prête', group: 'Intéressés' },
  { key: 'interesse-2', label: 'Offre Fondateur', group: 'Intéressés' },
  { key: 'interesse-3', label: '67€ = V3', group: 'Intéressés' },
  { key: 'interesse-4', label: 'Pourquoi maintenant', group: 'Intéressés' },
  { key: 'interesse-5', label: 'Dernier rappel', group: 'Intéressés' },
  { key: 'interesse-6', label: 'On en reste là ?', group: 'Intéressés' },
  { key: 'relance-1', label: 'Démo 2 min', group: 'Relances' },
  { key: 'relance-2', label: 'Valeur 67€', group: 'Relances' },
  { key: 'relance-3', label: 'Dernière main tendue', group: 'Relances' },
];

interface Stat {
  sent: number;
  delivered: number;
  opens: number;
  clicks: number;
}

const countFor = async (table: string, template: string, extra?: (q: any) => any): Promise<number> => {
  let q = (supabase as any).from(table).select('id', { count: 'exact', head: true }).eq('template_name', template);
  if (extra) q = extra(q);
  const { count } = await q;
  return count || 0;
};

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

const TemplatePerformancePanel: React.FC = () => {
  const [stats, setStats] = useState<Record<string, Stat>>({});
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const entries = await Promise.all(
        TEMPLATES.map(async (t) => {
          const [sent, delivered, opens, clicks] = await Promise.all([
            countFor('email_send_log', t.key),
            countFor('email_send_log', t.key, (q) => q.eq('status', 'delivered')),
            countFor('email_opens', t.key),
            countFor('email_clicks', t.key),
          ]);
          return [t.key, { sent, delivered, opens, clicks }] as const;
        })
      );
      setStats(Object.fromEntries(entries));
    } catch (e: any) {
      toast.error('Erreur de chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const verifyDelivery = async () => {
    setVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-sales-email', {
        body: { mode: 'verify_delivery', limit: 150 },
      });
      if (error) throw error;
      if (data?.checked === 0) {
        toast.info("Lecture du statut via l'API indisponible (clé Resend en envoi seul). La livraison est confirmée automatiquement par le webhook Resend.");
      } else {
        toast.success(`${data.delivered}/${data.checked} confirmés livrés côté Resend`);
      }
      await load();
    } catch (e: any) {
      toast.error('Vérification impossible');
    } finally {
      setVerifying(false);
    }
  };

  const totals = TEMPLATES.reduce(
    (acc, t) => {
      const s = stats[t.key];
      if (s) {
        acc.sent += s.sent; acc.delivered += s.delivered; acc.opens += s.opens; acc.clicks += s.clicks;
      }
      return acc;
    },
    { sent: 0, delivered: 0, opens: 0, clicks: 0 }
  );

  const groups = ['Standard', 'Intéressés', 'Relances'];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          {[
            { label: 'Envoyés', value: totals.sent, icon: Mail },
            { label: 'Livrés', value: totals.delivered, icon: CheckCircle2 },
            { label: 'Ouvertures', value: totals.opens, icon: Eye },
            { label: 'Clics', value: totals.clicks, icon: MousePointerClick },
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
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Actualiser
          </Button>
          <Button size="sm" onClick={verifyDelivery} disabled={verifying}>
            <CheckCircle2 className={`h-4 w-4 mr-2 ${verifying ? 'animate-spin' : ''}`} /> Vérifier la livraison
          </Button>
        </div>
      </div>

      {groups.map((g) => (
        <Card key={g} className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-gradient-gold text-sm">{g}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground text-xs border-b border-border/50">
                    <th className="text-left font-medium px-4 py-2">Template</th>
                    <th className="text-right font-medium px-3 py-2">Envoyés</th>
                    <th className="text-right font-medium px-3 py-2">Livrés</th>
                    <th className="text-right font-medium px-3 py-2">Ouvertures</th>
                    <th className="text-right font-medium px-3 py-2">Taux ouv.</th>
                    <th className="text-right font-medium px-3 py-2">Clics</th>
                    <th className="text-right font-medium px-4 py-2">Taux clic</th>
                  </tr>
                </thead>
                <tbody>
                  {TEMPLATES.filter((t) => t.group === g).map((t) => {
                    const s = stats[t.key] || { sent: 0, delivered: 0, opens: 0, clicks: 0 };
                    const openRate = pct(s.opens, s.sent);
                    const clickRate = pct(s.clicks, s.sent);
                    return (
                      <tr key={t.key} className="border-b border-border/30 last:border-0 hover:bg-background/40">
                        <td className="px-4 py-2 text-foreground">
                          {t.label} <span className="text-muted-foreground text-xs">({t.key})</span>
                        </td>
                        <td className="px-3 py-2 text-right text-foreground">{s.sent}</td>
                        <td className="px-3 py-2 text-right">
                          {s.delivered > 0 ? (
                            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">{s.delivered}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right text-foreground">{s.opens}</td>
                        <td className="px-3 py-2 text-right">
                          <span className={openRate >= 40 ? 'text-emerald-400' : openRate >= 20 ? 'text-gold-light' : 'text-muted-foreground'}>
                            {openRate}%
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-foreground">{s.clicks}</td>
                        <td className="px-4 py-2 text-right">
                          <span className={clickRate >= 10 ? 'text-emerald-400' : clickRate >= 3 ? 'text-gold-light' : 'text-muted-foreground'}>
                            {clickRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}

      <p className="text-xs text-muted-foreground px-1">
        Les ouvertures et clics incluent les envois de test. Le statut « Livrés » est confirmé automatiquement par le webhook Resend.
      </p>
    </div>
  );
};

export default TemplatePerformancePanel;
