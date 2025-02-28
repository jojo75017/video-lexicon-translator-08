
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, MapPin, Square, Pencil, Circle, Type } from "lucide-react";
import { Form, FormField, FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Schéma pour la validation du formulaire
const searchFormSchema = z.object({
  searchQuery: z.string().min(2, "Entrez au moins 2 caractères")
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

// Types pour les éléments dessinés
interface DrawnItems {
  markers: L.Marker[];
  polygons: L.Polygon[];
  polylines: L.Polyline[];
  circles: L.Circle[];
}

const MapModal = ({ isOpen, onClose, title = "Créer une carte interactive" }: MapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const { toast } = useToast();
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 48.8566,
    lng: 2.3522,
    name: "Paris"
  });
  const [iframeCode, setIframeCode] = useState<string>("");
  const [activeDrawTool, setActiveDrawTool] = useState<string | null>(null);
  const [drawnItems, setDrawnItems] = useState<DrawnItems>({
    markers: [],
    polygons: [],
    polylines: [],
    circles: []
  });
  const [legendText, setLegendText] = useState<string>("");
  const drawnItemsLayerRef = useRef<L.FeatureGroup | null>(null);

  // Initialisation du formulaire
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

  // Gérer le changement de texte de la légende
  const handleLegendChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLegendText(e.target.value);
    // Mettre à jour le code iframe lorsque la légende change
    setTimeout(generateIframeCode, 100);
  };

  // Fonction de recherche de lieu via l'API Nominatim d'OpenStreetMap
  const searchLocation = async (searchQuery: string) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const newLocation = {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
          name: result.display_name
        };
        
        setLocation(newLocation);
        
        // Mettre à jour la carte
        if (mapInstance.current) {
          mapInstance.current.setView([newLocation.lat, newLocation.lng], 13);
          
          // Mettre à jour le marqueur
          if (marker) {
            marker.setLatLng([newLocation.lat, newLocation.lng]);
            marker.bindPopup(newLocation.name).openPopup();
          } else {
            const newMarker = L.marker([newLocation.lat, newLocation.lng]).addTo(mapInstance.current);
            newMarker.bindPopup(newLocation.name).openPopup();
            setMarker(newMarker);
          }
        }
        
        // Générer le code iframe pour ce lieu
        generateIframeCode();
        
        toast({
          title: "Lieu trouvé",
          description: `Carte centrée sur ${newLocation.name}`,
        });
      } else {
        toast({
          title: "Aucun résultat",
          description: "Aucun lieu trouvé pour cette recherche",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher ce lieu. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Activer un outil de dessin
  const enableDrawTool = (tool: string) => {
    if (!mapInstance.current || !drawnItemsLayerRef.current) return;
    
    // Désactiver l'outil actif
    if (drawControlRef.current) {
      mapInstance.current.removeControl(drawControlRef.current);
    }

    // Options de base pour tous les outils
    const drawOptions: L.Control.DrawOptions = {
      draw: {
        rectangle: false,
        circlemarker: false,
        marker: false,
        circle: false,
        polygon: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItemsLayerRef.current,
        remove: true
      }
    };

    // Activer l'outil sélectionné
    switch (tool) {
      case 'marker':
        drawOptions.draw.marker = true;
        break;
      case 'polygon':
        drawOptions.draw.polygon = {
          allowIntersection: false,
          showArea: true,
        };
        break;
      case 'polyline':
        drawOptions.draw.polyline = {
          shapeOptions: {
            color: '#3388ff',
            weight: 4
          }
        };
        break;
      case 'circle':
        drawOptions.draw.circle = {
          shapeOptions: {
            color: '#3388ff'
          }
        };
        break;
      default:
        break;
    }

    // Créer et ajouter le contrôle de dessin
    const drawControl = new L.Control.Draw(drawOptions);
    mapInstance.current.addControl(drawControl);
    drawControlRef.current = drawControl;
    setActiveDrawTool(tool);
    
    toast({
      title: "Outil activé",
      description: `Outil de dessin "${tool}" activé. Cliquez sur la carte pour dessiner.`,
    });
  };

  // Désactiver tous les outils de dessin
  const disableDrawTools = () => {
    if (!mapInstance.current || !drawControlRef.current) return;
    
    mapInstance.current.removeControl(drawControlRef.current);
    drawControlRef.current = null;
    setActiveDrawTool(null);
  };

  // Effacer tous les éléments dessinés
  const clearDrawnItems = () => {
    if (!drawnItemsLayerRef.current) return;

    drawnItemsLayerRef.current.clearLayers();
    setDrawnItems({
      markers: [],
      polygons: [],
      polylines: [],
      circles: []
    });
    
    toast({
      title: "Éléments effacés",
      description: "Tous les éléments dessinés ont été supprimés.",
    });
    
    // Mettre à jour l'iframe
    generateIframeCode();
  };

  // Générer le code iframe pour le lieu actuel et les éléments dessinés
  const generateIframeCode = () => {
    const iframeWidth = 600;
    const iframeHeight = 400;
    const zoom = 13;
    
    // Code de base avec le marqueur pour l'emplacement
    let code = `<!DOCTYPE html>
<html>
<head>
  <title>Carte interactive</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { width: ${iframeWidth}px; height: ${iframeHeight}px; }
    .map-legend {
      position: absolute;
      bottom: 30px;
      left: 10px;
      z-index: 1000;
      background-color: white;
      padding: 8px 15px;
      border-radius: 5px;
      max-width: 70%;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  ${legendText ? `<div class="map-legend">${legendText}</div>` : ''}
  <script>
    // Initialiser la carte
    const map = L.map('map').setView([${location.lat}, ${location.lng}], ${zoom});
    
    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Ajouter le marqueur principal
    L.marker([${location.lat}, ${location.lng}])
      .addTo(map)
      .bindPopup("${location.name}")
      .openPopup();
`;

    // Ajouter du code pour les éléments dessinés
    if (drawnItemsLayerRef.current) {
      // Ajouter les marqueurs additionnels
      drawnItems.markers.forEach((marker, i) => {
        const latlng = marker.getLatLng();
        code += `
    // Marqueur additionnel ${i + 1}
    L.marker([${latlng.lat}, ${latlng.lng}]).addTo(map);`;
      });

      // Ajouter les polygones
      drawnItems.polygons.forEach((polygon, i) => {
        const coordinates = polygon.getLatLngs()[0];
        if (Array.isArray(coordinates)) {
          const points = (coordinates as L.LatLng[]).map(latlng => `[${latlng.lat}, ${latlng.lng}]`).join(', ');
          code += `
    // Polygone ${i + 1}
    L.polygon([${points}], {color: '${polygon.options.color || 'blue'}'}).addTo(map);`;
        }
      });

      // Ajouter les polylines
      drawnItems.polylines.forEach((polyline, i) => {
        const coordinates = polyline.getLatLngs();
        const points = (coordinates as L.LatLng[]).map(latlng => `[${latlng.lat}, ${latlng.lng}]`).join(', ');
        code += `
    // Ligne ${i + 1}
    L.polyline([${points}], {color: '${polyline.options.color || 'blue'}'}).addTo(map);`;
      });

      // Ajouter les cercles
      drawnItems.circles.forEach((circle, i) => {
        const center = circle.getLatLng();
        const radius = circle.getRadius();
        code += `
    // Cercle ${i + 1}
    L.circle([${center.lat}, ${center.lng}], {
      radius: ${radius},
      color: '${circle.options.color || 'blue'}'
    }).addTo(map);`;
      });
    }

    // Fermer le script et le HTML
    code += `
  </script>
</body>
</html>`;

    setIframeCode(code);
    return code;
  };

  // Télécharger le code iframe
  const downloadIframeCode = () => {
    const element = document.createElement('a');
    const file = new Blob([iframeCode], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `carte_${location.name.substring(0, 20).replace(/\W+/g, '_')}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Téléchargement réussi",
      description: "Le code HTML de la carte a été téléchargé avec succès",
    });
  };

  // Soumettre le formulaire de recherche
  const onSubmit = (values: SearchFormValues) => {
    searchLocation(values.searchQuery);
  };

  // Créer et initialiser la carte seulement quand le modal est ouvert
  useEffect(() => {
    // Ne rien faire si le modal n'est pas ouvert
    if (!isOpen) return;
    
    // Fonction d'initialisation de la carte
    const initializeMap = () => {
      try {
        console.log("Tentative d'initialisation de la carte");
        
        // Nettoyer la carte existante si elle existe
        if (mapInstance.current) {
          console.log("Suppression de la carte existante");
          mapInstance.current.remove();
          mapInstance.current = null;
          setMarker(null);
        }
        
        // Vérifier si le conteneur de la carte existe
        if (!mapContainer.current) {
          console.error("Le conteneur de carte est null");
          return;
        }
        
        // Assurez-vous que le DOM est complètement chargé
        setTimeout(() => {
          if (!mapContainer.current) return;
          
          console.log("Création de la carte", mapContainer.current.clientWidth, mapContainer.current.clientHeight);
          
          // Créer une nouvelle instance de carte
          const map = L.map(mapContainer.current, {
            center: [location.lat, location.lng],
            zoom: 13,
            scrollWheelZoom: true,
          });
          
          // Ajouter les tuiles OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Initialiser le groupe de features pour les éléments dessinés
          const drawnItemsLayer = new L.FeatureGroup();
          map.addLayer(drawnItemsLayer);
          drawnItemsLayerRef.current = drawnItemsLayer;
          
          // Écouter les événements de dessin
          map.on(L.Draw.Event.CREATED, (event: any) => {
            const { layerType, layer } = event;
            
            // Ajouter la couche au groupe de features
            drawnItemsLayer.addLayer(layer);
            
            // Mettre à jour l'état des éléments dessinés
            setDrawnItems(prev => {
              const newItems = { ...prev };
              
              switch (layerType) {
                case 'marker':
                  newItems.markers = [...prev.markers, layer as L.Marker];
                  break;
                case 'polygon':
                  newItems.polygons = [...prev.polygons, layer as L.Polygon];
                  break;
                case 'polyline':
                  newItems.polylines = [...prev.polylines, layer as L.Polyline];
                  break;
                case 'circle':
                  newItems.circles = [...prev.circles, layer as L.Circle];
                  break;
                default:
                  break;
              }
              
              return newItems;
            });
            
            // Mettre à jour l'iframe
            setTimeout(generateIframeCode, 100);
            
            toast({
              title: "Élément ajouté",
              description: `Un ${layerType} a été ajouté à la carte.`,
            });
          });
          
          // Écouter les événements d'édition
          map.on(L.Draw.Event.EDITED, () => {
            toast({
              title: "Édition terminée",
              description: "Les éléments ont été modifiés.",
            });
            
            // Mettre à jour l'iframe
            setTimeout(generateIframeCode, 100);
          });
          
          // Écouter les événements de suppression
          map.on(L.Draw.Event.DELETED, (event: any) => {
            const layers = event.layers;
            
            // Mettre à jour l'état des éléments dessinés
            layers.eachLayer((layer: any) => {
              setDrawnItems(prev => {
                const newItems = { ...prev };
                
                if (layer instanceof L.Marker) {
                  newItems.markers = prev.markers.filter(m => m !== layer);
                } else if (layer instanceof L.Polygon) {
                  newItems.polygons = prev.polygons.filter(p => p !== layer);
                } else if (layer instanceof L.Polyline) {
                  newItems.polylines = prev.polylines.filter(p => p !== layer);
                } else if (layer instanceof L.Circle) {
                  newItems.circles = prev.circles.filter(c => c !== layer);
                }
                
                return newItems;
              });
            });
            
            toast({
              title: "Éléments supprimés",
              description: "Les éléments sélectionnés ont été supprimés.",
            });
            
            // Mettre à jour l'iframe
            setTimeout(generateIframeCode, 100);
          });
          
          // Ajouter un marqueur
          const newMarker = L.marker([location.lat, location.lng]).addTo(map)
            .bindPopup(location.name)
            .openPopup();
          
          // Stocker le marqueur et l'instance de carte pour le nettoyage
          setMarker(newMarker);
          mapInstance.current = map;
          
          // Forcer une mise à jour de la taille de la carte
          map.invalidateSize(true);
          
          // Générer le code iframe initial
          generateIframeCode();
          
          console.log("Carte initialisée avec succès");
          setIsMapInitialized(true);
        }, 300);
      } catch (error) {
        console.error("Erreur d'initialisation de la carte:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la carte. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    };

    // Initialiser la carte après un court délai pour s'assurer que le DOM est prêt
    const timer = setTimeout(initializeMap, 300);
    
    // Nettoyer lors du démontage
    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        console.log("Nettoyage de la carte");
        mapInstance.current.remove();
        mapInstance.current = null;
        setMarker(null);
        setIsMapInitialized(false);
        setDrawnItems({
          markers: [],
          polygons: [],
          polylines: [],
          circles: []
        });
      }
    };
  }, [isOpen, location.lat, location.lng]);

  // Pour gérer le redimensionnement du DOM quand le modal est ouvert
  useEffect(() => {
    if (isOpen && mapInstance.current) {
      const resizeMap = () => {
        if (mapInstance.current) {
          console.log("Mise à jour de la taille de la carte");
          mapInstance.current.invalidateSize(true);
        }
      };
      
      // Utilisé pour redimensionner la carte après l'animation d'ouverture du modal
      window.addEventListener('resize', resizeMap);
      const timer = setTimeout(resizeMap, 500);
      
      return () => {
        window.removeEventListener('resize', resizeMap);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Recherchez un lieu, ajoutez des marqueurs, dessinez des zones et créez une carte interactive à intégrer sur votre site.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-4">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="searchQuery"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder="Entrez une ville, un pays ou une adresse..." 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </form>
        </Form>
        
        {/* Outils de dessin */}
        <div className="flex gap-2 mb-4">
          <Button 
            onClick={() => enableDrawTool('marker')}
            variant={activeDrawTool === 'marker' ? 'default' : 'outline'}
            size="sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Marqueur
          </Button>
          <Button 
            onClick={() => enableDrawTool('polygon')}
            variant={activeDrawTool === 'polygon' ? 'default' : 'outline'}
            size="sm"
          >
            <Square className="h-4 w-4 mr-2" />
            Zone
          </Button>
          <Button 
            onClick={() => enableDrawTool('polyline')}
            variant={activeDrawTool === 'polyline' ? 'default' : 'outline'}
            size="sm"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Chemin
          </Button>
          <Button 
            onClick={() => enableDrawTool('circle')}
            variant={activeDrawTool === 'circle' ? 'default' : 'outline'}
            size="sm"
          >
            <Circle className="h-4 w-4 mr-2" />
            Cercle
          </Button>
          {activeDrawTool && (
            <Button 
              onClick={disableDrawTools}
              variant="destructive"
              size="sm"
            >
              Désactiver
            </Button>
          )}
          <Button 
            onClick={clearDrawnItems}
            variant="secondary"
            size="sm"
            className="ml-auto"
          >
            Effacer tout
          </Button>
        </div>
        
        <div className="relative w-full h-[40vh] bg-gray-100 rounded-lg overflow-hidden">
          <div 
            ref={mapContainer} 
            className="absolute inset-0 rounded-lg z-10" 
            style={{ width: '100%', height: '100%' }}
          />
          {!isMapInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}
        </div>
        
        {/* Champ pour la légende */}
        <div className="mt-4">
          <FormItem>
            <FormLabel>
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Légende de la carte
              </div>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ajoutez une légende descriptive (ex: randonnée en Savoie, meilleurs restaurants au Vietnam...)"
                value={legendText}
                onChange={handleLegendChange}
                className="h-20"
              />
            </FormControl>
          </FormItem>
        </div>
        
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium">Code HTML pour intégration</h3>
          <Textarea
            value={iframeCode}
            readOnly
            className="font-mono text-sm h-24"
          />
          <div className="flex justify-end">
            <Button onClick={downloadIframeCode} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
