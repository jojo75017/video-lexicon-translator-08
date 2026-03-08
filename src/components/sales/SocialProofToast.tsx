import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const BUYERS = [
  { name: 'Marie D.', city: 'Lyon' },
  { name: 'Thomas L.', city: 'Paris' },
  { name: 'Sophie R.', city: 'Bordeaux' },
  { name: 'Nicolas F.', city: 'Marseille' },
  { name: 'Julie M.', city: 'Toulouse' },
  { name: 'Antoine B.', city: 'Lille' },
  { name: 'Camille P.', city: 'Nantes' },
  { name: 'Lucas G.', city: 'Strasbourg' },
  { name: 'Emma V.', city: 'Montpellier' },
  { name: 'Hugo D.', city: 'Rennes' },
  { name: 'Clara S.', city: 'Nice' },
  { name: 'Pierre J.', city: 'Grenoble' },
  { name: 'Léa T.', city: 'Dijon' },
  { name: 'Maxime R.', city: 'Bruxelles' },
  { name: 'Sarah K.', city: 'Genève' },
];

const getRandomMinutes = () => Math.floor(Math.random() * 55) + 2;

const SocialProofToast = () => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({ name: '', city: '', minutes: 0 });

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const showToast = () => {
      const buyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
      setCurrent({ name: buyer.name, city: buyer.city, minutes: getRandomMinutes() });
      setVisible(true);

      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), 6500);
    };

    const firstTimer = setTimeout(showToast, 2500);
    const interval = setInterval(showToast, 22000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -90, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -90, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 230 }}
          className="fixed bottom-24 md:bottom-6 left-4 z-[80] max-w-xs"
        >
          <div className="flex items-center gap-3 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-foreground font-semibold">
                {current.name} <span className="text-muted-foreground font-normal">de {current.city}</span>
              </p>
              <p className="text-xs text-primary">
                A rejoint les Fondateurs il y a {current.minutes} min
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProofToast;
