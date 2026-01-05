import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DemoBannerProps {
  plansGenerated: number;
  maxPlans: number;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ plansGenerated, maxPlans }) => {
  const navigate = useNavigate();
  const remaining = maxPlans - plansGenerated;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-4 mb-4 relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />
      
      <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </motion.div>
          <div>
            <p className="font-medium text-foreground">
              🎁 Mode Démo Gratuit
            </p>
            <p className="text-sm text-muted-foreground">
              {remaining > 0 
                ? `${remaining} plan${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''} • Chapitres bloqués`
                : 'Limite atteinte • Passez à la version complète'
              }
            </p>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            size="sm"
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25"
            onClick={() => navigate('/offres')}
          >
            Débloquer tout <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
