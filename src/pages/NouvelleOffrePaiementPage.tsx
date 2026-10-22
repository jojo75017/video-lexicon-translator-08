import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import { Button } from '@/components/ui/button';
import { V3_NEW_OFFERS } from '@/data/v3Pricing';

// Page de paiement des boutons Landaa : /paiement-offre?plan=<id>
const PLANS: Record<string, { title: string; detail: string }> = {
  auteur97_1x: { title: 'EbookStudio Auteur — 97 € paiement unique', detail: '97 € en une fois. Aucun renouvellement automatique.' },
  auteur97_2x: { title: 'EbookStudio Auteur — paiement en 2 fois', detail: '48,50 € aujourd’hui, puis 48,50 € dans un mois. Total : 97 €.' },
  auteur97_3x: { title: 'EbookStudio Auteur — paiement en 3 fois', detail: '32,34 € aujourd’hui, puis 2 × 32,33 € les mois suivants. Total : 97 €.' },
  starter27_1x: { title: 'EbookStudio Starter — 27 € à vie', detail: '27 € en une fois. Accès à vie, aucun renouvellement.' },
  edition247_1x: { title: 'EbookStudio Édition — 197 € à vie', detail: '197 € en une fois. Aucun renouvellement.' },
  edition247_2x: { title: 'EbookStudio Édition — à vie en 2 fois', detail: '98,50 € aujourd’hui, puis 98,50 € dans un mois. Total : 197 €.' },
  edition247_3x: { title: 'EbookStudio Édition — à vie en 3 fois', detail: '65,68 € aujourd\'hui, puis 2 × 65,66 €. Total : 197 €. Aucun renouvellement.' },
};

const TRACKING = /^(utm_.+|src|ref)$/;

export default function NouvelleOffrePaiementPage() {
  const [params, setParams] = useSearchParams();
  const plan = params.get('plan') ?? '';
  const def = PLANS[plan];
  const options = plan.startsWith("auteur97_") ? V3_NEW_OFFERS.auteur.options : plan.startsWith("edition247_") ? V3_NEW_OFFERS.edition.options : [];
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

  const backUrl = `/v3/plans${tracking ? `?${tracking}` : ''}`;

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
            {!clientSecret && options.length > 0 && (
              <fieldset className="mb-6 space-y-2">
                <legend className="mb-2 text-sm font-semibold">Votre paiement — sans frais</legend>
                {options.map(option => <label key={option.plan} className="flex cursor-pointer items-center gap-3 rounded-md border border-input p-3 text-sm">
                  <input type="radio" name="installments" checked={plan === option.plan} disabled={loading} onChange={() => { const next = new URLSearchParams(params); next.set('plan', option.plan); setParams(next); setError(null); }} />
                  {option.label}
                </label>)}
              </fieldset>
            )}
            {!clientSecret ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium" htmlFor="email">Votre email (il servira à vous connecter)</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2" placeholder="vous@exemple.fr" />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button onClick={start} disabled={loading} className="w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Procéder au paiement sécurisé
                </Button>
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
