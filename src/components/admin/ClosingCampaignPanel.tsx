import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Send, Eye, ExternalLink } from 'lucide-react';

/**
 * Campagne de clôture de l'offre 47 € (fin le 30/09/2026).
 * Deux segments : message personnel aux cliqueurs (les plus chauds),
 * et séquence de clôture en 3 emails pour les ouvreurs sans clic.
 */

interface LetterStat {
  template: string;
  label: string;
  subject: string;
  segment: 'clickers' | 'openers_no_click' | 'no_click';
  sent: number;
  opens: number;
  clicks: number;
}

const SEGMENT_LABEL: Record<LetterStat['segment'], string> = {
  clickers: 'Cliqueurs',
  openers_no_click: 'Ouvreurs sans clic',
  no_click: 'Tous les non-cliqueurs',
};


const ClosingCampaignPanel = () => {
  const [letters, setLetters] = useState<LetterStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data: session } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke('send-closing-47', {
      body,
      headers: { Authorization: `Bearer ${session.session?.access_token}` },
    });
    if (error) throw error;
    if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
    return data as Record<string, unknown>;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await call({ mode: 'status' });
      setLetters((data.letters as LetterStat[]) || []);
    } catch (err) {
      toast.error('Suivi indisponible : ' + ((err as Error).message || ''));
    }
    setLoading(false);
  }, [call]);

  useEffect(() => {
    load();
  }, [load]);

  const simulate = async (template: string) => {
    setBusy(template);
    try {
      const data = await call({ mode: 'send', template, dry_run: true });
      const eligible = Number(data.eligible_total ?? data.would_send ?? 0);
      toast.success(`${data.would_send} destinataires dans cette vague — ${eligible} éligibles au total`);
    } catch (err) {
      toast.error('Simulation impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };


  const sendTest = async (template: string) => {
    const email = testEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Renseigne une adresse de test valide');
      return;
    }
    setBusy(template);
    try {
      await call({ mode: 'test', template, test_email: email });
      toast.success(`Test envoyé à ${email}`);
    } catch (err) {
      toast.error('Test impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const send = async (letter: LetterStat) => {
    setBusy(letter.template);
    try {
      const check = await call({ mode: 'send', template: letter.template, dry_run: true });
      const count = Number(check.would_send || 0);
      if (count === 0) {
        toast.info('Aucun destinataire éligible (déjà envoyé, acheteurs ou désinscrits exclus).');
        setBusy(null);
        return;
      }
      if (!window.confirm(`Envoyer « ${letter.label} » à ${count} contacts (${SEGMENT_LABEL[letter.segment]}) ?`)) {
        setBusy(null);
        return;
      }
      const data = await call({ mode: 'send', template: letter.template });
      const message = String(data.message || `${data.sent} emails envoyés sur ${data.targets} ciblés`);
      if (data.quota_reached) toast.warning(message);
      else toast.success(message);
      load();

    } catch (err) {
      toast.error("Erreur d'envoi : " + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const openPreview = async (template: string) => {
    setBusy(template);
    try {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('send-closing-47', {
        body: { mode: 'preview', template },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (error) throw error;
      const html = typeof data === 'string' ? data : JSON.stringify(data);
      const win = window.open('', '_blank');
      win?.document.write(html);
      win?.document.close();
    } catch (err) {
      toast.error('Aperçu impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  return (
    <div className="rounded-lg border border-border bg-card/50 p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold">Clôture 47 € — cliqueurs et ouvreurs</h3>
        <span className="text-xs text-muted-foreground">Fin de l'accès à vie le 30/09/2026</span>
        <Button variant="ghost" size="sm" onClick={load} className="ml-auto text-muted-foreground">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card/80 border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Cible</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Envoyés</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Ouvertures</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">Clics</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {letters.map((l) => (
              <tr key={l.template} className="border-b border-border/50">
                <td className="px-3 py-2">
                  <div className="font-medium">{l.label}</div>
                  <div className="text-xs text-muted-foreground">{l.subject}</div>
                </td>
                <td className="px-3 py-2 text-xs">{SEGMENT_LABEL[l.segment]}</td>
                <td className="px-3 py-2 text-center">{l.sent}</td>
                <td className="px-3 py-2 text-center">{l.opens}</td>
                <td className="px-3 py-2 text-center">{l.clicks}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap justify-end gap-1">
                    <Button variant="outline" size="sm" disabled={busy === l.template} onClick={() => openPreview(l.template)}>
                      <ExternalLink className="mr-1 h-3 w-3" /> Aperçu
                    </Button>
                    <Button variant="outline" size="sm" disabled={busy === l.template} onClick={() => sendTest(l.template)}>
                      Test
                    </Button>
                    <Button variant="outline" size="sm" disabled={busy === l.template} onClick={() => simulate(l.template)}>
                      <Eye className="mr-1 h-3 w-3" /> Simuler
                    </Button>
                    <Button size="sm" disabled={busy === l.template} onClick={() => send(l)}>
                      <Send className="mr-1 h-3 w-3" /> Envoyer
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
          Acheteurs, désinscrits et contacts inactifs sont exclus automatiquement. Un même email n'est jamais envoyé deux fois.
        </p>
      </div>
    </div>
  );
};

export default ClosingCampaignPanel;
