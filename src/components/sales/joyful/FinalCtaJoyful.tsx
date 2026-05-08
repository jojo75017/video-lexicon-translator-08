import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Blob from "./Blob";

interface Props {
  onCtaClick: () => void;
  launchPrice: number;
}

export const FinalCtaJoyful = ({ onCtaClick, launchPrice }: Props) => {
  return (
    <section className="relative py-24 px-4 bg-gradient-to-br from-[hsl(var(--joy-peach))] via-[hsl(var(--joy-sun))] to-[hsl(var(--joy-bubblegum))] overflow-hidden">
      <Blob className="absolute top-10 left-10 w-32 h-32 opacity-50 animate-joy-float" color="text-white" />
      <Blob className="absolute bottom-10 right-10 w-40 h-40 opacity-40 animate-joy-float" color="text-joy-mint" style={{ animationDelay: "1s" }} />

      {/* Confetti dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-white/70"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="text-7xl md:text-9xl mb-6 inline-block animate-joy-wiggle">🎉</div>
        <h2 className="text-4xl md:text-6xl font-black text-joy-ink mb-5 leading-tight">
          On se lance ensemble ?
        </h2>
        <p className="text-lg md:text-xl text-joy-ink/80 mb-10 max-w-xl mx-auto font-medium">
          Ton premier ebook publié sur Amazon ce week-end. Promis, c'est plus simple que tu ne crois.
        </p>
        <Button
          size="lg"
          onClick={onCtaClick}
          className="bg-joy-ink text-joy-cream hover:bg-joy-ink/90 text-xl font-black px-10 py-8 rounded-2xl shadow-joy-lg hover:scale-105 transition-transform"
        >
          <Sparkles className="w-6 h-6 mr-2" />
          C'est parti pour {launchPrice}€ à vie
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
        <p className="text-sm text-joy-ink/70 mt-5">
          Paiement unique · Garantie 30 jours · Accès instantané
        </p>
      </motion.div>
    </section>
  );
};

export default FinalCtaJoyful;
