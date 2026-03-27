import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FloatingMobileCTA: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-border px-4 py-3 safe-bottom"
        >
          <Button
            onClick={() => navigate('/upsell-paiement?plan=pro')}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6 rounded-xl shadow-lg shadow-primary/25"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Accéder — 67€ à vie
          </Button>
          <div className="flex items-center justify-center gap-2 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-muted-foreground text-xs">Garantie 30 jours · Paiement sécurisé</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingMobileCTA;