import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Users, ShieldCheck, Zap, Clock } from 'lucide-react';

const messages = [
  { icon: Flame, text: "3 personnes ont acheté dans la dernière heure", color: "text-orange-400" },
  { icon: TrendingUp, text: "Le prix augmentera bientôt à 147€", color: "text-amber-400" },
  { icon: Users, text: "Rejoignez +5000 auteurs satisfaits", color: "text-emerald-400" },
  { icon: ShieldCheck, text: "Garantie 30 jours — 0 risque pour vous", color: "text-cyan-400" },
  { icon: Zap, text: "Votre 1er ebook publié ce soir sur Amazon", color: "text-violet-400" },
  { icon: Clock, text: "Places Fondateur limitées — ne tardez pas", color: "text-red-400" },
];

export const UrgencyBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = messages[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-slate-900/90 border-y border-amber-500/20 py-2.5 overflow-hidden">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center justify-center gap-2 text-sm"
      >
        <Icon className={`w-4 h-4 ${current.color}`} />
        <span className="text-white/80 font-medium">{current.text}</span>
      </motion.div>
    </div>
  );
};

export default UrgencyBanner;
