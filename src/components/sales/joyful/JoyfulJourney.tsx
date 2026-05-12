import { motion } from "framer-motion";

const days = [
  { day: "Jour 1", emoji: "💡", title: "Tu choisis ton sujet", desc: "Avec l'aide d'EbookStudio, tu trouves une niche qui te ressemble en 10 minutes." },
  { day: "Jour 2", emoji: "📝", title: "L'IA écrit ton plan", desc: "P1 (l'éditeur) bâtit le squelette. Tu ajustes ce que tu veux." },
  { day: "Jour 3-4", emoji: "✍️", title: "Rédaction express", desc: "Les agents P2 à P10 écrivent chapitre par chapitre. Toi tu relis et tu kiffes." },
  { day: "Jour 5", emoji: "🎨", title: "Couverture magique", desc: "Imagen 3 te génère une couverture pro en 30 secondes. Tu choisis ta préférée." },
  { day: "Jour 6", emoji: "🎧", title: "Bonus audiobook", desc: "Optionnel : on transforme ton ebook en audiobook avec une voix neuronale." },
  { day: "Jour 7", emoji: "🚀", title: "Tu publies sur KDP", desc: "Export PDF/EPUB nickel + checklist KDP. Tu cliques, c'est en ligne." },
];

export const JoyfulJourney = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-joy-cream to-[hsl(var(--joy-lavender)/0.3)]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block bg-joy-mint text-joy-ink font-bold text-sm px-4 py-2 rounded-full shadow-joy mb-4">
            🗓️ De zéro à publié en 7 jours
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-joy-ink mb-4">
            Voici ta semaine type
          </h2>
          <p className="text-lg text-joy-ink/70">Pas de précipitation, pas de marathon - juste un rythme doux</p>
        </div>

        <div className="space-y-4">
          {days.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-start gap-5 bg-white rounded-3xl p-5 md:p-6 shadow-joy border-2 ${i % 2 ? "border-[hsl(var(--joy-peach))] md:ml-12" : "border-[hsl(var(--joy-mint))] md:mr-12"}`}
            >
              <div className="text-5xl shrink-0 animate-joy-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {d.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-joy-ink/50 mb-1">{d.day}</div>
                <h3 className="text-xl md:text-2xl font-black text-joy-ink mb-1">{d.title}</h3>
                <p className="text-joy-ink/70">{d.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoyfulJourney;
