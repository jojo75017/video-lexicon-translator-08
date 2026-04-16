import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getSessionExpiry = () => {
  const stored = sessionStorage.getItem('offer_expiry');
  if (stored) return parseInt(stored, 10);
  const expiry = Date.now() + 2.5 * 60 * 60 * 1000;
  sessionStorage.setItem('offer_expiry', String(expiry));
  return expiry;
};

const CountdownTimer = () => {
  const [expiry] = useState(getSessionExpiry);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, expiry - Date.now());
      if (diff === 0) { setExpired(true); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiry]);

  const totalSeconds = timeLeft.h * 3600 + timeLeft.m * 60 + timeLeft.s;
  const isUrgent = totalSeconds < 1800;

  if (expired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 ${
        isUrgent
          ? 'bg-destructive/10 border-destructive/30'
          : 'bg-card border-primary/30'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className={`w-5 h-5 ${isUrgent ? 'text-destructive' : 'text-primary'} animate-pulse`} />
          <span className="font-bold text-foreground text-sm">Votre offre expire dans</span>
        </div>
        <Badge className={`${isUrgent ? 'bg-destructive text-destructive-foreground' : 'bg-primary/10 text-primary border-primary/30'} font-bold`}>
          {isUrgent ? '⏰ DERNIÈRE CHANCE' : 'OFFRE LIMITÉE'}
        </Badge>
      </div>

      <div className="flex items-center justify-center gap-3">
        {[
          { value: timeLeft.h, label: 'heures' },
          { value: timeLeft.m, label: 'min' },
          { value: timeLeft.s, label: 'sec' },
        ].map((unit, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`text-center px-4 py-3 rounded-xl ${
              isUrgent ? 'bg-destructive/10' : 'bg-muted/80'
            }`}>
              <motion.span
                key={unit.value}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-3xl font-black tabular-nums block ${
                  isUrgent ? 'text-destructive' : 'text-foreground'
                }`}
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
              <span className="text-[10px] text-foreground/50 uppercase tracking-wider">{unit.label}</span>
            </div>
            {i < 2 && <span className={`text-2xl font-bold ${isUrgent ? 'text-destructive/50' : 'text-foreground/30'}`}>:</span>}
          </div>
        ))}
      </div>

      {isUrgent && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-destructive/80 text-xs mt-3 flex items-center justify-center gap-1"
        >
          <Flame className="w-3 h-3" />
          Le prix passera à 247€ après expiration
        </motion.p>
      )}
    </motion.div>
  );
};

export default CountdownTimer;
