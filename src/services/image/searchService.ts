
import { PinterestImage } from '@/types/pinterest';
import { FRANCE_LOCATIONS, EUROPE_LOCATIONS, WORLD_LOCATIONS } from '@/types/pinterest';

export const searchImagesByKeyword = (
  images: PinterestImage[],
  keyword: string,
  category: 'monde' | 'europe' | 'france' | 'all' = 'all'
): PinterestImage[] => {
  if (!keyword.trim()) {
    return filterImagesByCategory(images, category);
  }
  
  const searchTerms = keyword.toLowerCase().trim().split(/\s+/);
  
  const results = images.filter(image => {
    // Si la catégorie est spécifiée, filtrer d'abord par catégorie
    if (category !== 'all' && image.category !== category) {
      return false;
    }
    
    return searchTerms.some(term => {
      const countryMatch = image.country && image.country.toLowerCase().includes(term);
      const regionMatch = image.region && image.region.toLowerCase().includes(term);
      
      if (countryMatch || regionMatch) {
        return true;
      }
      
      const titleMatch = image.title.toLowerCase().includes(term);
      
      if (image.category === 'france' && FRANCE_LOCATIONS.some(loc => loc.toLowerCase() === term)) {
        return true;
      }
      
      if (image.category === 'europe' && EUROPE_LOCATIONS.some(loc => loc.toLowerCase() === term)) {
        return true;
      }
      
      if (image.category === 'monde' && WORLD_LOCATIONS.some(loc => loc.toLowerCase() === term)) {
        return true;
      }
      
      return titleMatch;
    });
  });
  
  return sortSearchResults(results, searchTerms);
};

export const filterImagesByCategory = (
  images: PinterestImage[],
  category: 'monde' | 'europe' | 'france' | 'all'
): PinterestImage[] => {
  if (category === 'all') {
    return images;
  }
  return images.filter(image => image.category === category);
};

const sortSearchResults = (results: PinterestImage[], searchTerms: string[]): PinterestImage[] => {
  return results.sort((a, b) => {
    const aCountryMatch = a.country && searchTerms.some(term => a.country?.toLowerCase() === term);
    const bCountryMatch = b.country && searchTerms.some(term => b.country?.toLowerCase() === term);
    
    if (aCountryMatch && !bCountryMatch) return -1;
    if (!aCountryMatch && bCountryMatch) return 1;
    
    const aRegionMatch = a.region && searchTerms.some(term => a.region?.toLowerCase() === term);
    const bRegionMatch = b.region && searchTerms.some(term => b.region?.toLowerCase() === term);
    
    if (aRegionMatch && !bRegionMatch) return -1;
    if (!aRegionMatch && bRegionMatch) return 1;
    
    return 0;
  });
};
