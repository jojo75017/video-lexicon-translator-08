import React from 'react';
import { Gauge, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface CreditsData {
  configured: boolean;
  mode?: 'gateway' | 'direct';
  remaining?: number | null;
  planCredits?: number | null;
  used?: number | null;
  pct?: number | null;
  billingPeriodEnd?: string | null;
  error?: string;
}

interface Props {
  compact?: boolean;
  className?: string;
}

export const FirecrawlCreditsIndicator: React.FC<Props> = ({ compact = false, className = '' }) => {
  const [data, setData] = React.useState<CreditsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke('firecrawl-credits');
      if (error) throw error;
      setData(res as CreditsData);
    } catch (e) {
      setData({ configured: false, error: (e as Error).message });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const pct = data?.pct ?? null;
  const remaining = data?.remaining;
  const plan = data?.planCredits;
  const low = pct != null && pct >= 80;
  const critical = pct != null && pct >= 95;

  const tone = critical
    ? 'border-l-red-500 bg-red-50/60 dark:bg-red-950/20'
    : low
    ? 'border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20'
    : 'border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/15';

  const icon = critical ? (
    <AlertTriangle className="w-5 h-5 text-red-600" />
  ) : low ? (
    <AlertTriangle className="w-5 h-5 text-amber-600" />
  ) : (
    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
  );

  return (
    <Card className={`border-l-4 rounded-r-lg ${tone} ${className}`}>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">{icon}</div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">Plafond Firecrawl (scraping)</p>
                {data?.mode && (
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                    {data.mode}
                  </Badge>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={load} disabled={loading} className="h-7 gap-1">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-xs">Actualiser</span>
              </Button>
            </div>

            {loading && !data ? (
              <p className="text-xs text-muted-foreground">Chargement…</p>
            ) : !data?.configured ? (
              <p className="text-xs text-muted-foreground">
                Firecrawl n'est pas encore connecté. Ouvrez Paramètres → Connecteurs pour l'activer.
              </p>
            ) : data.error ? (
              <p className="text-xs text-muted-foreground">
                Impossible de récupérer le plafond : {data.error}
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <strong className="text-foreground">{remaining?.toLocaleString('fr-FR') ?? '—'}</strong>{' '}
                    crédits restants
                    {plan ? ` / ${plan.toLocaleString('fr-FR')}` : ''}
                  </span>
                  {pct != null && <span>{pct}% utilisés</span>}
                </div>
                {pct != null && <Progress value={pct} className="h-2" />}
                {data.billingPeriodEnd && (
                  <p className="text-[11px] text-muted-foreground">
                    Renouvellement le{' '}
                    {new Date(data.billingPeriodEnd).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
                {critical && (
                  <p className="text-xs text-red-700 dark:text-red-400">
                    Plafond bientôt atteint : augmentez le plan Firecrawl ou attendez le renouvellement.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirecrawlCreditsIndicator;
