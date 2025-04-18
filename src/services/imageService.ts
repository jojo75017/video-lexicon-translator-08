
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

// Nouvelles images variées pour les résultats simulés
const DIVERSE_IMAGES = {
  france: [
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop', // Paris - Tour Eiffel
    'https://images.unsplash.com/photo-1529686342540-1b43aec0df75?q=80&w=2070&auto=format&fit=crop', // Mont Saint-Michel
    'https://images.unsplash.com/photo-1549144511-f099e773c147?q=80&w=2034&auto=format&fit=crop', // Provence - Lavande
    'https://images.unsplash.com/photo-1596642548090-3d6cccf8e7e1?q=80&w=1974&auto=format&fit=crop', // Marseille
    'https://images.unsplash.com/photo-1576604303383-550e733e2cf9?q=80&w=2070&auto=format&fit=crop', // Lyon
    'https://images.unsplash.com/photo-1623210553709-daec2c5c9965?q=80&w=1974&auto=format&fit=crop'  // Bordeaux
  ],
  europe: [
    'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop', // Rome - Colisée
    'https://images.unsplash.com/photo-1558033244-2fa755eb879d?q=80&w=1974&auto=format&fit=crop', // Venise
    'https://images.unsplash.com/photo-1561637253-e1b812103abd?q=80&w=1974&auto=format&fit=crop', // Barcelone
    'https://images.unsplash.com/photo-1500380279785-371201be6a10?q=80&w=2069&auto=format&fit=crop', // Santorini
    'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?q=80&w=2070&auto=format&fit=crop', // Amsterdam
    'https://images.unsplash.com/photo-1565452344518-47faca79dc69?q=80&w=2035&auto=format&fit=crop'  // Londres
  ],
  monde: [
    'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=2070&auto=format&fit=crop', // New York
    'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070&auto=format&fit=crop', // Tokyo
    'https://images.unsplash.com/photo-1586041828039-b8d193d6d1dc?q=80&w=2036&auto=format&fit=crop', // Dubaï
    'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=2012&auto=format&fit=crop', // Sydney
    'https://images.unsplash.com/photo-1564662230624-73e317f08290?q=80&w=1974&auto=format&fit=crop', // Rio
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?q=80&w=1974&auto=format&fit=crop'    // Marrakech
  ]
};

// Ajout des fonctions requises par PinterestGenerator

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
      // Choisir une image aléatoire de la catégorie
      const imageSet = DIVERSE_IMAGES[imageCategory as keyof typeof DIVERSE_IMAGES];
      const imageUrl = imageSet[Math.floor(Math.random() * imageSet.length)];
      
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
        location = WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
        country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
      }
      
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

// Recherche d'images sur Unsplash
export const searchUnsplashImages = async (query: string): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Générer des résultats variés
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => {
      // Choisir une catégorie aléatoire
      const imageCategory = Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde';
      
      // Choisir une image aléatoire de la catégorie
      const imageSet = DIVERSE_IMAGES[imageCategory as keyof typeof DIVERSE_IMAGES];
      const imageUrl = imageSet[Math.floor(Math.random() * imageSet.length)];
      
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
        location = WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
        country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
      }
      
      return {
        id: `unsplash-${index}-${Date.now()}`,
        url: imageUrl,
        title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - ${query} ${index + 1}`,
        category: imageCategory as 'monde' | 'europe' | 'france',
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

// Recherche d'images sur Freepik
export const searchFreepikImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Déterminer quelle catégorie d'images utiliser
    let imageCategory = category === 'all' 
      ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') 
      : (category as 'monde' | 'europe' | 'france');
    
    // Générer des résultats variés
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => {
      // Choisir une image aléatoire de la catégorie
      const imageSet = DIVERSE_IMAGES[imageCategory as keyof typeof DIVERSE_IMAGES];
      const imageUrl = imageSet[Math.floor(Math.random() * imageSet.length)];
      
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
        location = WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
        country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
      }
      
      return {
        id: `freepik-${index}-${Date.now()}`,
        url: imageUrl,
        title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - ${query} ${index + 1}`,
        category: imageCategory as 'monde' | 'europe' | 'france',
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

// Recherche d'images sur Pexels
export const searchPexelsImages = async (query: string, category?: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler une recherche d'images pour l'exemple
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Déterminer quelle catégorie d'images utiliser
    let imageCategory = category === 'all' 
      ? (Math.random() > 0.6 ? 'france' : Math.random() > 0.5 ? 'europe' : 'monde') 
      : (category as 'monde' | 'europe' | 'france');
    
    // Générer des résultats variés
    const results: PinterestImage[] = Array(10).fill(null).map((_, index) => {
      // Choisir une image aléatoire de la catégorie
      const imageSet = DIVERSE_IMAGES[imageCategory as keyof typeof DIVERSE_IMAGES];
      const imageUrl = imageSet[Math.floor(Math.random() * imageSet.length)];
      
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
        location = WORLD_LOCATIONS[Math.floor(Math.random() * WORLD_LOCATIONS.length)];
        country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][Math.floor(Math.random() * 5)];
      }
      
      return {
        id: `pexels-${index}-${Date.now()}`,
        url: imageUrl,
        title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - ${query} ${index + 1}`,
        category: imageCategory as 'monde' | 'europe' | 'france',
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

// Obtenir des images préréglées par catégorie
export const getPresetImagesByCategory = async (category: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  try {
    // Simuler le chargement des images préréglées
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Des images variées pour chaque catégorie
    const images: PinterestImage[] = [];
    
    if (category === 'all' || category === 'france') {
      // Utiliser les 5 premières locations françaises avec des images variées
      FRANCE_LOCATIONS.slice(0, 5).forEach((location, index) => {
        const imageUrl = DIVERSE_IMAGES.france[index % DIVERSE_IMAGES.france.length];
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
      // Utiliser les 5 premières locations européennes avec des images variées
      EUROPE_LOCATIONS.slice(0, 5).forEach((location, index) => {
        const imageUrl = DIVERSE_IMAGES.europe[index % DIVERSE_IMAGES.europe.length];
        const country = ['Italie', 'Espagne', 'Grèce', 'Portugal', 'Allemagne'][index % 5];
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
      // Utiliser les 5 premières locations mondiales avec des images variées
      WORLD_LOCATIONS.slice(0, 5).forEach((location, index) => {
        const imageUrl = DIVERSE_IMAGES.monde[index % DIVERSE_IMAGES.monde.length];
        const country = ['États-Unis', 'Japon', 'Australie', 'Brésil', 'Maroc'][index % 5];
        images.push({
          id: `preset-world-${index}-${Date.now()}`,
          url: imageUrl,
          title: `${country} - ${location.charAt(0).toUpperCase() + location.slice(1)} - Aventure exotique`,
          category: 'monde',
          country: country,
          source: 'local',
          tags: ['monde', location, 'voyage', 'aventure', 'exotique'],
          verified: true
        });
      });
    }
    
    console.log(`Loaded ${images.length} preset images for category ${category}`);
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
