
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Search, Map, Circle, Square, Minus, Edit3 } from "lucide-react";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

// Solve Leaflet's icon issue
// @ts-ignore - nécessaire car les ressources statiques ne sont pas typées
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Types
interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ZOOM_LEVEL = 13;
const DEFAULT_CENTER: [number, number] = [48.866667, 2.333333]; // Paris

const MapModal = ({ open, onOpenChange }: MapModalProps) => {
  const { toast } = useToast();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [iframeCode, setIframeCode] = useState<string>("");
  const [mapSettings, setMapSettings] = useState({
    mapType: "streets",
    zoom: ZOOM_LEVEL,
    width: "100%",
    height: "400px",
  });
  const [legendText, setLegendText] = useState<string>("");
  const drawnItemsLayerRef = useRef<L.FeatureGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Gérer le changement de texte de la légende
  const handleLegendChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLegendText(e.target.value);
    // Générer le code après un court délai
    setTimeout(generateIframeCode, 100);
  };

  // Gérer le changement de la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Fonction de recherche de lieu via l'API Nominatim d'OpenStreetMap
  const searchLocation = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      toast({
        title: "Requête trop courte",
        description: "Veuillez entrer au moins 2 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        // Prendre le premier résultat
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        if (mapRef.current) {
          mapRef.current.setView([lat, lon], ZOOM_LEVEL);
          
          // Ajouter un marqueur à l'emplacement trouvé
          L.marker([lat, lon])
            .addTo(mapRef.current)
            .bindPopup(`<b>${location.display_name}</b>`)
            .openPopup();

          // Mettre à jour le code iframe après avoir ajouté le marqueur
          setTimeout(generateIframeCode, 100);
          
          toast({
            title: "Emplacement trouvé",
            description: location.display_name,
          });
        }
      } else {
        toast({
          title: "Aucun résultat",
          description: "Aucun emplacement trouvé pour cette recherche",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de rechercher cet emplacement",
        variant: "destructive",
      });
    }
  };

  // Changer le fond de carte
  const changeMapType = (type: string) => {
    if (!mapRef.current) return;
    
    // Supprimer les couches de tuiles existantes
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapRef.current?.removeLayer(layer);
      }
    });
    
    // Ajouter la nouvelle couche de tuiles
    if (type === "streets") {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else if (type === "satellite") {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(mapRef.current);
    } else if (type === "terrain") {
      L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else if (type === "dark") {
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      }).addTo(mapRef.current);
    }

    // Mettre à jour les paramètres de la carte
    setMapSettings({
      ...mapSettings,
      mapType: type
    });
    
    // Régénérer le code iframe après un court délai
    setTimeout(generateIframeCode, 100);
  };

  // Fonction pour générer le code iframe pour intégrer la carte
  const generateIframeCode = () => {
    if (!mapRef.current || !drawnItemsLayerRef.current) return;
    
    try {
      // Obtenir les limites actuelles de la carte
      const bounds = mapRef.current.getBounds();
      const center = mapRef.current.getCenter();
      const zoom = mapRef.current.getZoom();
      
      // Préparer les données GeoJSON pour les éléments dessinés
      const drawnItems = drawnItemsLayerRef.current.toGeoJSON();
      const drawnItemsJson = JSON.stringify(drawnItems);

      // Créer le contenu HTML de l'iframe
      let iframeContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Carte interactive</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
  <style>
    body, html, #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
    }
    .legend {
      padding: 10px;
      background: white;
      border-radius: 5px;
      max-width: 300px;
      box-shadow: 0 0 15px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
  <script>
    // Initialiser la carte
    var map = L.map('map').setView([${center.lat}, ${center.lng}], ${zoom});
    
    // Ajouter le fond de carte
    ${getMapLayerCode(mapSettings.mapType)}
    
    // Ajouter les éléments dessinés
    var drawnItems = ${drawnItemsJson};
    L.geoJSON(drawnItems, {
      style: function(feature) {
        return {
          color: feature.properties.color || '#3388ff',
          weight: feature.properties.weight || 3,
          opacity: feature.properties.opacity || 0.5,
          fillOpacity: feature.properties.fillOpacity || 0.2
        };
      },
      pointToLayer: function(feature, latlng) {
        return L.marker(latlng);
      }
    }).addTo(map);
    
    ${legendText ? `
    // Ajouter la légende
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML = \`${legendText.replace(/`/g, '\\`')}\`;
      return div;
    };
    legend.addTo(map);
    ` : ''}
  </script>
