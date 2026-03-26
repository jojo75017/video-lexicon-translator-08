import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVipAvailability } from '@/hooks/useVipAvailability';

export const FloatingMobileCta: React.FC = () => {
  const navigate = useNavigate();
  const { isVipAvailable } = useVipAvailability();
  const [isVisible, setIsVisible] = useState(false);

  const price = isVipAvailable ? '37' : '67';

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (isVipAvailable) {
      navigate('/paiement-manuel');
    } else {
      navigate('/upsell-paiement?plan=pro');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          onClick={handleClick}
          className="fixed bottom-6 right-4 z-[60] lg:hidden flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold shadow-2xl shadow-violet-500/40 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4" />
          <span>{price}€ – Accès à vie</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingMobileCta;
