
import { PinterestImage } from '@/types/pinterest';
import { 
  FRANCE_LOCATIONS, 
  EUROPE_LOCATIONS, 
  WORLD_LOCATIONS,
  RELIABLE_FALLBACK_IMAGES
} from '@/types/pinterest';
import { toast } from 'sonner';

// Interface pour le résultat de la validation
interface ImageValidationResult {
  image: PinterestImage;
  confidenceScore: number;
  isConsistent: boolean;
}

// Fonction améliorée de validation et de filtrage des images
export const validateAndFixImages = (images: PinterestImage[]): PinterestImage[] => {
  if (!images || images.length === 0) return [];

  // Filtrer et scorer les images
  const validatedImages: ImageValidationResult[] = images
    .filter(img => img.url && img.url.startsWith('http'))
    .map(image => {
      const validationResult = calculateImageConsistency(image);
      return validationResult;
    })
    // Trier par score de confiance décroissant
    .sort((a, b) => b.confidenceScore - a.confidenceScore)
    // Ne garder que les images avec un score de confiance suffisant
    .filter(result => result.confidenceScore > 0.5);

  return validatedImages.map(result => {
    // Corriger le titre si nécessaire
    const correctedImage = ensureTitleMatchesLocation(result.image);
    return correctedImage;
  });
};

// Fonction pour calculer la cohérence et le score de confiance
const calculateImageConsistency = (image: PinterestImage): ImageValidationResult => {
  let confidenceScore = 0;
  const lowerTitle = image.title.toLowerCase();
  const lowerTags = image.tags?.map(tag => tag.toLowerCase()) || [];

  // Vérification de la catégorie
  if (image.category) {
    confidenceScore += 0.2;
  }

  // Vérification du pays/région
  if (image.country) {
    confidenceScore += 0.2;
    if (lowerTitle.includes(image.country.toLowerCase())) {
      confidenceScore += 0.2;
    }
  }

  if (image.region) {
    confidenceScore += 0.2;
    if (lowerTitle.includes(image.region.toLowerCase())) {
      confidenceScore += 0.2;
    }
  }

  // Vérification des tags
  const locationTags = [...FRANCE_LOCATIONS, ...EUROPE_LOCATIONS, ...WORLD_LOCATIONS];
  const matchingLocationTags = lowerTags.filter(tag => 
    locationTags.some(location => tag.includes(location))
  );

  if (matchingLocationTags.length > 0) {
    confidenceScore += 0.2;
  }

  // Vérification des critères spécifiques par catégorie
  switch (image.category) {
    case 'france':
      if (FRANCE_LOCATIONS.some(location => lowerTitle.includes(location))) {
        confidenceScore += 0.2;
      }
      break;
    case 'europe':
      if (EUROPE_LOCATIONS.some(location => lowerTitle.includes(location))) {
        confidenceScore += 0.2;
      }
      break;
    case 'monde':
      if (WORLD_LOCATIONS.some(location => lowerTitle.includes(location))) {
        confidenceScore += 0.2;
      }
      break;
  }

  // Limiter le score entre 0 et 1
  confidenceScore = Math.min(Math.max(confidenceScore, 0), 1);

  return {
    image,
    confidenceScore,
    isConsistent: confidenceScore > 0.5
  };
};

// Fonction pour s'assurer que le titre correspond à la localisation
const ensureTitleMatchesLocation = (image: PinterestImage): PinterestImage => {
  let updatedTitle = image.title;

  // Ajouter le pays/région au titre si absent
  if (image.country && !updatedTitle.toLowerCase().includes(image.country.toLowerCase())) {
    updatedTitle = `${image.country} - ${updatedTitle}`;
  }

  if (image.region && !updatedTitle.toLowerCase().includes(image.region.toLowerCase())) {
    updatedTitle = `${image.region} - ${updatedTitle}`;
  }

  return {
    ...image,
    title: updatedTitle
  };
};

// Ajout des fonctions requises par PinterestGenerator

