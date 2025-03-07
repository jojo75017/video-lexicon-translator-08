
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Plus, X, Copy, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Fix Leaflet icon issues
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapMarker {
  id: string;
  latlng: L.LatLng;
  name: string;
  color: string;
}

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_POSITION = [48.8566, 2.3522]; // Paris coordinates
const DEFAULT_ZOOM = 13;

const MapModal = ({ open, onOpenChange }: MapModalProps) => {
  const { t } = useTranslation();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const searchControllerRef = useRef<AbortController | null>(null);
  
  const [searchAddress, setSearchAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [currentMode, setCurrentMode] = useState<'search' | 'addMarker'>('search');
  const [newMarkerName, setNewMarkerName] = useState("");
  const [tempMarker, setTempMarker] = useState<L.Marker | null>(null);
  const [markerColor, setMarkerColor] = useState("red");
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map when component mounts and dialog opens
  useEffect(() => {
    if (!open) return;

    // Wait a moment for the modal to fully render
    const timer = setTimeout(() => {
      initializeMap();
    }, 300);

    return () => {
      clearTimeout(timer);
      cleanupMap();
    };
  }, [open]);

  const initializeMap = () => {
    console.log("Initializing map");
    
    // Clean up previous map if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    if (!mapContainerRef.current) {
      console.error("Map container not found");
      return;
    }

    try {
      // Create map instance
      mapRef.current = L.map(mapContainerRef.current).setView(DEFAULT_POSITION as L.LatLngExpression, DEFAULT_ZOOM);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Create markers layer
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);
      
      // Add click handler for adding markers
      mapRef.current.on('click', handleMapClick);
      
      console.log("Map initialized successfully");
      setMapInitialized(true);
      
      // Refresh markers if any exist
      if (markers.length > 0) {
        updateMarkers();
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error(t('map.openError'));
    }
  };

  // Update markers on the map when markers state changes
  useEffect(() => {
    if (mapInitialized && markers.length > 0) {
      updateMarkers();
    }
  }, [markers, mapInitialized]);

  const updateMarkers = () => {
    if (!mapRef.current || !markersLayerRef.current) {
      return;
    }
    
    console.log("Updating markers:", markers.length);
    
    // Clear all existing markers
    markersLayerRef.current.clearLayers();
    
    // Add all markers to the map
    markers.forEach(marker => {
      try {
        // Create custom marker icon with color
        const markerIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background-color: ${marker.color}; 
              width: 25px; 
              height: 25px; 
              border-radius: 50%; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              color: white; 
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">
              ${marker.name.charAt(0).toUpperCase()}
            </div>
          `,
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        });
        
        // Create and add marker to the layer
        const leafletMarker = L.marker(marker.latlng, { icon: markerIcon })
          .addTo(markersLayerRef.current!);
        
        // Add popup with marker information
        leafletMarker.bindPopup(`
          <div>
            <strong>${marker.name}</strong><br>
            ${t('map.latitude')}: ${marker.latlng.lat.toFixed(5)}<br>
            ${t('map.longitude')}: ${marker.latlng.lng.toFixed(5)}
          </div>
        `);
      } catch (error) {
        console.error("Error adding marker:", error, marker);
      }
    });
  };

  // Cleanup function for map resources
  const cleanupMap = () => {
    console.log("Cleaning up map resources");
    
    // Abort any pending searches
    if (searchControllerRef.current) {
      searchControllerRef.current.abort();
      searchControllerRef.current = null;
    }
    
    // Remove map
    if (mapRef.current) {
      mapRef.current.off('click', handleMapClick);
      mapRef.current.remove();
      mapRef.current = null;
    }
    
    // Reset markers layer
    markersLayerRef.current = null;
    
    // Reset state
    setMapInitialized(false);
  };

  // Handle map click for adding markers
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (currentMode !== 'addMarker' || !mapRef.current) return;
    
    // Remove any existing temporary marker
    if (tempMarker) {
      tempMarker.remove();
    }
    
    // Create new temporary marker
    const newTempMarker = L.marker(e.latlng).addTo(mapRef.current);
    setTempMarker(newTempMarker);
    
    // Notify user
    toast.info(t('map.markerPositionSet'));
    
    // Focus on name input (if possible)
    const nameInput = document.getElementById('marker-name-input');
    if (nameInput) {
      nameInput.focus();
    }
  };

  // Address search function
  const handleSearch = async () => {
    if (!searchAddress.trim()) {
      toast.error(t('map.enterAddress'));
      return;
    }
    
    if (!mapRef.current) {
      console.error("Map not initialized for search");
      toast.error(t('map.openError'));
      return;
    }
    
    // Abort any ongoing search
    if (searchControllerRef.current) {
      searchControllerRef.current.abort();
    }
    
    // Create new abort controller
    searchControllerRef.current = new AbortController();
    
    // Start searching
    setIsSearching(true);
    toast.info(`${t('map.searchingFor')} "${searchAddress}"`);
    
    try {
      // Encodage propre de l'adresse pour éviter les problèmes d'encodage
      const encodedAddress = encodeURIComponent(searchAddress.trim());
      console.log(`Recherche de l'adresse: ${encodedAddress}`);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&accept-language=fr`,
        { 
          signal: searchControllerRef.current.signal,
          headers: {
            'Accept-Language': 'fr', // Force des résultats en français
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Search results:", data);
      
      if (data && data.length > 0) {
        // Extraction correcte des coordonnées
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        if (isNaN(lat) || isNaN(lon)) {
          throw new Error("Coordonnées invalides");
        }
        
        console.log(`Coordonnées trouvées: ${lat}, ${lon}`);
        
        // Détermination du niveau de zoom approprié en fonction du type de résultat
        let zoomLevel = 5; // Par défaut pour les pays
        
        if (data[0].type === 'city' || data[0].type === 'administrative') {
          if (data[0].place_rank >= 16) { // Ville
            zoomLevel = 12;
          } else if (data[0].place_rank >= 12) { // Région
            zoomLevel = 8;
          } else if (data[0].place_rank >= 4) { // Pays
            zoomLevel = 5;
          }
        }
        
        mapRef.current.setView([lat, lon] as L.LatLngExpression, zoomLevel);
        toast.success(t('map.locationFound'));
      } else {
        toast.error(`${t('map.noResults')} "${searchAddress}". ${t('map.tryMorePrecise')}`);
      }
    } catch (error) {
      if (searchControllerRef.current?.signal.aborted) {
        console.log("Search aborted");
      } else {
        console.error("Search error:", error);
        toast.error(t('map.searchError'));
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Add marker from temporary marker
  const addMarker = () => {
    if (!tempMarker || !newMarkerName.trim()) {
      toast.error(t('map.enterMarkerName'));
      return;
    }
    
    // Get position from temporary marker
    const latlng = tempMarker.getLatLng();
    
    // Create new marker
    const newMarker: MapMarker = {
      id: Date.now().toString(),
      latlng,
      name: newMarkerName.trim(),
      color: markerColor
    };
    
    // Add to markers list
    setMarkers(prev => [...prev, newMarker]);
    
    // Clean up temporary marker
    tempMarker.remove();
    setTempMarker(null);
    setNewMarkerName("");
    
    // Notify user
    toast.success(`${t('map.markerAdded')} "${newMarkerName}" ${t('map.added')}`);
  };

  // Delete marker by ID
  const deleteMarker = (id: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
    toast.success(t('map.markerDeleted'));
  };

  // Generate embed code
  const generateEmbedCode = () => {
    if (!markers.length) return '';
    
    // Calculate center point from all markers
    const centerLat = markers.reduce((sum, marker) => sum + marker.latlng.lat, 0) / markers.length;
    const centerLng = markers.reduce((sum, marker) => sum + marker.latlng.lng, 0) / markers.length;
    
    // Generate marker parameters for each marker - utilisation d'URI.encode pour éviter les problèmes d'encodage
    const markerParams = markers.map(marker => 
      `&marker=${marker.latlng.lat},${marker.latlng.lng},${encodeURIComponent(marker.name)}`
    ).join('');
    
    // Code d'intégration corrigé avec un encodage approprié
    return `<iframe width="600" height="450" frameborder="0" style="border:0" 
      src="https://www.openstreetmap.org/export/embed.html?bbox=${centerLng-0.1}%2C${centerLat-0.1}%2C${centerLng+0.1}%2C${centerLat+0.1}&amp;layer=mapnik${markerParams.replace(/&/g, '&amp;')}"></iframe>`;
  };

  // Copy embed code to clipboard
  const copyEmbedCode = () => {
    const code = generateEmbedCode();
    navigator.clipboard.writeText(code);
    toast.success(t('map.codeCopied'));
  };

  // Available marker colors
  const colors = [
    { name: t('map.color.red'), value: 'red' },
    { name: t('map.color.blue'), value: 'blue' },
    { name: t('map.color.green'), value: 'green' },
    { name: t('map.color.yellow'), value: 'yellow' },
    { name: t('map.color.purple'), value: 'purple' }
  ];

  // Handle dialog close
  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      cleanupMap();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('map.title')}</DialogTitle>
          <DialogDescription>{t('map.subtitle')}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow overflow-hidden">
          {/* Map Controls */}
          <div className="md:col-span-1 space-y-4 overflow-y-auto p-2">
            <div className="flex space-x-2 mb-4">
              <Button
                variant={currentMode === 'search' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('search')}
                className="flex-1"
              >
                <Search className="h-4 w-4 mr-2" />
                {t('map.search')}
              </Button>
              <Button
                variant={currentMode === 'addMarker' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('addMarker')}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('map.addMarker')}
              </Button>
            </div>
            
            {currentMode === 'search' && (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder={t('map.addressPlaceholder')}
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    disabled={isSearching}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isSearching || !searchAddress.trim()}
                    size="icon"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {isSearching && (
                  <div className="text-sm text-gray-500 animate-pulse">
                    {t('map.searching')}
                  </div>
                )}
              </div>
            )}
            
            {currentMode === 'addMarker' && (
              <>
                <div className="space-y-2">
                  <p className="text-sm text-blue-600">{t('map.clickToAddMarker')}</p>
                  
                  <div className="space-y-2">
                    <Input
                      id="marker-name-input"
                      placeholder={t('map.markerName')}
                      value={newMarkerName}
                      onChange={(e) => setNewMarkerName(e.target.value)}
                      disabled={!tempMarker}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tempMarker && newMarkerName.trim()) {
                          e.preventDefault();
                          addMarker();
                        }
                      }}
                    />
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        {t('map.chooseMarkerColor')}
                      </label>
                      <div className="flex space-x-2">
                        {colors.map(color => (
                          <button
                            key={color.value}
                            className={`w-6 h-6 rounded-full ${
                              markerColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                            }`}
                            style={{ backgroundColor: color.value }}
                            onClick={() => setMarkerColor(color.value)}
                            title={color.name}
                            aria-label={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={addMarker} 
                        disabled={!tempMarker || !newMarkerName.trim()}
                        className="flex-1"
                      >
                        {t('map.add')}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (tempMarker) {
                            tempMarker.remove();
                            setTempMarker(null);
                          }
                          setNewMarkerName("");
                        }}
                        className="flex-1"
                      >
                        {t('map.cancel')}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Markers List */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">{t('map.markers')}</h3>
              
              {markers.length === 0 ? (
                <p className="text-sm text-gray-500">{t('map.noMarkers')}</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {markers.map(marker => (
                    <div 
                      key={marker.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: marker.color }}
                        />
                        <span>{marker.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteMarker(marker.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Legend Toggle */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowLegend(!showLegend)}
              >
                {showLegend ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    {t('map.hideLegend')}
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('map.showLegend')}
                  </>
                )}
              </Button>
            </div>
            
            {/* Embed Code */}
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                disabled={markers.length === 0}
              >
                {showEmbedCode ? t('map.hide') : t('map.show')} {t('map.embedCode')}
              </Button>
              
              {showEmbedCode && markers.length > 0 && (
                <div className="mt-2">
                  <div className="relative">
                    <pre className="p-2 bg-gray-100 rounded text-xs overflow-x-auto max-h-32">
                      {generateEmbedCode()}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={copyEmbedCode}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {t('map.copy')}
                    </Button>
                  </div>
                  <div className="mt-2 p-2 bg-yellow-50 text-xs rounded">
                    <p className="font-medium">{t('map.embedUsage')}</p>
                    <p>{t('map.embedInstructions')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Map Container */}
          <div className="md:col-span-2 relative min-h-[400px]">
            <div ref={mapContainerRef} className="absolute inset-0 rounded-md overflow-hidden"></div>
            
            {/* Legend - Toujours visible quand la carte est initialisée */}
            {showLegend && mapInitialized && (
              <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded shadow-md z-[1000]">
                <h4 className="font-semibold text-sm mb-2">{t('map.legendTitle')}</h4>
                <div className="space-y-1">
                  {colors.map(color => (
                    <div key={color.value} className="flex items-center text-xs">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <span>{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
