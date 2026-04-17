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
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/8 to-transparent pointer-events-none" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="max-w-5xl mx-auto relative"
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Revenus passifs réels
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Ils génèrent des{" "}
            <span className="text-primary">
              revenus passifs sur Amazon KDP
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Capture réelle d'un dashboard KDP — preuve que la méthode fonctionne.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} custom={1}>
          <div className="rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 bg-card">
            <img
              src={kdpProof}
              alt="Dashboard Amazon KDP — revenus passifs réels"
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: DollarSign, label: "Revenus mensuels", desc: "Royalties Amazon KDP en automatique" },
            { icon: Zap, label: "Sans publicité payante", desc: "Trafic organique optimisé SEO KDP" },
            { icon: TrendingUp, label: "Croissance constante", desc: "Effet boule de neige sur 12 mois" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <item.icon className="w-5 h-5 text-primary" />
              <div className="text-center">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PassiveRevenueProof;
