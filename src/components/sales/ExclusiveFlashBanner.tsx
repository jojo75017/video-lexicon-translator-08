import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Diamond, AlertTriangle, ArrowDown } from 'lucide-react';

export const ExclusiveFlashBanner: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mx-4 sm:mx-auto max-w-4xl my-10"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-kdp-orange/30 via-kdp-orange/20 to-destructive/20 rounded-2xl blur-xl" />
      
      <div className="relative bg-gradient-to-br from-card via-secondary to-card border border-kdp-orange/40 rounded-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-kdp-orange via-kdp-orange/80 to-destructive animate-pulse" />
        
        <div className="px-6 sm:px-10 py-8 sm:py-10">
          <div className="flex items-center justify-center gap-2 mb-5">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-6 h-6 text-primary fill-primary drop-shadow-sm" />
            </motion.div>
            <span className="bg-primary text-primary-foreground font-extrabold text-xs sm:text-sm tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
              ⚡ Flash Exclusif
            </span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-6 h-6 text-primary fill-primary drop-shadow-sm" />
            </motion.div>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center leading-tight mb-4">
            <span className="text-foreground drop-shadow-sm">Ce que vous allez découvrir ici,</span>
            <br />
            <span className="text-primary drop-shadow-sm">
              vous ne le trouverez nulle part ailleurs à ce prix.
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: Diamond,
                title: "Suite IA Complète",
                desc: "Rédaction, couvertures, audiobooks — tout en un seul outil",
              },
              {
                icon: AlertTriangle,
                title: "Prix Introuvable",
                desc: "67€ à vie au lieu de 500-2000€ chez les concurrents",
              },
              {
                icon: Zap,
                title: "Résultats ce soir",
                desc: "Votre 1er ebook publié sur Amazon en moins d'1h",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-card/80 border-border border rounded-xl p-4 text-center backdrop-blur-sm"
              >
                <item.icon className="w-7 h-7 text-primary mx-auto mb-2" />
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-muted-foreground text-xs mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex justify-center mt-6"
          >
            <ArrowDown className="w-5 h-5 text-primary/70" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ExclusiveFlashBanner;
