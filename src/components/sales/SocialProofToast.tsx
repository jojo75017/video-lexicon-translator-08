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
    // First show after 8-15s
    const firstDelay = 8000 + Math.random() * 7000;
    
    const showToast = () => {
      const buyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
      setCurrent({ name: buyer.name, city: buyer.city, minutes: getRandomMinutes() });
      setVisible(true);
      
      // Hide after 5s
      setTimeout(() => setVisible(false), 5000);
    };

    const firstTimer = setTimeout(() => {
      showToast();
      // Then show every 30-60s
      const interval = setInterval(showToast, 30000 + Math.random() * 30000);
      return () => clearInterval(interval);
    }, firstDelay);

    return () => clearTimeout(firstTimer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-xs"
        >
          <div className="flex items-center gap-3 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl shadow-emerald-500/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-sm text-white font-semibold">
                {current.name} <span className="text-white/50 font-normal">de {current.city}</span>
              </p>
              <p className="text-xs text-emerald-400">
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
