
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

// Nouvelles images variées pour les résultats simulés qui correspondent mieux aux localisations
const DIVERSE_IMAGES = {
  france: {
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop', // Paris
    'marseille': 'https://images.unsplash.com/photo-1589519160732-576f165b9aad?q=80&w=2070&auto=format&fit=crop', // Marseille
    'lyon': 'https://images.unsplash.com/photo-1618197109832-6feca3e0c3bc?q=80&w=2070&auto=format&fit=crop', // Lyon
    'nice': 'https://images.unsplash.com/photo-1504719122466-9f967d4459c7?q=80&w=2070&auto=format&fit=crop', // Nice
    'bordeaux': 'https://images.unsplash.com/photo-1560968950-be3315b4656c?q=80&w=2070&auto=format&fit=crop', // Bordeaux
    'default': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop', // Image par défaut France
  },
  europe: {
    'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop', // Rome
    'barcelone': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop', // Barcelone
    'venise': 'https://images.unsplash.com/photo-1558033244-2fa755eb879d?q=80&w=1974&auto=format&fit=crop', // Venise
    'santorini': 'https://images.unsplash.com/photo-1500380279785-371201be6a10?q=80&w=2069&auto=format&fit=crop', // Santorini
    'londres': 'https://images.unsplash.com/photo-1565452344518-47faca79dc69?q=80&w=2035&auto=format&fit=crop', // Londres
    'default': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop', // Image par défaut Europe
  },
  monde: {
    'new york': 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2070&auto=format&fit=crop', // New York
    'tokyo': 'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070&auto=format&fit=crop', // Tokyo
    'dubai': 'https://images.unsplash.com/photo-1586041828039-b8d193d6d1dc?q=80&w=2036&auto=format&fit=crop', // Dubai
    'sydney': 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=2012&auto=format&fit=crop', // Sydney
    'maroc': 'https://images.unsplash.com/photo-1539020140153-e839c3a2922f?q=80&w=2070&auto=format&fit=crop', // Maroc
    'rio': 'https://images.unsplash.com/photo-1564662230624-73e317f08290?q=80&w=1974&auto=format&fit=crop', // Rio
    'default': 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2070&auto=format&fit=crop', // Image par défaut Monde
  }
};

