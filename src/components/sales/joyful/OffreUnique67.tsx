import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, Heart, ShieldCheck } from "lucide-react";
import Blob from "./Blob";

interface Props {
  onCtaClick: () => void;
  launchPrice: number;
  normalPrice: number;
}

const features = [
  "Workflow 15 agents IA (P1 → P15)",
  "Gemini 3 Flash inclus",
  "Couvertures Imagen 3 illimitées",
  "Audiobooks Azure Neural",
  "Export PDF / EPUB / Word KDP",
  "18 modules de formation offerts",
  "Module BD/Comics inclus",
  "Traduction 30+ langues",
  "Mises à jour à vie 🎁",
  "Communauté privée",
  "Support prioritaire",
  "Garantie 30 jours sans condition",
];

export const OffreUnique67 = ({ onCtaClick, launchPrice, normalPrice }: Props) => {
  return (
    <section id="pricing" className="relative py-20 px-4 bg-joy-cream overflow-hidden">
      <Blob className="absolute -top-32 -right-20 w-96 h-96 opacity-40" color="text-joy-sun" />
      <Blob className="absolute -bottom-20 -left-32 w-80 h-80 opacity-50" color="text-joy-bubblegum" />

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-joy-bubblegum text-joy-ink font-bold text-sm px-4 py-2 rounded-full shadow-joy mb-4 animate-joy-wiggle">
            💝 Notre cadeau de lancement
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-joy-ink mb-3">
            Une seule offre. Toute simple.
          </h2>
          <p className="text-lg text-joy-ink/70">
            Tu payes une fois, tu utilises à vie. Pas d'abonnement, pas de surprise.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100 }}
          className="relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-joy-lg border-4 border-joy-ink"
        >
          {/* Ribbon */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-joy-sun text-joy-ink font-black text-xs uppercase tracking-wider px-5 py-1.5 rounded-full shadow-joy border-2 border-joy-ink">
            ⭐ Recommandé
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-2xl text-joy-ink/40 line-through">{normalPrice}€</span>
              <span className="text-7xl md:text-8xl font-black text-joy-ink">{launchPrice}€</span>
            </div>
            <p className="text-joy-ink/70 text-lg font-medium">
              une seule fois · accès <span className="bg-joy-sun px-2 rounded-md font-black text-joy-ink">à vie</span>
            </p>
            <p className="text-sm text-joy-ink/60 mt-2">ou en 2×35€ / 3×25€ via PayPal</p>
          </div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-2.5 bg-joy-cream rounded-xl px-3 py-2.5"
              >
                <div className="w-6 h-6 rounded-full bg-[hsl(var(--joy-mint))] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-joy-ink stroke-[3]" />
                </div>
                <span className="text-sm font-medium text-joy-ink">{f}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="lg"
            onClick={onCtaClick}
            className="w-full py-7 text-lg md:text-xl font-black bg-joy-ink text-joy-cream hover:bg-joy-ink/90 rounded-2xl shadow-joy-lg hover:scale-[1.02] transition-transform"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Oui je veux ça pour {launchPrice}€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-5 text-xs text-joy-ink/60">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Garantie 30 jours</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-[hsl(var(--joy-bubblegum))] fill-current" />+200 auteurs heureux</span>
            <span>·</span>
            <span>Accès instantané</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OffreUnique67;
