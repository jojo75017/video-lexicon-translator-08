import { useEffect, useMemo, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useSearchParams } from 'react-router-dom';
import {
  Loader2, Check, Palette, Users, BookOpen, Download, Sparkles, ShieldCheck,
  Clock, Gift, ChevronDown, CreditCard, Play,
} from 'lucide-react';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SeoHead from '@/components/funnel/SeoHead';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import { BD_COMIC_OFFER } from '@/data/bdComicOffer';
import BdTestimonials from '@/components/bd/BdTestimonials';

/** Page de vente du Studio BD & Jeunesse — offre d'entrée 17 €, puis upsell Pro 47 €. */
export default function BDOffrePage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(() => (params.get('email') || '').trim().toLowerCase());
  const [loading, setLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const deadline = useMemo(() => BD_COMIC_OFFER.endLabel, []);

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!validEmail(e)) {
      toast.error('Merci de saisir un email valide — c’est lui qui ouvrira votre accès.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', {
        body: {
          packId: 'bd_comic',
          email: e,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/bd-upsell?email=${encodeURIComponent(e)}&session_id={CHECKOUT_SESSION_ID}`,
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
      toast.error('Merci de saisir un email valide avant de payer avec PayPal.');
      return;
    }
    setPaypalLoading(true);
    try {
      const { error } = await supabase.functions.invoke('funnel-create-order', {
        body: { email: e, product_key: 'bd_comic_17', payment_method: 'paypal' },
      });
      if (error) throw new Error(error.message);
      window.open(BD_COMIC_OFFER.paypalUrl, '_blank', 'noopener,noreferrer');
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
        title="Studio BD & Jeunesse — créez vos BD et livres illustrés en IA (17 €)"
        description="Créez des bandes dessinées et des livres illustrés pour enfants avec l'IA : personnages, planches, histoires et export prêt pour Amazon KDP. Accès à vie pour 17 €."
        canonical="/bd-offre"
      />
      <PaymentTestModeBanner />

      {/* Barre d'urgence */}
      <div className="w-full bg-primary px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground sm:text-sm">
        <Clock className="mr-1 inline h-4 w-4" />
        Offre de lancement — {BD_COMIC_OFFER.price} € accès à vie jusqu’au {deadline} · ensuite {BD_COMIC_OFFER.regularPrice} €
      </div>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* HERO */}
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Grande nouveauté V4 — Studio BD &amp; Jeunesse
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
            Créez une bande dessinée complète
            <span className="block text-primary">ou un livre illustré pour enfants — sans savoir dessiner.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Vous décrivez votre idée. L’IA crée les personnages, écrit le scénario, illustre chaque case
            et prépare vos fichiers prêts à publier sur Amazon KDP.
          </p>

          {/* Zone vidéo VSL */}
          <div className="mx-auto mt-8 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-muted">
            {BD_COMIC_OFFER.vslUrl ? (
              <iframe
                src={BD_COMIC_OFFER.vslUrl}
                title="Présentation du Studio BD & Jeunesse"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Play className="h-10 w-10" />
                <p className="text-sm font-semibold">Vidéo de présentation — bientôt disponible</p>
                <p className="max-w-sm text-xs">
                  En attendant, tout est détaillé juste en dessous : fonctionnalités, bonus et garantie.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Tout ce que le studio fait pour vous</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Users, title: 'Création de personnages', desc: 'Héros, compagnons et méchants avec une apparence cohérente d’une case à l’autre.' },
              { icon: Palette, title: 'Planches de BD illustrées', desc: 'Styles franco-belges (ligne claire, aventure, humour) et mise en page automatique des cases.' },
              { icon: BookOpen, title: 'Histoires pour enfants', desc: 'Contes illustrés 3-7 ans et 8-12 ans, texte adapté à l’âge, morale et rythme de lecture.' },
              { icon: Sparkles, title: 'Scénario écrit par l’IA', desc: 'Découpage narratif, dialogues, bulles et onomatopées générés à partir de votre idée.' },
              { icon: Download, title: 'Export prêt à publier', desc: 'PDF, images haute résolution et fichiers aux formats attendus par Amazon KDP.' },
              { icon: ShieldCheck, title: 'Vos livres vous appartiennent', desc: 'Vous publiez et vendez librement les livres créés dans le studio.' },
            ].map(({ icon: Icon, title, desc }) => (
              <article key={title} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* POUR QUI ? */}
        <section className="mt-14 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-bold">Pour qui ?</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              'Auteurs KDP qui veulent une niche visuelle très demandée',
              'Parents et grands-parents qui offrent un livre personnalisé',
              'Enseignants et animateurs qui créent des supports illustrés',
              'Créateurs sans compétence en dessin ni logiciel graphique',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* BONUS */}
        <section className="mt-8 rounded-2xl border border-border bg-muted p-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Gift className="h-6 w-6 text-primary" /> Bonus inclus
          </h2>
          <ul className="mt-4 space-y-3">
            {BD_COMIC_OFFER.bonuses.map((b) => (
              <li key={b.title} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span><strong>{b.title}</strong> — {b.desc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* TÉMOIGNAGES */}
        <BdTestimonials />


        {/* PAIEMENT */}
        <section id="commander" className="mt-14 rounded-2xl border-2 border-primary bg-card p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">Votre accès au Studio BD &amp; Jeunesse</h2>
              <div className="mt-4 flex items-end gap-3">
                <span className="text-5xl font-black text-primary">{BD_COMIC_OFFER.price} €</span>
                <span className="pb-2 text-sm text-muted-foreground line-through">{BD_COMIC_OFFER.regularPrice} €</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Paiement unique · accès à vie · aucune mensualité
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {BD_COMIC_OFFER.included.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-muted p-4 text-sm">
                <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                <span>Garantie satisfait ou remboursé 30 jours — un simple message au support suffit.</span>
              </div>
            </div>

            <div>
              {!clientSecret ? (
                <>
                  <label className="block text-xs font-semibold text-muted-foreground" htmlFor="bd-email">
                    Votre email (il ouvrira votre accès)
                  </label>
                  <input
                    id="bd-email"
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
                      : <><CreditCard className="h-4 w-4" /> Payer {BD_COMIC_OFFER.price} € par carte</>}
                  </button>
                  <button
                    type="button"
                    onClick={startPaypal}
                    disabled={paypalLoading}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-bold transition-colors hover:bg-muted disabled:opacity-60"
                  >
                    {paypalLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Ouverture…</> : <>Payer avec PayPal</>}
                  </button>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Paiement sécurisé · carte bancaire, Apple Pay, Google Pay &amp; PayPal
                  </p>
                </>
              ) : (
                <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-center text-2xl font-bold">Questions fréquentes</h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {BD_COMIC_OFFER.faq.map((item, i) => (
              <div key={item.q} className="bg-card">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-muted-foreground">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
