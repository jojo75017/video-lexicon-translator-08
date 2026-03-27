import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Clock, DollarSign, Frown, Smile, ArrowRight } from 'lucide-react';

const BeforeAfterSection: React.FC = () => {
  const before = [
    { icon: Clock, text: "3-6 mois pour écrire un livre" },
    { icon: DollarSign, text: "500-2000€ en freelances & outils" },
    { icon: Frown, text: "Couverture amateur ou coûteuse" },
    { icon: X, text: "Pas d'audiobook (trop cher)" },
    { icon: X, text: "Mise en page manuelle pénible" },
    { icon: X, text: "Aucune aide SEO / mots-clés KDP" },
  ];

  const after = [
    { icon: Clock, text: "45 min pour un ebook complet" },
    { icon: DollarSign, text: "67€ une seule fois, à vie" },
    { icon: Smile, text: "Couverture pro générée par IA" },
    { icon: Check, text: "Audiobook inclus (voix Azure)" },
    { icon: Check, text: "Export DOCX/PDF prêt pour KDP" },
    { icon: Check, text: "Mots-clés & catégories optimisés" },
  ];

  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Avant vs Après <span className="text-primary">EbookStudio Pro</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comparez votre ancien process à la puissance de l'IA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <X className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-destructive">Sans EbookStudio</h3>
            </div>
            <ul className="space-y-4">
              {before.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-destructive" />
                  </div>
                  <span className="text-muted-foreground text-sm leading-relaxed">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary">Avec EbookStudio Pro</h3>
            </div>
            <ul className="space-y-4 relative z-10">
              {after.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-foreground text-sm leading-relaxed font-medium">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-muted-foreground text-sm mb-1">Passez du côté droit dès maintenant</p>
          <ArrowRight className="w-5 h-5 text-primary mx-auto animate-pulse" />
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;