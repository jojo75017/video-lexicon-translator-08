import axios from 'axios';
import { PixabayResponse, UnsplashResponse, PinterestImage } from '@/types/pinterest';
import { toast } from 'sonner';
import { worldImages, europeImages, franceImages } from '@/data/pinterestImages';

// Images de secours pour quand les APIs échouent
const MOCK_IMAGES = [
  {
    id: 'mock-1',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    title: 'Tour Eiffel, Paris',
    category: 'france' as 'france',
    country: 'France',
    source: 'mock' as 'pixabay',
    tags: ['paris', 'eiffel', 'architecture']
  },
  {
    id: 'mock-2',
    url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2073&auto=format&fit=crop',
    title: 'Notre Dame, Paris',
    category: 'france' as 'france',
    country: 'France',
    source: 'mock' as 'pixabay',
    tags: ['paris', 'cathedral', 'architecture']
  },
  {
    id: 'mock-3',
    url: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?q=80&w=2064&auto=format&fit=crop',
    title: 'Marseille Vieux Port',
    category: 'france' as 'france',
    country: 'France',
    source: 'mock' as 'pixabay',
    tags: ['marseille', 'port', 'mediterranean']
  },
  {
    id: 'mock-4',
    url: 'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?q=80&w=2073&auto=format&fit=crop',
    title: 'Lyon by Night',
    category: 'france' as 'france',
    country: 'France',
    source: 'mock' as 'pixabay',
    tags: ['lyon', 'night', 'city']
  },
  {
    id: 'mock-5',
    url: 'https://images.unsplash.com/photo-1562627090-efe63e5beeab?q=80&w=1965&auto=format&fit=crop',
    title: 'Colosseum, Rome',
    category: 'europe' as 'europe',
    country: 'Italy',
    source: 'mock' as 'pixabay',
    tags: ['rome', 'colosseum', 'italy']
  },
  {
    id: 'mock-6',
    url: 'https://images.unsplash.com/photo-1558642084-fd07fae5282e?q=80&w=1936&auto=format&fit=crop',
    title: 'Santorini, Greece',
    category: 'europe' as 'europe',
    country: 'Greece',
    source: 'mock' as 'pixabay',
    tags: ['santorini', 'greece', 'mediterranean']
  },
  {
    id: 'mock-7',
    url: 'https://images.unsplash.com/photo-1543832923-44667a44c804?q=80&w=1944&auto=format&fit=crop',
    title: 'New York Skyline',
    category: 'monde' as 'monde',
    country: 'United States',
    source: 'mock' as 'pixabay',
    tags: ['new york', 'skyline', 'usa']
  },
  {
    id: 'mock-8',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1950&auto=format&fit=crop',
    title: 'Tokyo Tower',
    category: 'monde' as 'monde',
    country: 'Japan',
    source: 'mock' as 'pixabay',
    tags: ['tokyo', 'tower', 'japan']
  }
];

// Clés d'API pour les services d'images
// Dans un environnement de production, ces clés doivent être stockées dans des variables d'environnement
const PIXABAY_API_KEY = '39696617-7bb5c5dbc12c51d28397ca3b0'; // Clé publique pour demo
const UNSPLASH_ACCESS_KEY = 'HyoKoX5Yj8uIJBz_9dRrj3hVemnoXg66Pb--pXOgdlA'; // Clé publique pour demo

