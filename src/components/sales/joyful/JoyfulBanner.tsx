import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  { emoji: "👋", text: "Hey, content de te voir ! +200 auteurs ont déjà rejoint l'aventure" },
  { emoji: "✨", text: "Pas de stress : on t'accompagne pas à pas, à ton rythme" },
  { emoji: "🎁", text: "Tarif câlin -150€ jusqu'au 15 sept - pas de bla-bla" },
  { emoji: "🛡️", text: "Garantie 30 jours : si tu adores pas, on te rembourse, point" },
  { emoji: "🚀", text: "Ton premier ebook publié ce week-end ? On y croit avec toi" },
];

export const JoyfulBanner = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, []);
  const m = messages[i];
  return (
    <div className="bg-gradient-to-r from-[hsl(var(--joy-sun))] via-[hsl(var(--joy-peach))] to-[hsl(var(--joy-bubblegum))] py-2.5 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-joy-ink px-4"
        >
          <span className="text-xl">{m.emoji}</span>
          <span>{m.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default JoyfulBanner;
