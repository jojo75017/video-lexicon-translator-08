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
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-red-500/30 rounded-2xl blur-xl" />
      
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-500/40 rounded-2xl overflow-hidden">
        {/* Animated top stripe */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 animate-pulse" />
        
        <div className="px-6 sm:px-10 py-8 sm:py-10">
          {/* Flash badge */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-extrabold text-xs sm:text-sm tracking-widest uppercase px-4 py-1.5 rounded-full">
              ⚡ Flash Exclusif
            </span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
            >
              <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            </motion.div>
          </div>

          {/* Main headline */}
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center leading-tight mb-4">
            <span className="text-white">Ce que vous allez découvrir ici,</span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              vous ne le trouverez nulle part ailleurs à ce prix.
            </span>
          </h3>

          {/* Sub-points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: Diamond,
                title: "Suite IA Complète",
                desc: "Rédaction, couvertures, audiobooks — tout en un seul outil",
                color: "text-cyan-400",
                border: "border-cyan-500/20",
              },
              {
                icon: AlertTriangle,
                title: "Prix Introuvable",
                desc: "67€ à vie au lieu de 500-2000€ chez les concurrents",
                color: "text-amber-400",
                border: "border-amber-500/20",
              },
              {
                icon: Zap,
                title: "Résultats ce soir",
                desc: "Votre 1er ebook publié sur Amazon en moins d'1h",
                color: "text-emerald-400",
                border: "border-emerald-500/20",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`bg-slate-800/50 ${item.border} border rounded-xl p-4 text-center`}
              >
                <item.icon className={`w-7 h-7 ${item.color} mx-auto mb-2`} />
                <p className="font-bold text-white text-sm">{item.title}</p>
                <p className="text-slate-400 text-xs mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Arrow indicator */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex justify-center mt-6"
          >
            <ArrowDown className="w-5 h-5 text-amber-400/60" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ExclusiveFlashBanner;
