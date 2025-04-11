
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
      return [];
    }

    return response.data.hits.map((image, index) => ({
      id: `pixabay-${image.id}-${index}`,
      url: image.webformatURL || image.largeImageURL,
      title: image.tags.split(',')[0] || 'Image Pixabay',
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

// Fonction pour rechercher des images sur Unsplash
export const searchUnsplashImages = async (query: string): Promise<PinterestImage[]> => {
  try {
    console.log('Searching Unsplash for:', query);
    const response = await axios.get<UnsplashResponse>('https://api.unsplash.com/search/photos', {
      params: {
        query,
        orientation: 'portrait',
        per_page: 30,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    console.log('Unsplash response:', response.data.results.length, 'results');
    
    if (response.data.results.length === 0) {
      console.log('No Unsplash results found');
      return [];
    }

    return response.data.results.map((image, index) => ({
      id: `unsplash-${image.id}-${index}`,
      url: image.urls.small || image.urls.regular,
      title: image.description || image.alt_description || 'Image Unsplash',
      category: mapCategoryFromQuery(query),
      country: extractLocationFromQuery(query),
      source: 'unsplash',
      tags: image.tags.map(tag => tag.title)
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche sur Unsplash:', error);
    toast.error('Impossible de récupérer les images depuis Unsplash');
    return [];
  }
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
