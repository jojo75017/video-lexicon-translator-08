import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shield, Clock, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVipAvailability } from '@/hooks/useVipAvailability';

interface StickyCtaBarProps {
  onCtaClick?: () => void;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({ onCtaClick }) => {
  const navigate = useNavigate();
  const { isVipAvailable, daysRemaining } = useVipAvailability();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Tarif unique affiché partout
  const price = '67';
  const originalPrice = '147';
  const discount = '-54%';
  const daysLeft = daysRemaining ?? 0;

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
      // Rediriger vers le bon paiement selon disponibilité VIP
      if (isVipAvailable) {
        navigate('/paiement-manuel');
      } else {
        navigate('/upsell-paiement?plan=pro');
      }
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const progressPercentage = isVipAvailable 
    ? ((60 - daysLeft) / 60) * 100 
    : 100;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-card via-card to-card border-t border-primary/30 shadow-2xl shadow-primary/10"
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
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-foreground border-0 text-[10px] font-bold">
                    2026
                  </Badge>
                  {isVipAvailable ? (
                    <>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                        🔥 OFFRE FONDATEUR
                      </Badge>
                      <span className="text-foreground/60 text-sm hidden sm:inline">
                        Plus que <strong className="text-amber-400">{daysLeft} jours</strong> à 67€
                      </span>
                    </>
                  ) : (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      ⭐ OFFRE SPÉCIALE
                    </Badge>
                  )}
                </div>
                
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{price}€</span>
                  <span className="text-lg text-foreground/40 line-through">{originalPrice}€</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    {discount}
                  </Badge>
                </div>
              </div>

              {/* Center: Trust badges */}
              <div className="hidden lg:flex items-center gap-4 text-xs text-foreground/60">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Garantie 30 jours
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Accès à vie
                </span>
              </div>

              {/* Right: CTA Button */}
              <div className="flex items-center gap-2">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-violet-500 hover:to-purple-500 text-foreground shadow-lg shadow-primary/25 whitespace-nowrap"
                  onClick={handleCtaClick}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Accès à Vie – {price}€</span>
                  <span className="sm:hidden">{price}€</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <button
                  onClick={handleDismiss}
                  className="p-2 text-foreground/40 hover:text-foreground/80 transition-colors"
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