// Recherche d'images sur Pixabay
export const searchPixabayImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => ({
      id: `pixabay-${index}-${Date.now()}`,
      url: RELIABLE_FALLBACK_IMAGES[category as keyof typeof RELIABLE_FALLBACK_IMAGES] || RELIABLE_FALLBACK_IMAGES.default,
      title: `${category === 'france' ? 'Paris' : category === 'europe' ? 'Rome' : 'New York'} - ${query} ${index + 1}`,
      category: category === 'all' ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') : (category as 'monde' | 'europe' | 'france'),
      country: category === 'france' ? 'France' : category === 'europe' ? 'Italie' : 'États-Unis',
      region: category === 'france' ? 'Île-de-France' : undefined,
      source: 'pixabay',
      tags: [query, category === 'france' ? 'paris' : category === 'europe' ? 'rome' : 'new york', 'voyage'],
      fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
    }));
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Pixabay:", error);
    toast.error("Erreur lors de la recherche d'images Pixabay");
    return [];
  }
};

// Recherche d'images sur Unsplash
export const searchUnsplashImages = async (query: string): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => ({
      id: `unsplash-${index}-${Date.now()}`,
      url: `https://source.unsplash.com/random/1000x1500/?${query},travel`,
      title: `${Math.random() > 0.5 ? 'Paris' : Math.random() > 0.5 ? 'Rome' : 'New York'} - ${query} ${index + 1}`,
      category: Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde',
      country: Math.random() > 0.6 ? 'France' : Math.random() > 0.5 ? 'Italie' : 'États-Unis',
      source: 'unsplash',
      tags: [query, 'travel', 'photography'],
      fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
    }));
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Unsplash:", error);
    toast.error("Erreur lors de la recherche d'images Unsplash");
    return [];
  }
};

// Recherche d'images sur Freepik
export const searchFreepikImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => ({
      id: `freepik-${index}-${Date.now()}`,
      url: RELIABLE_FALLBACK_IMAGES[category as keyof typeof RELIABLE_FALLBACK_IMAGES] || RELIABLE_FALLBACK_IMAGES.default,
      title: `${category === 'france' ? 'Paris' : category === 'europe' ? 'Rome' : 'New York'} - ${query} ${index + 1}`,
      category: category === 'all' ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') : (category as 'monde' | 'europe' | 'france'),
      country: category === 'france' ? 'France' : category === 'europe' ? 'Italie' : 'États-Unis',
      source: 'freepik',
      tags: [query, category === 'france' ? 'paris' : category === 'europe' ? 'rome' : 'new york', 'vector'],
      fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
    }));
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Freepik:", error);
    toast.error("Erreur lors de la recherche d'images Freepik");
    return [];
  }
};

// Recherche d'images sur Pexels
export const searchPexelsImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => ({
      id: `pexels-${index}-${Date.now()}`,
      url: RELIABLE_FALLBACK_IMAGES[category as keyof typeof RELIABLE_FALLBACK_IMAGES] || RELIABLE_FALLBACK_IMAGES.default,
      title: `${category === 'france' ? 'Paris' : category === 'europe' ? 'Rome' : 'New York'} - ${query} ${index + 1}`,
      category: category === 'all' ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') : (category as 'monde' | 'europe' | 'france'),
      country: category === 'france' ? 'France' : category === 'europe' ? 'Italie' : 'États-Unis',
      region: category === 'france' ? 'Île-de-France' : undefined,
      source: 'pexels',
      tags: [query, category === 'france' ? 'paris' : category === 'europe' ? 'rome' : 'new york', 'photography'],
      fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
    }));
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Pexels:", error);
    toast.error("Erreur lors de la recherche d'images Pexels");
    return [];
  }
};

