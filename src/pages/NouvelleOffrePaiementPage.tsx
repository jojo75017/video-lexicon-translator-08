import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import { LAUNCH_TUNNEL_URL } from '@/data/externalLinks';

// Page de paiement des boutons Landaa : /paiement-offre?plan=<id>
const PLANS: Record<string, { title: string; detail: string }> = {
  auteur97_1x: { title: 'EbookStudio Auteur — 97 € par an', detail: '97 € aujourd\'hui, puis renouvellement automatique chaque année. Résiliable à tout moment.' },
  auteur97_3x: { title: 'EbookStudio Auteur — 1 an en 3 fois', detail: '32,34 € aujourd\'hui, puis 2 × 32,33 € les mois suivants. Total : 97 €.' },
  edition247_1x: { title: 'EbookStudio Édition — 497 € à vie', detail: '497 € en une fois. Aucun renouvellement.' },
  edition247_3x: { title: 'EbookStudio Édition — à vie en 3 fois', detail: '165,68 € aujourd\'hui, puis 2 × 165,66 €. Total : 497 €. Aucun renouvellement.' },
  edition247_6x: { title: 'EbookStudio Édition — à vie en 6 fois', detail: '82,85 € aujourd\'hui, puis 5 × 82,83 €. Total : 497 €. Aucun renouvellement.' },
};

const TRACKING = /^(utm_.+|src|ref)$/;

export default function NouvelleOffrePaiementPage() {
  const [params] = useSearchParams();
  const plan = params.get('plan') ?? '';
  const def = PLANS[plan];
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const tracking = useMemo(() => {
    const t = new URLSearchParams();
    params.forEach((v, k) => { if (TRACKING.test(k)) t.set(k, v); });
    return t.toString();
  }, [params]);

  const start = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { setError('Merci de saisir un email valide.'); return; }
    setLoading(true); setError(null);
    try {
      const { data, error: err } = await supabase.functions.invoke('v3-pack-checkout', {
        body: {
          plan, email: e, environment: getStripeEnvironment(),
          src: params.get('src') ?? params.get('utm_source') ?? undefined,
          ref: params.get('ref') ?? undefined,
          returnUrl: `${window.location.origin}/paiement-succes?session_id={CHECKOUT_SESSION_ID}&plan=${plan}${tracking ? `&${tracking}` : ''}`,
        },
      });
      const msg = (data as { error?: string })?.error;
      if (err || msg) throw new Error(msg || 'Paiement indisponible pour le moment.');
      setClientSecret((data as { clientSecret: string }).clientSecret);
    } catch (x) {
      setError(x instanceof Error ? x.message : 'Paiement indisponible.');
    } finally { setLoading(false); }
  };

  const backUrl = `${LAUNCH_TUNNEL_URL}${tracking ? `?${tracking}` : ''}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <main className="mx-auto max-w-xl px-4 py-10">
        {!def ? (
          <p className="text-center">Formule inconnue. <a className="underline" href={backUrl}>Retour aux offres</a></p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">{def.title}</h1>
            <p className="text-muted-foreground mb-6">{def.detail}</p>
            {!clientSecret ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium" htmlFor="email">Votre email (il servira à vous connecter)</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="vous@exemple.fr" />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button onClick={start} disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Procéder au paiement sécurisé
                </button>
                <a href={backUrl} className="block text-center text-sm text-muted-foreground underline">Non merci, revenir aux offres</a>
              </div>
            ) : (
              <>
                <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
                <a href={backUrl} className="mt-4 block text-center text-sm text-muted-foreground underline">Annuler et revenir aux offres</a>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
