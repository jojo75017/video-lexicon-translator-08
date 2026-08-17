import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Activity, CheckCircle2, Loader2, MailWarning, RefreshCw, ShieldCheck, TestTube2, XCircle } from 'lucide-react';

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

interface TestResult {
  to: string;
  ok: boolean;
  message_id?: string;
  detail?: string;
  quotaExhausted?: boolean;
}

interface TestPayload {
  success: boolean;
  test_id: string;
  short_id: string;
  addresses: string[];
  results: TestResult[];
}


/**
 * Santé des emails : montre ce qui est réellement livré, rebondi ou inconnu,
 * et permet de synchroniser les évènements depuis Resend puis de nettoyer la liste.
 */
export default function EmailHealthPanel() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [diag, setDiag] = useState<DiagnosticPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [showTestInput, setShowTestInput] = useState(false);
  const [testAddresses, setTestAddresses] = useState('boubetgeorges@gmail.com');
  const [testResult, setTestResult] = useState<TestPayload | null>(null);

  const call = useCallback(async (mode: string, extra: Record<string, unknown> = {}) => {
    const { data: res, error } = await supabase.functions.invoke('email-health-sync', {
      body: { mode, days: 14, ...extra },
    });
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

  const loadDiagnostic = useCallback(async () => {
    setBusy('diagnostic');
    try {
      setDiag(await call('diagnostic') as unknown as DiagnosticPayload);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Diagnostic impossible');
    } finally {
      setBusy(null);
    }
  }, [call]);

  const runTest = useCallback(async () => {
    const addresses = testAddresses.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
    if (!addresses.length) {
      toast.error('Aucune adresse de test valide');
      return;
    }
    setBusy('test');
    try {
      const res = await call('deliverability_test', { addresses });
      setTestResult(res as unknown as TestPayload);
      const okCount = (res as unknown as TestPayload).results.filter((r) => r.ok).length;
      toast.success(`${okCount} test(s) envoyé(s) sur ${(res as unknown as TestPayload).results.length}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Test impossible');
    } finally {
      setBusy(null);
    }
  }, [call, load, testAddresses]);

  useEffect(() => { void load(); void loadDiagnostic(); }, [load, loadDiagnostic]);


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
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowTestInput((s) => !s)}
            disabled={busy !== null}
          >
            <TestTube2 className="h-4 w-4 mr-2" />
            Test d'arrivée
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!data?.resend_key_configured && (
          <p className="text-sm text-amber-400">
            Clé Resend absente : la synchronisation des livraisons est indisponible.
          </p>
        )}

        {diag && (
          <div className={`flex items-start gap-3 rounded-lg border p-3 ${diag.blocking.length === 0 ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
            {diag.blocking.length === 0
              ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />}
            <div>
              <p className={`text-sm font-semibold ${diag.blocking.length === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {diag.blocking.length === 0
                  ? 'Authentification OK — les emails peuvent partir'
                  : `Blocage détecté : ${diag.blocking.join(', ')}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {diag.blocking.length === 0
                  ? 'SPF, DKIM, DMARC et clé d\'envoi sont valides.'
                  : 'Résolvez les points rouges ci-dessous avant d\'envoyer une campagne.'}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">
              Authentification du domaine d'envoi
              {diag ? ` — ${diag.from_address}` : ''}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void loadDiagnostic()}
              disabled={busy !== null}
            >
              {busy === 'diagnostic'
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : 'Relancer le diagnostic'}
            </Button>
          </div>

          {!diag && <p className="text-sm text-muted-foreground">Diagnostic en cours…</p>}

          {diag && (
            <div className="space-y-2">
              {diag.checks.map((c) => (
                <div key={c.key} className="text-sm">
                  <p className={c.ok ? 'text-emerald-400' : 'text-red-400'}>
                    {c.ok ? '✓' : '✗'} {c.label}
                  </p>
                  <p className="break-all pl-4 text-xs text-muted-foreground">{c.value}</p>
                  {!c.ok && (
                    <p className="pl-4 text-xs text-amber-400">À faire : {c.fix}</p>
                  )}
                </div>
              ))}
              <p className="pt-1 text-xs text-muted-foreground">
                Réponses reçues sur {diag.reply_to} · livraisons confirmées :{' '}
                {diag.delivery_confirmed} / {diag.delivery_total} envois (14 jours)
              </p>
            </div>
          )}
        </div>

        {showTestInput && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                Envoyer un email [TEST] pour vérifier l'arrivée
              </p>
              <Button
                size="sm"
                onClick={() => void runTest()}
                disabled={busy !== null || !diag || diag.blocking.length > 0}
              >
                {busy === 'test' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TestTube2 className="h-4 w-4 mr-2" />}
                Lancer le test
              </Button>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="test-addresses" className="text-xs text-muted-foreground">
                Destinataires (séparés par virgule, point-virgule ou espace)
              </Label>
              <Input
                id="test-addresses"
                value={testAddresses}
                onChange={(e) => setTestAddresses(e.target.value)}
                placeholder="boubetgeorges@gmail.com, test@outlook.com, test@yahoo.com"
                disabled={busy === 'test'}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Conseil : testez au moins Gmail, Outlook et Yahoo. L'email porte le sujet
              « [TEST] EbookStudio — vérification de délivrabilité ».
            </p>

            {testResult && (
              <div className="space-y-2 rounded border border-border bg-background/40 p-3">
                <p className="text-sm font-semibold text-foreground">
                  Résultat du test <span className="text-gold">#{testResult.short_id}</span>
                </p>
                <div className="space-y-1">
                  {testResult.results.map((r) => (
                    <div key={r.to} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{r.to}</span>
                      <div className="flex items-center gap-2">
                        {r.ok ? (
                          <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Envoyé</Badge>
                        ) : (
                          <Badge variant="destructive">Erreur</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {testResult.results.some((r) => !r.ok) && (
                  <div className="text-xs text-red-400">
                    {testResult.results
                      .filter((r) => !r.ok)
                      .map((r) => `${r.to}: ${r.detail || 'échec'}`)
                      .join(' · ')}
                  </div>
                )}
              </div>
            )}
          </div>
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
