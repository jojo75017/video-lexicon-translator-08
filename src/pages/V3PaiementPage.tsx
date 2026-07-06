import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import SeoHead from "@/components/funnel/SeoHead";
import {
  Check, CreditCard, ArrowLeft, ArrowRight, Crown, Layers,
  ShieldCheck, Lock, Star, CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { V3_PRICE, V3_FULL_PACK } from "@/data/roadmapV3";

// Palette « Clair Ambre » cohérente avec la page de vente V3
const AMBER = "#E8951E";
const AMBER_DEEP = "#C97A14";
const CREAM = "#FBF6EC";
const INK = "#2A2118";
const SERIF = "'Instrument Serif', Georgia, serif";

type PlanKey = "v3-base" | "v3-pro";

const PLANS: Record<PlanKey, {
  name: string;
  price: number;
  installments: string[];
  features: string[];
}> = {
  "v3-base": {
    name: "Publication Assistée Pro V3 — Base",
    price: V3_PRICE,
    installments: ["1×197€", "3×69€"],
    features: [
      "Studio de création (15 agents IA)",
      "Studio couvertures pro",
      "Recherche de niche & concurrence",
      "Formatage & export multi-format KDP",
      "Séquence de lancement J-7",
      "Optimisation listing & Ads",
      "Mises à jour à vie",
      "Garantie 7 jours",
    ],
  },
  "v3-pro": {
    name: V3_FULL_PACK.title,
    price: V3_FULL_PACK.price,
    installments: V3_FULL_PACK.installments,
    features: [
      "Tout ce qu'inclut la Base",
      "Pack Monétisation",
      "Pack Distribution",
      "Pack Trafic Social",
      "Pack Qualité Éditoriale",
      "Mises à jour à vie",
      "Garantie 7 jours",
    ],
  },
};

const buildPaypalLink = (amount: number, label: string) =>
  `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=boubetgeorges@gmail.com&amount=${amount}&currency_code=EUR&item_name=${encodeURIComponent(label)}`;

const V3PaiementPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const planKey: PlanKey = params.get("plan") === "v3-pro" ? "v3-pro" : "v3-base";
  const plan = PLANS[planKey];

  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"stripe" | "paypal">("stripe");

  useEffect(() => {
    try {
      const e = localStorage.getItem("payment_email_backup") || localStorage.getItem("ebs_lead_email");
      if (e) setEmail(e);
    } catch { /* ignore */ }
  }, []);

  const paypalLink = useMemo(
    () => buildPaypalLink(plan.price, plan.name),
    [plan],
  );

  const handlePayPalClick = () => {
    if (email.trim()) {
      sessionStorage.setItem("payment_email", email.trim());
      localStorage.setItem("payment_email_backup", email.trim());
    }
  };

  const goToConfirmation = () => {
    if (!email.trim()) {
      toast.error("Veuillez d'abord entrer votre email");
      return;
    }
    sessionStorage.setItem("payment_email", email.trim());
    localStorage.setItem("payment_email_backup", email.trim());
    navigate("/confirmation-paiement");
  };

  return (
    <div style={{ background: CREAM, color: INK }} className="min-h-screen py-8 px-4">
      <SeoHead
        title={`Commande — ${plan.name}`}
        description="Finalisez votre commande Publication Assistée Pro V3. Paiement carte sécurisé ou PayPal."
        canonical="https://www.ebookstudio.fr/v3-paiement"
        noindex
      />
      <div className="max-w-xl mx-auto">
        <Link to="/publication-pro" className="inline-flex items-center gap-2 text-[#7a6c58] hover:text-[#2A2118] mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Retour à l'offre
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-3xl border bg-white shadow-xl overflow-hidden"
          style={{ borderColor: "#efe3cf" }}
        >
          {/* Header */}
          <div className="text-center py-8 px-6" style={{ background: INK, color: CREAM }}>
            <div className="inline-flex items-center gap-2 mb-3">
              {planKey === "v3-pro"
                ? <Crown className="w-5 h-5" style={{ color: AMBER }} />
                : <Layers className="w-5 h-5" style={{ color: AMBER }} />}
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: AMBER }}>
                Publication Assistée Pro — V3
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: SERIF }}>{plan.name}</h1>
            <div className="flex items-baseline justify-center gap-3">
              {planKey === "v3-pro" && (
                <span className="text-xl line-through opacity-50">{V3_FULL_PACK.compareAt}€</span>
              )}
              <span className="text-6xl font-black" style={{ color: AMBER }}>{plan.price}€</span>
            </div>
            <p className="text-sm opacity-80 mt-1">Paiement unique · Accès à vie</p>
            <p className="text-xs opacity-70 mt-1">ou {plan.installments.slice(1).join(" · ")}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Features */}
            <ul className="grid gap-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AMBER }} /> {f}
                </li>
              ))}
            </ul>

            {/* Email */}
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: AMBER, color: INK }}>1</span>
                Votre email
              </label>
              <Input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
              <p className="text-[11px] text-[#9a8a72] flex items-center gap-1">
                <Lock className="w-3 h-3" /> Votre accès sera envoyé à cette adresse
              </p>
            </div>

            {/* Méthode */}
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: AMBER, color: INK }}>2</span>
                Mode de paiement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { v: "stripe" as const, l: "Carte bancaire", s: "Accès immédiat" },
                  { v: "paypal" as const, l: "PayPal / 3×", s: "Paiement échelonné" },
                ]).map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setMethod(opt.v)}
                    className="text-left border-2 rounded-xl p-3 transition"
                    style={method === opt.v
                      ? { borderColor: AMBER, background: "#FFF3DF" }
                      : { borderColor: "#efe3cf" }}
                  >
                    <span className="font-semibold text-sm block">{opt.l}</span>
                    <span className="text-[11px] text-[#9a8a72]">{opt.s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paiement */}
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: AMBER, color: INK }}>3</span>
                Payer maintenant
              </label>

              {method === "stripe" ? (
                <StripeCheckoutButton
                  email={email}
                  planId={planKey}
                  successPath="/paiement-succes"
                  cancelPath={`/v3-paiement?plan=${planKey}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-6 text-lg font-bold text-white shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
                >
                  <>
                    Payer {plan.price}€ par carte
                    <ArrowRight className="w-5 h-5" />
                  </>
                </StripeCheckoutButton>
              ) : (
                <a href={paypalLink} target="_blank" rel="noopener noreferrer" onClick={handlePayPalClick} className="block">
                  <Button size="lg" className="w-full py-6 text-lg font-bold rounded-xl border-0" style={{ background: INK, color: CREAM }}>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payer {plan.price}€ — PayPal ou CB
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </a>
              )}
              <p className="text-center text-[11px] text-[#9a8a72] flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" /> Paiement sécurisé SSL 256-bit
              </p>
            </div>

            {/* Après paiement */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: "#efe3cf" }}>
              <Button onClick={goToConfirmation} variant="outline" size="lg"
                className="w-full rounded-xl border-2" style={{ borderColor: INK, color: INK }}>
                <CheckCircle className="w-5 h-5 mr-2" style={{ color: AMBER_DEEP }} />
                J'ai payé → Confirmer mon achat
              </Button>
            </div>

            {/* Garantie */}
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: "#FFF3DF" }}>
              <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" style={{ color: AMBER_DEEP }} />
              <p className="text-sm">
                <strong>Garantie 7 jours</strong> — satisfait ou remboursé, sans justification.
              </p>
            </div>

            <div className="text-center flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4" style={{ fill: AMBER, color: AMBER }} />)}
              <span className="text-[#9a8a72] text-sm ml-1">Créé par Georges Boubet</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default V3PaiementPage;
