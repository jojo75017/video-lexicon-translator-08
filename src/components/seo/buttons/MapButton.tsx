
import React from 'react';
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";

export const MapButton = () => {
  return (
    <Button variant="default" className="h-28 w-full flex flex-col gap-2 items-center justify-center">
      <Map className="h-8 w-8" />
      <div className="text-sm font-medium">Carte</div>
    </Button>
  );
};

