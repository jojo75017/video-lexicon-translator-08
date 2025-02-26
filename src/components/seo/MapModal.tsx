
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const MapModal = ({ isOpen, onClose, title = "Créer une carte interactive" }: MapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");

  useEffect(() => {
    if (!mapContainer.current || !isOpen || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: 1.5,
        center: [2.3522, 48.8566], // Paris
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.scrollZoom.disable();

      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error("Erreur lors de l'initialisation de la carte. Vérifiez votre token Mapbox.");
    }
  }, [isOpen, mapboxToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      toast.success("Token Mapbox configuré");
    } else {
      toast.error("Veuillez entrer un token Mapbox valide");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        {!mapboxToken ? (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Pour utiliser la carte, vous devez fournir votre token public Mapbox.
                Vous pouvez le trouver sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">votre compte Mapbox</a>.
              </p>
              <Input
                type="text"
                placeholder="Entrez votre token public Mapbox..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit">Configurer la carte</Button>
          </form>
        ) : (
          <div className="relative w-full h-[60vh]">
            <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
