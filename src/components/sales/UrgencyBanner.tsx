import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck, Zap, Clock, CreditCard, Sparkles, Gift, Hourglass } from 'lucide-react';

// Messages 100% factuels - aucun chiffre fictif (conformité DGCCRF + règle projet "no fake data")
const messages = [
  { icon: Gift, text: "Programme de parrainage — à votre succès ! Lancement officiel le 1er juillet", color: "text-[#232F3E]" },
  { icon: Hourglass, text: "Parrainage : ouverture le 1er juillet — préparez vos contacts", color: "text-[#232F3E]" },
  { icon: Clock, text: "Coaching VIP : 67€ au lieu de 197€ jusqu'au 15 juin", color: "text-[#232F3E]" },
  { icon: TrendingUp, text: "Ebookstudio Pro V2 : 67€ à vie, paiement unique", color: "text-[#232F3E]" },
  { icon: ShieldCheck, text: "Garantie 30 jours - remboursé sans question", color: "text-[#232F3E]" },
  { icon: CreditCard, text: "Paiement unique 67€ - pas d'abonnement", color: "text-[#232F3E]" },
  { icon: Zap, text: "Accès immédiat après paiement", color: "text-[#232F3E]" },
  { icon: Sparkles, text: "15 agents IA pour écrire ton ebook KDP", color: "text-[#232F3E]" },
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
    <div className="bg-[#FF9E2D] border-y border-[#FF9E2D]/30 py-2.5 overflow-hidden">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center justify-center gap-2 text-sm"
      >
        <Icon className={`w-4 h-4 ${current.color}`} />
        <span className="text-[#232F3E] font-semibold">{current.text}</span>
      </motion.div>
    </div>
  );
};

export default UrgencyBanner;
