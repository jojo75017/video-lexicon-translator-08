
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const MapModal = ({ isOpen, onClose, title = "Créer une carte interactive" }: MapModalProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !isOpen) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([48.8566, 2.3522], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add a marker
    const marker = L.marker([48.8566, 2.3522]).addTo(map.current);
    marker.bindPopup("Paris").openPopup();

    // Enable scroll wheel zoom
    map.current.scrollWheelZoom.enable();

    return () => {
      map.current?.remove();
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[60vh]">
          <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
