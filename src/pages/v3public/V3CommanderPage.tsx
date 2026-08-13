import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import {
  Check, Loader2, ShieldCheck, Zap, Infinity as InfinityIcon, CreditCard,
  Lock, Mail, ArrowRight, RotateCcw, Star, Quote,
} from "lucide-react";

import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SeoHead from "@/components/funnel/SeoHead";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { COMMANDER_URL } from "@/data/externalLinks";
import { V3_LAUNCH_BONUSES, V3_BONUSES_TOTAL_VALUE } from "@/data/v3Launch";
import { trackCaptureEvent } from "@/lib/captureTracking";
import { V3EngineStrip, V3EngineGrid } from "@/components/v3public/V3EngineBanner";
import heroBooks from "@/assets/commander-hero-books.jpg";



const BONUS_TOTAL = V3_BONUSES_TOTAL_VALUE;


const EMERALD = "#064e3b";
const GOLD = "#c9a84c";
const GOLD_LIGHT = "#f0d78c";
const PAPER = "#fbfaf6";
const INK = "#1a1a1a";
const SERIF = "'Instrument Serif', Georgia, serif";

type PlanId = "v2_1x" | "v2_2x" | "v2_3x";

const PLANS: Array<{ id: PlanId; label: string; sub: string; badge?: string }> = [
  { id: "v2_1x", label: "47 € en une fois", sub: "Le plus économique · accès immédiat", badge: "Recommandé" },
  { id: "v2_2x", label: "2 × 25 €", sub: "Prélevé sur 2 mois (50 € au total)" },
  { id: "v2_3x", label: "3 × 18 €", sub: "Prélevé sur 3 mois (54 € au total)" },
];

const INCLUDED = [
  "Génération complète de vos livres (plan, chapitres, relecture)",
  "Export Word & PDF prêts pour Amazon KDP, avec table des matières professionnelle",
  "Couvertures : Cover Studio (dos et 4e de couverture calculés)",
  "Livres illustrés enfants 3-7 ans et albums carrés",
  "Fiche KDP : description 4000 caractères, mots-clés, catégories, bio auteur",
  "Livres audio (voix de synthèse professionnelle)",
  "Forum communauté + guides de publication",
  "Accès à vie : aucun abonnement, aucune date d'expiration",
  "V3 incluse sans surcoût : tous les nouveaux outils vous seront ajoutés automatiquement",
];

interface Testimonial {
  id: string;
  author_name: string;
  book_title: string | null;
  comment: string;
  rating: number | null;
}

