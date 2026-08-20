import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Send, Eye } from 'lucide-react';

/**
 * Suivi + relance de la séquence « offre 47 € ».
 * Affiche par étape : envoyés / ouvertures uniques / clics uniques,
 * et permet d'envoyer l'étape suivante (avec test et simulation).
 */

const STEPS = [1, 2, 3, 4, 5];
const templateName = (step: number) => `fin-47-v3-${step}`;

interface StepStat {
  step: number;
  sent: number;
  opens: number;
  clicks: number;
}

const uniqueCount = (rows: Array<Record<string, unknown>> | null, key: string) =>
  new Set((rows || []).map((r) => String(r[key] || '').toLowerCase().trim()).filter(Boolean)).size;

const CampaignSequencePanel = () => {
  const [stats, setStats] = useState<StepStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyStep, setBusyStep] = useState<number | null>(null);
  const [testEmail, setTestEmail] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await Promise.all(
        STEPS.map(async (step) => {
          const t = templateName(step);
          const [{ data: sent }, { data: opens }, { data: clicks }] = await Promise.all([
            (supabase as any).from('email_send_log').select('recipient_email').eq('template_name', t).in('status', ['sent', 'delivered']).limit(5000),
            (supabase as any).from('email_opens').select('prospect_email').eq('template_name', t).limit(5000),
            (supabase as any).from('email_clicks').select('prospect_email').eq('template_name', t).limit(5000),
          ]);
          return {
            step,
            sent: uniqueCount(sent, 'recipient_email'),
            opens: uniqueCount(opens, 'prospect_email'),
            clicks: uniqueCount(clicks, 'prospect_email'),
          } as StepStat;
        }),
      );
      setStats(rows);
    } catch (err) {
      toast.error('Impossible de charger le suivi : ' + ((err as Error).message || ''));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const call = async (body: Record<string, unknown>) => {
    const { data: session } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke('send-sales-email', {
      body,
      headers: { Authorization: `Bearer ${session.session?.access_token}` },
    });
    if (error) throw error;
    return data as Record<string, unknown>;
  };

  const preview = async (step: number) => {
    setBusyStep(step);
    try {
      const data = await call({ mode: 'send_step', step, dry_run: true });
      toast.success(`Étape ${step} : ${data.would_send} destinataires seraient contactés`);
    } catch (err) {
      toast.error('Simulation impossible : ' + ((err as Error).message || ''));
    }
    setBusyStep(null);
  };

  const sendTest = async (step: number) => {
    const email = testEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Renseigne une adresse de test valide');
      return;
    }
    setBusyStep(step);
    try {
      await call({ mode: 'test', step, test_email: email });
      toast.success(`Test de l'étape ${step} envoyé à ${email}`);
    } catch (err) {
      toast.error('Test impossible : ' + ((err as Error).message || ''));
    }
    setBusyStep(null);
  };

  const sendStep = async (step: number) => {
    if (!window.confirm(`Envoyer l'étape ${step} à tous les contacts qui ont reçu l'étape ${step - 1} ?`)) return;
    setBusyStep(step);
    try {
      const data = await call({ mode: 'send_step', step });
      toast.success(`Étape ${step} : ${data.sent} emails envoyés sur ${data.targets} ciblés`);
      load();
    } catch (err) {
      toast.error("Erreur d'envoi : " + ((err as Error).message || ''));
    }
    setBusyStep(null);
  };

  const sendOpeners = async (step: number) => {
    setBusyStep(step);
    try {
      // On montre d'abord le nombre réel de destinataires : évite les relances "0 envoyé" sans explication.
      const check = await call({ mode: 'resend_openers', step, dry_run: true });
      const count = Number(check.would_send || 0);
      if (count === 0) {
        toast.info(`Aucun ouvreur à relancer sur l'étape ${step} (tous ont déjà cliqué, acheté ou été relancés).`);
        setBusyStep(null);
        return;
      }
      if (!window.confirm(`Relancer ${count} ouvreurs non-cliqueurs de l'étape ${step} ?`)) {
        setBusyStep(null);
        return;
      }
      const data = await call({ mode: 'resend_openers', step });
      toast.success(`Relance envoyée à ${data.sent} ouvreurs non-cliqueurs sur ${data.targets} ciblés`);
      load();
    } catch (err) {
      toast.error('Relance impossible : ' + ((err as Error).message || ''));
    }
    setBusyStep(null);
  };


  return (
    <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">Séquence offre 47 € — suivi et relance</h3>
        <Button variant="ghost" size="sm" onClick={load} className="ml-auto text-muted-foreground">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/80 border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Étape</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Envoyés</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Ouvertures uniques</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Clics uniques</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.step} className="border-b border-border/50">
                <td className="px-3 py-2 font-medium">Étape {s.step}</td>
                <td className="px-3 py-2 text-center">{s.sent}</td>
                <td className="px-3 py-2 text-center">{s.opens}</td>
                <td className="px-3 py-2 text-center">{s.clicks}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap justify-end gap-1">
                    <Button variant="outline" size="sm" disabled={busyStep === s.step} onClick={() => sendTest(s.step)}>
                      Test
                    </Button>
                    {s.step > 1 && (
                      <>
                        <Button variant="outline" size="sm" disabled={busyStep === s.step} onClick={() => preview(s.step)}>
                          <Eye className="mr-1 h-3 w-3" /> Simuler
                        </Button>
                        <Button size="sm" disabled={busyStep === s.step} onClick={() => sendStep(s.step)}>
                          <Send className="mr-1 h-3 w-3" /> Envoyer
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm" disabled={busyStep === s.step} onClick={() => sendOpeners(s.step)}>
                      Relancer ouvreurs
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="Adresse pour les envois de test"
          className="max-w-xs"
        />
        <p className="text-xs text-muted-foreground">
          Les boutons des emails passent désormais par ebookstudio.fr/r (lien de confiance, clics enregistrés).
        </p>
      </div>
    </div>
  );
};

export default CampaignSequencePanel;
