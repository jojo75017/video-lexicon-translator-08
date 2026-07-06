import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";
import {
  Check, CreditCard, ArrowRight, Crown, Layers, ShieldCheck,
  Lock, Star, CheckCircle, Gift, Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  V3_OFFERS, getV3Offer, V3_ORDER_BUMP, buildV3PaypalLink,
  type V3OfferKey,
} from "@/data/v3Launch";
import { V3_FULL_PACK } from "@/data/roadmapV3";

const AMBER = "#E8951E";
const AMBER_DEEP = "#C97A14";
const CREAM = "#FBF6EC";
const SOFT = "#FFF3DF";
const INK = "#2A2118";
const SERIF = "'Instrument Serif', Georgia, serif";

interface V3OrderFormProps {
  /** Offre présélectionnée. */
  defaultOffer?: V3OfferKey;
  /** Compact = rendu dans un dialog admin (pas de background plein écran). */
  compact?: boolean;
}

/** Formulaire de commande V3 réutilisable : choix d'UNE offre + order bump optionnel. */
const V3OrderForm = ({ defaultOffer = "v3-base", compact = false }: V3OrderFormProps) => {
  const navigate = useNavigate();
  const [offerKey, setOfferKey] = useState<V3OfferKey>(defaultOffer);
  const [bump, setBump] = useState(false);
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"stripe" | "paypal">("stripe");

  const offer = getV3Offer(offerKey);
  const total = offer.price + (bump ? V3_ORDER_BUMP.price : 0);

  useEffect(() => {
    try {
      const e = localStorage.getItem("payment_email_backup") || localStorage.getItem("ebs_lead_email");
      if (e) setEmail(e);
    } catch { /* ignore */ }
  }, []);

  const paypalLink = useMemo(
    () => buildV3PaypalLink(total, `${offer.name}${bump ? " + " + V3_ORDER_BUMP.short : ""}`),
    [total, offer.name, bump],
  );

  const persistEmail = () => {
    if (email.trim()) {
      sessionStorage.setItem("payment_email", email.trim());
      localStorage.setItem("payment_email_backup", email.trim());
    }
  };

  const goToConfirmation = () => {
    if (!email.trim()) { toast.error("Veuillez d'abord entrer votre email"); return; }
    persistEmail();
    navigate("/confirmation-paiement");
  };

  return (
    <div style={{ color: INK }} className={compact ? "" : "min-h-screen py-8 px-4"} >
      <div className={compact ? "" : "max-w-xl mx-auto"}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-3xl border bg-white shadow-xl overflow-hidden"
          style={{ borderColor: "#efe3cf" }}
        >
          {/* Header */}
          <div className="text-center py-6 px-6" style={{ background: INK, color: CREAM }}>
            <div className="inline-flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: AMBER }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: AMBER }}>
                Commande — Publication Assistée Pro V3
              </span>
            </div>
            <h1 className="text-xl font-bold" style={{ fontFamily: SERIF }}>Finalisez votre commande</h1>
          </div>

          <div className="p-6 space-y-6">
            {/* Étape 1 — Choix de l'offre (OU exclusif) */}
            <div className="space-y-3">
              <label className="font-medium text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: AMBER, color: INK }}>1</span>
                Choisissez votre offre <span className="text-[11px] text-[#9a8a72] font-normal">(une seule)</span>
              </label>
              <div className="grid gap-3">
                {V3_OFFERS.map((o) => {
                  const selected = offerKey === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => setOfferKey(o.key)}
                      className="text-left border-2 rounded-2xl p-4 transition relative"
                      style={selected ? { borderColor: AMBER, background: SOFT } : { borderColor: "#efe3cf" }}
                    >
                      {o.highlight && (
                        <span className="absolute -top-2 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: AMBER, color: INK }}>
                          RECOMMANDÉ
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {o.key === "v3-pro" ? <Crown className="w-4 h-4" style={{ color: AMBER_DEEP }} /> : <Layers className="w-4 h-4" style={{ color: AMBER_DEEP }} />}
                          <span className="font-bold text-sm">{o.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          {o.compareAt && <span className="block text-[11px] line-through text-[#9a8a72]">{o.compareAt}€</span>}
                          <span className="text-lg font-black" style={{ color: AMBER_DEEP }}>{o.price}€</span>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#7a6c58] mt-1">{o.tagline}</p>
                      {selected && (
                        <ul className="grid gap-1.5 mt-3">
                          {o.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-[12px]">
                              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: AMBER }} /> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order bump */}
            <button
              type="button"
              onClick={() => setBump((b) => !b)}
              className="w-full text-left border-2 border-dashed rounded-2xl p-4 transition flex gap-3"
              style={bump ? { borderColor: AMBER, background: SOFT } : { borderColor: "#d9c9a8", background: "#FFFDF8" }}
            >
              <span
                className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: AMBER_DEEP, background: bump ? AMBER : "transparent" }}
              >
                {bump && <Check className="w-3.5 h-3.5" style={{ color: INK }} />}
              </span>
              <div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Gift className="w-4 h-4" style={{ color: AMBER_DEEP }} />
                  {V3_ORDER_BUMP.title}
                  <span className="text-[11px] font-black" style={{ color: AMBER_DEEP }}>
                    +{V3_ORDER_BUMP.price}€ <span className="line-through text-[#9a8a72] font-normal">{V3_ORDER_BUMP.compareAt}€</span>
                  </span>
                </div>
                <p className="text-[12px] text-[#7a6c58] mt-1">{V3_ORDER_BUMP.desc}</p>
              </div>
            </button>

            {/* Étape 2 — Email */}
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: AMBER, color: INK }}>2</span>
                Votre email
              </label>
              <Input type="email" placeholder="votre@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl" />
              <p className="text-[11px] text-[#9a8a72] flex items-center gap-1">
                <Lock className="w-3 h-3" /> Votre accès sera envoyé à cette adresse
              </p>
            </div>

            {/* Étape 3 — Méthode */}
            <div className="space-y-2">
              <label className="font-medium text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: AMBER, color: INK }}>3</span>
                Mode de paiement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { v: "stripe" as const, l: "Carte bancaire", s: "Accès immédiat" },
                  { v: "paypal" as const, l: "PayPal / 3×", s: "Paiement échelonné" },
                ]).map((opt) => (
                  <button key={opt.v} type="button" onClick={() => setMethod(opt.v)}
                    className="text-left border-2 rounded-xl p-3 transition"
                    style={method === opt.v ? { borderColor: AMBER, background: SOFT } : { borderColor: "#efe3cf" }}>
                    <span className="font-semibold text-sm block">{opt.l}</span>
                    <span className="text-[11px] text-[#9a8a72]">{opt.s}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Récap total */}
            <div className="rounded-xl p-4 space-y-1 text-sm" style={{ background: SOFT }}>
              <div className="flex justify-between"><span>{offer.name}</span><strong>{offer.price}€</strong></div>
              {bump && <div className="flex justify-between"><span>{V3_ORDER_BUMP.short}</span><strong>+{V3_ORDER_BUMP.price}€</strong></div>}
              <div className="flex justify-between text-base pt-1 border-t" style={{ borderColor: "#e7d6b6" }}>
                <span className="font-bold">Total</span>
                <span className="font-black" style={{ color: AMBER_DEEP }}>{total}€</span>
              </div>
            </div>

            {/* Paiement */}
            {method === "stripe" ? (
              <StripeCheckoutButton
                email={email}
                planId={offerKey}
                addons={bump ? [V3_ORDER_BUMP.key] : []}
                successPath="/paiement-succes"
                cancelPath="/commande-v3"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-6 text-lg font-bold transition-all hover:scale-[1.02] disabled:opacity-60 border-0"
              >
                <>
                  <CreditCard className="w-5 h-5" />
                  Payer {total}€ par carte
                  <ArrowRight className="w-5 h-5" />
                </>
              </StripeCheckoutButton>
            ) : (
              <a href={paypalLink} target="_blank" rel="noopener noreferrer" onClick={persistEmail} className="block">
                <Button size="lg" className="w-full py-6 text-lg font-bold rounded-xl border-0" style={{ background: INK, color: CREAM }}>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payer {total}€ — PayPal ou CB
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            )}
            <p className="text-center text-[11px] text-[#9a8a72] flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" /> Paiement sécurisé SSL 256-bit · {offer.installments.slice(1).join(" · ")}
            </p>

            <Button onClick={goToConfirmation} variant="outline" size="lg"
              className="w-full rounded-xl border-2" style={{ borderColor: INK, color: INK }}>
              <CheckCircle className="w-5 h-5 mr-2" style={{ color: AMBER_DEEP }} />
              J'ai payé → Confirmer mon achat
            </Button>

            {/* Garantie */}
            <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: SOFT }}>
              <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" style={{ color: AMBER_DEEP }} />
              <p className="text-sm"><strong>Garantie 7 jours</strong> — satisfait ou remboursé, sans justification.</p>
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

export default V3OrderForm;
