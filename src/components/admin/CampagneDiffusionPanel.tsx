import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, RotateCcw, Send, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CAMPAGNE_EMAILS, emailToHtml } from '@/data/campagneUnique';

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  blocked?: boolean;
  sent: Record<string, number>;
}

/**
 * Diffusion réelle de la campagne unique : remise à zéro des compteurs
 * puis envoi par lots, email par email, sans doublon.
 */
export function CampagneDiffusionPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke('send-campagne-unique', { body });
    if (error) throw error;
    if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
    return data as Record<string, unknown>;
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await call({ mode: 'stats' });
      setStats(data as unknown as Stats);
    } catch (err) {
      toast.error(`Compteurs indisponibles : ${(err as Error).message}`);
    }
  }, [call]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const reset = async () => {
    if (!window.confirm('Remettre tous les compteurs à zéro ? Les envois, ouvertures et clics de la campagne seront effacés et les prospects repartiront à l\'étape 0.')) return;
    setBusy('reset');
    try {
      const data = await call({ mode: 'reset' });
      toast.success(`Compteurs remis à zéro — ${data.ready ?? 0} prospects prêts à recevoir la campagne`);
      await loadStats();
    } catch (err) {
      toast.error(`Remise à zéro impossible : ${(err as Error).message}`);
    }
    setBusy(null);
  };

  const sendAll = async (emailId: string) => {
    const email = CAMPAGNE_EMAILS.find((item) => item.id === emailId);
    if (!email) return;
    if (!window.confirm(`Envoyer « ${email.subject} » à tous les prospects actifs ?`)) return;

    setBusy(emailId);
    setProgress('Préparation…');
    let totalSent = 0;
    let totalFailed = 0;
    try {
      for (let batch = 0; batch < 40; batch++) {
        const data = await call({
          mode: 'send',
          emailId,
          subject: email.subject,
          html: emailToHtml(email),
          batch_size: 100,
        });
        totalSent += Number(data.sent ?? 0);
        totalFailed += Number(data.failed ?? 0);
        setProgress(`${totalSent} envoyés · ${totalFailed} erreurs · ${data.remaining ?? 0} restants`);
        if (Number(data.targets ?? 0) === 0 || data.quota_exhausted === true) break;
      }
      toast.success(`${totalSent} emails envoyés${totalFailed ? ` — ${totalFailed} erreurs` : ''}`);
      await loadStats();
    } catch (err) {
      toast.error(`Envoi interrompu : ${(err as Error).message}`);
    }
    setBusy(null);
  };

  return (
    <Card className="rounded-2xl border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Users className="h-5 w-5" /> Diffusion réelle aux prospects
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="rounded-xl" onClick={loadStats}>
            <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="rounded-xl"
            disabled={busy !== null}
            onClick={reset}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {busy === 'reset' ? 'Remise à zéro…' : 'Compteurs à 0'}
          </Button>
        </div>
      </div>

      {stats === null ? (
        <p className="mt-4 text-sm text-muted-foreground">Chargement des compteurs…</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="text-muted-foreground">Prospects actifs</p>
              <p className="text-xl font-semibold text-foreground">{stats.active}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="text-muted-foreground">Total en base</p>
              <p className="text-xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="text-muted-foreground">Désinscrits (exclus)</p>
              <p className="text-xl font-semibold text-foreground">{stats.unsubscribed}</p>
            </div>
          </div>

          {stats.blocked && (
            <p className="mt-3 text-sm font-medium text-destructive">
              L'envoi est désactivé sur ce projet (EMAIL_SENDING_ENABLED = false).
            </p>
          )}

          <ul className="mt-4 space-y-2">
            {CAMPAGNE_EMAILS.map((email, index) => {
              const sent = stats.sent?.[email.id] ?? 0;
              return (
                <li
                  key={email.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-full">Email {index + 1}</Badge>
                      <span className="truncate text-sm font-medium text-foreground">{email.subject}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{sent} déjà envoyés</p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-xl"
                    disabled={busy !== null || stats.blocked}
                    onClick={() => sendAll(email.id)}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {busy === email.id ? 'Envoi…' : 'Envoyer à tous'}
                  </Button>
                </li>
              );
            })}
          </ul>

          {busy && progress && (
            <p className="mt-3 text-sm text-muted-foreground">{progress}</p>
          )}
        </>
      )}
    </Card>
  );
}

export default CampagneDiffusionPanel;
