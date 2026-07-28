import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Crown, Zap, CreditCard, X } from "lucide-react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  V3_PLANS,
  formatPrice,
  getYearlySavingsPercent,
  getV3PriceId,
  type V3BillingInterval,
  type V3PlanId,
} from "@/data/v3Pricing";

const PLAN_ICONS = {
  debutant: Sparkles,
  expert: Zap,
  auteur: Crown,
} as const;

const PLAN_ACCENTS: Record<string, string> = {
  debutant: "#0d7a5f",   // Auteur — émeraude douce
  expert: "#C97A14",     // Studio — or/ambre (mis en avant)
  auteur: "#5B21B6",     // Éditeur — pourpre édition
};

function PayPalTestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "checkout">("email");

  useEffect(() => {
    if (open) {
      setClientSecret(null);
      setStep("email");
      setLoading(false);
      supabase.auth.getUser().then(({ data }) => {
        if (data.user?.email) setEmail(data.user.email);
      });
    }
  }, [open]);

  const startCheckout = async () => {
    if (!email.includes("@")) {
      toast.error("Email invalide");
      return;
    }
    setLoading(true);
    try {
      const returnUrl = `${window.location.origin}/v3/offres/merci?session_id={CHECKOUT_SESSION_ID}&test=paypal`;
      const { data, error } = await supabase.functions.invoke("test-paypal-checkout", {
        body: {
          email,
          environment: getStripeEnvironment(),
          returnUrl,
        },
      });
      if (error || !data?.clientSecret) {
        throw new Error(error?.message || data?.error || "Impossible de créer la session de test");
      }
      setClientSecret(data.clientSecret as string);
      setStep("checkout");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'ouverture du checkout");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientSecret = useCallback(() => {
    return Promise.resolve(clientSecret!);
  }, [clientSecret]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-hidden p-0">
        <DialogHeader className="px-5 py-4 border-b border-black/5">
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.064 1.193 1.378 2.64 1.085 4.154-.342 1.833-1.206 3.055-2.462 3.747-.578.32-1.19.52-1.83.62.374.428.6.91.72 1.45.262 1.105.13 2.53-.387 4.257-.602 2.03-1.55 3.465-2.815 4.267-1.163.733-2.683 1.104-4.526 1.104H7.68a.65.65 0 0 1-.604-.438z" />
            </svg>
            Test PayPal — 1 € fictif
          </DialogTitle>
          <DialogDescription>
            Aucun vrai prélèvement. Cette session sert uniquement à vérifier que le bouton PayPal s'affiche.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 overflow-y-auto">
          {step === "email" ? (
            <div className="max-w-md mx-auto py-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Email de test
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 focus:border-[#008296] focus:outline-none"
                />
              </label>
              <Button
                onClick={startCheckout}
                disabled={loading}
                className="w-full bg-[#008296] hover:bg-[#006b7a]"
              >
                {loading ? "Ouverture..." : "Voir le checkout test"}
              </Button>
              <p className="text-xs text-center text-slate-500">
                En preview, le checkout utilise Stripe en mode sandbox. En production, le montant serait de 1 € réel.
              </p>
            </div>
          ) : clientSecret ? (
            <EmbeddedCheckoutProvider
              stripe={getStripe()}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function V3PlanTestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState<V3PlanId>("expert");
  const [billing, setBilling] = useState<V3BillingInterval>("month");
  const [step, setStep] = useState<"choose" | "checkout">("choose");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setClientSecret(null);
      setStep("choose");
      setLoading(false);
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setEmail(data.user.email || "");
          setUserId(data.user.id);
        }
      });
    }
  }, [open]);

  const start = async () => {
    if (!email.includes("@")) return toast.error("Email invalide");
    setLoading(true);
    try {
      const priceId = getV3PriceId(planId, billing);
      const { data, error } = await supabase.functions.invoke("v3-subscription-checkout", {
        body: {
          priceId,
          email,
          userId,
          environment: getStripeEnvironment(),
          returnUrl: `${window.location.origin}/v3/forfaits?test=success`,
        },
      });
      if (error || !data?.clientSecret) {
        throw new Error(error?.message || data?.error || "Échec création session");
      }
      setClientSecret(data.clientSecret);
      setStep("checkout");
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tester un forfait V3 (admin)</DialogTitle>
          <DialogDescription>
            Ouvre le vrai tunnel Stripe (test mode si sandbox) pour vérifier le flux d'abonnement.
          </DialogDescription>
        </DialogHeader>
        {step === "choose" ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600">Forfait</label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value as V3PlanId)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="debutant">Auteur — 9,99€/mo · 97€/an</option>
                <option value="expert">Studio — 12,99€/mo · 117€/an</option>
                <option value="auteur">Éditeur — 59€/mo · 547€/an</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Facturation</label>
              <div className="mt-1 flex gap-2">
                <button
                  onClick={() => setBilling("month")}
                  className={`flex-1 py-2 rounded-lg text-sm ${billing === "month" ? "bg-slate-800 text-white" : "border border-slate-300"}`}
                >Mensuel</button>
                <button
                  onClick={() => setBilling("year")}
                  className={`flex-1 py-2 rounded-lg text-sm ${billing === "year" ? "bg-slate-800 text-white" : "border border-slate-300"}`}
                >Annuel</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Price ID Stripe : <code className="bg-slate-100 px-1 rounded">{getV3PriceId(planId, billing)}</code>
            </p>
            <Button onClick={start} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Création…" : "Ouvrir le checkout Stripe"}
            </Button>
          </div>
        ) : clientSecret ? (
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default function V3ForfaitsPage() {
  const [interval, setInterval] = useState<V3BillingInterval>("month");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPayPalTest, setShowPayPalTest] = useState(false);
  const [showPlanTest, setShowPlanTest] = useState(false);

  useEffect(() => {
    getIsCurrentSessionAdmin().then(setIsAdmin);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: "#FAFAFA" }}>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3" style={{ color: "#b45309" }}>
            EbookStudio V3 · Forfaits
          </p>
          <h1 className="text-4xl md:text-5xl font-serif mb-4" style={{ color: "#232F3E" }}>
            Choisissez votre atelier d'édition
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#4b5563" }}>
            3 forfaits, tous équipés du pipeline IA. Passez au supérieur à tout moment.
          </p>

          <div className="inline-flex mt-8 p-1 rounded-full border" style={{ borderColor: "#e5e7eb", background: "#fff" }}>
            <button
              onClick={() => setInterval("month")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                interval === "month" ? "text-white" : "text-slate-600"
              }`}
              style={{ background: interval === "month" ? "#008296" : "transparent" }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setInterval("year")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                interval === "year" ? "text-white" : "text-slate-600"
              }`}
              style={{ background: interval === "year" ? "#008296" : "transparent" }}
            >
              Annuel <span className="text-xs opacity-80">(−20%)</span>
            </button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {V3_PLANS.map((plan) => {
            const Icon = PLAN_ICONS[plan.id];
            const accent = PLAN_ACCENTS[plan.id];
            const price = interval === "month" ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = getYearlySavingsPercent(plan);
            const featured = plan.id === "expert";

            return (
              <article
                key={plan.id}
                className="relative rounded-2xl bg-white p-8 flex flex-col"
                style={{
                  border: featured ? `2px solid ${accent}` : "1px solid #e5e7eb",
                  boxShadow: featured
                    ? "0 20px 40px -12px rgba(180, 83, 9, 0.25)"
                    : "0 4px 12px rgba(0,0,0,0.04)",
                }}
              >
                {featured && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg whitespace-nowrap"
                    style={{ background: accent }}
                  >
                    ⭐ Le plus recommandé
                  </span>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg grid place-items-center"
                    style={{ background: `${accent}15`, color: accent }}
                  >
                    <Icon size={20} />
                  </div>
                  <h2 className="text-2xl font-serif" style={{ color: "#232F3E" }}>
                    {plan.name}
                  </h2>
                </div>

                <p className="text-sm mb-6 min-h-[3rem]" style={{ color: "#6b7280" }}>
                  {plan.tagline}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold" style={{ color: "#232F3E" }}>
                      {formatPrice(price)}
                    </span>
                    <span className="text-sm text-slate-500">
                      /{interval === "month" ? "mois" : "an"}
                    </span>
                  </div>
                  {interval === "year" && (
                    <p className="text-xs mt-1" style={{ color: accent }}>
                      Économisez {savings}% vs mensuel
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: "#374151" }}>
                      <Check size={16} className="shrink-0 mt-0.5" style={{ color: accent }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/contact-support?sujet=v3-${plan.id}-${interval}`}
                  className="block text-center py-3 rounded-lg font-semibold transition hover:opacity-90"
                  style={{
                    background: featured ? accent : "#232F3E",
                    color: "#fff",
                  }}
                >
                  Être prévenu au lancement
                </Link>
                <p className="text-[11px] text-center mt-2" style={{ color: "#9ca3af" }}>
                  Ouverture des abonnements · octobre 2026
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Une question ?{" "}
            <Link to="/contact-support" className="underline" style={{ color: "#008296" }}>
              Contactez-nous
            </Link>{" "}
            — réponse sous 24h.
          </p>

          {isAdmin && (
            <div className="inline-flex flex-col items-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Outils admin
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowPayPalTest(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Tester PayPal (1 € fictif)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPlanTest(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Tester un forfait V3 (Stripe)
                </Button>
              </div>
              <p className="text-xs text-blue-600/80 max-w-xs">
                Ouvre les vrais tunnels de paiement en mode test. Visible uniquement par vous.
              </p>
            </div>
          )}
        </div>
      </div>

      <PayPalTestModal open={showPayPalTest} onClose={() => setShowPayPalTest(false)} />
      <V3PlanTestModal open={showPlanTest} onClose={() => setShowPlanTest(false)} />
    </div>
  );
}
