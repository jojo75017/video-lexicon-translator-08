
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import MapModal from '../MapModal';
import { toast } from 'sonner';

const MapButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMap = () => {
    try {
      console.log("Ouverture de la carte");
      setIsOpen(true);
    } catch (error) {
      console.error("Erreur lors de l'ouverture de la carte:", error);
      toast.error("Impossible d'ouvrir la carte. Veuillez réessayer.");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="p-6 h-auto flex flex-col items-center gap-4 text-center"
        onClick={handleOpenMap}
      >
        <MapIcon className="h-8 w-8" />
        <div>
          <h3 className="font-semibold mb-2">Carte interactive</h3>
          <p className="text-sm text-gray-600">Créez une carte personnalisée pour visualiser vos données</p>
        </div>
      </Button>

      <MapModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default MapButton;
