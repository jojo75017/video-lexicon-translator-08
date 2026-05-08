import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const items = [
  {
    q: "C'est vraiment 67€ une seule fois ?",
    a: "Yes ! Tu payes 67€ via PayPal et tu as accès à vie à toute la plateforme. Pas d'abonnement, pas de renouvellement, pas de frais cachés. Promesse.",
    color: "bg-joy-peach",
  },
  {
    q: "Et si je suis nul·le en informatique ?",
    a: "Aucun souci ! Si tu sais utiliser un email, tu sais utiliser EbookStudio. Tout est guidé, l'IA fait le boulot technique, et on a des tutos vidéo pour chaque étape.",
    color: "bg-joy-mint",
  },
  {
    q: "Combien ça me coûte d'utiliser l'IA Gemini ?",
    a: "Entre 0,20€ et 0,50€ par ebook complet. C'est ta clé Gemini personnelle (gratuite à créer chez Google). On te donne un guide vidéo dédié.",
    color: "bg-joy-lavender",
  },
  {
    q: "Je peux vraiment vendre les ebooks sur Amazon ?",
    a: "Oui, 100% à toi. Tu gardes tous les droits, tu gardes tous les revenus. On t'aide juste à les créer plus vite et mieux.",
    color: "bg-joy-bubblegum",
  },
  {
    q: "Et si finalement ça me plaît pas ?",
    a: "Tu as 30 jours pour tester. Si ça te plaît pas, tu m'écris, je te rembourse. Pas de question, pas de pression. Tranquille.",
    color: "bg-joy-sun",
  },
  {
    q: "Le prix va vraiment augmenter ?",
    a: "Oui, le 15 septembre 2026 il passe à 147€ à vie. C'est le tarif fondateur, on le tient pour récompenser les early adopters comme toi.",
    color: "bg-joy-peach",
  },
];

export const JoyfulFAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 px-4 bg-joy-cream">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-joy-ink mb-3">
            Tes questions, nos réponses honnêtes
          </h2>
          <p className="text-lg text-joy-ink/70">Pas de baratin marketing, on te dit tout</p>
        </div>

        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`${it.color} rounded-2xl shadow-joy overflow-hidden`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-bold text-joy-ink text-lg">{it.q}</span>
                  <Plus
                    className={`w-5 h-5 text-joy-ink shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-joy-ink/80 leading-relaxed">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JoyfulFAQ;
