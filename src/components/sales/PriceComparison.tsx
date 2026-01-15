import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

const PriceComparison: React.FC = () => {
  const comparisons = [
    {
      service: 'Rédacteur freelance (1 ebook)',
      price: '500 - 2000€',
      time: '2-4 semaines',
      issues: ['Délais variables', 'Révisions coûteuses', 'Style pas toujours adapté']
    },
    {
      service: 'Formation écriture en ligne',
      price: '200 - 500€',
      time: '3-6 mois',
      issues: ['Pas de génération IA', 'Résultats non garantis', 'Travail manuel 100%']
    },
    {
      service: 'Ghostwriter professionnel',
      price: '1500 - 5000€',
      time: '1-2 mois',
      issues: ['Très coûteux', 'Droits parfois partagés', 'Minimum 1 projet']
    },
    {
      service: 'Agence éditoriale',
      price: '3000 - 10000€',
      time: '2-6 mois',
      issues: ['Budget conséquent', 'Process long', 'Pas adapté aux indies']
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-violet-50/50 via-background to-purple-50/50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">💸 Comparez les prix du marché</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez combien vous économisez avec EbookStudio Pro par rapport aux alternatives traditionnelles
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {comparisons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{item.service}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Délai : {item.time}</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-red-500 line-through">{item.price}</span>
                </div>
              </div>
              <div className="space-y-2">
                {item.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* EbookStudio Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  <span className="font-bold text-xl">EbookStudio Pro</span>
                </div>
                <p className="text-white/80 mb-4">Accès à vie – Ebooks illimités</p>
                
                <div className="space-y-2">
                  {[
                    'Génération IA instantanée',
                    'Ebooks illimités à vie',
                    'Toutes les formations incluses',
                    'Support prioritaire',
                    'Mises à jour gratuites'
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center md:text-right">
                <div className="mb-2">
                  <span className="text-2xl text-white/60 line-through">97€</span>
                </div>
                <div className="text-5xl font-black text-yellow-300">37€</div>
                <p className="text-sm text-white/80 mt-2">Paiement unique</p>
                <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                  💰 Économie : <span className="font-bold">463€ minimum</span>
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
