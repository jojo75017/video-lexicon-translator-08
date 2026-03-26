import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useVipAvailability } from '@/hooks/useVipAvailability';

const PriceComparison: React.FC = () => {
  const navigate = useNavigate();
  const { isVipAvailable } = useVipAvailability();
  const price = isVipAvailable ? '37' : '67';

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
    }
  ];

  const handleCta = () => {
    if (isVipAvailable) {
      navigate('/paiement-manuel');
    } else {
      navigate('/upsell-paiement?plan=pro');
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-violet-50/50 via-background to-purple-50/50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            💸 COMPARATIF PRIX DU MARCHÉ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Combien coûte un ebook <span className="text-red-500 line-through decoration-2">sans</span> EbookStudio ?
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
              className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-red-200/60 dark:border-red-800/30 shadow-sm hover:shadow-md transition-shadow"
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
                  <span className="text-lg font-bold text-red-500">{item.price}</span>
                  <p className="text-[11px] text-muted-foreground">{item.perBook}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {item.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* VS Separator */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-300 dark:via-violet-700 to-transparent" />
          <span className="text-2xl font-black text-violet-600 bg-violet-100 dark:bg-violet-900/50 px-5 py-2 rounded-full">VS</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-300 dark:via-violet-700 to-transparent" />
        </div>

        {/* EbookStudio Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 md:p-10 text-white shadow-2xl shadow-violet-500/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <span className="font-bold text-2xl">EbookStudio Pro</span>
                </div>
                <p className="text-white/70 mb-5 text-sm">Accès à vie – Ebooks illimités – {isVipAvailable ? 'Offre Fondateur' : 'Paiement unique ou en 3x/5x'}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Génération IA en 47 min',
                    'Ebooks illimités à vie',
                    'Couvertures pro générées',
                    '18 modules de formation',
                    'Audio & marketing inclus',
                    'Support + mises à jour'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3">
                <div>
                  <span className="text-xl text-white/50 line-through">197€</span>
                </div>
                <div className="text-6xl font-black text-yellow-300 leading-none">{price}€</div>
                <p className="text-sm text-white/70">{isVipAvailable ? 'Paiement unique' : 'Paiement unique ou en 3x49€ / 5x32€'}</p>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  💰 Économie : <span className="font-bold text-yellow-200">de 463€ à 9 963€</span>
                </div>

                <Button
                  onClick={handleCta}
                  size="lg"
                  className="mt-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-yellow-500/30 transition-all hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Obtenir l'accès à {price}€
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Paiement sécurisé • Accès immédiat</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PriceComparison;
