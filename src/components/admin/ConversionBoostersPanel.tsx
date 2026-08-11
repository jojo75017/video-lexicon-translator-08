import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Send, Eye, MessageSquareQuote, ShoppingCart } from 'lucide-react';

/**
 * Deux relances à fort rendement, pilotées à la main :
 *  - Demande de témoignage aux abonnés actifs (la page de vente n'a aucun avis).
 *  - Relance des paniers abandonnés (commandes restées en attente > 2 h).
 * Chaque action se prévisualise avant l'envoi ; aucun destinataire n'est
 * contacté deux fois.
 */

type ActionKey = 'temoignage' | 'panier';

const ACTIONS: Array<{
  key: ActionKey;
  fn: string;
  title: string;
  desc: string;
  icon: typeof MessageSquareQuote;
}> = [
  {
    key: 'temoignage',
    fn: 'send-testimonial-request',
    title: 'Demander un témoignage aux abonnés',
    desc: 'Invite chaque abonné actif à déposer 3 lignes + une photo de son livre sur /v3/temoignage. Les avis restent en attente de validation.',
    icon: MessageSquareQuote,
  },
  {
    key: 'panier',
    fn: 'relance-panier-abandonne',
    title: 'Relancer les paniers abandonnés',
    desc: "Commandes en attente depuis plus de 2 h (et moins de 14 jours) : rappel du 47 €, garantie 30 jours, PayPal et paiement en plusieurs fois. Une seule relance par commande.",
    icon: ShoppingCart,
  },
];

const ConversionBoostersPanel = () => {
  const [counts, setCounts] = useState<Record<ActionKey, number | null>>({ temoignage: null, panier: null });
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<ActionKey | null>(null);

  const call = useCallback(async (fn: string, body: Record<string, unknown>) => {
    const { data: session } = await supabase.auth.getSession();
    const { data, error } = await supabase.functions.invoke(fn, {
      body,
      headers: { Authorization: `Bearer ${session.session?.access_token}` },
    });
    if (error) throw error;
    if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
    return data as Record<string, unknown>;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const next: Record<ActionKey, number | null> = { temoignage: null, panier: null };
    for (const action of ACTIONS) {
      try {
        const data = await call(action.fn, { mode: 'status' });
        next[action.key] = Number(data.would_send ?? 0);
      } catch {
        next[action.key] = null;
      }
    }
    setCounts(next);
    setLoading(false);
  }, [call]);

  useEffect(() => {
    load();
  }, [load]);

  const preview = async (key: ActionKey, fn: string) => {
    setBusy(key);
    try {
      const data = await call(fn, { mode: 'preview' });
      toast.success(`${data.would_send} destinataire(s) seraient contacté(s)`);
      setCounts((c) => ({ ...c, [key]: Number(data.would_send ?? 0) }));
    } catch (err) {
      toast.error('Prévisualisation impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  const send = async (key: ActionKey, fn: string, title: string) => {
    if (!window.confirm(`Envoyer maintenant — « ${title} » ?`)) return;
    setBusy(key);
    try {
      const data = await call(fn, { mode: 'send' });
      const errors = (data.errors as string[]) || [];
      toast.success(`${data.sent} email(s) envoyé(s)${errors.length ? ` · ${errors.length} erreur(s)` : ''}`);
      if (errors.length) console.warn('Erreurs d’envoi :', errors);
      await load();
    } catch (err) {
      toast.error('Envoi impossible : ' + ((err as Error).message || ''));
    }
    setBusy(null);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Leviers de conversion</h2>
          <p className="text-sm text-muted-foreground">
            Preuve sociale et paniers abandonnés : les deux relances qui rapportent le plus sans baisser le prix.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Actualiser</span>
        </Button>
      </header>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const count = counts[action.key];
          return (
            <article key={action.key} className="rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{action.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{action.desc}</p>
                </div>
              </div>

              <p className="mt-3 text-sm font-semibold text-foreground">
                {count === null ? 'Destinataires : indisponible' : `${count} destinataire(s) en attente`}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => preview(action.key, action.fn)}
                  disabled={busy === action.key}
                >
                  <Eye className="mr-2 h-4 w-4" /> Prévisualiser
                </Button>
                <Button
                  size="sm"
                  onClick={() => send(action.key, action.fn, action.title)}
                  disabled={busy === action.key || count === 0}
                >
                  {busy === action.key ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Envoyer
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ConversionBoostersPanel;
