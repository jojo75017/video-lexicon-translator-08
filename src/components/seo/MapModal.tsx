
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Share2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import 'leaflet/dist/leaflet.css';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MapModal: React.FC<MapModalProps> = ({ open, onOpenChange }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [showIframeCode, setShowIframeCode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fonction pour initialiser la carte avec une iframe OpenStreetMap directement
  useEffect(() => {
    if (!open || !mapRef.current) return;

    // Initialisation de la carte avec Paris comme point central par défaut
    const defaultLatitude = 48.8566;
    const defaultLongitude = 2.3522;
    generateDirectMapEmbed(defaultLatitude, defaultLongitude, "Paris, France");
    
    console.log("Carte initialisée avec succès");
  }, [open]);

  // Fonction pour générer l'embed de carte directement depuis OpenStreetMap
  const generateDirectMapEmbed = (latitude: number, longitude: number, placeName: string) => {
    if (!mapRef.current) return;

    // Nettoyer le conteneur de carte
    mapRef.current.innerHTML = '';

    // Créer une iframe pour la carte
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02}%2C${latitude - 0.02}%2C${longitude + 0.02}%2C${latitude + 0.02}&amp;layer=mapnik&amp;marker=${latitude}%2C${longitude}`;

    // Ajouter l'iframe au conteneur
    mapRef.current.appendChild(iframe);

    // Générer le code d'intégration
    const iframeHtml = `<iframe 
      width="100%" 
      height="400" 
      frameborder="0" 
      scrolling="no" 
      marginheight="0" 
      marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.02}%2C${latitude - 0.02}%2C${longitude + 0.02}%2C${latitude + 0.02}&amp;layer=mapnik&amp;marker=${latitude}%2C${longitude}" 
      style="border: 1px solid black">
    </iframe>
    <p>
      <small><a href="https://www.openstreetmap.org/?mlat=${latitude}&amp;mlon=${longitude}#map=15/${latitude}/${longitude}" target="_blank">Voir en plein écran</a></small>
    </p>`;

    setIframeCode(iframeHtml);
    setSearchError(null);
  };

  const searchAddress = async () => {
    if (!address.trim()) {
      toast.error("Veuillez saisir une adresse");
      return;
    }

    console.log("Recherche d'adresse:", address);
    setIsSearching(true);
    setSearchError(null);
    toast.info(`Recherche en cours pour: ${address}`);
    
    try {
      // Utilisation du service Nominatim pour la géocodification
      const encodedAddress = encodeURIComponent(address.trim());
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LocalSEOApp'
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
        
        // Générer la carte avec les nouvelles coordonnées
        generateDirectMapEmbed(latitude, longitude, display_name);
        
        toast.success(`Emplacement trouvé: ${display_name}`);
      } else {
        console.log("Aucun résultat trouvé pour:", address);
        setSearchError(`Aucun résultat trouvé pour "${address}". Essayez d'être plus précis en incluant la ville ou le pays.`);
        toast.error(`Aucun résultat trouvé pour: ${address}. Essayez d'être plus précis.`);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse:", error);
      setSearchError("Erreur lors de la recherche. Veuillez réessayer avec une autre adresse.");
      toast.error("Erreur lors de la recherche. Veuillez réessayer.");
    } finally {
      setIsSearching(false);
    }
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
            {isSearching ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Recherche...
              </span>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </div>

        {searchError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mr-2 mt-0.5" />
            <p className="text-sm">{searchError}</p>
          </div>
        )}
        
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
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
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
