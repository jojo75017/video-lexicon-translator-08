
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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

// Schema pour la validation du formulaire
const searchFormSchema = z.object({
  searchQuery: z.string().min(2, "Entrez au moins 2 caractères")
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const MapModal = ({ isOpen, onClose, title = "Créer une carte interactive" }: MapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const { toast } = useToast();
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string }>({
    lat: 48.8566,
    lng: 2.3522,
    name: "Paris"
  });
  const [iframeCode, setIframeCode] = useState<string>("");

  // Initialisation du formulaire
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchQuery: "",
    },
  });

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
        generateIframeCode(newLocation);
        
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

  // Générer le code iframe pour le lieu actuel
  const generateIframeCode = (loc = location) => {
    const iframeWidth = 600;
    const iframeHeight = 400;
    const zoom = 13;
    
    const code = `<iframe width="${iframeWidth}" height="${iframeHeight}" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - 0.05},${loc.lat - 0.05},${loc.lng + 0.05},${loc.lat + 0.05}&amp;layer=mapnik&amp;marker=${loc.lat},${loc.lng}" style="border: 1px solid black"></iframe><br/><small><a href="https://www.openstreetmap.org/?mlat=${loc.lat}&amp;mlon=${loc.lng}#map=${zoom}/${loc.lat}/${loc.lng}">Voir sur OpenStreetMap</a></small>`;
    
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
      description: "Le code iframe a été téléchargé avec succès",
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
      }
    };
  }, [isOpen, location.lat, location.lng, toast]);

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
            Recherchez un lieu et créez une carte interactive à intégrer sur votre site.
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
        
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium">Code iframe pour intégration</h3>
          <Textarea
            value={iframeCode}
            readOnly
            className="font-mono text-sm h-24"
          />
          <div className="flex justify-end">
            <Button onClick={downloadIframeCode} className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Télécharger l'iframe
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
