
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import 'leaflet/dist/leaflet.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const MapModal = ({ isOpen, onClose, title = "Créer une carte interactive" }: MapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only attempt to initialize map if the modal is open and container exists
    if (!isOpen || !mapContainer.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      try {
        // Clean up any existing map instance
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }

        // Create a new map instance
        const map = L.map(mapContainer.current).setView([48.8566, 2.3522], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add a marker
        const marker = L.marker([48.8566, 2.3522]).addTo(map);
        marker.bindPopup("Paris").openPopup();

        // Enable scroll wheel zoom
        map.scrollWheelZoom.enable();

        // Store the map instance for cleanup
        mapInstance.current = map;

        // Invalidate the map size after a small delay to ensure proper rendering
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

        console.log("Map initialized successfully");
      } catch (error) {
        console.error("Failed to initialize map:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la carte. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }).catch(err => {
      console.error("Failed to load Leaflet:", err);
      toast({
        title: "Erreur",
        description: "Impossible de charger la bibliothèque de cartographie.",
        variant: "destructive",
      });
    });

    // Cleanup function to remove the map when the component unmounts or the modal closes
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        console.log("Map cleaned up");
      }
    };
  }, [isOpen, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Explorez et interagissez avec la carte ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[60vh]">
          <div 
            ref={mapContainer} 
            className="absolute inset-0 rounded-lg" 
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