// Fonction pour obtenir l'URL d'image correspondant à une localisation
const getImageUrlForLocation = (category: 'france' | 'europe' | 'monde', location: string): string => {
  const lowerLocation = location.toLowerCase();
  const categoryImages = DIVERSE_IMAGES[category];
  
  for (const [key, url] of Object.entries(categoryImages)) {
    if (lowerLocation.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  return categoryImages.default;
};

// Recherche d'images sur Pixabay
export const searchPixabayImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Déterminer quelle catégorie d'images utiliser
    let imageCategory = category === 'all' 
      ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') 
      : (category as 'monde' | 'europe' | 'france');
    
    // Générer des résultats variés
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => {
      // Déterminer le titre en fonction de la catégorie
      let location = '';
      let country = '';
      
      if (imageCategory === 'france') {
        location = FRANCE_LOCATIONS[Math.floor(Math.random() * FRANCE_LOCATIONS.length)];
        country = 'France';
      } else if (imageCategory === 'europe') {
        location = EUROPE_LOCATIONS[Math.floor(Math.random() * EUROPE_LOCATIONS.length)];
        country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][Math.floor(Math.random() * 5)];
      } else {
        // Si la recherche contient un lieu du monde, utiliser ce lieu
        const queryLower = query.toLowerCase();
        const worldLocationMatch = WORLD_LOCATIONS.find(loc => queryLower.includes(loc));
        location = worldLocationMatch || WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
        
        // Déterminer le pays basé sur la localisation
        if (location === 'new york' || location === 'miami' || location === 'san francisco' || location === 'los angeles' || location === 'chicago') {
          country = 'États-Unis';
        } else if (location === 'tokyo' || location === 'pékin' || location === 'shanghai' || location === 'hong kong') {
          country = location === 'tokyo' ? 'Japon' : 'Chine';
        } else if (location === 'sydney') {
          country = 'Australie';
        } else if (location === 'rio de janeiro') {
          country = 'Brésil';
        } else if (location === 'maroc' || location === 'marrakech') {
          country = 'Maroc';
        } else {
          country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
        }
      }
      
      // Obtenir l'URL d'image appropriée pour cette localisation
      const imageUrl = getImageUrlForLocation(imageCategory, location);
      
      return {
        id: `pixabay-${index}-${Date.now()}`,
        url: imageUrl,
        title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - ${query} ${index + 1}`,
        category: imageCategory as 'monde' | 'europe' | 'france',
        country: country,
        region: imageCategory === 'france' ? location.charAt(0).toUpperCase() + location.slice(1) : undefined,
        source: 'pixabay',
        tags: [query, location, 'voyage', 'découverte', 'tourisme'].slice(0, 3 + Math.floor(Math.random() * 3)),
        fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
      };
    });
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Pixabay:", error);
    toast.error("Erreur lors de la recherche d'images Pixabay");
    return [];
  }
};

// Recherche d'images sur Unsplash avec même correction appliquée
export const searchUnsplashImages = async (query: string): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Déterminer quelle catégorie d'images utiliser basée sur la requête
    let imageCategory: 'france' | 'europe' | 'monde';
    let detectedLocation = '';
    
    // Détection de la catégorie basée sur la requête
    const queryLower = query.toLowerCase();
    
    if (FRANCE_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'france';
      detectedLocation = FRANCE_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    } else if (EUROPE_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'europe';
      detectedLocation = EUROPE_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    } else if (WORLD_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'monde';
      detectedLocation = WORLD_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    } else {
      // Par défaut si aucune localisation n'est détectée
      imageCategory = Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde';
    }
    
    // Générer des résultats variés
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => {
      // Déterminer le titre en fonction de la catégorie
      let location = detectedLocation;
      let country = '';
      
      if (!location) {
        if (imageCategory === 'france') {
          location = FRANCE_LOCATIONS[Math.floor(Math.random() * FRANCE_LOCATIONS.length)];
        } else if (imageCategory === 'europe') {
          location = EUROPE_LOCATIONS[Math.floor(Math.random() * EUROPE_LOCATIONS.length)];
        } else {
          location = WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
        }
      }
      
      // Déterminer le pays
      if (imageCategory === 'france') {
        country = 'France';
      } else if (imageCategory === 'europe') {
        if (location.includes('rome') || location.includes('venise') || location.includes('florence')) {
          country = 'Italie';
        } else if (location.includes('barcelone') || location.includes('madrid')) {
          country = 'Espagne';
        } else if (location.includes('athènes')) {
          country = 'Grèce';
        } else if (location.includes('lisbonne') || location.includes('porto')) {
          country = 'Portugal';
        } else {
          country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][Math.floor(Math.random() * 5)];
        }
      } else {
        // Pays pour le monde
        if (location.includes('new york') || location.includes('chicago') || location.includes('los angeles')) {
          country = 'États-Unis';
        } else if (location.includes('tokyo')) {
          country = 'Japon';
        } else if (location.includes('sydney')) {
          country = 'Australie';
        } else if (location.includes('rio')) {
          country = 'Brésil';
        } else if (location.includes('maroc') || location.includes('marrakech')) {
          country = 'Maroc';
        } else {
          country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
        }
      }
      
      // Obtenir l'URL d'image appropriée pour cette localisation
      const imageUrl = getImageUrlForLocation(imageCategory, location);
      
      return {
        id: `unsplash-${index}-${Date.now()}`,
        url: imageUrl,
        title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - ${query} ${index + 1}`,
        category: imageCategory,
        country: country,
        region: imageCategory === 'france' ? location.charAt(0).toUpperCase() + location.slice(1) : undefined,
        source: 'unsplash',
        tags: [query, location, 'travel', 'photography', 'voyage'].slice(0, 3 + Math.floor(Math.random() * 3)),
        fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
      };
    });
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Unsplash:", error);
    toast.error("Erreur lors de la recherche d'images Unsplash");
    return [];
  }
};

