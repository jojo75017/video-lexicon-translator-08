import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap, Clock, CreditCard, Sparkles } from 'lucide-react';

// Messages 100% factuels — aucun chiffre fictif (conformité DGCCRF + règle projet "no fake data")
const messages = [
  { icon: Clock, text: "Pont de l'Ascension : −30€ jusqu'au lundi 18 mai 23h59", color: "text-kdp-orange" },
  { icon: TrendingUp, text: "Le prix passe à 97€ le mardi 19 mai", color: "text-kdp-orange" },
  { icon: ShieldCheck, text: "Garantie 30 jours — remboursé sans question", color: "text-primary" },
  { icon: CreditCard, text: "Paiement unique 67€ — pas d'abonnement", color: "text-primary" },
  { icon: Zap, text: "Accès immédiat après paiement", color: "text-primary" },
  { icon: Sparkles, text: "15 agents IA pour écrire ton ebook KDP", color: "text-primary" },
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
