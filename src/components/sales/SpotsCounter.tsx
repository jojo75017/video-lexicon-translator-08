import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Users, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const TOTAL_SPOTS = 50;
// Simulated spots taken — seeded from date to be consistent per day
const getSpotsLeft = () => {
  const dayOfYear = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / 86400000);
  const base = Math.min(42, 28 + Math.floor(dayOfYear * 0.21));
  return TOTAL_SPOTS - base;
};

const SpotsCounter = () => {
  const [spotsLeft, setSpotsLeft] = useState(getSpotsLeft);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Occasionally decrease by 1 to simulate live activity
    const interval = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev <= 3) return prev;
        if (Math.random() < 0.15) {
          setFlash(true);
          setTimeout(() => setFlash(false), 1500);
          return prev - 1;
        }
        return prev;
      });
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const pctTaken = ((TOTAL_SPOTS - spotsLeft) / TOTAL_SPOTS) * 100;
  const isLow = spotsLeft <= 10;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl border p-5 ${
        isLow 
          ? 'bg-red-950/40 border-red-500/40' 
          : 'bg-amber-950/30 border-amber-500/30'
      } ${flash ? 'ring-2 ring-amber-400/50' : ''} transition-all duration-500`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${isLow ? 'text-red-400' : 'text-amber-400'} animate-pulse`} />
          <span className="font-bold text-foreground text-sm">Places Fondateur</span>
        </div>
        <Badge className={`${isLow ? 'bg-red-500 text-foreground' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'} font-bold`}>
          {isLow ? '⚠️ PRESQUE COMPLET' : 'LIMITÉ'}
        </Badge>
      </div>
      
      <div className="flex items-baseline gap-2 mb-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={spotsLeft}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className={`text-4xl font-black ${isLow ? 'text-red-400' : 'text-amber-400'}`}
          >
            {spotsLeft}
          </motion.span>
        </AnimatePresence>
        <span className="text-foreground/60 text-sm">/ {TOTAL_SPOTS} places restantes</span>
      </div>
      
      <Progress value={pctTaken} className="h-3 mb-2" />
      <p className="text-xs text-foreground/50">
        {TOTAL_SPOTS - spotsLeft} créateurs ont déjà rejoint l'offre Fondateur
      </p>
    </motion.div>
  );
};

export default SpotsCounter;
