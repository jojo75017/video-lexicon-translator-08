
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import MapModal from '../MapModal';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";

const MapButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenMap = () => {
    console.log("Ouverture de la carte interactive");
    setIsOpen(true);
    toast.info(t("map.openSuccess", "Carte interactive ouverte. Vous pouvez ajouter des marqueurs et personnaliser votre carte."));
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
          <h3 className="font-semibold mb-2">{t("map.interactiveMap", "Carte interactive")}</h3>
          <p className="text-sm text-gray-600">{t("map.description", "Créez une carte personnalisée avec des marqueurs et des points d'intérêt")}</p>
        </div>
      </Button>

      <MapModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

export default MapButton;
