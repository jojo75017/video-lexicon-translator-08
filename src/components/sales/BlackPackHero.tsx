import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Rocket, ArrowRight, Sparkles, Flame, Users } from "lucide-react";

interface BlackPackHeroProps {
  onCtaClick: () => void;
  launchEnd: number;
  launchPrice?: number;
  normalPrice?: number;
}

const useCountdown = (target: number) => {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
};

const GOLD = "#FFB020";
const BG = "#0a0a0a";
const WHITE = "#FFFFFF";
const GREY = "#D4D4D4";

const BlackPackHero = ({ onCtaClick, launchEnd, launchPrice = 67, normalPrice = 147 }: BlackPackHeroProps) => {
  const c = useCountdown(launchEnd);
  const discount = Math.round(((normalPrice - launchPrice) / normalPrice) * 100);

  const units = [
    { v: c.d, l: "Jours" },
    { v: c.h, l: "Heures" },
    { v: c.m, l: "Min" },
    { v: c.s, l: "Sec" },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: BG,
        backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 0%, hsl(38 92% 50% / 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, hsl(38 92% 50% / 0.10), transparent 60%)`,
      }}
    >
      {/* Subtle grain / spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 30%, transparent 0%, rgba(0,0,0,0.55) 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:py-20 md:py-24 text-center">
        {/* Badge édition limitée */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full px-5 py-2"
          style={{
            border: `1px solid ${GOLD}`,
            background: "rgba(255, 176, 32, 0.08)",
            color: GOLD,
          }}
        >
          <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
          <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>
            ✨ Édition limitée
          </span>
          <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
        </motion.div>

        {/* Compteur géant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 flex items-center justify-center gap-2 sm:gap-4"
        >
          {units.map((u, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="flex items-center justify-center rounded-xl px-3 sm:px-5 py-3 sm:py-4 min-w-[64px] sm:min-w-[88px]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${GOLD}`,
                  boxShadow: `0 0 30px hsl(38 92% 50% / 0.18), inset 0 0 12px hsl(38 92% 50% / 0.06)`,
                }}
              >
                <span
                  className="font-black tabular-nums leading-none"
                  style={{
                    color: WHITE,
                    fontSize: "clamp(28px, 6vw, 56px)",
                    textShadow: "0 2px 12px rgba(255,176,32,0.35)",
                  }}
                >
                  {String(u.v).padStart(2, "0")}
                </span>
              </div>
              <span
                className="mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                style={{ color: GOLD }}
              >
                {u.l}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-black leading-[1.05] tracking-tight mb-5"
          style={{
            color: WHITE,
            fontSize: "clamp(34px, 6.5vw, 72px)",
          }}
        >
          Ton ebook mérite
          <br />
          <span
            style={{
              color: GOLD,
              textShadow: `0 0 40px hsl(38 92% 50% / 0.45)`,
            }}
          >
            AMAZON KDP
          </span>
          <br />
          <span style={{ color: GREY, fontSize: "0.55em", fontWeight: 700 }}>
            (en moins d'1h)
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl mb-10"
          style={{ color: GREY, lineHeight: 1.6 }}
        >
          15 agents IA qui rédigent, illustrent et publient ton livre — entièrement automatisé,{" "}
          <strong style={{ color: WHITE }}>sans expérience requise</strong>.
        </motion.p>

        {/* CTA principal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <button
            type="button"
            onClick={onCtaClick}
            className="group inline-flex items-center justify-center gap-3 rounded-2xl px-8 sm:px-10 py-5 sm:py-6 font-black text-base sm:text-lg transition-all hover:scale-[1.03] active:scale-100"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, #FF8A00 100%)`,
              color: "#1a1a1a",
              boxShadow: `0 10px 40px hsl(38 92% 50% / 0.45), 0 0 0 1px hsl(38 92% 50% / 0.6)`,
            }}
          >
            <Rocket className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: "#1a1a1a" }} />
            <span style={{ color: "#1a1a1a" }}>
              Découvrir l'offre
            </span>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" style={{ color: "#1a1a1a" }} />
          </button>
        </motion.div>

        {/* Bandeau urgence (sans prix) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div
            className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-semibold"
            style={{ color: GOLD }}
          >
            <Flame className="h-4 w-4" style={{ color: GOLD }} />
            <span style={{ color: GOLD }}>
              ⚡ Offre de lancement expire dans {c.d}j {c.h}h {c.m}m
            </span>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 rounded-xl px-4 sm:px-6 py-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${GOLD}`,
              boxShadow: `0 0 30px hsl(38 92% 50% / 0.20)`,
            }}
          >
            <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: WHITE }}>
              <Users className="h-4 w-4" style={{ color: GOLD }} />
              <span style={{ color: WHITE }}>
                🔥 +5000 auteurs déjà inscrits
              </span>
            </div>
          </div>

          {/* Petites réassurances */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm"
            style={{ color: GREY }}
          >
            <span style={{ color: GREY }}>✓ Paiement unique</span>
            <span style={{ color: GREY }}>✓ Accès à vie</span>
            <span style={{ color: GREY }}>✓ Garantie 30 jours</span>
          </div>
        </motion.div>
      </div>

      {/* Transition vers la section claire suivante */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${BG} 40%, #FAFAFA 100%)`,
        }}
      />
    </section>
  );
};

export default BlackPackHero;