/** Blocs de réassurance : les trois objections qui bloquent le paiement. */
const REASSURANCE = [
  {
    icon: RotateCcw,
    title: "Garantie 30 jours",
    body: "Si l'outil ne vous convient pas, écrivez-moi dans les 30 jours : vous êtes remboursé, sans justification à fournir.",
  },
  {
    icon: CreditCard,
    title: "PayPal accepté",
    body: "Sur la page de paiement, choisissez PayPal ou la carte bancaire. Le paiement en 2 ou 3 fois reste possible.",
  },
  {
    icon: Lock,
    title: "Aucun abonnement",
    body: "Un seul paiement, accès conservé, rien à résilier. À partir du 1er octobre, l'accès à vie n'existera plus.",
  },
];

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
        .select("id,author_name,book_title,comment,rating")
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
    void trackCaptureEvent('commander', 'view');
  }, []);


  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error("Merci de saisir un email valide — c'est lui qui ouvrira votre accès.");
      return;
    }
    // Suivi du tunnel : clic sur le bouton de paiement (avant l'appel Stripe).
    void trackCaptureEvent('commander', 'checkout_click', { leadMagnet: plan });
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
          const payload = await context.clone().json().catch(() => null) as { error?: string } | null;
          if (payload?.error) message = payload.error;
        }
        throw new Error(message);
      }
      const secret = (data as { clientSecret?: string })?.clientSecret;
      if (!secret) throw new Error("Session de paiement indisponible.");
      // Suivi du tunnel : le formulaire Stripe s'affiche réellement.
      void trackCaptureEvent('commander', 'checkout_ready', { leadMagnet: plan });
      setClientSecret(secret);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Paiement impossible pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: PAPER, color: INK }}>
      <SeoHead
        title="Commander EbookStudio Pro — 47 € accès à vie (offre août-septembre)"
        description="Accès à vie à EbookStudio Pro pour 47 € au lieu de 59 €, jusqu'au 30 septembre. Aucun abonnement. La V3 est incluse sans surcoût. Carte bancaire ou PayPal, accès immédiat."
        canonical={COMMANDER_URL}
      />
      <PaymentTestModeBanner />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* HERO — nouvelle mise en page éditoriale */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]"
              style={{ borderColor: `${GOLD}66`, color: "#8a6d16", background: `${GOLD}12` }}
            >
              <InfinityIcon className="h-3.5 w-3.5" /> Accès à vie · sans abonnement
            </span>

            <h1
              className="mt-6 text-4xl leading-[1.05] md:text-6xl"
              style={{ fontFamily: SERIF, color: EMERALD }}
            >
              Écrivez et publiez<br />votre livre sur<br />
              <em>Amazon KDP</em>
            </h1>

            <div className="mt-7 h-px w-24" style={{ background: `${EMERALD}33` }} />

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-700">
              EbookStudio rédige, met en page, habille et référence vos livres avec
              l'assistance IA complète. Du sommaire vide au fichier prêt à téléverser.
            </p>

            <a
              href="#paiement"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-black transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD})`, color: INK }}
            >
              Obtenir l'accès à vie — 47 € <ArrowRight className="h-4 w-4" />
            </a>

            <p className="mt-4 text-sm text-slate-600">
              <span className="line-through">59 €</span> jusqu'au 30 septembre · garanti 30 jours
            </p>

            <div className="mt-10 border-t pt-6" style={{ borderColor: `${EMERALD}1a` }}>
              <dl className="grid grid-cols-3 gap-4">
                {[
                  { k: "Paiement", v: "unique, à vie" },
                  { k: "Accès", v: "immédiat" },
                  { k: "Garantie", v: "30 jours" },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#8a6d16" }}>
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-lg" style={{ fontFamily: SERIF, color: EMERALD }}>{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-3 md:p-4" style={{ borderColor: `${GOLD}44` }}>
            <img
              src={heroBooks}
              alt="Trois livres reliés vert foncé au titre doré, publiés avec EbookStudio"
              width={1200}
              height={912}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* MOTEUR MULTI-MODÈLES */}
        <div className="mt-14 overflow-hidden rounded-2xl">
          <V3EngineStrip />
        </div>
        <V3EngineGrid className="!px-0 !py-8" />





        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Colonne offre */}
          <div className="rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: `${EMERALD}22` }}>
            <h2 className="text-xl font-black" style={{ color: EMERALD }}>Ce qui est inclus</h2>
            <ul className="mt-5 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: GOLD }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Zap, t: "Accès immédiat", d: "Dès le paiement validé" },
                { icon: ShieldCheck, t: "Paiement sécurisé", d: "Carte bancaire & PayPal" },
                { icon: Lock, t: "Sans engagement", d: "Aucun prélèvement caché" },
              ].map((b) => (
                <div key={b.t} className="rounded-xl border p-4" style={{ borderColor: `${EMERALD}18` }}>
                  <b.icon className="h-4 w-4" style={{ color: EMERALD }} />
                  <div className="mt-2 text-sm font-bold" style={{ color: EMERALD }}>{b.t}</div>
                  <div className="text-xs text-slate-600">{b.d}</div>
                </div>
              ))}
            </div>

            {/* Bonus de lancement : la valeur monte, le prix ne bouge pas */}
            <div className="mt-7 rounded-xl border p-5" style={{ borderColor: `${GOLD}55`, background: `${GOLD}0d` }}>
              <h3 className="text-sm font-black" style={{ color: EMERALD }}>
                Offerts avec votre commande — {BONUS_TOTAL} € de valeur
              </h3>
              <ul className="mt-3 space-y-2.5">
                {V3_LAUNCH_BONUSES.map((b) => (
                  <li key={b.title} className="flex gap-3 text-sm text-slate-700">
                    <span aria-hidden className="text-base leading-none">{b.emoji}</span>
                    <span>
                      <span className="font-bold" style={{ color: EMERALD }}>{b.title}</span>
                      <span className="block text-xs text-slate-600">{b.desc}</span>
                    </span>
                  </li>
                ))}
                <li className="flex gap-3 text-sm text-slate-700">
                  <span aria-hidden className="text-base leading-none">🤝</span>
                  <span>
                    <span className="font-bold" style={{ color: EMERALD }}>Démarrage accompagné</span>
                    <span className="block text-xs text-slate-600">
                      Envoyez-moi votre sujet après votre commande : je crée votre premier sommaire avec vous.
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Le calcul, écrit noir sur blanc */}
            <div className="mt-5 rounded-xl border p-5" style={{ borderColor: `${EMERALD}22` }}>
              <h3 className="text-sm font-black" style={{ color: EMERALD }}>Pourquoi maintenant</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                À partir du 1<sup>er</sup> octobre, EbookStudio passe uniquement en abonnement :
                17 € par mois, soit <strong>204 € la première année</strong>. Aujourd'hui, c'est
                <strong> 47 € une seule fois</strong>, conservés à vie, mises à jour comprises.
              </p>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Une question avant de commander ? Écrivez à{" "}
              <a href="mailto:contact@ebookstudio.fr" className="underline" style={{ color: EMERALD }}>
                contact@ebookstudio.fr
              </a>{" "}
              — réponse sous 24 h ouvrées.
            </p>
          </div>


          {/* Colonne paiement */}
          <div
            id="paiement"
            className="scroll-mt-24 rounded-2xl border p-6 md:p-8"

            style={{ background: "#fff", borderColor: `${GOLD}66`, boxShadow: "0 26px 60px -34px rgba(6,78,59,0.45)" }}
          >
            {!clientSecret ? (
              <>
                <div
                  className="mb-4 rounded-xl border px-4 py-3 text-sm font-bold"
                  style={{ background: `${GOLD}14`, borderColor: `${GOLD}55`, color: "#8a6d16" }}
                >
                  🎁 La V3 est incluse sans surcoût : tous les nouveaux outils et la nouvelle interface vous seront ajoutés automatiquement.
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-400 line-through">59 €</span>
                  <span className="text-4xl font-black" style={{ color: EMERALD }}>47 €</span>
                  <span className="text-sm text-slate-500">paiement unique</span>
                </div>
                <p className="mt-1 text-[11px] font-bold" style={{ color: "#8a6d16" }}>
                  Offre valable jusqu'au 30 septembre — ensuite 59 €.
                </p>


                <label className="mt-6 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Votre email
                </label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder="vous@email.com"
                    className="w-full rounded-xl border px-10 py-3 text-sm outline-none focus:border-emerald-700"
                    style={{ borderColor: `${EMERALD}33` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500">
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
                          borderColor: active ? GOLD : `${EMERALD}1f`,
                          background: active ? `${GOLD}14` : "transparent",
                        }}
                      >
                        <span>
                          <span className="block text-sm font-bold" style={{ color: EMERALD }}>{opt.label}</span>
                          <span className="block text-[11px] text-slate-600">{opt.sub}</span>
                        </span>
                        {opt.badge && !active && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${GOLD}22`, color: "#8a6d16" }}>
                            {opt.badge}
                          </span>
                        )}
                        {active && <Check className="h-4 w-4" style={{ color: GOLD }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Réassurance juste au-dessus du bouton : c'est là qu'on hésite */}
                <ul className="mt-5 space-y-1.5 rounded-xl border p-4 text-xs text-slate-700" style={{ borderColor: `${EMERALD}1f`, background: `${EMERALD}08` }}>
                  <li className="flex items-center gap-2">
                    <RotateCcw className="h-3.5 w-3.5 shrink-0" style={{ color: EMERALD }} />
                    <span><strong>Garantie 30 jours</strong> — remboursé sur simple demande, sans justification.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 shrink-0" style={{ color: EMERALD }} />
                    <span><strong>PayPal ou carte bancaire</strong>, en 1, 2 ou 3 fois.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 shrink-0" style={{ color: EMERALD }} />
                    <span><strong>Aucun abonnement</strong> : rien à résilier, accès conservé à vie.</span>
                  </li>
                </ul>

                <button
                  onClick={startPayment}
                  disabled={loading}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-black transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD})`, color: INK }}
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Préparation du paiement…</>
                  ) : (
                    <>Payer {selected.label.replace("en une fois", "").trim()} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <CreditCard className="h-3.5 w-3.5" /> Carte bancaire & PayPal — paiement chiffré, sur cette page.
                </div>
                <p className="mt-2 text-center text-[11px] text-slate-500">
                  En plusieurs fois, l'accès s'ouvre dès la 1re échéance.
                </p>
              </>
            ) : (
              <div>
                <h2 className="mb-4 text-lg font-black" style={{ color: EMERALD }}>
                  Paiement sécurisé
                </h2>
                <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            )}
          </div>
        </div>

        {/* Réassurance : garantie, PayPal, absence d'abonnement */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {REASSURANCE.map((r) => (
            <div key={r.title} className="rounded-2xl border bg-white p-5" style={{ borderColor: `${EMERALD}18` }}>
              <r.icon className="h-5 w-5" style={{ color: GOLD }} />
              <h3 className="mt-3 text-sm font-black" style={{ color: EMERALD }}>{r.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{r.body}</p>
            </div>
          ))}
        </div>

        {testimonials.length > 0 && (
          <div className="mt-10">
            <h2 className="text-center text-lg font-black" style={{ color: EMERALD }}>
              Ce qu'en disent les auteurs
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.id} className="rounded-2xl border bg-white p-5" style={{ borderColor: `${GOLD}44` }}>
                  <Quote className="h-4 w-4" style={{ color: GOLD }} />
                  <blockquote className="mt-2 text-sm leading-relaxed text-slate-700">{t.comment}</blockquote>
                  <figcaption className="mt-3 text-xs font-bold" style={{ color: EMERALD }}>
                    {t.author_name}
                    {t.book_title && <span className="font-normal text-slate-500"> — {t.book_title}</span>}
                  </figcaption>
                  {t.rating ? (
                    <div className="mt-1.5 flex gap-0.5" aria-label={`${t.rating} sur 5`}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3" style={{ color: GOLD, fill: GOLD }} />
                      ))}
                    </div>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* FAQ — les questions posées avant de payer */}
        <div className="mt-14" id="faq">
          <h2 className="text-center text-2xl md:text-3xl" style={{ fontFamily: SERIF, color: EMERALD }}>
            Questions fréquentes
          </h2>
          <div className="mx-auto mt-6 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-${i}`}
                  className="rounded-2xl border bg-white px-5"
                  style={{ borderColor: `${EMERALD}1f` }}
                >
                  <AccordionTrigger className="text-left text-sm font-bold" style={{ color: EMERALD }}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-700">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Une autre question ?{" "}
            <a href="mailto:contact@ebookstudio.fr" className="underline" style={{ color: EMERALD }}>
              contact@ebookstudio.fr
            </a>{" "}
            — réponse sous 24 h ouvrées.
          </p>
          <div className="mt-8 text-center">
            <a
              href="#paiement"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-black transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD})`, color: INK }}
            >
              Obtenir l'accès à vie — 47 € <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

      </section>

    </main>
  );
}
