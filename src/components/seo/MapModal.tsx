
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Share2, AlertTriangle, MapPin, X, Plus, Move, Trash2 } from "lucide-react";
import { toast } from "sonner";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Marker {
  id: string;
  lat: number;
  lng: number;
  label: string;
}

const MapModal: React.FC<MapModalProps> = ({ open, onOpenChange }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [address, setAddress] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [showIframeCode, setShowIframeCode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [currentLat, setCurrentLat] = useState(48.8566);
  const [currentLng, setCurrentLng] = useState(2.3522);
  const [activeMode, setActiveMode] = useState<'view' | 'addMarker' | 'move'>('view');
  const [newMarkerLabel, setNewMarkerLabel] = useState('');
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [tempMarkerPosition, setTempMarkerPosition] = useState<{lat: number, lng: number} | null>(null);

  // Fonction pour initialiser la carte
  useEffect(() => {
    if (!open || !mapContainerRef.current) return;

    // On utilise une carte OpenStreetMap comme base
    const defaultLatitude = currentLat;
    const defaultLongitude = currentLng;
    
    // Création d'une iframe pour la carte de base
    generateMapEmbed(defaultLatitude, defaultLongitude);
    
    console.log("Carte initialisée avec succès");
  }, [open, currentLat, currentLng]);

  // Fonction pour générer l'embed de carte
  const generateMapEmbed = (latitude: number, longitude: number) => {
    if (!mapContainerRef.current) return;

    // Nettoyer le conteneur de carte
    mapContainerRef.current.innerHTML = '';

    // Créer une iframe pour la carte
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = 'none';
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05}%2C${latitude - 0.05}%2C${longitude + 0.05}%2C${latitude + 0.05}&amp;layer=mapnik`;
    iframe.id = 'map-iframe';
    
    // Ajouter l'iframe au conteneur
    mapContainerRef.current.appendChild(iframe);
    iframeRef.current = iframe;

    // Générer le code d'intégration avec les marqueurs
    updateIframeCode(latitude, longitude, markers);
  };

  // Fonction pour mettre à jour le code d'intégration
  const updateIframeCode = (latitude: number, longitude: number, currentMarkers: Marker[]) => {
    // Code HTML de base pour l'iframe
    let iframeHtml = `<iframe 
      width="100%" 
      height="400" 
      frameborder="0" 
      scrolling="no" 
      marginheight="0" 
      marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.05}%2C${latitude - 0.05}%2C${longitude + 0.05}%2C${latitude + 0.05}&amp;layer=mapnik`;
    
    // Ajouter les marqueurs au code
    if (currentMarkers.length > 0) {
      currentMarkers.forEach(marker => {
        iframeHtml += `&amp;marker=${marker.lat}%2C${marker.lng}`;
      });
    }
    
    iframeHtml += `" style="border: 1px solid black"></iframe>
    <p>
      <small><a href="https://www.openstreetmap.org/?mlat=${latitude}&amp;mlon=${longitude}#map=15/${latitude}/${longitude}" target="_blank">Voir en plein écran</a></small>
    </p>`;

    // JavaScript pour ajouter les marqueurs avec des labels
    if (currentMarkers.length > 0) {
      iframeHtml += `
<script>
  // Attendre que la page soit chargée
  window.onload = function() {
    // Ajouter les marqueurs avec leurs labels
    ${currentMarkers.map(marker => `
      // Création du marqueur ${marker.id}
      var marker${marker.id.replace(/-/g, '_')} = L.marker([${marker.lat}, ${marker.lng}]).addTo(map);
      marker${marker.id.replace(/-/g, '_')}.bindPopup("${marker.label}").openPopup();
    `).join('\n')}
  };
</script>`;
    }

    setIframeCode(iframeHtml);
  };

  // Fonction pour rechercher une adresse
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
        
        // Mettre à jour les coordonnées actuelles
        setCurrentLat(latitude);
        setCurrentLng(longitude);
        
        // Générer la carte avec les nouvelles coordonnées
        generateMapEmbed(latitude, longitude);
        
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

  // Gestionnaire pour ajouter un marqueur
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeMode !== 'addMarker' || !mapContainerRef.current) return;
    
    // On ne peut pas vraiment interagir directement avec l'iframe, donc on simule l'ajout
    // en demandant à l'utilisateur les coordonnées ou en utilisant des coordonnées relatives à la position actuelle

    // Pour simplifier, on ajoute un marqueur à un décalage aléatoire par rapport au centre
    const offsetLat = (Math.random() - 0.5) * 0.02;
    const offsetLng = (Math.random() - 0.5) * 0.02;
    
    // Coordonnées du nouveau marqueur
    const newLat = currentLat + offsetLat;
    const newLng = currentLng + offsetLng;
    
    // Enregistrer temporairement la position du marqueur
    setTempMarkerPosition({lat: newLat, lng: newLng});
    
    // Afficher l'input pour le label
    setShowLabelInput(true);
    
    toast.info("Position du marqueur définie. Veuillez entrer un libellé.");
  };

  // Confirmer l'ajout d'un marqueur avec son label
  const confirmAddMarker = () => {
    if (!tempMarkerPosition) return;
    
    const newMarker: Marker = {
      id: `marker-${Date.now()}`,
      lat: tempMarkerPosition.lat,
      lng: tempMarkerPosition.lng,
      label: newMarkerLabel || `Marqueur ${markers.length + 1}`
    };
    
    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    
    // Mise à jour du code d'intégration
    updateIframeCode(currentLat, currentLng, updatedMarkers);
    
    // Réinitialiser
    setTempMarkerPosition(null);
    setShowLabelInput(false);
    setNewMarkerLabel('');
    setActiveMode('view');
    
    toast.success(`Marqueur "${newMarker.label}" ajouté!`);
    
    // Rafraîchir la carte pour montrer le nouveau marqueur
    generateMapEmbed(currentLat, currentLng);
  };

  // Annuler l'ajout d'un marqueur
  const cancelAddMarker = () => {
    setTempMarkerPosition(null);
    setShowLabelInput(false);
    setNewMarkerLabel('');
    setActiveMode('view');
  };

  // Supprimer un marqueur
  const deleteMarker = (id: string) => {
    const updatedMarkers = markers.filter(marker => marker.id !== id);
    setMarkers(updatedMarkers);
    
    // Mise à jour du code d'intégration
    updateIframeCode(currentLat, currentLng, updatedMarkers);
    
    toast.success("Marqueur supprimé!");
    
    // Rafraîchir la carte
    generateMapEmbed(currentLat, currentLng);
  };

  // Mode déplacement de la carte
  const moveMap = (direction: 'north' | 'south' | 'east' | 'west') => {
    const moveStep = 0.02;
    let newLat = currentLat;
    let newLng = currentLng;
    
    switch (direction) {
      case 'north':
        newLat += moveStep;
        break;
      case 'south':
        newLat -= moveStep;
        break;
      case 'east':
        newLng += moveStep;
        break;
      case 'west':
        newLng -= moveStep;
        break;
    }
    
    setCurrentLat(newLat);
    setCurrentLng(newLng);
    
    // La carte sera mise à jour automatiquement via l'effet useEffect
  };

  // Copier le code d'intégration
  const copyIframeCode = () => {
    navigator.clipboard.writeText(iframeCode);
    toast.success("Code d'intégration copié !");
  };

  // Gestion des touches pour la recherche
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carte Interactive SEO</DialogTitle>
          <DialogDescription>
            Recherchez une adresse et ajoutez des marqueurs pour créer une carte personnalisée
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
        
        {/* Contrôles de la carte */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={activeMode === 'view' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveMode('view')}
            className="flex items-center"
          >
            <Search className="h-4 w-4 mr-1" />
            Visualiser
          </Button>
          <Button 
            variant={activeMode === 'addMarker' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveMode('addMarker')}
            className="flex items-center"
          >
            <MapPin className="h-4 w-4 mr-1" />
            Ajouter un marqueur
          </Button>
          <Button 
            variant={activeMode === 'move' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveMode('move')}
            className="flex items-center"
          >
            <Move className="h-4 w-4 mr-1" />
            Déplacer la carte
          </Button>
        </div>
        
        {/* Contrôles de déplacement */}
        {activeMode === 'move' && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('north')}>Nord</Button>
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('west')}>Ouest</Button>
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('east')}>Est</Button>
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('south')}>Sud</Button>
            <div></div>
          </div>
        )}
        
        {/* Zone d'affichage de la carte avec gestion des clics */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-[400px] rounded-md border mb-4 relative"
          style={{ zIndex: 0 }} 
          onClick={handleMapClick}
        ></div>
        
        {/* Interface pour ajouter un label au marqueur */}
        {showLabelInput && (
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <p className="mb-2 font-medium">Ajouter un marqueur</p>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Nom du marqueur..."
                value={newMarkerLabel}
                onChange={(e) => setNewMarkerLabel(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button variant="outline" size="sm" onClick={confirmAddMarker}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
              <Button variant="outline" size="sm" onClick={cancelAddMarker}>
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
            </div>
          </div>
        )}
        
        {/* Liste des marqueurs */}
        {markers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Marqueurs ({markers.length})</h3>
            <div className="space-y-2">
              {markers.map((marker) => (
                <div key={marker.id} className="flex justify-between items-center p-2 border rounded-md">
                  <div>
                    <span className="font-medium">{marker.label}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({marker.lat.toFixed(4)}, {marker.lng.toFixed(4)})
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteMarker(marker.id)} 
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Section code d'intégration */}
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
