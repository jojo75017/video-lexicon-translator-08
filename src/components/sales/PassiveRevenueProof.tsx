import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Zap } from 'lucide-react';
import kdpProof from '@/assets/kdp-proof-revenue.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const PassiveRevenueProof: React.FC = () => {
  return (
    <section className="py-14 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-green-500/8 to-transparent pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Revenus passifs réels
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            💰 Je ne m'en occupe pas…{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
              et ça tombe.
            </span>
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Capture réelle de mon tableau de bord Amazon KDP — les redevances arrivent chaque mois, sans effort supplémentaire.
          </p>
        </motion.div>

        {/* Screenshot */}
        <motion.div variants={fadeUp} custom={1} className="mb-8">
          <div className="rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 bg-card">
            <img
              src={kdpProof}
              alt="Tableau de bord Amazon KDP montrant les revenus passifs — graphique des redevances sur 30 jours et livres les plus rémunérateurs"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
          <p className="text-xs text-muted-foreground/60 text-center mt-2 italic">
            📊 Capture d'écran non retouchée — Février 2026
          </p>
        </motion.div>

        {/* Key points */}
        <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { icon: DollarSign, label: 'Redevances automatiques', desc: 'Amazon verse chaque mois' },
            { icon: Zap, label: 'Zéro effort après publication', desc: 'Le livre travaille pour vous' },
            { icon: TrendingUp, label: 'Revenus récurrents', desc: 'Chaque livre = un actif' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <item.icon className="w-5 h-5 text-emerald-500" />
              <span className="font-semibold text-sm">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PassiveRevenueProof;
