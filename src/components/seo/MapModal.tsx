
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Share2 } from "lucide-react";
import { toast } from "sonner";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MapModal: React.FC<MapModalProps> = ({ open, onOpenChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [address, setAddress] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [showIframeCode, setShowIframeCode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Initialiser la carte lorsque le composant est monté et que le modal est ouvert
  useEffect(() => {
    if (!open || !mapRef.current) return;

    // Nettoyage des instances précédentes si présentes
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
      markersLayerRef.current = null;
    }

    console.log("Initialisation d'une nouvelle carte");
    try {
      // Initialiser la carte
      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([48.8566, 2.3522], 4); // Vue mondiale pour débuter
      
      // Ajouter la couche de tuiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Créer une couche pour les marqueurs
      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      // Ajouter un marqueur par défaut pour Paris
      L.marker([48.8566, 2.3522]).addTo(markersLayer)
        .bindPopup("Paris, France")
        .openPopup();
      
      // Générer le code iframe initial
      generateIframeCode(map.getCenter(), map.getZoom());
      
      leafletMapRef.current = map;
      
      // Forcer un redimensionnement de la carte pour s'assurer qu'elle est visible
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
      
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
      toast.error("Erreur lors de l'initialisation de la carte");
    }

    return () => {
      // Ne pas supprimer la carte lors de la fermeture pour éviter les problèmes de ré-initialisation
    };
  }, [open]);

  const searchAddress = async () => {
    if (!address.trim()) {
      toast.error("Veuillez saisir une adresse");
      return;
    }

    if (!leafletMapRef.current || !markersLayerRef.current) {
      console.error("La carte n'est pas initialisée correctement");
      toast.error("La carte n'est pas initialisée correctement. Veuillez réessayer.");
      return;
    }

    console.log("Recherche d'adresse:", address);
    setIsSearching(true);
    toast.info(`Recherche en cours pour: ${address}`);
    
    try {
      // Utilisation du service Nominatim pour la géocodification
      const encodedAddress = encodeURIComponent(address.trim());
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur réseau: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Résultats de recherche:", data);

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        console.log(`Emplacement trouvé: ${display_name} (${latitude}, ${longitude})`);
        
        // Nettoyer tous les marqueurs existants
        if (markersLayerRef.current) {
          markersLayerRef.current.clearLayers();
        }
        
        // Ajouter un nouveau marqueur avec popup
        if (markersLayerRef.current && leafletMapRef.current) {
          const marker = L.marker([latitude, longitude]).addTo(markersLayerRef.current);
          marker.bindPopup(display_name).openPopup();
          
          // Définir la vue sur l'emplacement trouvé avec animation
          leafletMapRef.current.setView([latitude, longitude], 12, {
            animate: true,
            duration: 1
          });
          
          // Forcer un rafraîchissement de la carte
          setTimeout(() => {
            if (leafletMapRef.current) {
              leafletMapRef.current.invalidateSize();
            }
          }, 100);
          
          // Générer le nouveau code iframe
          const center = L.latLng(latitude, longitude);
          generateIframeCode(center, 12);
        }
        
        toast.success(`Emplacement trouvé: ${display_name}`);
      } else {
        console.log("Aucun résultat trouvé pour:", address);
        toast.error(`Aucun résultat trouvé pour: ${address}. Essayez d'être plus précis.`);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse:", error);
      toast.error("Erreur lors de la recherche. Veuillez réessayer.");
    } finally {
      setIsSearching(false);
    }
  };

  const generateIframeCode = (center: L.LatLng, zoom: number) => {
    console.log("Génération du code iframe pour le centre:", center, "zoom:", zoom);
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
            Recherchez une adresse, une ville ou un pays pour créer une carte personnalisée
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 flex items-center space-x-2">
          <Input
            placeholder="Entrez une adresse, ville ou pays..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={searchAddress} 
            variant="outline" 
            disabled={isSearching}
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
        
        <div 
          ref={mapRef} 
          className="w-full h-[400px] rounded-md border mb-4"
          style={{ zIndex: 0 }} 
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
