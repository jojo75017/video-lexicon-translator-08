
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Fix Leaflet icon issue outside of component
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapModal = ({ isOpen, onClose, title = "Créer une carte interactive" }: MapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { toast } = useToast();
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Initialize map when the modal is open and visible
  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    // Add a significant delay to ensure the modal is fully rendered
    const timer = setTimeout(() => {
      try {
        console.log("Initializing map after delay, container exists:", !!mapContainer.current);
        
        // Clean up existing map if it exists
        if (mapInstance.current) {
          console.log("Removing existing map");
          mapInstance.current.remove();
          mapInstance.current = null;
        }
        
        if (!mapContainer.current) {
          console.error("Map container ref is null after delay");
          return;
        }
        
        // Create map instance with explicit dimensions
        const mapContainerElement = mapContainer.current;
        console.log("Map container dimensions:", mapContainerElement.clientWidth, "x", mapContainerElement.clientHeight);
        
        const map = L.map(mapContainerElement, {
          center: [48.8566, 2.3522],
          zoom: 13,
          scrollWheelZoom: true,
        });
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add a marker
        L.marker([48.8566, 2.3522])
          .addTo(map)
          .bindPopup("Paris")
          .openPopup();
        
        // Store map instance for cleanup
        mapInstance.current = map;
        setIsMapInitialized(true);
        
        // Force a redraw after everything is set up
        map.invalidateSize(true);
        console.log("Map initialized successfully");
      } catch (error) {
        console.error("Failed to initialize map:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la carte. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }, 500); // Increased delay to 500ms to ensure DOM is ready
    
    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        console.log("Cleaning up map on unmount");
        mapInstance.current.remove();
        mapInstance.current = null;
        setIsMapInitialized(false);
      }
    };
  }, [isOpen, toast]);

  // Additional handler for when dialog content becomes visible
  useEffect(() => {
    if (isOpen && mapInstance.current) {
      // Add a delay to ensure the modal transition is complete
      const timer = setTimeout(() => {
        if (mapInstance.current) {
          console.log("Invalidating map size after modal transition");
          mapInstance.current.invalidateSize(true);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) {
        console.log("Invalidating map size due to window resize");
        mapInstance.current.invalidateSize(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Explorez et interagissez avec la carte ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
          <div 
            ref={mapContainer} 
            className="absolute inset-0 rounded-lg z-10" 
            id="map-container"
            style={{ width: '100%', height: '100%' }}
          />
          {!isMapInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