// Function to get mock images filtered by query
const getMockImages = (query: string, category: string = ''): PinterestImage[] => {
  console.log("Récupération d'images de test pour", query, category);
  let filteredImages = [...MOCK_IMAGES];
  
  // Filter by query if provided
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredImages = filteredImages.filter(img => 
      img.title.toLowerCase().includes(lowerQuery) || 
      img.country?.toLowerCase().includes(lowerQuery) ||
      img.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Filter by category if provided and not 'all'
  if (category && category !== 'all') {
    filteredImages = filteredImages.filter(img => img.category === category);
  }
  
  console.log(`Trouvé ${filteredImages.length} images pour la requête: "${query}", catégorie: "${category}"`);
  return filteredImages;
};

// Fonction pour rechercher des images sur Pixabay
export const searchPixabayImages = async (query: string, category: string = ''): Promise<PinterestImage[]> => {
  try {
    console.log('Recherche sur Pixabay pour:', query);
    
    // Utilisation temporaire des données de test en raison de problèmes d'API
    console.log('Utilisation des données de test en raison de problèmes avec l\'API Pixabay');
    return getMockImages(query, category);
  } catch (error) {
    console.error('Erreur lors de la recherche sur Pixabay:', error);
    toast.error('Impossible de récupérer les images depuis Pixabay. Utilisation des images locales.');
    return getMockImages(query, category);
  }
};

// Fonction pour générer un titre à partir des tags
const generateTitleFromTags = (tags: string): string => {
  if (!tags) return '';
  
  const tagArray = tags.split(',').map(tag => tag.trim());
  if (tagArray.length === 0) return '';
  
  // Capitaliser le premier tag
  const firstTag = tagArray[0].charAt(0).toUpperCase() + tagArray[0].slice(1);
  
  if (tagArray.length === 1) return firstTag;
  
  // Ajouter un second tag s'il existe
  return `${firstTag} ${tagArray[1]}`;
};

// Fonction pour rechercher des images sur Unsplash
export const searchUnsplashImages = async (query: string): Promise<PinterestImage[]> => {
  console.log('Utilisation des données de test en raison de problèmes avec l\'API Unsplash');
  return getMockImages(query);
};

// Fonction pour mapper la catégorie en fonction de la requête
const mapCategoryFromQuery = (query: string): 'monde' | 'europe' | 'france' => {
  const lowerQuery = query.toLowerCase();
  const europeanCountries = ['allemagne', 'espagne', 'italie', 'royaume-uni', 'portugal', 'grèce', 'suisse', 'belgique', 'pays-bas', 'autriche'];
  const frenchRegions = ['bretagne', 'normandie', 'provence', 'alsace', 'aquitaine', 'corse', 'paris', 'loire'];
  
  if (frenchRegions.some(region => lowerQuery.includes(region))) {
    return 'france';
  } else if (europeanCountries.some(country => lowerQuery.includes(country))) {
    return 'europe';
  } else {
    return 'monde';
  }
};

// Fonction pour extraire le lieu depuis la requête
const extractLocationFromQuery = (query: string): string => {
  // Extraire le premier mot qui pourrait être un lieu
  const words = query.split(' ');
  const potentialLocation = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return potentialLocation;
};

// Fonction pour obtenir des images prédéfinies par catégorie
export const getPresetImagesByCategory = async (category: 'monde' | 'europe' | 'france' | 'all'): Promise<PinterestImage[]> => {
  console.log('Chargement des images prédéfinies pour la catégorie:', category);
  
  try {
    let results: PinterestImage[] = [];
    
    if (category === 'all') {
      results = [...worldImages, ...europeImages, ...franceImages];
    } else if (category === 'monde') {
      results = [...worldImages];
    } else if (category === 'europe') {
      results = [...europeImages];
    } else if (category === 'france') {
      results = [...franceImages];
    }
    
    // Vérifier que les images ont bien des URLs valides
    results = results.filter(img => img.url && img.url.startsWith('http'));
    
    console.log(`Chargé ${results.length} images pour la catégorie ${category}`);
    return results;
  } catch (error) {
    console.error('Erreur lors du chargement des images préréglées:', error);
    // Utiliser des images de secours en cas d'erreur
    return getMockImages('', category);
  }
};

// Fonction pour générer du contenu basé sur une image
export const generateContentFromImage = (image: PinterestImage): { title: string, description: string } => {
  if (!image) return { title: '', description: '' };
  
  let title = '';
  let description = '';
  
  // Générer un titre basé sur l'image
  if (image.title) {
    title = `Découvrez ${image.title.charAt(0).toUpperCase() + image.title.slice(1)}`;
  } else if (image.country) {
    title = `Explorez les merveilles de ${image.country}`;
  } else if (image.region) {
    title = `Voyagez à travers ${image.region}`;
  } else {
    title = "Découvrez cette destination incroyable";
  }
  
  // Limiter le titre à 60 caractères
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  // Générer une description plus détaillée basée sur l'image (environ 100 mots)
  const locationName = image.country || image.region || image.title || 'cette destination';
  const tags = image.tags && image.tags.length > 0 ? image.tags.slice(0, 3).join(', ') : 'paysages à couper le souffle, culture locale, histoire fascinante';
  
  description = `Partez à la découverte de ${locationName}, une destination qui ravira tous vos sens. Vous serez émerveillé par ses ${tags}. 
  
Chaque coin de rue révèle un nouveau trésor à explorer, chaque rencontre une histoire à écouter. Les couleurs vives, les parfums enivrants et les saveurs délicates vous transporteront dans un univers où le temps semble s'être arrêté.

Que vous soyez amateur de photographie, passionné d'histoire, ou simplement en quête d'évasion, ${locationName} saura vous séduire par son authenticité et sa diversité. Des monuments emblématiques aux petites ruelles cachées, chaque lieu porte en lui l'empreinte d'un passé riche et d'une culture vivante.

Préparez votre voyage et laissez-vous guider par l'appel de l'aventure dans ce lieu magique où nature et culture se rencontrent harmonieusement.`;
  
  // Limiter la description à 600 caractères (environ 100 mots)
  if (description.length > 600) {
    description = description.substring(0, 597) + '...';
  }
  
  return { title, description };
};
