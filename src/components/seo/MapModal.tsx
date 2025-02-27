
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
  const leafletLoaded = useRef<boolean>(false);

  useEffect(() => {
    // Only initialize map when modal is open and container exists
    if (!isOpen || !mapContainer.current) return;

    const initializeMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        leafletLoaded.current = true;
        
        // Clean up existing map
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }

        // Fix Leaflet icon issue
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        console.log("Creating map in element:", mapContainer.current);
        
        // Create map with a short delay to ensure DOM is ready
        setTimeout(() => {
          // Create map instance
          const map = L.map(mapContainer.current).setView([48.8566, 2.3522], 13);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Add a marker
          const marker = L.marker([48.8566, 2.3522]).addTo(map);
          marker.bindPopup("Paris").openPopup();
          
          // Enable scroll zoom
          map.scrollWheelZoom.enable();
          
          // Store map instance for cleanup
          mapInstance.current = map;
          
          // Force a redraw after the modal is fully visible
          setTimeout(() => {
            map.invalidateSize(true);
            console.log("Map size invalidated");
          }, 250);
          
          console.log("Map initialized successfully");
        }, 100);
      } catch (error) {
        console.error("Failed to initialize map:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la carte. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        console.log("Map cleaned up");
      }
    };
  }, [isOpen, toast]);

  // Handle window resize to fix map size
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) {
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
        <div className="relative w-full h-[60vh] bg-gray-100 rounded-lg">
          <div 
            ref={mapContainer} 
            className="absolute inset-0 rounded-lg z-10" 
            style={{ width: '100%', height: '100%' }}
          />
          {!leafletLoaded.current && isOpen && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
