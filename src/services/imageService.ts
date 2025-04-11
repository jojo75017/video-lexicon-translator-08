
import axios from 'axios';
import { PixabayResponse, UnsplashResponse, PinterestImage } from '@/types/pinterest';
import { toast } from 'sonner';

// Clés d'API pour les services d'images
// Dans un environnement de production, ces clés doivent être stockées dans des variables d'environnement
const PIXABAY_API_KEY = '39696617-7bb5c5dbc12c51d28397ca3b0'; // Clé publique pour demo
const UNSPLASH_ACCESS_KEY = 'HyoKoX5Yj8uIJBz_9dRrj3hVemnoXg66Pb--pXOgdlA'; // Clé publique pour demo

// Fonction pour rechercher des images sur Pixabay
export const searchPixabayImages = async (query: string, category: string = ''): Promise<PinterestImage[]> => {
  try {
    console.log('Searching Pixabay for:', query);
    const response = await axios.get<PixabayResponse>('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        category: category,
        orientation: 'vertical',
        per_page: 50,
        image_type: 'photo',
        safesearch: true,
      }
    });

    console.log('Pixabay response:', response.data.hits.length, 'results');
    
    if (response.data.hits.length === 0) {
      console.log('No Pixabay results found');
      toast.info(`Aucun résultat trouvé pour "${query}". Essayez d'autres termes.`);
      return [];
    }

    // Ajouter des logs pour déboguer
    console.log('First hit example:', response.data.hits[0]);

    return response.data.hits.map((image, index) => ({
      id: `pixabay-${image.id}-${index}`,
      url: image.largeImageURL || image.webformatURL,
      title: generateTitleFromTags(image.tags) || `Image de ${query}`,
      category: mapCategoryFromQuery(query),
      country: extractLocationFromQuery(query),
      source: 'pixabay',
      tags: image.tags.split(',').map(tag => tag.trim())
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche sur Pixabay:', error);
    toast.error('Impossible de récupérer les images depuis Pixabay');
    return [];
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

// Fonction pour rechercher des images sur Unsplash - désactivée pour le moment en raison de problèmes d'authentification
export const searchUnsplashImages = async (query: string): Promise<PinterestImage[]> => {
  // En raison des problèmes d'authentification avec l'API Unsplash, nous redirigerons vers Pixabay pour l'instant
  console.log('Unsplash API a des problèmes d\'authentification, utilisation de Pixabay à la place');
  toast.info('Recherche sur Pixabay (Unsplash temporairement indisponible)');
  return searchPixabayImages(query);
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
  console.log('Loading preset images for category:', category);
  
  // Termes de recherche prédéfinis pour chaque catégorie
  const searchTerms = {
    monde: ['japon', 'états-unis', 'australie', 'canada', 'brésil'],
    europe: ['italie', 'espagne', 'grèce', 'royaume-uni', 'allemagne'],
    france: ['paris', 'provence', 'bretagne', 'normandie', 'alpes']
  };
  
  try {
    if (category === 'all') {
      // Combiner toutes les recherches
      const allTerms = [...searchTerms.monde, ...searchTerms.europe, ...searchTerms.france];
      const randomTerms = allTerms.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      console.log('Using random search terms for "all" category:', randomTerms);
      
      // Faire des recherches en parallèle
      const results = await Promise.all(randomTerms.map(term => searchPixabayImages(term)));
      const flatResults = results.flat();
      
      console.log(`Found ${flatResults.length} preset images for "all" category`);
      return flatResults;
    }
    
    // Rechercher des images pour la catégorie spécifique
    console.log(`Using search terms for "${category}" category:`, searchTerms[category]);
    const results = await Promise.all(searchTerms[category].map(term => searchPixabayImages(term)));
    const flatResults = results.flat();
    
    console.log(`Found ${flatResults.length} preset images for "${category}" category`);
    return flatResults;
  } catch (error) {
    console.error("Erreur lors du chargement des images prédéfinies:", error);
    toast.error(`Erreur lors du chargement des images pour la catégorie "${category}"`);
    return [];
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
  
  // Limiter le titre à 40 caractères
  if (title.length > 40) {
    title = title.substring(0, 37) + '...';
  }
  
  // Générer une description basée sur l'image
  if (image.tags && image.tags.length > 0) {
    const locationName = image.country || image.region || image.title || 'cette destination';
    description = `Explorez ${locationName} avec ${image.tags.slice(0, 3).join(', ')}. `;
    description += `Découvrez les paysages magnifiques, la culture fascinante et créez des souvenirs inoubliables lors de votre voyage.`;
  } else {
    const locationName = image.country || image.region || image.title || 'cette destination';
    description = `Partez à la découverte de ${locationName}. Un lieu magique où nature, culture et aventure se rencontrent pour vous offrir une expérience inoubliable.`;
  }
  
  // Limiter la description à 300 caractères
  if (description.length > 300) {
    description = description.substring(0, 297) + '...';
  }
  
  return { title, description };
};
