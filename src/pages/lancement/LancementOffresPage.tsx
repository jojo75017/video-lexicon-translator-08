// Page de vente du tunnel de lancement — /lancement/offres
import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useSearchParams } from 'react-router-dom';
import { Check, X, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import { PayPalSubscribeButton } from '@/components/v3/PayPalSubscribeButton';
import { trackCaptureEvent } from '@/lib/captureTracking';
import { V3_PLANS, type V3BillingInterval, type V3PlanId } from '@/data/v3Pricing';
import {
  LANCEMENT_DATE_LABEL, LANCEMENT_FAQ, LANCEMENT_GARANTIES, LANCEMENT_OBJECTIONS,
  LANCEMENT_OBTENU, LANCEMENT_POURQUOI, LANCEMENT_POUR_QUI,
} from '@/data/lancementTunnel';

export default function LancementOffresPage() {
  const [params] = useSearchParams();
  const source = params.get('source') || '';
  const [interval, setInterval] = useState<V3BillingInterval>('month');
  const [checkout, setCheckout] = useState<{ priceId: string; planName: string } | null>(null);

  usePageMeta({
    title: "Les offres du lancement EbookStudio — Plume, Édition, Maison d'Édition",
    description: `Trois formules ouvertes le ${LANCEMENT_DATE_LABEL} : Plume 27 €/mois, Édition 47 €/mois, Maison d'Édition 97 €/mois. Sans engagement.`,
    canonical: 'https://ebookstudio.fr/lancement/offres',
  });

  useEffect(() => {
    void trackCaptureEvent('lancement', 'offer_view');
  }, []);

  const openCheckout = (plan: V3PlanId, planName: string) => {
    const priceId = `v3_${plan}_${interval === 'month' ? 'monthly' : 'annual'}`;
    void trackCaptureEvent('lancement', 'checkout_open');
    setCheckout({ priceId, planName });
  };

  const returnUrl = `${window.location.origin}/lancement/merci?session_id={CHECKOUT_SESSION_ID}${
    source ? `&source=${encodeURIComponent(source)}` : ''
  }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Accrocher */}
        <header className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            Ouverture le {LANCEMENT_DATE_LABEL}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            Choisissez la formule qui correspond à votre rythme d'écriture
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Toutes les formules contiennent l'atelier complet : écrire, corriger, habiller, publier,
            vendre. Elles se distinguent par le volume et les studios professionnels inclus.
          </p>
        </header>

        {/* Est-ce pour moi ? */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold md:text-3xl">{LANCEMENT_POUR_QUI.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold text-primary">{LANCEMENT_POUR_QUI.yes.title}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {LANCEMENT_POUR_QUI.yes.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-muted/40 p-6">
              <h3 className="font-semibold text-muted-foreground">{LANCEMENT_POUR_QUI.no.title}</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {LANCEMENT_POUR_QUI.no.items.map((i) => (
                  <li key={i} className="flex gap-2">
                    <X className="mt-0.5 h-4 w-4 shrink-0" />{i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Projeter */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold md:text-3xl">{LANCEMENT_OBTENU.title}</h2>
          <p className="mt-2 text-muted-foreground">{LANCEMENT_OBTENU.intro}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {LANCEMENT_OBTENU.blocks.map((b) => (
              <div key={b.title} className="rounded-xl border bg-card p-6">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Sparkles className="h-4 w-4 text-primary" />{b.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {b.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Prouver */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold md:text-3xl">{LANCEMENT_POURQUOI.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {LANCEMENT_POURQUOI.items.map((i) => (
              <div key={i.title} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">{i.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Offres */}
        <section id="offres" className="mt-20">
          <h2 className="text-center text-2xl font-bold md:text-3xl">Les trois formules</h2>
          <div className="mt-6 flex justify-center gap-2 rounded-full border bg-muted/40 p-1 w-fit mx-auto">
            <button
              type="button"
              onClick={() => setInterval('month')}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                interval === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setInterval('year')}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                interval === 'year' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              Annuel · 2 mois offerts
            </button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {V3_PLANS.map((plan) => {
              const amount = interval === 'month' ? plan.monthlyPrice : plan.yearlyPrice;
              const highlight = plan.id === 'edition';
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border bg-card p-6 ${
                    highlight ? 'border-primary shadow-lg lg:scale-[1.02]' : ''
                  }`}
                >
                  {highlight && (
                    <span className="mb-3 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                      Le plus choisi
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
                  <p className="mt-5 text-4xl font-bold">
                    {amount} €
                    <span className="text-base font-normal text-muted-foreground">
                      {interval === 'month' ? ' / mois' : ' / an'}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {interval === 'year'
                      ? `soit ${Math.round((amount / 12) * 100) / 100} € par mois`
                      : 'sans engagement, résiliable à tout moment'}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {plan.features.slice(0, 9).map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}
                      </li>
                    ))}
                  </ul>
                  {/* PayPal retiré du tunnel de lancement : paiement par carte uniquement. */}
                  <div className="mt-6 space-y-2">
                    <Button
                      size="lg"
                      className="w-full"
                      variant={highlight ? 'default' : 'outline'}
                      onClick={() => openCheckout(plan.id, plan.name)}
                    >
                      Je choisis {plan.name}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Paiement sécurisé par carte bancaire
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-3 rounded-xl border bg-muted/40 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {LANCEMENT_GARANTIES.map((g) => (
              <div key={g} className="flex gap-2 text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{g}
              </div>
            ))}
          </div>
        </section>

        {/* Sécuriser */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold md:text-3xl">
            Qu'est-ce qui pourrait vous retenir ?
          </h2>
          <div className="mt-6 space-y-4">
            {LANCEMENT_OBJECTIONS.map((o) => (
              <div key={o.objection} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">« {o.objection} »</h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold md:text-3xl">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="mt-4">
            {LANCEMENT_FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <div className="mt-14 text-center">
          <Button size="lg" asChild>
            <a href="#offres">Choisir ma formule</a>
          </Button>
        </div>
      </div>

      {checkout && (
        <V3SubscribeCheckout
          priceId={checkout.priceId}
          planName={checkout.planName}
          returnUrl={returnUrl}
          onClose={() => setCheckout(null)}
        />
      )}
    </div>
  );
}
