
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
  const handleResetPin = () => {
    console.log("Réinitialisation du pin");
    resetPin();
    toast.success("Pin réinitialisé avec succès");
  };

  const handleToggleHistory = () => {
    console.log("Toggle historique:", !historyVisible);
    setHistoryVisible(!historyVisible);
    toast.info(historyVisible ? "Historique masqué" : "Historique affiché");
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleResetPin}
          type="button"
        >
          Réinitialiser
        </Button>
        <Button 
          variant="outline" 
          onClick={handleToggleHistory}
          type="button"
        >
          {historyVisible ? 'Masquer l\'historique' : 'Voir l\'historique'}
        </Button>
      </div>
    </div>
  );
};

export default PinterestActions;
