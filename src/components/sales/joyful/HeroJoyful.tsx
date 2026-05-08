import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Blob from "./Blob";

interface Props {
  onCtaClick: () => void;
  launchPrice: number;
  normalPrice: number;
}

export const HeroJoyful = ({ onCtaClick, launchPrice, normalPrice }: Props) => {
  return (
    <section className="relative bg-joy-cream overflow-hidden py-20 md:py-28 px-4">
      {/* Decorative blobs */}
      <Blob className="absolute -top-20 -left-20 w-80 h-80 opacity-60 animate-joy-float" color="text-joy-peach" />
      <Blob className="absolute -bottom-32 -right-20 w-96 h-96 opacity-50 animate-joy-float" color="text-joy-mint" style={{ animationDelay: "1s" }} />
      <Blob className="absolute top-1/3 right-1/4 w-40 h-40 opacity-40" color="text-joy-lavender" />

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -6 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-block bg-joy-sun text-joy-ink font-bold text-sm px-4 py-2 rounded-full shadow-joy mb-6"
        >
          ✨ La méthode joyeuse pour publier ton 1er ebook
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black text-joy-ink leading-[1.05] mb-6"
        >
          Et si écrire ton livre devenait...{" "}
          <span className="relative inline-block">
            <span className="relative z-10">vraiment fun</span>
            <span className="absolute bottom-1 left-0 right-0 h-3 md:h-5 bg-joy-sun -z-0 -rotate-1 rounded-full" />
          </span>{" "}
          <span className="inline-block animate-joy-wiggle">🎉</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-joy-ink/80 max-w-2xl mx-auto mb-10 font-medium"
        >
          15 agents IA bienveillants qui t'aident à créer, illustrer et publier ton ebook sur Amazon KDP — sans prise de tête, sans abonnement, sans pression.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <Button
            size="lg"
            onClick={onCtaClick}
            className="bg-joy-ink text-joy-cream hover:bg-joy-ink/90 text-lg font-bold px-8 py-7 rounded-2xl shadow-joy-lg hover:scale-105 transition-transform"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Je commence pour {launchPrice}€ à vie
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <a href="#decouvrir" className="text-joy-ink font-semibold underline underline-offset-4 decoration-2 decoration-[hsl(var(--joy-peach))] hover:decoration-[hsl(var(--joy-sun))]">
            Découvrir d'abord →
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-joy-ink/70"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[hsl(var(--joy-mint))]" />
            Garantie 30 jours
          </span>
          <span>·</span>
          <span><span className="line-through opacity-50">{normalPrice}€</span> {launchPrice}€ à vie</span>
          <span>·</span>
          <span>+200 auteurs heureux</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroJoyful;
