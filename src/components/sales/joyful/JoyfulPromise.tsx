import { motion } from "framer-motion";

const promises = [
  {
    emoji: "🕒",
    title: "Tu vas gagner du temps",
    desc: "Un ebook complet en moins d'1 heure au lieu de 3 mois. L'IA fait le gros du boulot, tu valides.",
    color: "bg-joy-peach",
  },
  {
    emoji: "😌",
    title: "Tu vas dire adieu au stress",
    desc: "Un workflow guidé pas à pas. Pas de page blanche, pas de tech, pas de prise de tête.",
    color: "bg-joy-mint",
  },
  {
    emoji: "🏆",
    title: "Tu vas être fier·e de toi",
    desc: "Voir ton livre publié sur Amazon avec ton nom dessus. Cette sensation, ça n'a pas de prix.",
    color: "bg-joy-lavender",
  },
];

export const JoyfulPromise = () => {
  return (
    <section id="decouvrir" className="py-20 px-4 bg-joy-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black text-joy-ink mb-4">
            Tu vas adorer parce que…
          </h2>
          <p className="text-lg text-joy-ink/70">3 promesses simples qu'on tient depuis 200+ auteurs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {promises.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
              className={`${p.color} rounded-3xl p-8 shadow-joy hover:shadow-joy-lg transition-shadow`}
            >
              <div className="text-6xl mb-4 inline-block animate-joy-float" style={{ animationDelay: `${i * 0.3}s` }}>
                {p.emoji}
              </div>
              <h3 className="text-2xl font-black text-joy-ink mb-3">{p.title}</h3>
              <p className="text-joy-ink/80 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoyfulPromise;
