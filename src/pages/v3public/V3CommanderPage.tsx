import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import {
  Check, Loader2, ShieldCheck, Zap, Infinity as InfinityIcon, CreditCard,
  Lock, Mail, ArrowRight,
} from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SeoHead from "@/components/funnel/SeoHead";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

const EMERALD = "#064e3b";
const GOLD = "#c9a84c";
const GOLD_LIGHT = "#f0d78c";
const PAPER = "#fbfaf6";
const INK = "#1a1a1a";
const SERIF = "'Instrument Serif', Georgia, serif";

type PlanId = "v2_1x" | "v2_2x" | "v2_3x";

const PLANS: Array<{ id: PlanId; label: string; sub: string; badge?: string }> = [
  { id: "v2_1x", label: "59 € en une fois", sub: "Le plus économique · accès immédiat", badge: "Recommandé" },
  { id: "v2_2x", label: "2 × 32 €", sub: "Prélevé sur 2 mois (64 € au total)" },
  { id: "v2_3x", label: "3 × 22 €", sub: "Prélevé sur 3 mois (66 € au total)" },
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
];

export default function V3CommanderPage() {
  const [params] = useSearchParams();
  const src = params.get("src") || undefined;
  const ref = params.get("ref") || params.get("aff") || undefined;

  const [email, setEmail] = useState(() => (params.get("email") || "").trim().toLowerCase());
  const [plan, setPlan] = useState<PlanId>("v2_1x");
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const selected = useMemo(() => PLANS.find((p) => p.id === plan)!, [plan]);

  const startPayment = async () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      toast.error("Merci de saisir un email valide — c'est lui qui ouvrira votre accès.");
      return;
    }
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
      if (error) throw new Error(error.message);
      const secret = (data as { clientSecret?: string })?.clientSecret;
      if (!secret) throw new Error("Session de paiement indisponible.");
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
        title="Commander EbookStudio Pro — 59 € accès à vie"
        description="Accès à vie à EbookStudio Pro pour 59 €, ou en 2 à 3 fois. Paiement sécurisé par carte bancaire ou PayPal, accès immédiat."
        canonical="https://www.ebookstudio.fr/commander"
      />
      <PaymentTestModeBanner />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold"
            style={{ background: `${EMERALD}12`, color: EMERALD }}
          >
            <InfinityIcon className="h-3.5 w-3.5" /> Accès à vie · sans abonnement
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-black leading-tight" style={{ fontFamily: SERIF, color: EMERALD }}>
            EbookStudio Pro — 59 €, une seule fois
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-700">
            Écrivez, habillez et publiez vos livres sur Amazon KDP avec l'assistance IA complète.
            Paiement sécurisé par carte bancaire ou PayPal, accès ouvert immédiatement.
          </p>
        </div>

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
            className="rounded-2xl border p-6 md:p-8"
            style={{ background: "#fff", borderColor: `${GOLD}66`, boxShadow: "0 26px 60px -34px rgba(6,78,59,0.45)" }}
          >
            {!clientSecret ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black" style={{ color: EMERALD }}>59 €</span>
                  <span className="text-sm text-slate-500">paiement unique</span>
                </div>

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
      </section>
    </main>
  );
}