// Obtenir des images préréglées par catégorie
export const getPresetImagesByCategory = async (category: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler le chargement des images préréglées
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Des images de secours pour chaque catégorie
    const images: PinterestImage[] = [];
    
    if (category === 'all' || category === 'france') {
      FRANCE_LOCATIONS.slice(0, 5).forEach((location, index) => {
        images.push({
          id: `preset-fr-${index}-${Date.now()}`,
          url: RELIABLE_FALLBACK_IMAGES.france,
          title: `${location.charAt(0).toUpperCase() + location.slice(1)} - Vue magnifique`,
          category: 'france',
          country: 'France',
          region: location.charAt(0).toUpperCase() + location.slice(1),
          source: 'local',
          tags: ['france', location, 'voyage', 'tourisme'],
          verified: true
        });
      });
    }
    
    if (category === 'all' || category === 'europe') {
      EUROPE_LOCATIONS.slice(0, 5).forEach((location, index) => {
        images.push({
          id: `preset-eu-${index}-${Date.now()}`,
          url: RELIABLE_FALLBACK_IMAGES.europe,
          title: `${location.charAt(0).toUpperCase() + location.slice(1)} - Découverte culturelle`,
          category: 'europe',
          country: EUROPE_LOCATIONS[index % EUROPE_LOCATIONS.length].charAt(0).toUpperCase() + EUROPE_LOCATIONS[index % EUROPE_LOCATIONS.length].slice(1),
          source: 'local',
          tags: ['europe', location, 'voyage', 'culture'],
          verified: true
        });
      });
    }
    
    if (category === 'all' || category === 'monde') {
      WORLD_LOCATIONS.slice(0, 5).forEach((location, index) => {
        images.push({
          id: `preset-world-${index}-${Date.now()}`,
          url: RELIABLE_FALLBACK_IMAGES.monde,
          title: `${location.charAt(0).toUpperCase() + location.slice(1)} - Aventure exotique`,
          category: 'monde',
          country: WORLD_LOCATIONS[index % WORLD_LOCATIONS.length].charAt(0).toUpperCase() + WORLD_LOCATIONS[index % WORLD_LOCATIONS.length].slice(1),
          source: 'local',
          tags: ['monde', location, 'voyage', 'aventure', 'exotique'],
          verified: true
        });
      });
    }
    
    return validateAndFixImages(images);
  } catch (error) {
    console.error("Erreur lors du chargement des images préréglées:", error);
    toast.error("Erreur lors du chargement des images préréglées");
    return [];
  }
};

// Générer du contenu à partir d'une image
export const generateContentFromImage = (image: PinterestImage): { title: string; description: string } => {
  // Extraire les informations de l'image
  const { category, country, region, tags = [] } = image;
  
  // Déterminer la location principale
  let mainLocation = '';
  
  if (region) {
    mainLocation = region.charAt(0).toUpperCase() + region.slice(1);
  } else if (country) {
    mainLocation = country.charAt(0).toUpperCase() + country.slice(1);
  } else if (category === 'france') {
    mainLocation = 'France';
  } else if (category === 'europe') {
    mainLocation = 'Europe';
  } else {
    mainLocation = 'cette destination';
  }
  
  // Générer un titre basé sur la catégorie et la localisation
  let title = '';
  if (category === 'france') {
    title = `Découvrez les merveilles de ${mainLocation}`;
  } else if (category === 'europe') {
    title = `Explorez la magie de ${mainLocation}`;
  } else {
    title = `Aventure inoubliable à ${mainLocation}`;
  }
  
  // Générer une description basée sur les tags et la catégorie
  const tagWords = tags.slice(0, 3).map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ');
  
  let description = '';
  if (category === 'france') {
    description = `Explorez ${mainLocation} avec ses monuments emblématiques, sa gastronomie raffinée et son atmosphère unique. ${tagWords}. Un voyage inoubliable vous attend !`;
  } else if (category === 'europe') {
    description = `Partez à la découverte de ${mainLocation}, un joyau européen avec son histoire fascinante, son architecture remarquable et sa culture vibrante. ${tagWords}. Une destination incontournable !`;
  } else {
    description = `Laissez-vous séduire par ${mainLocation}, une destination exotique offrant dépaysement, aventures et rencontres authentiques. ${tagWords}. Des souvenirs inoubliables vous attendent !`;
  }
  
  return { title, description };
};
