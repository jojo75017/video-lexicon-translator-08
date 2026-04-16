import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, ArrowRight, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useVipAvailability } from '@/hooks/useVipAvailability';

const PriceComparison: React.FC = () => {
  const navigate = useNavigate();
  const { isVipAvailable } = useVipAvailability();
  const price = '67';

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

        {/* VS Separator */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <span className="text-2xl font-black text-primary bg-primary/10 px-5 py-2 rounded-full border border-primary/20">VS</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>

        {/* EbookStudio Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-primary to-accent rounded-2xl p-8 md:p-10 text-primary-foreground shadow-2xl shadow-primary/20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-kdp-orange" />
                  <span className="font-bold text-2xl">EbookStudio Pro</span>
                </div>
                <p className="text-primary-foreground/70 mb-5 text-sm">Accès à vie – Ebooks illimités – {isVipAvailable ? 'Offre Fondateur' : 'Paiement unique ou en 2×35€ / 3×25€'}</p>
                
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
                      <Check className="w-4 h-4 text-kdp-orange shrink-0" />
                      <span className="text-primary-foreground/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-3">
                <div>
                  <span className="text-xl text-primary-foreground/50 line-through">147€</span>
                </div>
                <div className="text-6xl font-black text-kdp-orange leading-none">{price}€</div>
                <p className="text-sm text-primary-foreground/70">{isVipAvailable ? 'Paiement unique' : 'Paiement unique ou en 2×35€ / 3×25€'}</p>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                  💰 Économie : <span className="font-bold text-kdp-orange">de 463€ à 9 963€</span>
                </div>

                <Button
                  onClick={handleCta}
                  size="lg"
                  className="mt-3 bg-kdp-orange hover:bg-kdp-orange/90 text-foreground font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-kdp-orange/30 transition-all hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Obtenir l'accès à {price}€
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="flex items-center gap-2 text-xs text-primary-foreground/60 mt-1">
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
