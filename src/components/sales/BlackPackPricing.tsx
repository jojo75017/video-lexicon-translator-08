import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Rocket, ArrowRight, ShieldCheck, Star, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StripeCheckoutButton from "@/components/StripeCheckoutButton";

interface BlackPackPricingProps {
  onCtaClick: () => void;
  launchPrice?: number;
  normalPrice?: number;
}

const GOLD = "#FFB020";
const BG = "#0a0a0a";
const WHITE = "#FFFFFF";
const GREY = "#D4D4D4";
const SOFT = "#1a1a1a";

const BlackPackPricing = ({ onCtaClick, launchPrice = 67, normalPrice = 147 }: BlackPackPricingProps) => {
  const discount = Math.round(((normalPrice - launchPrice) / normalPrice) * 100);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const breakdown = [
    { label: "Tous les outils KDP", price: 87 },
    { label: "Formation 18 modules", price: 47 },
    { label: "Bonus & ressources", price: 13 },
  ];

  const includes = [
    "Tous les outils sans limite",
    "Toutes les formations",
    "Tous les bonus inclus",
    "Communauté privée",
    "Mises à jour à vie",
    "Support prioritaire",
  ];

  return (
    <section
      id="black-pack-pricing"
      className="relative overflow-hidden py-16 sm:py-20 px-4"
      style={{
        background: BG,
        backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 0%, hsl(38 92% 50% / 0.12), transparent 60%)`,
      }}
    >
      <div className="mx-auto max-w-5xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-5"
            style={{
              border: `1px solid ${GOLD}`,
              background: "rgba(255,176,32,0.08)",
            }}
          >
            <Star className="h-4 w-4" style={{ color: GOLD, fill: GOLD }} />
            <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              Ne paie pas €{normalPrice}
            </span>
            <Star className="h-4 w-4" style={{ color: GOLD, fill: GOLD }} />
          </div>
          <h2
            className="font-black leading-tight"
            style={{ color: WHITE, fontSize: "clamp(28px, 4.5vw, 48px)" }}
          >
            Tout ce que tu obtiens —{" "}
            <span style={{ color: GOLD, textShadow: "0 0 30px hsl(38 92% 50% / 0.4)" }}>
              €{launchPrice} à vie
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg" style={{ color: GREY }}>
            Paiement unique. Aucun abonnement. Accès immédiat.
          </p>
        </motion.div>

        {/* Grille comparaison */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 mb-10">
          {/* Carte prix normal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 sm:p-8 relative"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid rgba(255,255,255,0.12)`,
            }}
          >
            <div
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: GREY }}
            >
              Prix normal
            </div>
            <div className="space-y-3 mb-5">
              {breakdown.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span style={{ color: GREY }}>{b.label}</span>
                  <span className="font-bold" style={{ color: WHITE }}>€{b.price}</span>
                </div>
              ))}
            </div>
            <div
              className="my-4 h-px"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold uppercase" style={{ color: GREY }}>
                Total
              </span>
              <span
                className="text-3xl font-black"
                style={{
                  color: "#FF6B6B",
                  textDecoration: "line-through",
                  textDecorationThickness: "3px",
                }}
              >
                €{normalPrice}
              </span>
            </div>
          </motion.div>

          {/* Carte Black Pack - meilleur choix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6 sm:p-8 relative"
            style={{
              background: `linear-gradient(155deg, rgba(255,176,32,0.12) 0%, rgba(255,138,0,0.06) 100%)`,
              border: `2px solid ${GOLD}`,
              boxShadow: `0 10px 50px hsl(38 92% 50% / 0.25)`,
            }}
          >
            {/* Badge */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
              style={{ background: GOLD, color: SOFT }}
            >
              ⭐ Meilleur choix
            </div>

            <div
              className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ color: GOLD }}
            >
              Offre Black Pack
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span
                className="text-5xl sm:text-6xl font-black leading-none"
                style={{ color: GOLD, textShadow: "0 0 30px hsl(38 92% 50% / 0.5)" }}
              >
                €{launchPrice}
              </span>
              <span
                className="rounded-md px-2 py-0.5 text-xs font-black"
                style={{ background: GOLD, color: SOFT }}
              >
                −{discount}%
              </span>
            </div>
            <div className="text-sm mb-5" style={{ color: GREY }}>
              Paiement unique · Accès à vie
            </div>

            <div className="space-y-2.5">
              {includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full flex-shrink-0"
                    style={{ background: GOLD }}
                  >
                    <Check className="h-3 w-3" style={{ color: SOFT }} strokeWidth={3} />
                  </div>
                  <span style={{ color: WHITE }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA central - Email + 2 boutons paiement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-xl"
        >
          {/* Champ email */}
          <div
            className="rounded-2xl p-5 sm:p-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid rgba(255,176,32,0.25)`,
            }}
          >
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: GOLD }}>
              Ton email pour recevoir l'accès
            </label>
            <div className="relative mb-4">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: GREY }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="w-full rounded-xl border-0 py-3.5 pl-12 pr-4 text-base font-semibold focus:outline-none focus:ring-2"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: WHITE,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                required
              />
            </div>

            {/* Bouton 1 : Carte bancaire (Stripe) - PRINCIPAL */}
            <StripeCheckoutButton
              email={email}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 sm:py-5 font-black text-base sm:text-lg transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-60 disabled:hover:scale-100 mb-3"
            >
              💳 Payer par carte - €{launchPrice} à vie
            </StripeCheckoutButton>

            {/* Séparateur */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREY }}>ou</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>

            {/* Bouton 2 : PayPal - SECONDAIRE */}
            <button
              type="button"
              onClick={() => navigate("/upsell-paiement?plan=pro")}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3.5 font-bold text-sm transition-all hover:bg-white/10"
              style={{
                background: "transparent",
                color: WHITE,
                border: "1.5px solid rgba(255,255,255,0.25)",
              }}
            >
              💰 Payer avec PayPal (2x ou 3x possible)
            </button>
          </div>

          {/* Rassurances */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
            style={{ color: GREY }}
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" style={{ color: GOLD }} />
              Garantie 30 jours satisfait ou remboursé
            </span>
            <span>· Paiement unique · Accès à vie</span>
            <span>· 100% sécurisé</span>
          </div>
        </motion.div>
      </div>

      {/* Transition vers section claire */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${BG} 40%, #FAFAFA 100%)`,
        }}
      />
    </section>
  );
};

export default BlackPackPricing;
