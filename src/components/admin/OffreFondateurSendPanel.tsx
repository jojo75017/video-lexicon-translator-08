import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Mail, Send, Users } from 'lucide-react';
import { FONDATEUR_END_LABEL, FONDATEUR_PRICE, FONDATEUR_SEATS } from '@/data/offreFondateur';

/** Tailles de lot proposées : petits lots pour tester, gros lots pour la campagne. */
const BATCH_SIZES = [50, 100, 300, 500] as const;

interface Preview {
  subject: string;
  totalPending: number;
  alreadySent: number;
  nextBatch: string[];
}

interface SendResult {
  sentCount: number;
  failedCount: number;
  remaining: number;
  quotaStopped: boolean;
  failed: Array<{ email: string; error: string }>;
}

/**
 * Envoi par lots de l'annonce « 15 jours ou 15 places à 47 € ».
 * Chaque prospect n'est contacté qu'une seule fois, même sur plusieurs lots.
 */
export default function OffreFondateurSendPanel() {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [batchSize, setBatchSize] = useState<number>(300);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [testTo, setTestTo] = useState('');
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState<SendResult | null>(null);

  const readError = async (error: unknown): Promise<string> => {
    const ctx = (error as { context?: unknown })?.context;
    if (ctx instanceof Response) {
      const payload = (await ctx.clone().json().catch(() => null)) as { error?: string } | null;
      if (payload?.error) return payload.error;
    }
    return (error as Error)?.message || 'Action impossible pour le moment.';
  };

  const loadPreview = async (size = batchSize) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-offre-fondateur', {
        body: { mode: 'preview', batchSize: size },
      });
      if (error) throw new Error(await readError(error));
      setPreview(data as Preview);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lecture impossible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPreview(300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendTest = async () => {
    const to = testTo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      toast.error('Indiquez une adresse valide pour recevoir le test.');
      return;
    }
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-offre-fondateur', {
        body: { mode: 'test', to },
      });
      if (error) throw new Error(await readError(error));
      if ((data as { success?: boolean })?.success) toast.success(`Test envoyé à ${to}.`);
      else throw new Error('Envoi refusé.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Test impossible.');
    } finally {
      setTesting(false);
    }
  };

  const sendBatch = async () => {
    if (!preview?.totalPending) {
      toast.info('Aucun prospect en attente pour cette annonce.');
      return;
    }
    const count = Math.min(batchSize, preview.totalPending);
    if (!window.confirm(`Envoyer l'annonce à ${count} personnes maintenant ?`)) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-offre-fondateur', {
        body: { mode: 'send', batchSize },
      });
      if (error) throw new Error(await readError(error));
      const result = data as SendResult;
      setLastResult(result);
      if (result.quotaStopped) {
        toast.warning(
          `${result.sentCount} envois réalisés puis arrêt : la limite du jour est atteinte. Reprenez demain, rien ne sera envoyé deux fois.`,
        );
      } else {
        toast.success(`${result.sentCount} envois réalisés. ${result.remaining} personnes restent à contacter.`);
      }
      await loadPreview(batchSize);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Envoi impossible.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-2 border-[#c2410c]/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Mail className="h-5 w-5 text-[#c2410c]" />
          Annonce « {FONDATEUR_SEATS} derniers accès à vie à {FONDATEUR_PRICE} € »
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Envoi par lots à vos prospects. L'offre ferme dès la {FONDATEUR_SEATS}
          <sup>e</sup> commande réglée, ou le {FONDATEUR_END_LABEL}. Les acheteurs, les abonnés
          actifs et les désinscrits sont automatiquement écartés, et personne ne reçoit
          l'annonce deux fois.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Compteurs */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">À contacter</div>
            <div className="text-2xl font-bold">{preview?.totalPending ?? '—'}</div>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Déjà contactés</div>
            <div className="text-2xl font-bold">{preview?.alreadySent ?? '—'}</div>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Taille du lot</div>
            <div className="text-2xl font-bold">{batchSize}</div>
          </div>
        </div>

        {/* Choix de la taille du lot */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Combien de personnes dans ce lot ?</div>
          <div className="flex flex-wrap gap-2">
            {BATCH_SIZES.map((size) => (
              <Button
                key={size}
                type="button"
                variant={batchSize === size ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setBatchSize(size);
                  void loadPreview(size);
                }}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => void loadPreview()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
            Recompter les destinataires
          </Button>
          <Button
            type="button"
            onClick={() => void sendBatch()}
            disabled={sending || loading || !preview?.totalPending}
            className="bg-[#c2410c] text-white hover:bg-[#9a3412]"
          >
            {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Envoyer le lot suivant ({Math.min(batchSize, preview?.totalPending ?? 0)})
          </Button>
        </div>

        {/* Test à soi-même */}
        <div className="space-y-2 rounded-lg border p-3">
          <div className="text-sm font-medium">Relire le message avant l'envoi réel</div>
          <div className="flex flex-wrap gap-2">
            <Input
              type="email"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              placeholder="votre@email.fr"
              className="max-w-xs"
            />
            <Button type="button" variant="outline" onClick={() => void sendTest()} disabled={testing}>
              {testing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              M'envoyer un test
            </Button>
          </div>
        </div>

        {/* Résultat du dernier lot */}
        {lastResult && (
          <div className="rounded-lg border bg-muted/30 p-3 text-sm">
            <div className="font-medium">Dernier lot</div>
            <div className="mt-1 text-muted-foreground">
              {lastResult.sentCount} envois réussis · {lastResult.failedCount} en échec ·{' '}
              {lastResult.remaining} personnes restent à contacter.
            </div>
            {lastResult.failed?.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {lastResult.failed.map((f) => (
                  <li key={f.email}>
                    {f.email} — {f.error}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Aperçu des prochaines adresses */}
        {preview?.nextBatch?.length ? (
          <details className="rounded-lg border p-3 text-sm">
            <summary className="cursor-pointer font-medium">
              Voir les {preview.nextBatch.length} premières adresses du prochain lot
            </summary>
            <div className="mt-2 max-h-64 overflow-auto font-mono text-xs text-muted-foreground">
              {preview.nextBatch.map((e) => (
                <div key={e}>{e}</div>
              ))}
            </div>
          </details>
        ) : null}
      </CardContent>
    </Card>
  );
}
