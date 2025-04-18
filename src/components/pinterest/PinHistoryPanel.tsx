
import React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PinterestPin } from '@/types/pinterest';
import { usePinHistory } from '@/hooks/usePinHistory';

interface PinHistoryPanelProps {
  selectedPin: PinterestPin;
  onSelect: (pin: PinterestPin) => void;
}

const PinHistoryPanel: React.FC<PinHistoryPanelProps> = ({ selectedPin, onSelect }) => {
  const { history, addPin, removePin, clearHistory } = usePinHistory();
  const { toast } = useToast();

  // Sauvegarder le pin actuel dans l'historique
  useEffect(() => {
    // Cette fonction est appelée chaque fois que selectedPin change
    // Pour éviter des ajouts inutiles, on pourrait ajouter une logique de vérification ici
  }, [selectedPin]);

  const handleSaveCurrent = () => {
    if (!selectedPin.image && !selectedPin.uploadedImage) {
      toast({
        title: "Impossible de sauvegarder",
        description: "Veuillez d'abord sélectionner une image pour ce pin",
        variant: "destructive",
      });
      return;
    }
    
    addPin(selectedPin);
    toast({
      title: "Pin sauvegardé",
      description: "Le pin a été ajouté à votre historique",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "Historique effacé",
      description: "Tous les pins ont été supprimés de l'historique",
    });
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Historique des Pins</h3>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleSaveCurrent}>
              Sauvegarder ce pin
            </Button>
            <Button variant="destructive" size="sm" onClick={handleClearHistory}>
              Effacer
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Aucun pin dans l'historique
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((pin, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => onSelect(pin)}
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {pin.uploadedImage ? (
                      <img 
                        src={pin.uploadedImage} 
                        alt={pin.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : pin.image ? (
                      <img 
                        src={pin.image.url} 
                        alt={pin.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{pin.title}</h4>
                    <p className="text-xs text-gray-500 truncate">{pin.description.substring(0, 60)}...</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePin(index);
                      toast({
                        title: "Pin supprimé",
                        description: "Le pin a été retiré de l'historique",
                      });
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PinHistoryPanel;
