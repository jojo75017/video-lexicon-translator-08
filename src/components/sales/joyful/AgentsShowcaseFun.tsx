import { motion } from "framer-motion";

const agents = [
  { id: "P1", emoji: "📋", name: "Éditeur en chef", desc: "Bâtit le plan béton de ton ebook", color: "bg-joy-peach" },
  { id: "P2", emoji: "🔍", name: "Chercheur", desc: "Trouve les pépites pour chaque chapitre", color: "bg-joy-mint" },
  { id: "P3", emoji: "✍️", name: "Rédacteur", desc: "Écrit avec ta voix, ton style", color: "bg-joy-lavender" },
  { id: "P4", emoji: "🎯", name: "Stratège SEO", desc: "Optimise pour Amazon KDP", color: "bg-joy-bubblegum" },
  { id: "P5", emoji: "🧠", name: "Pédagogue", desc: "Rend chaque concept clair et fun", color: "bg-joy-sun" },
  { id: "P6", emoji: "💬", name: "Storyteller", desc: "Glisse des anecdotes qui collent", color: "bg-joy-peach" },
  { id: "P7", emoji: "📊", name: "Data analyste", desc: "Apporte des chiffres crédibles", color: "bg-joy-mint" },
  { id: "P8", emoji: "🎨", name: "Directeur artistique", desc: "Génère ta couverture pro", color: "bg-joy-lavender" },
  { id: "P9", emoji: "📐", name: "Architecte", desc: "Structure chapitres et sous-chapitres", color: "bg-joy-bubblegum" },
  { id: "P10", emoji: "🔗", name: "Liaison", desc: "Crée des transitions fluides", color: "bg-joy-sun" },
  { id: "P11", emoji: "🧐", name: "Relecteur", desc: "Chasse les fautes et lourdeurs", color: "bg-joy-peach" },
  { id: "P12", emoji: "✨", name: "Polisseur", desc: "Donne le coup d'éclat final", color: "bg-joy-mint" },
  { id: "P13", emoji: "🎧", name: "Voix audiobook", desc: "Transforme en audiobook pro", color: "bg-joy-lavender" },
  { id: "P14", emoji: "📦", name: "Exportateur", desc: "PDF, EPUB, Word, prêt KDP", color: "bg-joy-bubblegum" },
  { id: "P15", emoji: "🛡️", name: "Anti-IA", desc: "Humanise pour passer les détecteurs", color: "bg-joy-sun" },
];

export const AgentsShowcaseFun = () => {
  return (
    <section id="outils" className="py-20 px-4 bg-joy-cream">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-joy-lavender text-joy-ink font-bold text-sm px-4 py-2 rounded-full shadow-joy mb-4">
            🤖 Ton équipe IA personnelle
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-joy-ink mb-3">
            15 agents qui bossent pour toi
          </h2>
          <p className="text-lg text-joy-ink/70 max-w-2xl mx-auto">
            Chaque agent a son super-pouvoir. Ensemble, ils créent ton ebook pendant que tu sirotes ton café ☕
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {agents.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 150 }}
              whileHover={{ y: -6, rotate: i % 2 ? 2 : -2 }}
              className={`${a.color} rounded-2xl p-4 shadow-joy hover:shadow-joy-lg transition-shadow text-center`}
            >
              <div className="text-4xl mb-2">{a.emoji}</div>
              <div className="text-[10px] font-black text-joy-ink/50 mb-1">{a.id}</div>
              <h3 className="font-black text-joy-ink text-sm mb-1 leading-tight">{a.name}</h3>
              <p className="text-xs text-joy-ink/70 leading-snug">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsShowcaseFun;
