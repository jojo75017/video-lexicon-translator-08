import { useEffect, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Loader2, Crown, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SeoHead from '@/components/funnel/SeoHead';
import { BD_COMIC_OFFER } from '@/data/bdComicOffer';

/** Offre unique après l'achat du Studio BD : version Pro à 47 €. */
export default function BDUpsellPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => (params.get('email') || '').trim().toLowerCase());
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const pro = BD_COMIC_OFFER.proUpsell;

  useEffect(() => {
    if (email) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user?.email;
      if (active && sessionEmail) setEmail(sessionEmail.toLowerCase());
    });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!validEmail(e)) {
      toast.error('Merci de saisir l’email utilisé pour votre commande.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', {
        body: {
          packId: 'bd_comic_pro',
          email: e,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/bd-merci?pro=1&session_id={CHECKOUT_SESSION_ID}`,
        },
      });
      if (error) throw new Error(error.message);
      const secret = (data as { clientSecret?: string })?.clientSecret;
      if (!secret) throw new Error('Session de paiement indisponible.');
      setClientSecret(secret);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Paiement impossible pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const startPaypal = async () => {
    const e = email.trim().toLowerCase();
    if (!validEmail(e)) {
      toast.error('Merci de saisir l’email utilisé pour votre commande.');
      return;
    }
    setPaypalLoading(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-create-order', {
        body: { email: e, product_key: 'bd_comic_pro_47', payment_method: 'paypal' },
      });
      if (error) throw new Error(error.message);
      window.open(pro.paypalUrl, '_blank', 'noopener,noreferrer');
      toast.success('PayPal est ouvert. Indiquez votre email dans la note du paiement.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'PayPal indisponible pour le moment.');
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead
        title="Offre unique — Studio BD & Jeunesse Pro (47 €)"
        description="Étendez votre Studio BD & Jeunesse : illustrations étendues, styles Pro et exports multi-formats. Offre unique après commande."
        canonical="/bd-upsell"
        noindex
      />

      <div className="w-full bg-primary px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground">
        Paiement confirmé — une dernière étape facultative avant votre studio
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Crown className="h-3.5 w-3.5 text-primary" /> Offre unique, affichée une seule fois
          </span>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">
            Passez votre studio en version <span className="text-primary">Pro</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Votre Studio BD &amp; Jeunesse est actif. La version Pro lève les limites de volume
            d’illustrations et ouvre les styles avancés — utile dès que vous enchaînez plusieurs tomes.
          </p>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Ce que la version Pro ajoute</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {pro.included.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-muted p-4 text-xs">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              <span>Paiement unique, aucun abonnement. Garantie 30 jours identique à votre commande.</span>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-primary bg-card p-6">
            {!clientSecret ? (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-primary">{pro.price} €</span>
                  <span className="pb-1 text-sm text-muted-foreground">paiement unique</span>
                </div>
                <label className="mt-5 block text-xs font-semibold text-muted-foreground" htmlFor="bd-pro-email">
                  Email de votre commande
                </label>
                <input
                  id="bd-pro-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                  className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={startPayment}
                  disabled={loading}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Préparation…</>
                    : <><CreditCard className="h-4 w-4" /> Oui, j’ajoute la version Pro — {pro.price} €</>}
                </button>
                <button
                  type="button"
                  onClick={startPaypal}
                  disabled={paypalLoading}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-bold transition-colors hover:bg-muted disabled:opacity-60"
                >
                  {paypalLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Ouverture…</> : <>Ajouter avec PayPal</>}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/bd-merci')}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 text-xs font-semibold text-muted-foreground underline-offset-4 hover:underline"
                >
                  Non merci, accéder directement à mon studio <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
