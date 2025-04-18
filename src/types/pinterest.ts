
export interface PinterestImage {
  id: string;
  title: string;
  description?: string;
  url?: string;
  src?: string;
  width?: number;
  height?: number;
  source?: string;
  tags?: string[];
  uploadedAt?: string;
  authorName?: string;
  authorUrl?: string;
  // Ajout des propriétés manquantes
  category?: string;
  country?: string;
  region?: GeoRegion;
}

export interface PinterestPin {
  title: string;
  description: string;
  globalDescription: string;
  hashtags: string[];
  tags: string[];
  callToAction: string;
  image: PinterestImage | null;
  uploadedImage: string | null;
  design: any;
  showHashtags: boolean;
}

// Constantes pour les emplacements géographiques
export const FRANCE_LOCATIONS = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice', 'Toulouse', 'Strasbourg'];
export const EUROPE_LOCATIONS = ['Londres', 'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Barcelone', 'Vienne'];
export const WORLD_LOCATIONS = ['New York', 'Tokyo', 'Sydney', 'Bangkok', 'Rio de Janeiro', 'Dubaï', 'Toronto'];

// Type pour les régions géographiques
export type GeoRegion = "france" | "europe" | "monde";
