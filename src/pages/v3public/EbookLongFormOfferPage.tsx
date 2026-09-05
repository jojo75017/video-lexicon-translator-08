import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CreditCard, Loader2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import LongFormProcessDemo from '@/components/v3public/LongFormProcessDemo';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import SeoHead from '@/components/funnel/SeoHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EBOOK_LONG_FORM_OFFER } from '@/data/ebookLongFormOffer';
import { supabase } from '@/integrations/supabase/client';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function EbookLongFormOfferPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      const sessionEmail = data.session?.user?.email;
      if (active && sessionEmail) setEmail(sessionEmail.toLowerCase());
    });
    return () => { active = false; };
  }, []);

  const normalizedEmail = () => email.trim().toLowerCase();

  const startStripePayment = async () => {
    const checkoutEmail = normalizedEmail();
    if (!isValidEmail(checkoutEmail)) {
      toast.error('Indiquez l’adresse e-mail utilisée pour votre commande.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', {
        body: {
          packId: EBOOK_LONG_FORM_OFFER.stripePackId,
          email: checkoutEmail,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/v3?ebook-version-longue=confirme&session_id={CHECKOUT_SESSION_ID}`,
        },
      });
      if (error) throw new Error(error.message);
      const secret = (data as { clientSecret?: string } | null)?.clientSecret;
      if (!secret) throw new Error('Le formulaire de paiement est momentanément indisponible.');
      setClientSecret(secret);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Le paiement ne peut pas être ouvert pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const startPaypalPayment = async () => {
    const checkoutEmail = normalizedEmail();
    if (!isValidEmail(checkoutEmail)) {
      toast.error('Indiquez l’adresse e-mail utilisée pour votre commande.');
      return;
    }
    setPaypalLoading(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-create-order', {
        body: {
          email: checkoutEmail,
          product_key: EBOOK_LONG_FORM_OFFER.paypalProductKey,
          payment_method: 'paypal',
        },
      });
      if (error) throw new Error(error.message);
      window.open(EBOOK_LONG_FORM_OFFER.paypalUrl, '_blank', 'noopener,noreferrer');
      toast.success('PayPal est ouvert. Indiquez votre adresse e-mail dans la note du paiement.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'PayPal est momentanément indisponible.');
    } finally {
      setPaypalLoading(false);
    }
  };

  return (
    <div className="longform-offer-theme min-h-screen bg-background text-foreground">
      <SeoHead
        title="Ebook Version Longue V4 — Offre spéciale 47 €"
        description="Créez des ebooks longs et structurés avec EbookStudio V4 : plan, chapitres, exemples, couverture et exports."
        canonical="/v3/offre-version-longue"
        noindex
      />
      <PaymentTestModeBanner />

      <div className="border-b border-primary/50 bg-primary px-4 py-2 text-center text-xs font-black uppercase tracking-widest text-primary-foreground sm:text-sm">
        Offre spéciale unique — ne fermez pas cette page
      </div>

      <main>
        <section className="overflow-hidden border-b border-border px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-accent">
                <Sparkles className="h-4 w-4" /> Prochainement V4 — mise à jour incluse gratuitement
              </span>
              <h1 className="mt-7 text-4xl font-black leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Générez des Ebooks Complets et Longs Format <span className="text-primary">(100+ pages)</span> en quelques clics
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                Passez d'une simple idée à un manuscrit organisé, approfondi et prêt pour sa dernière étape éditoriale — sans perdre la cohérence au fil des chapitres.
              </p>

              <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 border border-primary/50 bg-card p-5 shadow-[0_10px_30px_-18px_hsl(var(--foreground)/0.35)] sm:flex-row sm:justify-between sm:text-left">
                <div className="flex items-end gap-3">
                  <span className="pb-1 text-lg font-bold text-muted-foreground line-through">{EBOOK_LONG_FORM_OFFER.referencePrice} €</span>
                  <span className="text-4xl font-black text-primary">{EBOOK_LONG_FORM_OFFER.price} €</span>
                  <span className="pb-1 text-sm font-semibold text-muted-foreground">paiement unique</span>
                </div>
                <Button asChild size="lg" className="h-auto min-h-12 w-full whitespace-normal px-5 py-3 text-sm font-black uppercase leading-5 sm:w-auto">
                  <a href="#offre">Voir l'offre à 47 € <ArrowRight /></a>
                </Button>
              </div>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Accès anticipé : l'outil Version Longue complet arrive avec la V4, et la mise à jour est incluse sans supplément.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 border border-border bg-card sm:grid-cols-4">
              {['Plan H2/H3', 'Chapitres', 'Exemples', 'Couverture + FAQ'].map((label, index) => (
                <div key={label} className="border-b border-r border-border px-3 py-4 text-center last:border-r-0 sm:border-b-0">
                  <span className="block text-sm font-black text-primary">0{index + 1}</span>
                  <span className="mt-1 block text-sm font-bold text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


        <LongFormProcessDemo />

        <section className="px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="modules-title">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Une chaîne éditoriale complète</p>
              <h2 id="modules-title" className="mt-3 text-3xl font-black text-foreground sm:text-4xl">Cinq modules pour aller au-delà d'un texte court</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {EBOOK_LONG_FORM_OFFER.modules.map(({ icon: Icon, title, description, status }) => (
                <article key={title} className="border border-border bg-card p-6 transition-colors hover:border-primary/60">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/40 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-black uppercase text-accent">{status}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="offre" className="border-y border-border bg-card/70 px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="offer-title">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="pt-3">
              <p className="text-xs font-bold uppercase tracking-widest text-accent">Accès anticipé V4</p>
              <h2 id="offer-title" className="mt-3 text-3xl font-black text-foreground sm:text-4xl">Ajoutez la Version Longue à votre espace</h2>
              <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
                {['Paiement unique, sans abonnement', 'Mise à jour V4 incluse gratuitement', 'Garantie 30 jours satisfait ou remboursé', 'Accès depuis votre espace EbookStudio'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent"><Check className="h-3.5 w-3.5" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-primary bg-background p-5 shadow-[0_0_45px_hsl(var(--primary)/0.16)] sm:p-8">
              {!clientSecret ? (
                <>
                  <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
                    <span className="pb-1 text-xl font-bold text-muted-foreground line-through">{EBOOK_LONG_FORM_OFFER.referencePrice} €</span>
                    <span className="text-5xl font-black text-primary">{EBOOK_LONG_FORM_OFFER.price} €</span>
                    <span className="pb-1 text-sm font-semibold text-muted-foreground">paiement unique</span>
                  </div>
                  <label htmlFor="longform-email" className="mt-7 block text-xs font-bold uppercase tracking-widest text-muted-foreground">E-mail de votre commande</label>
                  <Input
                    id="longform-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="vous@exemple.fr"
                    className="mt-2 h-12 border-input bg-card text-foreground placeholder:text-muted-foreground"
                  />
                  <Button type="button" size="lg" onClick={startStripePayment} disabled={loading} className="mt-4 h-auto min-h-14 w-full whitespace-normal px-5 py-4 text-center text-sm font-black uppercase leading-5 shadow-[0_0_28px_hsl(var(--primary)/0.3)] sm:text-base">
                    {loading ? <><Loader2 className="animate-spin" /> Préparation du paiement…</> : <><CreditCard /> Oui ! Ajouter Ebook-Version_Longue à ma commande (47 €)</>}
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={startPaypalPayment} disabled={paypalLoading} className="mt-3 h-12 w-full border-border bg-card text-foreground hover:bg-muted hover:text-foreground">
                    {paypalLoading ? <><Loader2 className="animate-spin" /> Ouverture…</> : 'Payer avec PayPal'}
                  </Button>
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center text-[10px] font-bold uppercase text-muted-foreground sm:text-xs">
                    <span className="flex items-center justify-center gap-1"><LockKeyhole className="h-3.5 w-3.5 text-accent" /> Stripe</span>
                    <span className="flex items-center justify-center gap-1"><CreditCard className="h-3.5 w-3.5 text-accent" /> PayPal</span>
                    <span className="flex items-center justify-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> 30 jours</span>
                  </div>
                  <Button asChild variant="link" className="mt-5 h-auto w-full whitespace-normal text-center text-xs leading-5 text-muted-foreground hover:text-foreground">
                    <Link to="/v3">Non merci, je refuse cette offre unique et je passe à mon espace membre. <ArrowRight /></Link>
                  </Button>
                </>
              ) : (
                <div aria-label="Paiement sécurisé Ebook Version Longue">
                  <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
