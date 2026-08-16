import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity, Loader2, MailWarning, RefreshCw, ShieldCheck } from 'lucide-react';

interface TemplateRow {
  template: string;
  sent: number;
  delivered: number;
  bounced: number;
  complained: number;
  failed: number;
  unknown: number;
}

interface StatusPayload {
  days: number;
  totals: {
    sent: number; delivered: number; bounced: number; complained: number;
    failed: number; unknown: number; opens: number; clicks: number;
  };
  templates: TemplateRow[];
  resend_key_configured: boolean;
}

interface DiagnosticCheck {
  key: string;
  label: string;
  ok: boolean;
  value: string;
  fix: string;
}

interface DiagnosticPayload {
  from_address: string;
  reply_to: string;
  checks: DiagnosticCheck[];
  blocking: string[];
  delivery_confirmed: number;
  delivery_total: number;
}


/**
 * Santé des emails : montre ce qui est réellement livré, rebondi ou inconnu,
 * et permet de synchroniser les évènements depuis Resend puis de nettoyer la liste.
 */
export default function EmailHealthPanel() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const call = useCallback(async (mode: string) => {
    const { data: res, error } = await supabase.functions.invoke('email-health-sync', { body: { mode, days: 14 } });
    if (error) throw error;
    if ((res as { error?: string })?.error) throw new Error((res as { error: string }).error);
    return res as Record<string, unknown>;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await call('status') as unknown as StatusPayload);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Lecture impossible');
    } finally {
      setLoading(false);
    }
  }, [call]);

  useEffect(() => { void load(); }, [load]);

  const run = async (mode: string, label: string) => {
    setBusy(mode);
    try {
      const res = await call(mode);
      if (mode === 'sync') {
        toast.success(`${label} : ${res.updated ?? 0} envois mis à jour sur ${res.checked ?? 0} vérifiés`);
      } else {
        toast.success(
          `${label} : ${res.bounced_paused ?? 0} rebonds coupés, ${res.never_opened_paused ?? 0} jamais-ouvreurs mis en pause`,
        );
      }
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Action impossible');
    } finally {
      setBusy(null);
    }
  };

  const t = data?.totals;
  const rate = (n: number) => (t && t.sent > 0 ? `${Math.round((n / t.sent) * 100)} %` : '—');

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Activity className="h-5 w-5 text-gold" /> Santé des emails (14 jours)
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
          <Button size="sm" onClick={() => void run('sync', 'Synchronisation')} disabled={busy !== null}>
            {busy === 'sync' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
            Synchroniser les livraisons
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void run('hygiene_preview', 'Aperçu du nettoyage')}
            disabled={busy !== null}
          >
            Aperçu du nettoyage
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => void run('hygiene', 'Nettoyage')}
            disabled={busy !== null}
          >
            {busy === 'hygiene' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <MailWarning className="h-4 w-4 mr-2" />}
            Nettoyer la liste
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data?.resend_key_configured && (
          <p className="text-sm text-amber-400">
            Clé Resend absente : la synchronisation des livraisons est indisponible.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Envoyés', value: t?.sent ?? 0, sub: '' },
            { label: 'Livrés', value: t?.delivered ?? 0, sub: rate(t?.delivered ?? 0) },
            { label: 'Rebonds + plaintes', value: (t?.bounced ?? 0) + (t?.complained ?? 0), sub: rate((t?.bounced ?? 0) + (t?.complained ?? 0)) },
            { label: 'Statut inconnu', value: t?.unknown ?? 0, sub: rate(t?.unknown ?? 0) },
            { label: 'Ouvertures', value: t?.opens ?? 0, sub: rate(t?.opens ?? 0) },
            { label: 'Clics', value: t?.clicks ?? 0, sub: rate(t?.clicks ?? 0) },
            { label: 'Échecs', value: t?.failed ?? 0, sub: rate(t?.failed ?? 0) },
          ].map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-background/40 p-3">
              <div className="text-2xl font-bold text-foreground">{k.value}</div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
              {k.sub && <div className="text-xs text-gold-light">{k.sub}</div>}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 pr-3">Modèle</th>
                <th className="py-2 pr-3">Envoyés</th>
                <th className="py-2 pr-3">Livrés</th>
                <th className="py-2 pr-3">Rebonds</th>
                <th className="py-2 pr-3">Inconnus</th>
              </tr>
            </thead>
            <tbody>
              {(data?.templates ?? []).map((row) => (
                <tr key={row.template} className="border-t border-border">
                  <td className="py-2 pr-3 text-foreground">{row.template}</td>
                  <td className="py-2 pr-3">{row.sent}</td>
                  <td className="py-2 pr-3">{row.delivered}</td>
                  <td className="py-2 pr-3">
                    {row.bounced + row.complained > 0
                      ? <Badge variant="destructive">{row.bounced + row.complained}</Badge>
                      : 0}
                  </td>
                  <td className="py-2 pr-3">{row.unknown}</td>
                </tr>
              ))}
              {(data?.templates ?? []).length === 0 && !loading && (
                <tr><td colSpan={5} className="py-3 text-muted-foreground">Aucun envoi sur la période.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          « Statut inconnu » signifie que Resend n'a pas encore été interrogé pour ces envois :
          lancez la synchronisation. Le nettoyage coupe l'auto-envoi pour les rebonds durs et
          les adresses n'ayant jamais ouvert après 5 envois.
        </p>
      </CardContent>
    </Card>
  );
}
