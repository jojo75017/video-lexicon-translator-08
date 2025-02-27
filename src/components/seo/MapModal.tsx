
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

const MapModal = ({ isOpen, onClose, title = "Créer une carte interactive" }: MapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { toast } = useToast();
  const [isMapInitialized, setIsMapInitialized] = useState(false);

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
            center: [48.8566, 2.3522], // Paris
            zoom: 13,
            scrollWheelZoom: true,
          });
          
          // Ajouter les tuiles OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          
          // Ajouter un marqueur
          L.marker([48.8566, 2.3522]).addTo(map)
            .bindPopup("Paris")
            .openPopup();
          
          // Stocker l'instance de carte pour le nettoyage
          mapInstance.current = map;
          
          // Forcer une mise à jour de la taille de la carte
          map.invalidateSize(true);
          
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
        setIsMapInitialized(false);
      }
    };
  }, [isOpen, toast]);

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
            Explorez et interagissez avec la carte ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="relative w-full h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
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
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
