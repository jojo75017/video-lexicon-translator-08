
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PinterestActionsProps {
  resetPin: () => void;
  historyVisible: boolean;
  setHistoryVisible: (visible: boolean) => void;
}

const PinterestActions: React.FC<PinterestActionsProps> = ({
  resetPin,
  historyVisible,
  setHistoryVisible
}) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            console.log("Réinitialisation du pin");
            resetPin();
            toast.success("Pin réinitialisé avec succès");
          }}
        >
          Réinitialiser
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            console.log("Toggle historique:", !historyVisible);
            setHistoryVisible(!historyVisible);
            toast.info(historyVisible ? "Historique masqué" : "Historique affiché");
          }}
        >
          {historyVisible ? 'Masquer l\'historique' : 'Voir l\'historique'}
        </Button>
      </div>
    </div>
  );
};

export default PinterestActions;
