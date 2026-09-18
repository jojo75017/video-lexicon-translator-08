import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, Loader2, Mail, RefreshCw, Send } from 'lucide-react';

/**
 * Relance « devis correction / mise en forme + inscription V3 ».
 * Un seul email, deux blocs de poids égal (prestation à partir de 149 € ou
 * abonnement V3). Envoi par lots de 200, déclenché à la main, jamais deux
 * fois la même adresse.
 */

const FN = 'send-relance-devis-v3';
const BATCH = 200;

interface Target {
  email: string;
  source: string;
}

const RelanceDevisV3Panel = () => {
  const [count, setCount] = useState<number | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<
    'test' | 'send' | 'preview' | 'suivi-status' | 'suivi-test' | 'suivi-send' | null
  >(null);
  const [lastSent, setLastSent] = useState<number | null>(null);
  const [suiviCount, setSuiviCount] = useState<number | null>(null);
  const [suiviClickers, setSuiviClickers] = useState<number | null>(null);
  const [suiviDone, setSuiviDone] = useState<number | null>(null);

  const call = useCallback(async (body: Record<string, unknown>) => {
    const { data: session } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke(FN, {
      body,
      headers: { Authorization: `Bearer ${session.session?.access_token}` },
    });
    if (error) throw error;
    const payload = data as Record<string, unknown>;
    if (payload?.error) throw new Error(String(payload.error));
    return payload;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await call({ mode: 'status' });
      setCount(Number(data.would_send ?? 0));
      setTargets((data.targets as Target[]) || []);
    } catch {
      setCount(null);
    }
    setLoading(false);
  }, [call]);

  useEffect(() => {
    load();
  }, [load]);

  const preview = async () => {
    setBusy('preview');
    try {
      const data = await call({ mode: 'preview' });
      setCount(Number(data.would_send ?? 0));
      setTargets((data.targets as Target[]) || []);
      toast.success(`${data.would_send} destinataire(s) éligible(s)`);
    } catch (err) {
      toast.error('Aperçu impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const sendTest = async () => {
    setBusy('test');
    try {
      const data = await call({ mode: 'test' });
      if (data.success) toast.success(`Email de test envoyé à ${data.to}`);
      else toast.error('Test refusé : ' + String(data.error || ''));
    } catch (err) {
      toast.error('Test impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const sendBatch = async () => {
    if (!window.confirm(`Envoyer un lot de ${BATCH} emails maintenant ?`)) return;
    setBusy('send');
    try {
      const data = await call({ mode: 'send', limit: BATCH });
      const errors = (data.errors as string[]) || [];
      setLastSent(Number(data.sent ?? 0));
      toast.success(`${data.sent} email(s) envoyé(s)${errors.length ? ` · ${errors.length} refus` : ''}`);
      if (errors.length) console.warn('Refus d’envoi :', errors);
      await load();
    } catch (err) {
      toast.error('Envoi impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const loadSuivi = async () => {
    setBusy('suivi-status');
    try {
      const data = await call({ mode: 'suivi-status' });
      setSuiviCount(Number(data.would_send ?? 0));
      setSuiviClickers(Number(data.clickers ?? 0));
      setSuiviDone(Number(data.already_sent ?? 0));
      toast.success(`${data.would_send} non-cliqueur(s) à relancer`);
    } catch (err) {
      toast.error('Comptage impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const sendSuiviTest = async () => {
    setBusy('suivi-test');
    try {
      const data = await call({ mode: 'suivi-test' });
      if (data.success) toast.success(`Test relance nº2 envoyé à ${data.to}`);
      else toast.error('Test refusé : ' + String(data.error || ''));
    } catch (err) {
      toast.error('Test impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const sendSuiviBatch = async () => {
    if (!window.confirm(`Envoyer la relance nº2 à ${BATCH} non-cliqueurs maintenant ?`)) return;
    setBusy('suivi-send');
    try {
      const data = await call({ mode: 'suivi-send', limit: BATCH });
      const errors = (data.errors as string[]) || [];
      toast.success(`${data.sent} email(s) envoyé(s)${errors.length ? ` · ${errors.length} refus` : ''}`);
      if (errors.length) console.warn('Refus d’envoi :', errors);
      setSuiviCount(Number(data.remaining ?? 0));
    } catch (err) {
      toast.error('Envoi impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };



  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Mail className="h-5 w-5" /> Relance devis + inscription V3
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Un seul email, ton direct : « Votre livre est écrit. Il n'est pas encore publiable. »
            Deux choix de poids égal — devis de correction et mise en forme à partir de 149 €, ou
            abonnement V3 le 1<sup>er</sup> octobre. Paniers abandonnés d'abord, puis prospects
            actifs, puis leads.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Actualiser</span>
        </Button>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Destinataires restants</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {count === null ? '—' : count}
          </p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Taille d'un lot</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{BATCH}</p>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">Dernier lot envoyé</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{lastSent === null ? '—' : lastSent}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={preview} disabled={busy !== null}>
          <Eye className="mr-2 h-4 w-4" /> Aperçu des destinataires
        </Button>
        <Button variant="outline" size="sm" onClick={sendTest} disabled={busy !== null}>
          {busy === 'test' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Test vers ma boîte
        </Button>
        <Button size="sm" onClick={sendBatch} disabled={busy !== null || count === 0}>
          {busy === 'send' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Envoyer le lot de {BATCH}
        </Button>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-border p-4">
        <p className="text-sm font-semibold text-foreground">
          Relance nº2 — uniquement les non-cliqueurs
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Autre texte, autre objet (« Il reste peu de jours avant le 1<sup>er</sup> octobre »).
          Envoyée seulement aux adresses qui ont reçu le 1<sup>er</sup> email sans cliquer sur
          aucun des deux liens. Ceux qui ont cliqué ne sont jamais relancés.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Non-cliqueurs à relancer</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {suiviCount === null ? '—' : suiviCount}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Ont cliqué (exclus)</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {suiviClickers === null ? '—' : suiviClickers}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Déjà relancés</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {suiviDone === null ? '—' : suiviDone}
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={loadSuivi} disabled={busy !== null}>
            {busy === 'suivi-status' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Compter les non-cliqueurs
          </Button>
          <Button variant="outline" size="sm" onClick={sendSuiviTest} disabled={busy !== null}>
            {busy === 'suivi-test' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Test relance nº2 vers ma boîte
          </Button>
          <Button size="sm" variant="secondary" onClick={sendSuiviBatch} disabled={busy !== null || suiviCount === 0}>
            {busy === 'suivi-send' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Envoyer la relance nº2 (lot de {BATCH})
          </Button>
        </div>
      </div>

      {targets.length > 0 && (
        <div className="mt-4 rounded-xl border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground">
            50 premiers destinataires du prochain lot
          </p>
          <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs text-foreground">
            {targets.map((t) => (
              <li key={t.email} className="flex justify-between gap-3">
                <span className="truncate">{t.email}</span>
                <span className="shrink-0 text-muted-foreground">{t.source}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default RelanceDevisV3Panel;
