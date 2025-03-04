
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Share2, AlertTriangle, MapPin, X, Plus, Move, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from "react-i18next";

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Marker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  color?: string;
}

const MARKER_COLORS = [
  { name: 'red', hex: '#ef4444' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'green', hex: '#22c55e' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'purple', hex: '#a855f7' }
];

const MapModal: React.FC<MapModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
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
  const [selectedMarkerColor, setSelectedMarkerColor] = useState(MARKER_COLORS[0]);
  const [showLegend, setShowLegend] = useState(true);

  // Initialize map when the modal opens
  useEffect(() => {
    if (!open || !mapContainerRef.current) return;
    
    try {
      if (typeof L !== 'undefined') {
        initializeMap();
        console.log("Carte initialisée avec succès");
      } else {
        console.error("Leaflet n'est pas disponible");
        toast.error(t("map.openError", "Impossible d'ouvrir la carte. Veuillez réessayer."));
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
      toast.error(t("map.openError", "Impossible d'ouvrir la carte. Veuillez réessayer."));
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [open, t]);

  // Update markers when they change
  useEffect(() => {
    if (mapRef.current) {
      updateMapMarkers();
    }
  }, [markers, currentLat, currentLng]);

  // Initialize the map with current coordinates
  const initializeMap = () => {
    if (!mapContainerRef.current) return;
    
    // Clean up existing map if it exists
    if (mapRef.current) {
      mapRef.current.remove();
    }
    
    // Create a new map
    mapRef.current = L.map(mapContainerRef.current).setView([currentLat, currentLng], 13);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);
    
    // Add markers
    updateMapMarkers();
    
    // Add click handler for adding markers
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => handleMapClick(e));
  };

  // Update markers on the map
  const updateMapMarkers = () => {
    if (!mapRef.current) return;
    
    // Remove all existing markers
    mapRef.current.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });
    
    // Add current markers
    markers.forEach(marker => {
      const markerColor = marker.color || '#ef4444'; // Default: red
      
      // Create custom marker icon with specified color
      const markerIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      
      // Add marker with popup
      L.marker([marker.lat, marker.lng], { icon: markerIcon })
        .addTo(mapRef.current)
        .bindPopup(`<b>${marker.label}</b>`);
    });
    
    // Update embed code
    updateIframeCode();
  };

  // Update embed iframe code
  const updateIframeCode = () => {
    // Base HTML for iframe
    let iframeHtml = `<iframe 
      width="100%" 
      height="400" 
      frameborder="0" 
      scrolling="no" 
      marginheight="0" 
      marginwidth="0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${currentLng - 0.05}%2C${currentLat - 0.05}%2C${currentLng + 0.05}%2C${currentLat + 0.05}&amp;layer=mapnik`;
    
    // Add markers to code
    if (markers && markers.length > 0) {
      markers.forEach(marker => {
        iframeHtml += `&amp;marker=${marker.lat}%2C${marker.lng}`;
      });
    }
    
    iframeHtml += `" style="border: 1px solid black"></iframe>
    <p>
      <small><a href="https://www.openstreetmap.org/?mlat=${currentLat}&amp;mlon=${currentLng}#map=15/${currentLat}/${currentLng}" target="_blank">Voir en plein écran</a></small>
    </p>`;

    setIframeCode(iframeHtml);
  };

  // Search for an address
  const searchAddress = async () => {
    if (!address.trim()) {
      toast.error(t("map.enterAddress", "Veuillez saisir une adresse"));
      return;
    }

    console.log("Recherche d'adresse:", address);
    setIsSearching(true);
    setSearchError(null);
    toast.info(`${t("map.searchingFor", "Recherche en cours pour")}: ${address}`);
    
    try {
      // Use Nominatim for geocoding with improved parameters
      const encodedAddress = encodeURIComponent(address.trim());
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`, {
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
        
        // Update current coordinates
        setCurrentLat(latitude);
        setCurrentLng(longitude);
        
        // Update map view with appropriate zoom level based on location type
        if (mapRef.current) {
          // Adjust zoom level based on place_rank (country=4, city=~16, street=~18)
          const placeRank = data[0].place_rank || 10;
          let zoomLevel = 13; // default
          
          if (placeRank <= 4) { // Country
            zoomLevel = 5;
          } else if (placeRank <= 8) { // Region/Province
            zoomLevel = 7;
          } else if (placeRank <= 12) { // City/County
            zoomLevel = 10;
          } else if (placeRank <= 16) { // District/Suburb
            zoomLevel = 13;
          } else { // Street/Address
            zoomLevel = 16;
          }
          
          mapRef.current.setView([latitude, longitude], zoomLevel);
          toast.success(`${t("map.locationFound", "Emplacement trouvé")}: ${display_name}`);
        } else {
          // Initialize map if it doesn't exist yet
          try {
            initializeMap();
            toast.success(`${t("map.locationFound", "Emplacement trouvé")}: ${display_name}`);
          } catch (error) {
            console.error("Erreur lors de l'initialisation de la carte après recherche:", error);
            setSearchError(t("map.openError", "Impossible d'ouvrir la carte. Veuillez réessayer."));
            toast.error(t("map.openError", "Impossible d'ouvrir la carte. Veuillez réessayer."));
          }
        }
      } else {
        console.log("Aucun résultat trouvé pour:", address);
        setSearchError(`${t("map.noResults", "Aucun résultat trouvé pour")} "${address}". ${t("map.tryMorePrecise", "Essayez d'être plus précis en incluant la ville ou le pays.")}`);
        toast.error(`${t("map.noResults", "Aucun résultat trouvé pour")}: ${address}`);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'adresse:", error);
      setSearchError(t("map.searchError", "Erreur lors de la recherche. Veuillez réessayer avec une autre adresse."));
      toast.error(t("map.searchError", "Erreur lors de la recherche. Veuillez réessayer avec une autre adresse."));
    } finally {
      setIsSearching(false);
    }
  };

  // Handle map click for adding markers
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (activeMode !== 'addMarker' || !mapRef.current) return;
    
    const { lat, lng } = e.latlng;
    console.log(`Clic sur la carte à: ${lat}, ${lng}`);
    
    // Store marker position temporarily
    setTempMarkerPosition({ lat, lng });
    
    // Show label input
    setShowLabelInput(true);
    
    toast.info(t("map.markerPositionSet", "Position du marqueur définie. Veuillez entrer un libellé."));
  };

  // Confirm adding a marker with label
  const confirmAddMarker = () => {
    if (!tempMarkerPosition) return;
    
    const newMarker: Marker = {
      id: `marker-${Date.now()}`,
      lat: tempMarkerPosition.lat,
      lng: tempMarkerPosition.lng,
      label: newMarkerLabel || `${t("map.marker", "Marqueur")} ${markers.length + 1}`,
      color: selectedMarkerColor.hex
    };
    
    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    
    // Reset
    setTempMarkerPosition(null);
    setShowLabelInput(false);
    setNewMarkerLabel('');
    setActiveMode('view');
    
    toast.success(`${t("map.markerAdded", "Marqueur")} "${newMarker.label}" ${t("map.added", "ajouté")}!`);
  };

  // Cancel adding a marker
  const cancelAddMarker = () => {
    setTempMarkerPosition(null);
    setShowLabelInput(false);
    setNewMarkerLabel('');
    setActiveMode('view');
  };

  // Delete a marker
  const deleteMarker = (id: string) => {
    const updatedMarkers = markers.filter(marker => marker.id !== id);
    setMarkers(updatedMarkers);
    
    toast.success(t("map.markerDeleted", "Marqueur supprimé !"));
  };

  // Move map in specified direction
  const moveMap = (direction: 'north' | 'south' | 'east' | 'west') => {
    if (!mapRef.current) return;
    
    const center = mapRef.current.getCenter();
    const zoom = mapRef.current.getZoom();
    const moveStep = 0.02;
    
    let newLat = center.lat;
    let newLng = center.lng;
    
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
    
    mapRef.current.setView([newLat, newLng], zoom);
    setCurrentLat(newLat);
    setCurrentLng(newLng);
  };

  // Copy embed code
  const copyIframeCode = () => {
    navigator.clipboard.writeText(iframeCode);
    toast.success(t("map.codeCopied", "Code d'intégration copié !"));
  };

  // Handle key press for search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchAddress();
    }
  };

  // Change marker color
  const handleMarkerColorChange = (color: typeof MARKER_COLORS[0]) => {
    setSelectedMarkerColor(color);
  };

  // Toggle legend display
  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("map.title", "Carte Interactive SEO")}</DialogTitle>
          <DialogDescription>
            {t("map.description", "Recherchez une adresse et ajoutez des marqueurs pour créer une carte personnalisée")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 flex items-center space-x-2">
          <Input
            placeholder={t("map.addressPlaceholder", "Entrez une adresse, ville ou pays...")}
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
                {t("map.searching", "Recherche...")}
              </span>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {t("map.search", "Rechercher")}
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
        
        {/* Map controls */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={activeMode === 'view' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveMode('view')}
            className="flex items-center"
          >
            <Search className="h-4 w-4 mr-1" />
            {t("map.view", "Visualiser")}
          </Button>
          <Button 
            variant={activeMode === 'addMarker' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveMode('addMarker')}
            className="flex items-center"
          >
            <MapPin className="h-4 w-4 mr-1" />
            {t("map.addMarker", "Ajouter un marqueur")}
          </Button>
          <Button 
            variant={activeMode === 'move' ? "default" : "outline"} 
            size="sm" 
            onClick={() => setActiveMode('move')}
            className="flex items-center"
          >
            <Move className="h-4 w-4 mr-1" />
            {t("map.moveMap", "Déplacer la carte")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLegend}
            className="flex items-center ml-auto"
          >
            <Info className="h-4 w-4 mr-1" />
            {showLegend ? t("map.hideLegend", "Masquer la légende") : t("map.showLegend", "Afficher la légende")}
          </Button>
        </div>
        
        {/* Movement controls */}
        {activeMode === 'move' && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('north')}>{t("map.north", "Nord")}</Button>
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('west')}>{t("map.west", "Ouest")}</Button>
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('east')}>{t("map.east", "Est")}</Button>
            <div></div>
            <Button variant="outline" size="sm" onClick={() => moveMap('south')}>{t("map.south", "Sud")}</Button>
            <div></div>
          </div>
        )}
        
        {/* Marker color chooser */}
        {activeMode === 'addMarker' && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">{t("map.chooseMarkerColor", "Choisir la couleur du marqueur")}:</p>
            <div className="flex gap-2">
              {MARKER_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleMarkerColorChange(color)}
                  className={`w-6 h-6 rounded-full border ${selectedMarkerColor.name === color.name ? 'border-gray-900 ring-2 ring-gray-400' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.hex }}
                  title={t(`map.color.${color.name}`, color.name)}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Map display area */}
          <div className="md:col-span-2">
            <div 
              ref={mapContainerRef} 
              className="w-full h-[400px] rounded-md border relative"
              style={{ cursor: activeMode === 'addMarker' ? 'crosshair' : 'grab' }}
            ></div>
          </div>
          
          {/* Legend and marker list */}
          <div className="space-y-4">
            {/* Legend */}
            {showLegend && (
              <div className="border rounded-md p-3 bg-gray-50">
                <h3 className="text-sm font-semibold mb-2">{t("map.legendTitle", "Légende")}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-xs">{t("map.legendItems.importantPlaces", "Lieux importants")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-xs">{t("map.legendItems.clientLocation", "Emplacement client")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-xs">{t("map.legendItems.competitors", "Concurrents")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">{t("map.legendItems.pointsOfInterest", "Points d'intérêt")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span className="text-xs">{t("map.legendItems.targetAreas", "Zones cibles")}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Marker list */}
            <div className="border rounded-md p-3">
              <h3 className="text-sm font-semibold mb-2">{t("map.markers", "Marqueurs")} ({markers.length})</h3>
              {markers.length > 0 ? (
                <div className="max-h-[250px] overflow-y-auto space-y-2">
                  {markers.map((marker) => (
                    <div key={marker.id} className="flex justify-between items-center p-2 border rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: marker.color || '#ef4444' }}></div>
                        <span className="font-medium">{marker.label}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteMarker(marker.id)} 
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t("map.noMarkers", "Aucun marqueur ajouté")}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Marker label input interface */}
        {showLabelInput && (
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <p className="mb-2 font-medium">{t("map.addMarker", "Ajouter un marqueur")}</p>
            <div className="flex gap-2 items-center">
              <Input
                placeholder={t("map.markerName", "Nom du marqueur...")}
                value={newMarkerLabel}
                onChange={(e) => setNewMarkerLabel(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button variant="outline" size="sm" onClick={confirmAddMarker}>
                <Plus className="h-4 w-4 mr-1" />
                {t("map.add", "Ajouter")}
              </Button>
              <Button variant="outline" size="sm" onClick={cancelAddMarker}>
                <X className="h-4 w-4 mr-1" />
                {t("map.cancel", "Annuler")}
              </Button>
            </div>
          </div>
        )}
        
        {/* Embed code section */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">{t("map.embedCode", "Code d'intégration")}</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowIframeCode(!showIframeCode)}
          >
            {showIframeCode ? t("map.hide", "Masquer") : t("map.show", "Afficher")}
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
              {t("map.copy", "Copier")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
