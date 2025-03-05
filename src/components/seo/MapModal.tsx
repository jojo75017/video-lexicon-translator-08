
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Copy, Plus, XCircle, MapPin, Map, Eye, EyeOff, Trash2, Layers } from 'lucide-react';
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import * as L from 'leaflet';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MapModal = ({ open, onOpenChange }: MapModalProps) => {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearch, setLastSearch] = useState('');
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [activeMode, setActiveMode] = useState<'search' | 'addMarker' | 'move'>('search');
  const [tempMarker, setTempMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [markerLabel, setMarkerLabel] = useState('');
  const [markerColor, setMarkerColor] = useState<'red' | 'blue' | 'green' | 'yellow' | 'purple'>('red');
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; label: string; color: string }>>([]);
  const [showLegend, setShowLegend] = useState(false);
  const [searchType, setSearchType] = useState<'country' | 'city' | 'address'>('address');
  const [mapLoaded, setMapLoaded] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const searchAbortController = useRef<AbortController | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialiser la carte lors du montage du composant
  useEffect(() => {
    if (!open) return;

    // Fonction d'initialisation de la carte
    const initMap = async () => {
      try {
        if (!mapContainer.current || mapContainer.current.innerHTML !== '') {
          return;
        }

        const defaultView = [48.856614, 2.3522219] as [number, number]; // Paris
        const defaultZoom = 13;

        const map = L.map(mapContainer.current).setView(defaultView, defaultZoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create a layer group for markers
        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;

        map.on('click', (e: L.LeafletMouseEvent) => {
          if (activeMode === 'addMarker') {
            handleMapClick(e);
          }
        });

        mapRef.current = map;
        setMapLoaded(true);
        
        // Add existing markers when map is initialized
        if (markers.length > 0) {
          updateMapMarkers();
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
        toast.error(t("map.openError"));
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [open, t]);

  // Update markers when they change
  useEffect(() => {
    if (mapLoaded) {
      updateMapMarkers();
    }
  }, [markers, tempMarker, mapLoaded, markerColor]);

  // Mettre à jour les marqueurs sur la carte
  const updateMapMarkers = () => {
    if (!mapRef.current || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add permanent markers
    markers.forEach((marker) => {
      const markerIcon = L.icon({
        iconUrl: getMarkerIconUrl(marker.color),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      });

      L.marker([marker.lat, marker.lng], { icon: markerIcon })
        .bindPopup(marker.label)
        .addTo(markersLayerRef.current!);
    });

    // Add temp marker if exists
    if (tempMarker) {
      const markerIcon = L.icon({
        iconUrl: getMarkerIconUrl(markerColor),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
      });

      L.marker([tempMarker.lat, tempMarker.lng], { icon: markerIcon })
        .bindPopup(`<div>
          <p>${t("map.markerPositionSet")}</p>
          <p>${t("map.latitude")}: ${tempMarker.lat.toFixed(6)}</p>
          <p>${t("map.longitude")}: ${tempMarker.lng.toFixed(6)}</p>
        </div>`)
        .openPopup()
        .addTo(markersLayerRef.current);
    }
  };

  // Fonction pour obtenir l'URL de l'icône de marqueur en fonction de la couleur
  const getMarkerIconUrl = (color: string) => {
    const colorMapping: Record<string, string> = {
      red: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      blue: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      green: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      yellow: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      purple: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'
    };

    return colorMapping[color] || colorMapping.red;
  };

  // Gérer le clic sur la carte
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setTempMarker({ lat, lng });
    toast.info(t("map.markerPositionSet"));
  };

  // Rechercher une adresse
  const searchAddress = async () => {
    if (!address.trim() || isSearching) return;

    // Annuler la recherche précédente si elle existe
    if (searchAbortController.current) {
      searchAbortController.current.abort();
    }

    searchAbortController.current = new AbortController();

    setIsSearching(true);
    setSearchError(null);
    setLastSearch(address);

    console.log(`Recherche d'adresse: ${address}`);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
        {
          headers: {
            "Accept": "application/json",
            "User-Agent": "LocalSEOApp"
          },
          signal: searchAbortController.current.signal
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Résultats de recherche:", data);

      if (!data || data.length === 0) {
        setSearchError(t("map.noResults") + " " + address);
        toast.warning(`${t("map.noResults")} "${address}". ${t("map.tryMorePrecise")}`);
        return;
      }

      const { lat, lon, display_name, place_rank, boundingbox } = data[0];
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      // Déterminer le type de recherche
      let searchTypeResult: 'country' | 'city' | 'address' = 'address';
      if (place_rank <= 4) {
        searchTypeResult = 'country';
      } else if (place_rank <= 12) {
        searchTypeResult = 'city';
      }
      setSearchType(searchTypeResult);

      if (!mapRef.current) return;

      // Zoomer sur les résultats
      if (searchTypeResult === 'country' && boundingbox) {
        const southWest = [parseFloat(boundingbox[0]), parseFloat(boundingbox[2])] as [number, number];
        const northEast = [parseFloat(boundingbox[1]), parseFloat(boundingbox[3])] as [number, number];
        
        const bounds = L.latLngBounds(southWest, northEast);
        mapRef.current.fitBounds(bounds);
      } else {
        const zoom = searchTypeResult === 'city' ? 12 : 16;
        mapRef.current.setView([latitude, longitude], zoom);
      }

      toast.success(`${t("map.locationFound")}: ${display_name} (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`);
      console.log(`Emplacement trouvé: ${display_name} (${latitude}, ${longitude})`);

      // Placer un marqueur temporaire
      if (activeMode === 'addMarker') {
        setTempMarker({ lat: latitude, lng: longitude });
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Recherche annulée');
      } else {
        console.error("Erreur de recherche:", error);
        setSearchError(t("map.searchError"));
        toast.error(t("map.searchError"));
      }
    } finally {
      setIsSearching(false);
      searchAbortController.current = null;
    }
  };

  // Ajouter un marqueur à la liste
  const addMarker = () => {
    if (!tempMarker) return;
    if (!markerLabel.trim()) {
      toast.warning(t("map.enterAddress"));
      return;
    }

    const newMarker = {
      lat: tempMarker.lat,
      lng: tempMarker.lng,
      label: markerLabel,
      color: markerColor
    };

    setMarkers([...markers, newMarker]);
    setTempMarker(null);
    setMarkerLabel('');
    toast.success(`${t("map.markerAdded")} "${markerLabel}" ${t("map.added")}`);
    setActiveMode('search');
  };

  // Supprimer un marqueur
  const deleteMarker = (index: number) => {
    const updatedMarkers = [...markers];
    updatedMarkers.splice(index, 1);
    setMarkers(updatedMarkers);
    toast.success(t("map.markerDeleted"));
  };

  // Gérer l'appui sur la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSearching) {
      // Annuler le timeout précédent s'il existe
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      
      // Lancer la recherche immédiatement
      searchAddress();
    }
  };

  // Annuler l'ajout d'un marqueur
  const cancelAddMarker = () => {
    setTempMarker(null);
    setMarkerLabel('');
    setActiveMode('search');
  };

  // Générer le code d'intégration
  const generateEmbedCode = () => {
    let markersStr = markers.map(m => 
      `L.marker([${m.lat}, ${m.lng}]).addTo(map).bindPopup("${m.label.replace(/"/g, '\\"')}")`
    ).join(';\n    ');

    return `<!DOCTYPE html>
<html>
<head>
  <title>Ma Carte Personnalisée</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <style>
    #map { height: 500px; width: 100%; }
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <h2>Ma Carte Personnalisée</h2>
  <div id="map"></div>
  <script>
    var map = L.map('map').setView([${mapRef.current?.getCenter().lat || 48.856614}, ${mapRef.current?.getCenter().lng || 2.3522219}], ${mapRef.current?.getZoom() || 13});
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    ${markersStr}
  </script>
</body>
</html>`;
  };

  // Copier le code d'intégration
  const copyEmbedCode = () => {
    const code = generateEmbedCode();
    navigator.clipboard.writeText(code);
    toast.success(t("map.codeCopied"));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("map.title")}</DialogTitle>
          <DialogDescription>{t("map.description")}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow overflow-hidden">
          <div className="md:col-span-2 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder={t("map.addressPlaceholder")}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={isSearching}
              />
              <Button 
                onClick={searchAddress} 
                disabled={isSearching || !address.trim()}
              >
                {isSearching ? t("map.searching") : t("map.search")}
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Button
                variant={activeMode === 'search' ? "default" : "outline"}
                onClick={() => setActiveMode('search')}
                className="flex-1"
              >
                {t("map.search")}
              </Button>
              <Button
                variant={activeMode === 'addMarker' ? "default" : "outline"}
                onClick={() => setActiveMode('addMarker')}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("map.addMarker")}
              </Button>
              <Button
                variant={activeMode === 'move' ? "default" : "outline"}
                onClick={() => setActiveMode('move')}
                className="flex-1"
              >
                <Map className="h-4 w-4 mr-2" />
                {t("map.moveMap")}
              </Button>
            </div>

            {searchError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
                {searchError}
              </div>
            )}

            {activeMode === 'addMarker' && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg mb-4">
                {tempMarker 
                  ? (
                    <div className="space-y-2">
                      <p>{t("map.markerPositionSet")}</p>
                      <Input
                        placeholder={t("map.markerName")}
                        value={markerLabel}
                        onChange={(e) => setMarkerLabel(e.target.value)}
                        className="mb-2"
                      />
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{t("map.chooseMarkerColor")}:</p>
                        <RadioGroup value={markerColor} onValueChange={(val) => setMarkerColor(val as any)} className="flex items-center gap-2">
                          {['red', 'blue', 'green', 'yellow', 'purple'].map((color) => (
                            <div key={color} className="flex items-center space-x-1">
                              <RadioGroupItem value={color} id={`color-${color}`} className={`bg-${color}-500`} />
                              <Label htmlFor={`color-${color}`}>{t(`map.color.${color}`)}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={addMarker} disabled={!markerLabel.trim()}>
                          {t("map.add")}
                        </Button>
                        <Button variant="outline" onClick={cancelAddMarker}>
                          {t("map.cancel")}
                        </Button>
                      </div>
                    </div>
                  )
                  : <p>{t("map.clickToAddMarker")}</p>
                }
              </div>
            )}

            <div 
              ref={mapContainer} 
              className="flex-grow border rounded-lg overflow-hidden relative"
            >
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}

              {showLegend && (
                <div className="absolute bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
                  <h3 className="font-bold mb-2">{t("map.legendTitle")}</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span>{t("map.legendItems.importantPlaces")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span>{t("map.legendItems.clientLocation")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span>{t("map.legendItems.competitors")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span>{t("map.legendItems.pointsOfInterest")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span>{t("map.legendItems.targetAreas")}</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-3">
              <Button 
                variant="outline" 
                onClick={() => setShowLegend(!showLegend)}
                className="text-xs"
              >
                {showLegend ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    {t("map.hideLegend")}
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    {t("map.showLegend")}
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500">
                {searchType === 'country' && <span>{t("map.countrySearch")}</span>}
                {searchType === 'city' && <span>{t("map.citySearch")}</span>}
                {searchType === 'address' && <span>{t("map.addressSearch")}</span>}
                {lastSearch && <span> - {lastSearch}</span>}
              </div>

              <Button 
                variant="outline" 
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="text-xs"
              >
                {showEmbedCode ? t("map.hide") : t("map.show")} {t("map.embedCode")}
              </Button>
            </div>

            {showEmbedCode && (
              <div className="mt-3 relative">
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">{generateEmbedCode()}</pre>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyEmbedCode}
                  className="absolute top-2 right-2"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 overflow-auto max-h-full">
            <h3 className="font-semibold flex items-center mb-3">
              <MapPin className="h-4 w-4 mr-2" />
              {t("map.markers")}
            </h3>
            
            {markers.length === 0 ? (
              <p className="text-gray-500 text-sm">{t("map.noMarkers")}</p>
            ) : (
              <div className="space-y-3">
                {markers.map((marker, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-start border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{marker.label}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          if (mapRef.current) {
                            mapRef.current.setView([marker.lat, marker.lng], 16);
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteMarker(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mapRef.current && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">{t("map.locationDetails")}</h4>
                <div className="space-y-1 text-sm">
                  <p>{t("map.latitude")}: {mapRef.current.getCenter().lat.toFixed(6)}</p>
                  <p>{t("map.longitude")}: {mapRef.current.getCenter().lng.toFixed(6)}</p>
                  <p>{t("map.zoomLevel")}: {mapRef.current.getZoom()}</p>
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
