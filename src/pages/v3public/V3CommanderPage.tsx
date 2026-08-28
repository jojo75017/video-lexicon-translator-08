import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import {
  Check, Loader2, ShieldCheck, CreditCard,
  Lock, Mail, ArrowRight, RotateCcw, Star, Quote, Sparkles, Clock, Infinity as InfinityIcon,
} from "lucide-react";

import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SeoHead from "@/components/funnel/SeoHead";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { COMMANDER_URL } from "@/data/externalLinks";
import { V3_LAUNCH_BONUSES, V3_BONUSES_TOTAL_VALUE } from "@/data/v3Launch";
import { trackCaptureEvent } from "@/lib/captureTracking";
import { FicheCountdown } from "@/components/launch/FicheShell";
import mockup from "@/assets/methode-hero-mockup.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Que comprend exactement le paiement de 47 € ?",
    a: "Un accès à vie à EbookStudio Pro et à la V3 : génération complète des livres (plan, chapitres, relecture), exports Word et PDF prêts pour Amazon KDP, Cover Studio, livres illustrés enfants, fiche KDP, livres audio, guides et forum. Aucun abonnement, aucune date d'expiration.",
  },
  {
    q: "Puis-je payer avec PayPal ou en plusieurs fois ?",
    a: "Oui. Sur la page de paiement, vous choisissez la carte bancaire ou PayPal. Les formules 2 × 25 € et 3 × 18 € sont disponibles, et l'accès s'ouvre dès la première échéance.",
  },
  {
    q: "Faut-il savoir écrire ou être technique ?",
    a: "Non. Vous indiquez le sujet, le public et le ton : l'IA propose le sommaire, rédige chapitre par chapitre, relit le texte et prépare les fichiers. Vous gardez la main pour valider ou modifier à chaque étape.",
  },
  {
    q: "Ai-je besoin de mes propres clés API ?",
    a: "Ce n'est pas obligatoire pour démarrer. Vous pouvez ajouter votre clé Gemini ou OpenRouter dans les réglages pour générer sans limite à votre propre coût (quelques centimes par livre) ; sinon l'outil utilise les moteurs intégrés.",
  },
  {
    q: "Les livres m'appartiennent-ils ? Puis-je les vendre sur Amazon KDP ?",
    a: "Oui, vous conservez 100 % des droits sur tout ce que vous produisez, et vous pouvez les publier et les vendre sur Amazon KDP ou ailleurs, sans reversement.",
  },
  {
    q: "Et si l'outil ne me convient pas ?",
    a: "Garantie 30 jours : écrivez à contact@ebookstudio.fr dans les 30 jours suivant votre commande et vous êtes remboursé, sans justification à fournir.",
  },
  {
    q: "Pourquoi commander maintenant ?",
    a: "Le tarif 47 € à vie est valable jusqu'au 30 septembre. À partir du 1er octobre, EbookStudio passe uniquement en abonnement mensuel sans engagement : Plume 27 € par mois ou Édition 47 € par mois, résiliable à tout moment. L'accès à vie n'existera plus.",
  },
  {
    q: "Comment mon accès est-il ouvert après le paiement ?",
    a: "Immédiatement, avec l'email saisi avant le paiement. Vous recevez le lien de connexion par email ; en cas de problème, écrivez-nous et l'accès est débloqué manuellement sous 24 h ouvrées.",
  },
];

const BONUS_TOTAL = V3_BONUSES_TOTAL_VALUE;

type PlanId = "v2_1x" | "v2_2x" | "v2_3x";

const PLANS: Array<{ id: PlanId; label: string; sub: string; badge?: string }> = [
  { id: "v2_1x", label: "47 € en une fois", sub: "Le plus économique · accès immédiat", badge: "Recommandé" },
  { id: "v2_2x", label: "2 × 25 €", sub: "Prélevé sur 2 mois (50 € au total)" },
  { id: "v2_3x", label: "3 × 18 €", sub: "Prélevé sur 3 mois (54 € au total)" },
];

