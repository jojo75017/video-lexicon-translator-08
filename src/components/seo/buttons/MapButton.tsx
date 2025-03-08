
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import MapModal from '../MapModal';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";

const MapButton = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true); // Désactivé par défaut

  const handleOpenMap = () => {
    if (isDisabled) {
      toast.error("Cette fonctionnalité est temporairement désactivée.");
      return;
    }
    
    console.log("Opening interactive map");
    setIsOpen(true);
    toast.info(t("map.openSuccess"));
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex flex-col items-center gap-2 h-auto py-2 px-2 text-center hover:bg-blue-50"
        onClick={handleOpenMap}
        disabled={isDisabled}
      >
        <MapIcon className="h-5 w-5 text-blue-600" />
        <span className="text-xs">{t("map.interactiveMap")}</span>
      </Button>

      {!isDisabled && (
        <MapModal 
          open={isOpen} 
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
};

export default MapButton;
