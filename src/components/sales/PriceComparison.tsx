import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';

const PriceComparison: React.FC = () => {

  const comparisons = [
    {
      service: 'Rédacteur freelance',
      emoji: '✍️',
      price: '500 – 2 000€',
      perBook: '/ ebook',
      time: '2-4 semaines',
      issues: ['Délais variables', 'Révisions coûteuses', 'Style pas toujours adapté', 'Résultat non garanti']
    },
    {
      service: 'Formation écriture',
      emoji: '🎓',
      price: '200 – 500€',
      perBook: '/ formation',
      time: '3-6 mois',
      issues: ['Pas de génération IA', 'Résultats non garantis', 'Travail manuel 100%', 'Aucun outil inclus']
    },
    {
      service: 'Ghostwriter pro',
      emoji: '👻',
      price: '1 500 – 5 000€',
      perBook: '/ projet',
      time: '1-2 mois',
      issues: ['Très coûteux', 'Droits parfois partagés', '1 seul projet', 'Pas de formations']
    },
    {
      service: 'Agence éditoriale',
      emoji: '🏢',
      price: '3 000 – 10 000€',
      perBook: '/ livre',
      time: '2-6 mois',
      issues: ['Budget conséquent', 'Process très long', 'Pas adapté aux indépendants', 'Pas de support IA']
    },
    {
      service: 'KDP Rocket',
      emoji: '🚀',
      price: '~ 39€/mois',
      perBook: '/ abonnement',
      time: 'Récurrent',
      issues: ['Abonnement à vie', '12 outils seulement', 'Pas de génération manuscrit', 'Pas de formation incluse']
    }
  ];


  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-destructive/10 text-destructive text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            💸 COMPARATIF PRIX DU MARCHÉ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Combien coûte un ebook <span className="text-destructive line-through decoration-2">sans</span> EbookStudio ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Voici ce que facturent les professionnels pour <strong>un seul</strong> ebook…
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-card rounded-xl p-5 border border-destructive/20 shadow-sm hover:shadow-md hover:border-destructive/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{item.service}</h3>
                    <p className="text-xs text-muted-foreground">Délai : {item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-destructive">{item.price}</span>
                  <p className="text-[11px] text-muted-foreground">{item.perBook}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {item.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <X className="w-3.5 h-3.5 text-destructive shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lien vers l'offre unique en bas de page */}
        <div className="text-center">
          <button
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline text-base"
          >
            <Sparkles className="w-5 h-5" />
            Voir notre offre unique tout-en-un
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PriceComparison;