const INCLUDED = [
  "Génération complète de vos livres (plan, chapitres, relecture 4 passes)",
  "Export Word & PDF prêts pour Amazon KDP, table des matières professionnelle",
  "Couvertures : Cover Studio (dos et 4e de couverture calculés)",
  "Livres illustrés enfants 3-7 ans et albums carrés",
  "Fiche KDP : description 4000 caractères, mots-clés, catégories, bio auteur",
  "Livres audio (voix de synthèse professionnelle) et traductions 10 langues",
  "Accès à vie : aucun abonnement, aucune date d'expiration",
  "V3 incluse sans surcoût : tous les nouveaux outils ajoutés automatiquement",
];

interface Testimonial {
  id: string;
  author_name: string;
  book_title: string | null;
  comment: string;
  rating: number | null;
  created_at?: string | null;
}

/** Fin de l'offre 47 € : 30 septembre 2026, 23 h 59 (heure de Paris) — aligné sur
 *  le compte à rebours de la page /methode et des emails. */
const OFFER_END = new Date("2026-09-30T21:59:59Z");

function OfferCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const remaining = OFFER_END.getTime() - now;
  if (remaining <= 0) return null;
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  return (
    <div
      className="mb-4 flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold"
      style={{ borderColor: "rgba(212,175,55,0.35)", background: "rgba(212,175,55,0.08)", color: "var(--ds-gold-light)" }}
    >
      <Clock className="h-3.5 w-3.5" /> Il reste {days} jour{days > 1 ? "s" : ""} et {hours} h avant la fin de l'accès à vie
    </div>
  );
}

/**
 * Page de commande — même identité visuelle que la page de vente /methode
 * (bleu nuit + doré + orange), un seul objectif : le paiement.
 * Aucune distraction : pas de popup, pas de cadeau, pas de lien concurrent.
 */
