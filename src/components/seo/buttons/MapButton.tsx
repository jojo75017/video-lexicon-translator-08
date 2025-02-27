
import React from 'react';
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

interface MapButtonProps {
  onClick?: () => void;
}

export const MapButton: React.FC<MapButtonProps> = ({ onClick }) => {
  return (
    <Button 
      variant="default" 
      className="h-28 w-full flex flex-col gap-2 items-center justify-center"
      onClick={onClick}
    >
      <Map className="h-8 w-8" />
      <div className="text-sm font-medium">Carte</div>
    </Button>
  );
};
