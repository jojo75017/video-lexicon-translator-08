
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Share2 } from "lucide-react";
import { toast } from "sonner";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MapModal: React.FC<MapModalProps> = ({ open, onOpenChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const [address, setAddress] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [showIframeCode, setShowIframeCode] = useState(false);

  // Initialize the map when the component is mounted and modal is open
  useEffect(() => {
    if (!open || !mapRef.current) return;

    // Check if map is already initialized
    if (!leafletMapRef.current) {
      console.log("Initializing map");
      // Initialize map
      const map = L.map(mapRef.current).setView([48.8566, 2.3522], 13);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Initialize draw control
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      // @ts-ignore - Type definition issues with leaflet-draw
      const drawControl = new L.Control.Draw({
        draw: {
          marker: {},
          polyline: {},
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: "<strong>Erreur:</strong> Les polygones ne peuvent pas s'intersecter!"
            },
            shapeOptions: {
              color: '#97009c'
            }
          },
          rectangle: {
            shapeOptions: {
              color: '#0000ff'
            }
          },
          circle: {
            shapeOptions: {
              color: '#662d91'
            }
          }
        },
        edit: {
          featureGroup: drawnItems
        }
      });

      map.addControl(drawControl);
      
      // @ts-ignore - Type definition issues with leaflet-draw
      map.on(L.Draw.Event.CREATED, function (e) {
        const layer = e.layer;
        drawnItems.addLayer(layer);
        generateIframeCode(map.getCenter(), map.getZoom());
      });

      leafletMapRef.current = map;

      // Generate initial iframe code
      generateIframeCode(map.getCenter(), map.getZoom());
    } else {
      // If map already exists, just invalidate size to handle container resizing
      leafletMapRef.current.invalidateSize();
    }

    // Cleanup function to run when component unmounts
    return () => {
      if (leafletMapRef.current && !open) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [open]);

  const searchAddress = async () => {
    if (!address.trim() || !leafletMapRef.current) return;

    console.log("Searching for address:", address);
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      console.log("Search results:", data);

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latLng = L.latLng(parseFloat(lat), parseFloat(lon));
        leafletMapRef.current.setView(latLng, 16);
        
        // Clear existing markers
        leafletMapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            leafletMapRef.current?.removeLayer(layer);
          }
        });
        
        // Add new marker
        L.marker(latLng).addTo(leafletMapRef.current);
        
        generateIframeCode(latLng, 16);
        toast.success(`Adresse trouvée: ${data[0].display_name}`);
      } else {
        toast.error("Adresse non trouvée");
      }
    } catch (error) {
      console.error("Error searching address:", error);
      toast.error("Erreur lors de la recherche");
    }
  };

  const generateIframeCode = (center: L.LatLng, zoom: number) => {
    const iframeHtml = `<iframe 
      width="100%" 
      height="400" 
      frameborder="0" 
      scrolling="no" 
      marginheight="0" 
      marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.01}%2C${center.lat - 0.01}%2C${center.lng + 0.01}%2C${center.lat + 0.01}&amp;layer=mapnik&amp;marker=${center.lat}%2C${center.lng}" 
      style="border: 1px solid black">
    </iframe>`;
    setIframeCode(iframeHtml);
  };

  const copyIframeCode = () => {
    navigator.clipboard.writeText(iframeCode);
    toast.success("Code d'intégration copié !");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carte Locale SEO</DialogTitle>
          <DialogDescription>
            Recherchez une adresse ou un lieu pour créer une carte personnalisée
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 flex items-center space-x-2">
          <Input
            placeholder="Rechercher une adresse..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={searchAddress} variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
        
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-md border mb-4"
        ></div>
        
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Code d'intégration</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowIframeCode(!showIframeCode)}
          >
            {showIframeCode ? 'Masquer' : 'Afficher'}
          </Button>
        </div>
        
        {showIframeCode && (
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {iframeCode}
            </pre>
            <Button 
              className="absolute top-2 right-2" 
              size="sm" 
              onClick={copyIframeCode}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copier
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
