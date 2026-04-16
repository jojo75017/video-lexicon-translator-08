import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, TrendingUp, Users, ShieldCheck, Zap, Clock } from 'lucide-react';

const messages = [
  { icon: Flame, text: "3 personnes ont acheté dans la dernière heure", color: "text-kdp-orange" },
  { icon: TrendingUp, text: "Le prix passera à 147€ le 1er juillet", color: "text-kdp-orange" },
  { icon: Users, text: "Rejoignez +5000 auteurs satisfaits", color: "text-primary" },
  { icon: ShieldCheck, text: "Garantie 30 jours — 0 risque pour vous", color: "text-primary" },
  { icon: Zap, text: "Votre 1er ebook publié ce soir sur Amazon", color: "text-primary" },
  { icon: Clock, text: "Places Fondateur limitées — ne tardez pas", color: "text-destructive" },
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
    <div className="bg-secondary border-y border-kdp-orange/20 py-2.5 overflow-hidden">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center justify-center gap-2 text-sm"
      >
        <Icon className={`w-4 h-4 ${current.color}`} />
        <span className="text-foreground/80 font-medium">{current.text}</span>
      </motion.div>
    </div>
  );
};

export default UrgencyBanner;