// Recherche d'images sur Freepik - mise à jour avec la même logique
export const searchFreepikImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Même logique améliorée que pour Unsplash et Pixabay
    
    // Déterminer quelle catégorie d'images utiliser
    let imageCategory = category === 'all' 
      ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') 
      : (category as 'monde' | 'europe' | 'france');
    
    // Détection de la localisation dans la requête
    const queryLower = query.toLowerCase();
    let detectedLocation = '';
    
    if (FRANCE_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'france';
      detectedLocation = FRANCE_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    } else if (EUROPE_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'europe';
      detectedLocation = EUROPE_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    } else if (WORLD_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'monde';
      detectedLocation = WORLD_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    }
    
    // Générer des résultats variés
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => {
      // Même logique de détermination du titre, pays, etc.
      let location = detectedLocation;
      let country = '';
      
      if (!location) {
        if (imageCategory === 'france') {
          location = FRANCE_LOCATIONS[Math.floor(Math.random() * FRANCE_LOCATIONS.length)];
          country = 'France';
        } else if (imageCategory === 'europe') {
          location = EUROPE_LOCATIONS[Math.floor(Math.random() * EUROPE_LOCATIONS.length)];
          // Logique pour déterminer le pays européen
          if (location.includes('rome') || location.includes('venise')) {
            country = 'Italie';
          } else if (location.includes('barcelone')) {
            country = 'Espagne';
          } else {
            country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][Math.floor(Math.random() * 5)];
          }
        } else {
          location = WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
          // Logique pour déterminer le pays mondial
          if (location.includes('new york')) {
            country = 'États-Unis';
          } else if (location.includes('tokyo')) {
            country = 'Japon';
          } else if (location.includes('maroc')) {
            country = 'Maroc';
          } else {
            country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
          }
        }
      } else {
        // Déterminer le pays basé sur la localisation détectée
        if (imageCategory === 'france') {
          country = 'France';
        } else if (imageCategory === 'europe') {
          
          if (location.includes('rome') || location.includes('venise')) {
            country = 'Italie';
          } else if (location.includes('barcelone')) {
            country = 'Espagne';
          } else {
            country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][Math.floor(Math.random() * 5)];
          }
        } else {
          
          if (location.includes('new york')) {
            country = 'États-Unis';
          } else if (location.includes('tokyo')) {
            country = 'Japon';
          } else if (location.includes('maroc')) {
            country = 'Maroc';
          } else {
            country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
          }
        }
      }
      
      // Obtenir l'URL d'image appropriée
      const imageUrl = getImageUrlForLocation(imageCategory, location);
      
      return {
        id: `freepik-${index}-${Date.now()}`,
        url: imageUrl,
        title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - ${query} ${index + 1}`,
        category: imageCategory,
        country: country,
        region: imageCategory === 'france' ? location.charAt(0).toUpperCase() + location.slice(1) : undefined,
        source: 'freepik',
        tags: [query, location, 'vector', 'illustration', 'design'].slice(0, 3 + Math.floor(Math.random() * 3)),
        fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
      };
    });
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Freepik:", error);
    toast.error("Erreur lors de la recherche d'images Freepik");
    return [];
  }
};

// Recherche d'images sur Pexels - mise à jour avec la même logique
export const searchPexelsImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Même logique que pour les autres fonctions de recherche
    let imageCategory = category === 'all' 
      ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') 
      : (category as 'monde' | 'europe' | 'france');
    
    // Détection de la localisation dans la requête
    const queryLower = query.toLowerCase();
    let detectedLocation = '';
    
    if (FRANCE_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'france';
      detectedLocation = FRANCE_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    } else if (EUROPE_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'europe';
      detectedLocation = EUROPE_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    } else if (WORLD_LOCATIONS.some(loc => queryLower.includes(loc))) {
      imageCategory = 'monde';
      detectedLocation = WORLD_LOCATIONS.find(loc => queryLower.includes(loc)) || '';
    }
    
    // Générer des résultats variés
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => {
      // Logique similaire aux autres fonctions
      let location = detectedLocation;
      let country = '';
      
      if (!location) {
        if (imageCategory === 'france') {
          location = FRANCE_LOCATIONS[Math.floor(Math.random() * FRANCE_LOCATIONS.length)];
          country = 'France';
        } else if (imageCategory === 'europe') {
          location = EUROPE_LOCATIONS[Math.floor(Math.random() * EUROPE_LOCATIONS.length)];
          // Déterminer le pays européen
          if (location.includes('rome') || location.includes('venise')) {
            country = 'Italie';
          } else if (location.includes('barcelone')) {
            country = 'Espagne';
          } else {
            country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][Math.floor(Math.random() * 5)];
          }
        } else {
          location = WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
          // Déterminer le pays mondial
          if (location.includes('new york')) {
            country = 'États-Unis';
          } else if (location.includes('tokyo')) {
            country = 'Japon';
          } else if (location.includes('maroc')) {
            country = 'Maroc';
          } else {
            country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
          }
        }
      } else {
        // Déterminer le pays basé sur la localisation détectée
        if (imageCategory === 'france') {
          country = 'France';
        } else if (imageCategory === 'europe') {
          if (location.includes('rome') || location.includes('venise')) {
            country = 'Italie';
          } else if (location.includes('barcelone')) {
            country = 'Espagne';
          } else {
            country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][Math.floor(Math.random() * 5)];
          }
        } else {
          if (location.includes('new york')) {
            country = 'États-Unis';
          } else if (location.includes('tokyo')) {
            country = 'Japon';
          } else if (location.includes('maroc')) {
            country = 'Maroc';
          } else {
            country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
          }
        }
      }
      
      // Obtenir l'URL d'image appropriée
      const imageUrl = getImageUrlForLocation(imageCategory, location);
      
      return {
        id: `pexels-${index}-${Date.now()}`,
        url: imageUrl,
        title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - ${query} ${index + 1}`,
        category: imageCategory,
        country: country,
        region: imageCategory === 'france' ? location.charAt(0).toUpperCase() + location.slice(1) : undefined,
        source: 'pexels',
        tags: [query, location, 'photography', 'professional', 'voyage'].slice(0, 3 + Math.floor(Math.random() * 3)),
        fallbackUrl: RELIABLE_FALLBACK_IMAGES.default
      };
    });
    
    return validateAndFixImages(results);
  } catch (error) {
    console.error("Erreur lors de la recherche d'images Pexels:", error);
    toast.error("Erreur lors de la recherche d'images Pexels");
    return [];
  }
};

