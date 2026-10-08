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
import LancementOfferBanner from '@/components/lancement/LancementOfferBanner';
import V3SubscribeCheckout from '@/components/v3public/V3SubscribeCheckout';
import { useLancementPlaces, placesLabel } from '@/hooks/useLancementPlaces';
import { trackCaptureEvent } from '@/lib/captureTracking';
import { V3_PLANS } from '@/data/v3Pricing';
import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import {
  LANCEMENT_FAQ, LANCEMENT_FIN_LABEL, LANCEMENT_PLACES, LANCEMENT_PRIX, LANCEMENT_PRICE_ID,
  LANCEMENT_APRES_LABEL, isLancementOuvert, LANCEMENT_GARANTIES, LANCEMENT_OBJECTIONS,
  LANCEMENT_OBTENU, LANCEMENT_POURQUOI, LANCEMENT_POUR_QUI,
} from '@/data/lancementTunnel';

export default function LancementOffresPage() {
  const [params] = useSearchParams();
  const source = params.get('source') || '';
  const [checkout, setCheckout] = useState<{ priceId: string; planName: string } | null>(null);

  usePageMeta({
    title: "Offre de lancement EbookStudio V3 — Édition à vie pour 47 €",
    description: `Accès à vie à la V3 niveau Édition pour 47 € payés une seule fois. ${LANCEMENT_PLACES} places, jusqu'au ${LANCEMENT_FIN_LABEL}.`,
    canonical: 'https://ebookstudio.fr/lancement/offres',
  });

  useEffect(() => {
    void trackCaptureEvent('lancement', 'offer_view');
  }, []);

  const { places, ouvert } = useLancementPlaces();
  const edition = V3_PLANS.find((p) => p.id === 'edition');

  const returnUrl = `${window.location.origin}/lancement/merci?session_id={CHECKOUT_SESSION_ID}${
    source ? `&source=${encodeURIComponent(source)}` : ''
  }`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PaymentTestModeBanner />
      <LancementOfferBanner source={source} />

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Accrocher */}
        <header className="text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
            {ouvert ? `Tarif de lancement · jusqu'au ${LANCEMENT_FIN_LABEL}` : 'La V3 est ouverte'}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            {ouvert
              ? "L'atelier V3 Édition, à vie, pour 47 € une seule fois"
              : "Les offres à vie et les options EbookStudio"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {ouvert ? "L'atelier complet pour écrire, corriger, habiller, publier et vendre votre livre. Un seul paiement, aucun abonnement." : <>
            Le contingent de lancement est fermé. Vos droits acquis restent conservés ; les compléments professionnels sont facultatifs et sans abonnement.</>}
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
        {ouvert ? (
        <section id="offres" className="mt-20">
          <div className="mx-auto max-w-xl rounded-2xl border-2 border-primary bg-card p-8 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Tarif de lancement</p>
            <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">V3 Édition — accès à vie</h2>
            <p className="mt-5 text-5xl font-bold">
              {LANCEMENT_PRIX} €
              <span className="ml-2 text-base font-normal text-muted-foreground">payés une seule fois</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Aucun abonnement. {placesLabel(places)}, jusqu'au {LANCEMENT_FIN_LABEL} au plus tard.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {(edition?.features ?? []).slice(0, 9).map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-7 w-full"
              onClick={() => {
                void trackCaptureEvent('lancement', 'checkout_open');
                setCheckout({ priceId: LANCEMENT_PRICE_ID, planName: 'Édition — accès à vie' });
              }}
            >
              Je réserve ma place à {LANCEMENT_PRIX} €
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">Paiement sécurisé par carte bancaire</p>
            <p className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">{LANCEMENT_APRES_LABEL}</p>
          </div>
          <div className="mt-8 grid gap-3 rounded-xl border bg-muted/40 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {LANCEMENT_GARANTIES.filter((g) => !g.startsWith('Sans engagement')).map((g) => (
              <div key={g} className="flex gap-2 text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{g}
              </div>
            ))}
          </div>
        </section>
        ) : (
        <section id="offres" className="mt-20">
          <V3PricingOverview baseAvailable={false} />
        </section>
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
        )}

        {/* Sécuriser */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold md:text-3xl">
            Qu'est-ce qui pourrait vous retenir ?
          </h2>
          <div className="mt-6 space-y-4">
            {LANCEMENT_OBJECTIONS.map((o) => (
              <div key={o.objection} className="rounded-xl border bg-card p-6">
                <h3 className="font-semibold">« {o.objection} »</h3>
                <p className="mt-2 text-sm text-muted-foreground">{ouvert && o.answerLancement ? o.answerLancement : o.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold md:text-3xl">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="mt-4">
            {LANCEMENT_FAQ.filter((f) => !f.abonnementOnly).map((f, i) => (
              <AccordionItem key={f.q} value={`q${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <div className="mt-14 text-center">
          <Button size="lg" asChild>
            <a href="#offres">{ouvert ? `Je réserve ma place à ${LANCEMENT_PRIX} €` : 'Choisir ma formule'}</a>
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
