import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, Clock, ArrowRight, X } from 'lucide-react';

interface StickyCtaBarProps {
  price?: string;
  originalPrice?: string;
  spotsLeft?: number;
  totalSpots?: number;
  onCtaClick?: () => void;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({
  price = '37',
  originalPrice = '97',
  spotsLeft = 39,
  totalSpots = 50,
  onCtaClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      const shouldShow = window.scrollY > 500 && !isDismissed;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const progressPercentage = ((totalSpots - spotsLeft) / totalSpots) * 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-violet-500/30 shadow-2xl shadow-black/50"
        >
          {/* Progress bar at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: Offer info */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] font-bold">
                    2026
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                    🔥 OFFRE LIMITÉE
                  </Badge>
                  <span className="text-white/60 text-sm hidden sm:inline">
                    Plus que <strong className="text-amber-400">{spotsLeft} places</strong> à ce prix
                  </span>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{price}€</span>
                  <span className="text-lg text-white/40 line-through">{originalPrice}€</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    -62%
                  </Badge>
                </div>
              </div>

              {/* Center: Trust badges */}
              <div className="hidden lg:flex items-center gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Garantie 30 jours
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Accès instantané
                </span>
              </div>

              {/* Right: CTA Button */}
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25 whitespace-nowrap"
                  onClick={handleCtaClick}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Accès à Vie</span>
                  <span className="sm:hidden">Acheter</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <button
                  onClick={handleDismiss}
                  className="p-2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCtaBar;
