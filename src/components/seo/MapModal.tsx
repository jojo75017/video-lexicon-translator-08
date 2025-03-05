
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

const DefaultIcon = L.icon({
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [searchAddress, setSearchAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [currentMode, setCurrentMode] = useState<'search' | 'addMarker'>('search');
  const [newMarkerName, setNewMarkerName] = useState("");
  const [tempMarker, setTempMarker] = useState<L.Marker | null>(null);
  const [markerColor, setMarkerColor] = useState("red");
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  // Initialize map when component mounts
  useEffect(() => {
    if (!open || !mapContainerRef.current) return;

    // Clean up any previous instances
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    }

    const initMap = () => {
      try {
        console.log("Initializing map");
        mapRef.current = L.map(mapContainerRef.current).setView(DEFAULT_POSITION as L.LatLngExpression, DEFAULT_ZOOM);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

        // Map click event for adding markers
        mapRef.current.on('click', (e) => {
          if (currentMode === 'addMarker') {
            handleMapClick(e);
          }
        });

        console.log("Map initialized");
      } catch (error) {
        console.error("Map initialization error:", error);
        toast.error(t('map.initError'));
      }
    };

    // Timeout to ensure the container is fully rendered
    setTimeout(initMap, 100);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      
      if (mapRef.current) {
        console.log("Cleaning up map");
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, [open, t]);

  // Update markers on the map when markers state changes
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;
    
    console.log("Updating markers:", markers.length);
    
    // Clear existing markers
    markersLayerRef.current.clearLayers();
    
    // Add all markers to the map
    markers.forEach(marker => {
      try {
        const markerIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${marker.color}; width: 25px; height: 25px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold;">${marker.name.charAt(0)}</div>`,
          iconSize: [25, 25],
          iconAnchor: [12, 12]
        });
        
        const leafletMarker = L.marker(marker.latlng, { icon: markerIcon })
          .addTo(markersLayerRef.current!);
        
        leafletMarker.bindPopup(`
          <div>
            <strong>${marker.name}</strong><br>
            ${t('map.latitude')}: ${marker.latlng.lat.toFixed(5)}<br>
            ${t('map.longitude')}: ${marker.latlng.lng.toFixed(5)}
          </div>
        `);
      } catch (error) {
        console.error("Error adding marker:", error);
      }
    });
  }, [markers, t]);

  // Update current mode effect
  useEffect(() => {
    if (currentMode === 'search' && tempMarker) {
      tempMarker.remove();
      setTempMarker(null);
    }
  }, [currentMode, tempMarker]);

  const handleSearch = async () => {
    if (!searchAddress.trim() || !mapRef.current) {
      toast.error(t('map.enterAddress'));
      return;
    }
    
    // Abort any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setIsSearching(true);
    
    try {
      toast.info(`${t('map.searchingFor')} "${searchAddress}"`);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}`,
        { 
          signal: abortControllerRef.current.signal,
          headers: { 'Accept-Language': 'fr' }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        mapRef.current.setView(location as L.LatLngExpression, 14);
        toast.success(t('map.locationFound'));
      } else {
        toast.error(`${t('map.noResults')} "${searchAddress}". ${t('map.tryMorePrecise')}`);
      }
    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        console.log("Search aborted");
      } else {
        console.error("Search error:", error);
        toast.error(t('map.searchError'));
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (currentMode !== 'addMarker' || !mapRef.current) return;
    
    // Remove any temporary marker
    if (tempMarker) {
      tempMarker.remove();
    }
    
    // Add a temporary marker
    const newTempMarker = L.marker(e.latlng).addTo(mapRef.current);
    setTempMarker(newTempMarker);
    
    // Show toast and focus on marker name input
    toast.info(t('map.markerPositionSet'));
  };

  const addMarker = () => {
    if (!tempMarker || !newMarkerName.trim()) return;
    
    const latlng = tempMarker.getLatLng();
    
    // Add new marker to state
    const newMarker: MapMarker = {
      id: Date.now().toString(),
      latlng,
      name: newMarkerName.trim(),
      color: markerColor
    };
    
    setMarkers(prev => [...prev, newMarker]);
    
    // Reset temp marker and input
    tempMarker.remove();
    setTempMarker(null);
    setNewMarkerName("");
    
    toast.success(`${t('map.markerAdded')} "${newMarkerName}" ${t('map.added')}`);
  };

  const deleteMarker = (id: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
    toast.success(t('map.markerDeleted'));
  };

  const generateEmbedCode = () => {
    if (!markers.length) return '';
    
    const centerLat = markers.reduce((sum, marker) => sum + marker.latlng.lat, 0) / markers.length;
    const centerLng = markers.reduce((sum, marker) => sum + marker.latlng.lng, 0) / markers.length;
    
    const markerParams = markers.map(marker => 
      `&amp;marker=${marker.latlng.lat},${marker.latlng.lng},${encodeURIComponent(marker.name)}`
    ).join('');
    
    return `<iframe width="600" height="450" style="border:0" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=${centerLng-0.1},${centerLat-0.1},${centerLng+0.1},${centerLat+0.1}&amp;layer=mapnik${markerParams}"></iframe>`;
  };

  const copyEmbedCode = () => {
    const code = generateEmbedCode();
    navigator.clipboard.writeText(code);
    toast.success(t('map.codeCopied'));
  };

  const colors = [
    { name: t('map.color.red'), value: 'red' },
    { name: t('map.color.blue'), value: 'blue' },
    { name: t('map.color.green'), value: 'green' },
    { name: t('map.color.yellow'), value: 'yellow' },
    { name: t('map.color.purple'), value: 'purple' }
  ];

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
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
                      placeholder={t('map.markerName')}
                      value={newMarkerName}
                      onChange={(e) => setNewMarkerName(e.target.value)}
                      disabled={!tempMarker}
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
                </div>
              )}
            </div>
          </div>
          
          {/* Map Container */}
          <div className="md:col-span-2 relative min-h-[400px]">
            <div ref={mapContainerRef} className="absolute inset-0 rounded-md overflow-hidden"></div>
            
            {/* Legend */}
            {showLegend && (
              <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded shadow-md z-[1000]">
                <h4 className="font-semibold text-sm mb-2">{t('map.legendTitle')}</h4>
                <div className="space-y-1">
                  {Object.entries(t('map.legendItems', { returnObjects: true })).map(([key, value]) => (
                    <div key={key} className="flex items-center text-xs">
                      <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                      <span>{value}</span>
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
