
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
    console.log("Opening interactive map");
    setIsOpen(true);
    toast.info(t("map.openSuccess"));
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
          <h3 className="font-semibold mb-2">{t("map.interactiveMap")}</h3>
          <p className="text-sm text-gray-600">{t("map.description")}</p>
        </div>
      </Button>

      <MapModal 
        open={isOpen} 
        onOpenChange={setIsOpen}
      />
    </>
  );
};

export default MapButton;
