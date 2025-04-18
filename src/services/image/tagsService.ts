
import { PinterestImage } from '@/types/pinterest';

export const extractTagsFromImage = (image: PinterestImage): string[] => {
  const tags: string[] = [];
  
  // Ajouter le pays ou la région comme tag principal
  if (image.country) {
    tags.push(image.country.toLowerCase());
  }
  
  if (image.region) {
    tags.push(image.region.toLowerCase());
  }
  
  // Ajouter la catégorie
  tags.push(image.category);
  
  // Extraire des mots clés du titre
  const titleWords = image.title.toLowerCase()
    .replace(/[^\w\sà-ÿ]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => {
      // Éviter les duplications avec le pays/région
      return !(image.country && image.country.toLowerCase().includes(word)) && 
             !(image.region && image.region.toLowerCase().includes(word));
    });
  
  // Ajouter des mots clés uniques du titre
  titleWords.forEach(word => {
    if (!tags.includes(word)) {
      tags.push(word);
    }
  });
  
  // Limiter le nombre de tags
  return tags.slice(0, 10);
};
