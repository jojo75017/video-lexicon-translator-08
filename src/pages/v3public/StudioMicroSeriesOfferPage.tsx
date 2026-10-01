import { useEffect, useState } from 'react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { ArrowRight, Check, CreditCard, Film, Loader2, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import SeoHead from '@/components/funnel/SeoHead';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MICRO_SERIES_OFFER } from '@/data/microSeriesOffer';
import useModuleAccess from '@/hooks/useModuleAccess';
import { supabase } from '@/integrations/supabase/client';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function StudioMicroSeriesOfferPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { hasAccess } = useModuleAccess(MICRO_SERIES_OFFER.moduleKey);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user?.email) setEmail(data.user.email.toLowerCase());
    });
    return () => { active = false; };
  }, []);

  const startPayment = async () => {
    const checkoutEmail = email.trim().toLowerCase();
    if (!isValidEmail(checkoutEmail)) {
      toast.error('Indiquez une adresse e-mail valide pour réserver votre accès.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('v3-upsell-checkout', {
        body: {
          packId: MICRO_SERIES_OFFER.stripePackId,
          email: checkoutEmail,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/v3/offre-micro-series?precommande=confirmee&session_id={CHECKOUT_SESSION_ID}`,
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead title="Studio Micro-Séries IA V4 — Précommande 67 €" description="Réservez le Studio Micro-Séries IA : scripts, storyboards et exports pour transformer vos livres en séries vidéo verticales." canonical="/v3/offre-micro-series" noindex />
      <PaymentTestModeBanner />
      <div className="border-b border-primary/30 bg-primary px-4 py-2 text-center text-xs font-black uppercase tracking-widest text-primary-foreground sm:text-sm">
        Précommande officielle — votre accès sera activé dès la sortie de la V4
      </div>

      <main>
        <section className="border-b border-border px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-accent">
                <Sparkles className="h-4 w-4" /> Bientôt dans la V4
              </span>
              <h1 className="mt-7 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Studio Micro-Séries <span className="text-primary">IA</span></h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                Transformez votre livre en une mini-série verticale prête pour Reels, TikTok et YouTube Shorts — sans payer la génération de vidéos à chaque essai.
              </p>
              <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 border border-primary/40 bg-card p-5 shadow-sm sm:flex-row sm:justify-between sm:text-left">
                <div>
                  <div className="flex items-end gap-3"><span className="pb-1 text-lg font-bold text-muted-foreground line-through">{MICRO_SERIES_OFFER.referencePrice} €</span><span className="text-4xl font-black text-primary">{MICRO_SERIES_OFFER.price} €</span></div>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">Paiement unique · accès à vie dès la sortie</p>
                </div>
                <Button asChild size="lg" className="h-auto min-h-12 w-full whitespace-normal px-5 py-3 text-sm font-black uppercase sm:w-auto"><a href="#precommande">{hasAccess ? 'Précommande enregistrée' : 'Réserver mon accès'} <ArrowRight /></a></Button>
              </div>
            </div>

            <div className="mt-12 grid gap-3 md:grid-cols-4">
              {MICRO_SERIES_OFFER.steps.map(({ icon: Icon, number, title, description }) => (
                <article key={number} className="border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between"><span className="text-sm font-black text-primary">{number}</span><Icon className="h-5 w-5 text-accent" /></div>
                  <h2 className="mt-5 text-lg font-black">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6" aria-labelledby="preview-title">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">Aperçu du futur studio</p>
              <h2 id="preview-title" className="mt-3 text-3xl font-black sm:text-4xl">Un épisode structuré avant de produire la moindre vidéo</h2>
              <div className="mt-7 space-y-3">
                {MICRO_SERIES_OFFER.deliverables.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-start gap-3 border-b border-border pb-3 text-sm font-semibold"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span><span className="pt-1">{label}</span></div>
                ))}
              </div>
            </div>
            <div className="border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4"><div><p className="text-xs font-black uppercase tracking-widest text-primary">Épisode 01 · 45 secondes</p><h3 className="mt-1 text-xl font-black">Le secret caché dans le chapitre 3</h3></div><Film className="h-7 w-7 text-accent" /></div>
              <div className="mt-4 space-y-3">
                {[
                  ['0–3 s', 'Accroche', '« Et si le détail que vous aviez ignoré changeait toute l’histoire ? »'],
                  ['3–18 s', 'Scène 1', 'Plan serré sur le livre, puis révélation du premier indice.'],
                  ['18–38 s', 'Scène 2', 'Montée du suspense et narration tirée du passage sélectionné.'],
                  ['38–45 s', 'Final', 'Question ouverte et invitation à découvrir le livre.'],
                ].map(([time, label, copy]) => <div key={time} className="grid grid-cols-[56px_1fr] gap-3 rounded-md bg-muted p-3"><span className="text-xs font-black text-primary">{time}</span><div><strong className="text-sm">{label}</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p></div></div>)}
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">Démonstration visuelle uniquement : elle ne consomme aucun crédit IA ou vidéo.</p>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40 px-4 py-16 sm:px-6" aria-labelledby="how-title">
          <div className="mx-auto max-w-6xl">
            <div className="border-l-4 border-accent bg-accent/10 p-5">
              <p className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-accent">
                <KeyRound className="h-4 w-4" /> Clé IA gratuite acceptée · 0 € de surcoût
              </p>
              <p className="mt-3 text-sm leading-6">
                Le studio se connecte directement à votre propre clé Google Gemini (gratuite) ou OpenRouter, enregistrée
                dans votre navigateur et visible de vous seul. Vous composez autant d’épisodes et de storyboards que vous
                voulez, sans abonnement caché ni crédit supplémentaire à acheter.
                {' '}
                <Link to="/v3/fonctionnalites/cles" className="font-bold text-primary underline">
                  Voir où coller ma clé
                </Link>
                .
              </p>
            </div>

            <h2 id="how-title" className="mt-12 text-3xl font-black sm:text-4xl">Comment vous allez créer vos vidéos en 3 étapes</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Le Studio Micro-Séries écrit et structure toute la série. Le rendu vidéo final reste fait dans l’outil de
              votre choix : aucune vidéo n’est calculée ni facturée ici.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {MICRO_SERIES_OFFER.videoSteps.map(({ number, title, description }) => (
                <article key={number} className="border border-border bg-card p-5 shadow-sm">
                  <span className="text-sm font-black text-primary">{number}</span>
                  <h3 className="mt-4 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 border border-border bg-card p-5 shadow-sm">
              <h3 className="text-lg font-black">Outils conseillés pour le montage et les images</h3>
              <div className="mt-4 divide-y divide-border">
                {MICRO_SERIES_OFFER.recommendedTools.map(({ name, usage, cost }) => (
                  <div key={name} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-4">
                    <strong className="text-sm">{name}</strong>
                    <span className="text-sm text-muted-foreground">{usage}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-accent">{cost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="precommande" className="scroll-mt-16 border-y border-border bg-secondary px-4 py-16 sm:px-6" aria-labelledby="order-title">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="pt-3"><p className="text-sm font-bold uppercase tracking-widest text-accent">Accès anticipé V4</p><h2 id="order-title" className="mt-3 text-3xl font-black sm:text-4xl">Réservez votre accès à vie</h2><ul className="mt-7 space-y-3 text-base">{['67 € une seule fois, sans abonnement', 'Accès automatiquement ouvert dès la sortie V4', 'Aucune génération vidéo facturée aujourd’hui', 'Garantie 30 jours satisfait ou remboursé'].map((item) => <li key={item} className="flex items-center gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="h-3.5 w-3.5" /></span>{item}</li>)}</ul></div>
            <div className="border-2 border-primary bg-card p-5 shadow-sm sm:p-8">
              {hasAccess ? (
                <div className="py-6 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-7 w-7" /></span><h3 className="mt-5 text-2xl font-black">Précommande enregistrée</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">Votre accès au Studio Micro-Séries IA sera ouvert automatiquement dès sa sortie avec la V4.</p><Button asChild variant="outline" className="mt-6"><Link to="/v3/upsells">Voir mes autres compléments</Link></Button></div>
              ) : !clientSecret ? (
                <><div className="flex flex-wrap items-end gap-x-4 gap-y-1"><span className="pb-1 text-xl font-bold text-muted-foreground line-through">{MICRO_SERIES_OFFER.referencePrice} €</span><span className="text-5xl font-black text-primary">{MICRO_SERIES_OFFER.price} €</span><span className="pb-1 text-sm font-semibold text-muted-foreground">paiement unique</span></div><div className="mt-4 border-l-4 border-accent bg-accent/10 p-3 text-sm leading-6"><strong>Vous achetez une précommande.</strong> Le studio n’est pas encore disponible. Votre achat réserve l’accès à vie, activé automatiquement avec la V4.</div><label htmlFor="micro-series-email" className="mt-6 block text-sm font-bold uppercase tracking-widest">E-mail de votre compte</label><Input id="micro-series-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" className="mt-2 h-12" /><Button type="button" size="lg" onClick={startPayment} disabled={loading} className="mt-4 h-auto min-h-14 w-full whitespace-normal px-5 py-4 text-center text-sm font-black uppercase leading-5 sm:text-base">{loading ? <><Loader2 className="animate-spin" /> Préparation du paiement…</> : <><CreditCard /> Précommander le Studio Micro-Séries — 67 €</>}</Button><div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-5 text-center text-xs font-bold uppercase"><span className="flex items-center justify-center gap-1"><LockKeyhole className="h-3.5 w-3.5 text-accent" /> Paiement sécurisé</span><span className="flex items-center justify-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-accent" /> Garantie 30 jours</span></div></>
              ) : <div aria-label="Paiement sécurisé Studio Micro-Séries IA"><EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}><EmbeddedCheckout /></EmbeddedCheckoutProvider></div>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}