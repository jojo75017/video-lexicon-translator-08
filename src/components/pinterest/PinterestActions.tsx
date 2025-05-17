
import React from 'react';
import { Button } from '@/components/ui/button';

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
        <Button variant="outline" onClick={resetPin}>
          Réinitialiser
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setHistoryVisible(!historyVisible)}
        >
          {historyVisible ? 'Masquer l\'historique' : 'Voir l\'historique'}
        </Button>
      </div>
    </div>
  );
};

export default PinterestActions;