// Obtenir des images préréglées par catégorie - version améliorée
export const getPresetImagesByCategory = async (category: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler le chargement des images préréglées
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Des images variées pour chaque catégorie
    const images: PinterestImage[] = [];
    
    if (category === 'all' || category === 'france') {
      // Utiliser les 5 premières locations françaises avec des images appropriées
      FRANCE_LOCATIONS.slice(0, 5).forEach((location, index) => {
        const imageUrl = getImageUrlForLocation('france', location);
        images.push({
          id: `preset-fr-${index}-${Date.now()}`,
          url: imageUrl,
          title: `France - ${location.charAt(0).toUpperCase() + location.slice(1)} - Vue magnifique`,
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
      // Utiliser les 5 premières locations européennes avec des images appropriées
      EUROPE_LOCATIONS.slice(0, 5).forEach((location, index) => {
        // Déterminer le pays en fonction de la localisation
        let country = 'Europe';
        if (location.includes('rome') || location.includes('venise') || location.includes('florence')) {
          country = 'Italie';
        } else if (location.includes('barcelone') || location.includes('madrid')) {
          country = 'Espagne';
        } else if (location.includes('athènes')) {
          country = 'Grèce';
        } else {
          country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][index % 5];
        }
        
        const imageUrl = getImageUrlForLocation('europe', location);
        images.push({
          id: `preset-eu-${index}-${Date.now()}`,
          url: imageUrl,
          title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - Découverte culturelle`,
          category: 'europe',
          country: country,
          source: 'local',
          tags: ['europe', location, 'voyage', 'culture'],
          verified: true
        });
      });
    }
    
    if (category === 'all' || category === 'monde') {
      // Utiliser les 5 premières locations mondiales avec des images appropriées
      WORLD_LOCATIONS.slice(0, 5).forEach((location, index) => {
        // Déterminer le pays en fonction de la localisation
        let country = 'International';
        if (location.includes('new york') || location.includes('los angeles') || location.includes('chicago')) {
          country = 'États-Unis';
        } else if (location.includes('tokyo')) {
          country = 'Japon';
        } else if (location.includes('sydney')) {
          country = 'Australie';
        } else if (location.includes('rio')) {
          country = 'Brésil';
        } else if (location.includes('maroc') || location.includes('marrakech')) {
          country = 'Maroc';
        } else {
          country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][index % 5];
        }
        
        const imageUrl = getImageUrlForLocation('monde', location);
        images.push({
          id: `preset-world-${index}-${Date.now()}`,
          url: imageUrl,
          title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - Aventure exotique`,
          category: 'monde',
          country: country,
          source: 'local',
          tags: ['monde', location, 'voyage', 'aventure', 'exotique']
        });
      });
    }
    
    return images;
  } catch (error) {
    console.error("Erreur lors du chargement des images préréglées:", error);
    toast.error("Erreur lors du chargement des images");
    return [];
  }
};