</body>
</html>
      `;
      
      // Coder le contenu en base64 pour l'iframe
      const encodedContent = btoa(iframeContent);
      
      // Créer le code iframe
      const iframeCodeStr = `<iframe src="data:text/html;base64,${encodedContent}" width="${mapSettings.width}" height="${mapSettings.height}" style="border:none;"></iframe>`;
      
      setIframeCode(iframeCodeStr);
    } catch (error) {
      console.error("Erreur lors de la génération du code iframe:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le code d'intégration",
        variant: "destructive",
      });
    }
  };

  // Fonction pour obtenir le code JavaScript du fond de carte
  const getMapLayerCode = (mapType: string) => {
    switch (mapType) {
      case "streets":
        return `L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);`;
      case "satellite":
        return `L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);`;
      case "terrain":
        return `L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);`;
      case "dark":
        return `L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
        }).addTo(map);`;
      default:
        return `L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);`;
    }
  };

  // Activer l'outil de dessin sur la carte
  const enableDrawTool = (drawType: string) => {
    if (!mapRef.current || !drawnItemsLayerRef.current) return;
    
    // Supprimer tout contrôle de dessin existant
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Control) {
        mapRef.current?.removeControl(layer);
      }
    });
    
    // Options de l'outil de dessin
    const drawOptions: L.Control.DrawConstructorOptions = {
      draw: {
        polyline: false,
        polygon: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItemsLayerRef.current,
      }
    };
    
    // Activer l'outil spécifique
    switch (drawType) {
      case "marker":
        drawOptions.draw.marker = true;
        break;
      case "polyline":
        drawOptions.draw.polyline = true;
        break;
      case "polygon":
        drawOptions.draw.polygon = true;
        break;
      case "rectangle":
        drawOptions.draw.rectangle = true;
        break;
      case "circle":
        drawOptions.draw.circle = true;
        break;
    }
    
    // Créer et ajouter le contrôle de dessin
    const drawControl = new L.Control.Draw(drawOptions);
    mapRef.current.addControl(drawControl);
    
    toast({
      title: "Outil de dessin activé",
      description: `Vous pouvez maintenant dessiner un ${drawType} sur la carte`,
    });
  };

  // Créer et initialiser la carte seulement quand le modal est ouvert
  useEffect(() => {
    // Ne rien faire si le modal n'est pas ouvert
    if (!open || !mapContainerRef.current) return;

    console.log("Initialisation de la carte");
    
    // Vérifier si la carte est déjà initialisée
    if (!mapInitialized && !mapRef.current) {
      try {
        // Créer la carte
        const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, ZOOM_LEVEL);
        mapRef.current = map;
        
        // Ajouter le fond de carte par défaut
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Créer une couche pour les éléments dessinés
        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);
        drawnItemsLayerRef.current = drawnItems;
        
        // Ajouter les gestionnaires d'événements pour le dessin
        map.on(L.Draw.Event.CREATED, (event: any) => {
          const layer = event.layer;
          drawnItems.addLayer(layer);
          
          // Générer le code iframe après l'ajout d'un élément
          setTimeout(generateIframeCode, 100);
        });
        
        map.on(L.Draw.Event.EDITED, () => {
          // Régénérer le code iframe après l'édition
          setTimeout(generateIframeCode, 100);
        });
        
        map.on(L.Draw.Event.DELETED, () => {
          // Régénérer le code iframe après la suppression
          setTimeout(generateIframeCode, 100);
        });
        
        // Générer le code iframe initial
        setTimeout(generateIframeCode, 500);
        
        setMapInitialized(true);
        console.log("Carte initialisée avec succès");
      } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte:", error);
        toast({
          title: "Erreur d'initialisation",
          description: "Impossible d'initialiser la carte",
          variant: "destructive",
        });
      }
    }
    
    // Nettoyage lors de la fermeture du modal
    return () => {
      if (mapRef.current && open) {
        console.log("Nettoyage de la carte");
        mapRef.current.remove();
        mapRef.current = null;
        setMapInitialized(false);
        drawnItemsLayerRef.current = null;
      }
    };
  }, [open, mapInitialized]);

  // Copier le code iframe dans le presse-papier
  const copyIframeCode = () => {
    if (!iframeCode) {
      toast({
        title: "Aucun code à copier",
        description: "Veuillez d'abord générer un code d'intégration",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(iframeCode)
      .then(() => {
        toast({
          title: "Code copié",
          description: "Le code d'intégration a été copié dans le presse-papier",
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la copie:", error);
        toast({
          title: "Erreur",
          description: "Impossible de copier le code",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-purple-800">
            Créer une carte interactive
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Personnalisez votre carte et obtenez le code d'intégration pour votre site web
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mb-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Entrez une ville, un pays ou une adresse..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button onClick={searchLocation}>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </div>
        
        {/* Outils de dessin */}
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={() => enableDrawTool("marker")}
            className="flex-1"
          >
            <Map className="h-4 w-4 mr-2" />
            Marqueur
          </Button>
          <Button 
            variant="outline" 
            onClick={() => enableDrawTool("polyline")}
            className="flex-1"
          >
            <Minus className="h-4 w-4 mr-2" />
            Ligne
          </Button>
          <Button 
            variant="outline" 
            onClick={() => enableDrawTool("polygon")}
            className="flex-1"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Polygone
          </Button>
          <Button 
            variant="outline" 
            onClick={() => enableDrawTool("rectangle")}
            className="flex-1"
          >
            <Square className="h-4 w-4 mr-2" />
            Rectangle
          </Button>
          <Button 
            variant="outline" 
            onClick={() => enableDrawTool("circle")}
            className="flex-1"
          >
            <Circle className="h-4 w-4 mr-2" />
            Cercle
          </Button>
        </div>
        
        {/* Carte */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <div 
              ref={mapContainerRef} 
              className="w-full h-full rounded-md overflow-hidden border border-gray-200"
            />
          </div>
          
          <div className="w-1/3 overflow-auto">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Type de carte</h3>
                <Select 
                  value={mapSettings.mapType} 
                  onValueChange={(value) => changeMapType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de carte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="streets">Rues</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Légende</h3>
                <Textarea 
                  placeholder="Ajoutez une légende pour votre carte..."
                  value={legendText}
                  onChange={handleLegendChange}
                  className="h-32"
                />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Code d'intégration</h3>
                <Textarea 
                  value={iframeCode} 
                  readOnly 
                  className="h-32 font-mono text-xs"
                />
                <Button 
                  variant="outline" 
                  onClick={copyIframeCode}
                  className="mt-2 w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le code
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
