import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DemoBannerProps {
  plansGenerated: number;
  maxPlans: number;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ plansGenerated, maxPlans }) => {
  const navigate = useNavigate();
  const remaining = maxPlans - plansGenerated;

  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
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
        <Button 
          size="sm"
          className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white"
          onClick={() => navigate('/offres')}
        >
          Débloquer tout <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
