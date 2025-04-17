
import React from 'react';
import { Button } from '@/components/ui/button';
import { PinterestPin } from '@/types/pinterest';

interface PinHistoryPanelProps {
  pinHistory: PinterestPin[];
  onRestore: (pin: PinterestPin) => void;
}

const PinHistoryPanel: React.FC<PinHistoryPanelProps> = ({
  pinHistory,
  onRestore,
}) => {
  if (pinHistory.length === 0) {
    return <p className="text-gray-500">Aucun pin dans l'historique</p>;
  }

  return (
    <div className="space-y-2">
      {pinHistory.map((historicPin, index) => (
        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
          <span className="truncate">{historicPin.title}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRestore(historicPin)}
          >
            Restaurer
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PinHistoryPanel;
