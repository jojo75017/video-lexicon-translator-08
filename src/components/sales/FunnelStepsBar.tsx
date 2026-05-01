import { motion } from "framer-motion";
import { Mail, CreditCard, Rocket, ArrowRight } from "lucide-react";

interface FunnelStepsBarProps {
  onCtaClick?: () => void;
}

const steps = [
  {
    n: 1,
    icon: Mail,
    title: "Choisis ton offre",
    desc: "Saisis ton email sur cette page",
  },
  {
    n: 2,
    icon: CreditCard,
    title: "Paiement sécurisé",
    desc: "Carte bancaire ou PayPal",
  },
  {
    n: 3,
    icon: Rocket,
    title: "Accès immédiat",
    desc: "Code reçu + outils débloqués",
  },
];

const FunnelStepsBar = ({ onCtaClick }: FunnelStepsBarProps) => {
  const handleClick = () => {
    if (onCtaClick) return onCtaClick();
    document.getElementById("black-pack-pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      aria-label="Tunnel d'achat en 3 étapes"
      className="px-4 py-6 sm:py-8 border-b border-border/50"
      style={{
        background:
          "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(45 100% 97%) 100%)",
      }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Titre */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 mb-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-800">
              ⚡ Comment ça marche
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            Ton accès en{" "}
            <span className="text-amber-600">3 étapes simples</span>
          </h2>
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative rounded-2xl bg-white border-2 border-amber-200/60 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
            >
              {/* Numéro */}
              <div className="absolute -top-3 -left-3 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-sm shadow-lg">
                {s.n}
              </div>

              <div className="flex items-start gap-3 pl-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 mb-0.5">
                    Étape {s.n}
                  </div>
                  <div className="font-black text-foreground text-sm sm:text-base leading-tight mb-1">
                    {s.title}
                  </div>
                  <div className="text-xs text-muted-foreground leading-snug">
                    {s.desc}
                  </div>
                </div>
              </div>

              {/* Flèche entre les étapes (desktop uniquement) */}
              {i < steps.length - 1 && (
                <ArrowRight
                  aria-hidden
                  className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 z-10"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl font-black text-base sm:text-lg px-8 py-4 transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(90deg, #F59E0B 0%, #F97316 100%)",
              color: "#FFFFFF",
              boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.5)",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>🚀 Démarrer maintenant — 67€ à vie</span>
            <ArrowRight className="w-5 h-5" style={{ color: "#FFFFFF" }} />
          </button>
          <span className="text-xs text-muted-foreground">
            ✓ Paiement unique · ✓ Garantie 30 jours · ✓ Paiement sécurisé
          </span>
        </div>
      </div>
    </section>
  );
};

export default FunnelStepsBar;