export default function V3CommanderPage() {
  const [params] = useSearchParams();
  const src = params.get("src") || undefined;
  const ref = params.get("ref") || params.get("aff") || undefined;

  const [email, setEmail] = useState(() => (params.get("email") || "").trim().toLowerCase());
  const [plan, setPlan] = useState<PlanId>("v2_1x");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const selected = useMemo(() => PLANS.find((p) => p.id === plan)!, [plan]);

  // Avis réels et approuvés uniquement : aucun témoignage fabriqué.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("book_testimonials")
        .select("id,author_name,book_title,comment,rating,created_at")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (active && data) setTestimonials(data as Testimonial[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Suivi du tunnel : arrivée sur la page de commande.
  useEffect(() => {
    void trackCaptureEvent("commander", "view");
  }, []);

  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error("Merci de saisir un email valide — c'est lui qui ouvrira votre accès.");
      return;
    }
    void trackCaptureEvent("commander", "checkout_click", { leadMagnet: plan });
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("v3-pack-checkout", {
        body: {
          plan,
          email: e,
          src,
          ref,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
        },
      });
      if (error) {
        let message = error.message;
        const context = error.context;
        if (context instanceof Response) {
          const payload = (await context.clone().json().catch(() => null)) as { error?: string } | null;
          if (payload?.error) message = payload.error;
        }
        throw new Error(message);
      }
      const secret = (data as { clientSecret?: string })?.clientSecret;
      if (!secret) throw new Error("Session de paiement indisponible.");
      void trackCaptureEvent("commander", "checkout_ready", { leadMagnet: plan });
      setClientSecret(secret);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Paiement impossible pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dark-sales min-h-screen">
      <SeoHead
        title="Commander EbookStudio Pro — 47 € accès à vie (offre août-septembre)"
        description="Accès à vie à EbookStudio Pro pour 47 € jusqu'au 30 septembre, ensuite abonnement mensuel sans engagement. Aucun abonnement. La V3 est incluse sans surcoût. Carte bancaire ou PayPal, accès immédiat."
        canonical={COMMANDER_URL}
      />
      <PaymentTestModeBanner />

      {/* Header minimal — identique à la page /methode */}
      <header className="border-b border-[var(--ds-border)] bg-[var(--ds-bg)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="text-lg font-bold tracking-tight text-[var(--ds-text)]">EbookStudio</span>
          <FicheCountdown dark />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-16">
        {/* HERO compact : la vente est faite sur /methode, ici on finalise */}
        <section className="grid items-center gap-8 pt-10 md:pt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
              style={{ background: "var(--ds-orange-soft)", color: "var(--ds-orange)" }}
            >
              <Sparkles className="h-3.5 w-3.5" /> Dernière étape avant votre premier livre
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-tight md:text-5xl">
              Votre accès à vie à EbookStudio,{" "}
              <span style={{ color: "var(--ds-gold)" }}>pour 47 € une seule fois.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--ds-text-muted)]">
              Le système complet que vous venez de découvrir : 15 agents d'IA qui écrivent,
              corrigent, habillent et préparent votre livre pour Amazon KDP. Paiement unique,
              accès immédiat, garantie 30 jours.
            </p>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-black" style={{ color: "var(--ds-gold)" }}>47 €</span>
              <span className="text-lg text-[var(--ds-text-muted)] line-through">59 €</span>
              <span
                className="rounded-full px-3 py-1 text-sm font-bold"
                style={{ background: "var(--ds-orange-soft)", color: "var(--ds-orange)" }}
              >
                -20 %
              </span>
              <span className="text-sm text-[var(--ds-text-muted)]">· paiement unique, accès à vie</span>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: "var(--ds-border)" }}>
              {[
                { k: "Paiement", v: "unique, à vie" },
                { k: "Accès", v: "immédiat" },
                { k: "Garantie", v: "30 jours" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--ds-gold)" }}>
                    {s.k}
                  </dt>
                  <dd className="mt-1 text-base font-bold text-[var(--ds-text)]">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <img
              src={mockup}
              alt="Mockup d'un livre premium créé avec EbookStudio"
              width={1024}
              height={1024}
              className="ds-glow w-full rounded-2xl"
              loading="eager"
            />
          </div>
        </section>

        {/* OFFRE + PAIEMENT */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Colonne offre */}
          <div className="space-y-5">
            <div className="ds-card p-6 md:p-8">
              <h2 className="text-xl font-bold">Ce qui est inclus</h2>
              <ul className="mt-5 space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--ds-success)" }} />
                    <span className="text-[var(--ds-text-muted)]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: InfinityIcon, t: "Accès à vie", d: "Aucun abonnement" },
                  { icon: ShieldCheck, t: "Paiement sécurisé", d: "Carte & PayPal" },
                  { icon: Lock, t: "Sans engagement", d: "Rien à résilier" },
                ].map((b) => (
                  <div key={b.t} className="rounded-xl border p-4" style={{ borderColor: "var(--ds-border)", background: "var(--ds-bg-soft)" }}>
                    <b.icon className="h-4 w-4" style={{ color: "var(--ds-gold)" }} />
                    <div className="mt-2 text-sm font-bold text-[var(--ds-text)]">{b.t}</div>
                    <div className="text-xs text-[var(--ds-text-muted)]">{b.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus de lancement */}
            <div className="ds-card p-6" style={{ borderColor: "rgba(212,175,55,0.35)" }}>
              <h3 className="text-sm font-bold" style={{ color: "var(--ds-gold)" }}>
                Offerts avec votre commande — {BONUS_TOTAL} € de valeur
              </h3>
              <ul className="mt-3 space-y-2.5">
                {V3_LAUNCH_BONUSES.map((b) => (
                  <li key={b.title} className="flex gap-3 text-sm">
                    <span aria-hidden className="text-base leading-none">{b.emoji}</span>
                    <span>
                      <span className="font-bold text-[var(--ds-text)]">{b.title}</span>
                      <span className="block text-xs text-[var(--ds-text-muted)]">{b.desc}</span>
                    </span>
                  </li>
                ))}
                <li className="flex gap-3 text-sm">
                  <span aria-hidden className="text-base leading-none">🤝</span>
                  <span>
                    <span className="font-bold text-[var(--ds-text)]">Démarrage accompagné</span>
                    <span className="block text-xs text-[var(--ds-text-muted)]">
                      Envoyez-moi votre sujet après votre commande : je crée votre premier sommaire avec vous.
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Garantie — le bloc qui rassure au moment de payer */}
            <div className="ds-card flex gap-4 p-6">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(34,197,94,0.12)" }}
              >
                <ShieldCheck className="h-6 w-6 text-[var(--ds-success)]" />
              </span>
              <p className="text-sm leading-relaxed text-[var(--ds-text-muted)]">
                <strong className="text-[var(--ds-text)]">30 jours satisfait ou remboursé.</strong>{" "}
                Si l'atelier ne correspond pas à ce que vous attendiez, un simple email suffit :
                remboursement intégral, sans justification. À 47 €, la vraie question n'est pas le
                risque financier. C'est :{" "}
                <span className="text-[var(--ds-text)]">est-ce que vous voulez enfin voir votre livre en ligne ?</span>
              </p>
            </div>

            {/* Pourquoi maintenant */}
            <div className="ds-card p-6">
              <h3 className="text-sm font-bold" style={{ color: "var(--ds-gold)" }}>Pourquoi maintenant</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ds-text-muted)]">
                À partir du 1<sup>er</sup> octobre, EbookStudio passe uniquement en abonnement :
                à partir de 27 € par mois, soit <strong className="text-[var(--ds-text)]">324 € la première année</strong>.
                Aujourd'hui, c'est <strong className="text-[var(--ds-text)]">47 € une seule fois</strong>,
                conservés à vie, mises à jour comprises.
              </p>
            </div>
          </div>

          {/* Colonne paiement */}
          <div
            id="paiement"
            className="ds-card scroll-mt-24 p-6 md:p-8"
            style={{ borderColor: "rgba(212,175,55,0.45)", boxShadow: "0 0 60px rgba(212,175,55,0.10)" }}
          >
            {!clientSecret ? (
              <>
                <OfferCountdown />

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[var(--ds-text-muted)] line-through">59 €</span>
                  <span className="text-4xl font-black" style={{ color: "var(--ds-gold)" }}>47 €</span>
                  <span className="text-sm text-[var(--ds-text-muted)]">paiement unique</span>
                </div>
                <p className="mt-1 text-[11px] font-bold" style={{ color: "var(--ds-gold)" }}>
                  Offre valable jusqu'au 30 septembre — ensuite abonnement mensuel 27 € ou 47 €/mois, sans engagement.
                </p>

                <label className="mt-6 block text-xs font-bold uppercase tracking-wide text-[var(--ds-text-muted)]">
                  Votre email
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ds-text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="vous@email.com"
                    className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-[var(--ds-gold)]"
                    style={{ background: "var(--ds-bg-soft)", borderColor: "var(--ds-border)", color: "var(--ds-text)" }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--ds-text-muted)]">
                  C'est avec cet email que votre accès sera créé.
                </p>

                <div className="mt-5 space-y-2">
                  {PLANS.map((opt) => {
                    const active = plan === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPlan(opt.id)}
                        className="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all"
                        style={{
                          borderColor: active ? "var(--ds-gold)" : "var(--ds-border)",
                          background: active ? "rgba(212,175,55,0.10)" : "transparent",
                        }}
                      >
                        <span>
                          <span className="block text-sm font-bold text-[var(--ds-text)]">{opt.label}</span>
                          <span className="block text-[11px] text-[var(--ds-text-muted)]">{opt.sub}</span>
                        </span>
                        {opt.badge && !active && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{ background: "var(--ds-orange-soft)", color: "var(--ds-orange)" }}
                          >
                            {opt.badge}
                          </span>
                        )}
                        {active && <Check className="h-4 w-4" style={{ color: "var(--ds-gold)" }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Réassurance juste au-dessus du bouton : c'est là qu'on hésite */}
                <ul
                  className="mt-5 space-y-1.5 rounded-xl border p-4 text-xs text-[var(--ds-text-muted)]"
                  style={{ borderColor: "var(--ds-border)", background: "var(--ds-bg-soft)" }}
                >
                  <li className="flex items-center gap-2">
                    <RotateCcw className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ds-success)" }} />
                    <span><strong className="text-[var(--ds-text)]">Garantie 30 jours</strong> — remboursé sur simple demande, sans justification.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ds-gold)" }} />
                    <span><strong className="text-[var(--ds-text)]">PayPal ou carte bancaire</strong>, en 1, 2 ou 3 fois.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--ds-gold)" }} />
                    <span><strong className="text-[var(--ds-text)]">Aucun abonnement</strong> : rien à résilier, accès conservé à vie.</span>
                  </li>
                </ul>

                {/* LE bouton unique de la page */}
                <button
                  onClick={startPayment}
                  disabled={loading}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, var(--ds-orange) 0%, var(--ds-orange-deep) 100%)" }}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Préparation du paiement…</>
                  ) : (
                    <>Payer {selected.label.replace("en une fois", "").trim()} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[var(--ds-text-muted)]">
                  <CreditCard className="h-3.5 w-3.5" /> Carte bancaire & PayPal — paiement chiffré, sur cette page.
                </div>
                <p className="mt-2 text-center text-[11px] text-[var(--ds-text-muted)]">
                  En plusieurs fois, l'accès s'ouvre dès la 1re échéance.
                </p>
                <p className="mt-2 text-center text-[11px] text-[var(--ds-text-muted)]">
                  Un doute avant de payer ? Écrivez-moi directement :{" "}
                  <a href="mailto:boubetgeorges@gmail.com" className="underline" style={{ color: "var(--ds-gold)" }}>
                    boubetgeorges@gmail.com
                  </a>
                </p>
              </>
            ) : (
              <div>
                <h2 className="mb-4 text-lg font-bold text-[var(--ds-text)]">Paiement sécurisé</h2>
                <div className="rounded-xl bg-white p-2">
                  <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Témoignages réels, s'il y en a */}
        {testimonials.length > 0 && (
          <section className="mt-14">
            <h2 className="text-center text-xl font-bold md:text-2xl">Ce qu'en disent les auteurs</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.id} className="ds-card p-5">
                  <Quote className="h-4 w-4" style={{ color: "var(--ds-gold)" }} />
                  <blockquote className="mt-2 text-sm leading-relaxed text-[var(--ds-text-muted)]">{t.comment}</blockquote>
                  <figcaption className="mt-3 text-xs font-bold text-[var(--ds-text)]">
                    {t.author_name}
                    {t.book_title && <span className="font-normal text-[var(--ds-text-muted)]"> — {t.book_title}</span>}
                    {t.created_at && (
                      <span className="font-normal text-[var(--ds-text-muted)]">
                        {" · "}
                        {new Date(t.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                      </span>
                    )}
                  </figcaption>
                  {t.rating ? (
                    <div className="mt-1.5 flex gap-0.5" aria-label={`${t.rating} sur 5`}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3" style={{ color: "var(--ds-gold)", fill: "var(--ds-gold)" }} />
                      ))}
                    </div>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* FAQ — les questions posées avant de payer */}
        <section className="mt-14" id="faq">
          <h2 className="text-center text-2xl font-bold md:text-3xl">Questions fréquentes</h2>
          <div className="mx-auto mt-6 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-${i}`}
                  className="ds-card border px-5"
                  style={{ borderColor: "var(--ds-border)" }}
                >
                  <AccordionTrigger className="text-left text-sm font-bold text-[var(--ds-text)] hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-[var(--ds-text-muted)]">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <p className="mt-6 text-center text-xs text-[var(--ds-text-muted)]">
            Une autre question ?{" "}
            <a href="mailto:contact@ebookstudio.fr" className="underline" style={{ color: "var(--ds-gold)" }}>
              contact@ebookstudio.fr
            </a>{" "}
            — réponse sous 24 h ouvrées.
          </p>
        </section>

        {/* Rappel final — même bouton */}
        <section className="mt-14 border-t pt-12 text-center" style={{ borderColor: "var(--ds-border)" }}>
          <h2 className="text-2xl font-bold md:text-3xl">Votre livre est déjà dans votre tête.</h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--ds-text-muted)]">
            Dans quelques soirées, il peut être en ligne. Ou rester une idée de plus.
          </p>
          <div className="mt-6">
            <a
              href="#paiement"
              onClick={() => trackCaptureEvent("commander", "click")}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-lg transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg, var(--ds-orange) 0%, var(--ds-orange-deep) 100%)" }}
            >
              Obtenir l'accès à vie — 47 € <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-4 text-xs text-[var(--ds-text-muted)]">
            <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[var(--ds-success)]" />
            Garantie 30 jours · paiement unique · accès immédiat
          </p>
        </section>

        {/* Footer réduit aux mentions légales */}
        <footer className="mt-14 border-t pt-6 text-center text-[11px] text-[var(--ds-text-muted)]" style={{ borderColor: "var(--ds-border)" }}>
          <a href="/mentions-legales" className="hover:underline">Mentions légales</a>
          {" · "}
          <a href="/cgv" className="hover:underline">CGV</a>
          {" · "}
          <a href="/politique-confidentialite" className="hover:underline">Confidentialité</a>
          {" · "}
          <a href="mailto:contact@ebookstudio.fr" className="hover:underline">contact@ebookstudio.fr</a>
        </footer>
      </div>
    </main>
  );
}
