
import { PinterestImage } from '@/types/pinterest';
import { FRANCE_LOCATIONS, EUROPE_LOCATIONS, WORLD_LOCATIONS } from '@/types/pinterest';

// Fonction pour générer du contenu à partir d'une image
export const generateContentFromImage = (image: PinterestImage): { title: string; description: string } => {
  if (!image) {
    return {
      title: 'Image sans titre',
      description: 'Aucune description disponible pour cette image.'
    };
  }

  // Déterminer la localisation principale
  let location = '';
  let locationType = '';
  
  if (image.country) {
    location = image.country;
    locationType = image.category === 'france' ? 'région' : 'pays';
  } else if (image.region) {
    location = image.region;
    locationType = 'région';
  } else if (image.category === 'france') {
    location = 'France';
    locationType = 'pays';
  } else if (image.category === 'europe') {
    location = 'Europe';
    locationType = 'continent';
  } else if (image.category === 'monde') {
    location = 'monde';
    locationType = 'destination';
  }
  
  // Extraire des informations à partir du titre
  const titleParts = image.title.split(/[-,]/);
  let subject = titleParts.length > 1 ? titleParts[1].trim() : titleParts[0].trim();
  
  if (subject.toLowerCase().includes(location.toLowerCase())) {
    // Éviter la répétition dans le titre
    subject = subject.replace(new RegExp(location, 'i'), '').trim();
  }
  
  // Générer un titre attractif
  const titlePrefixes = [
    `Découvrez ${location}`,
    `Explorez ${location}`,
    `Voyage à ${location}`,
    `Visitez ${location}`,
    `Les merveilles de ${location}`
  ];
  
  const randomTitlePrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  let title = subject ? `${randomTitlePrefix} et ses ${subject}` : randomTitlePrefix;
  
  // Nettoyer le titre
  title = title.replace(/\s+/g, ' ').trim();
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  // Générer une description détaillée
  const descriptionIntros = [
    `Partez à la découverte de ce magnifique ${locationType}`,
    `Laissez-vous séduire par ce ${locationType} fascinant`,
    `Une destination immanquable pour les amateurs de voyage`,
    `Ce ${locationType} regorge de trésors à découvrir`,
    `Voyagez au cœur de cette destination exceptionnelle`
  ];
  
  const descriptionMiddles = [
    `avec ses paysages à couper le souffle`,
    `et sa culture riche et variée`,
    `qui vous surprendra par sa diversité`,
    `connu pour son patrimoine historique`,
    `avec son atmosphère unique et authentique`
  ];
  
  const descriptionEndings = [
    `Une expérience inoubliable vous attend.`,
    `Préparez-vous à être émerveillé.`,
    `Idéal pour des vacances réussies.`,
    `À découvrir absolument lors de votre prochain voyage.`,
    `Une destination qui ne vous laissera pas indifférent.`
  ];
  
  const randomIntro = descriptionIntros[Math.floor(Math.random() * descriptionIntros.length)];
  const randomMiddle = descriptionMiddles[Math.floor(Math.random() * descriptionMiddles.length)];
  const randomEnding = descriptionEndings[Math.floor(Math.random() * descriptionEndings.length)];
  
  let description = `${randomIntro} ${location}, ${randomMiddle}. ${randomEnding}`;
  
  // Assurer que la description n'est pas trop longue
  if (description.length > 280) {
    description = description.substring(0, 277) + '...';
  }
  
  return {
    title,
    description
  };
};

// Fonction de recherche d'images par mot-clé
export const searchImagesByKeyword = (
  images: PinterestImage[],
  keyword: string,
  category: 'monde' | 'europe' | 'france' | 'all' = 'all'
): PinterestImage[] => {
  if (!keyword.trim()) {
    return filterImagesByCategory(images, category);
  }
  
  const searchTerms = keyword.toLowerCase().trim().split(/\s+/);
  
  return images.filter(image => {
    // Si la catégorie est spécifiée, filtrer d'abord par catégorie
    if (category !== 'all' && image.category !== category) {
      return false;
    }
    
    // Vérifier si l'image correspond à un des termes de recherche
    return searchTerms.some(term => {
      const titleMatch = image.title.toLowerCase().includes(term);
      const countryMatch = image.country && image.country.toLowerCase().includes(term);
      const regionMatch = image.region && image.region.toLowerCase().includes(term);
      
      // Vérifier les correspondances avec les listes de localisations
      const isFrenchLocation = FRANCE_LOCATIONS.some(loc => loc.toLowerCase().includes(term));
      const isEuropeanLocation = EUROPE_LOCATIONS.some(loc => loc.toLowerCase().includes(term));
      const isWorldLocation = WORLD_LOCATIONS.some(loc => loc.toLowerCase().includes(term));
      
      return titleMatch || countryMatch || regionMatch || 
             (image.category === 'france' && isFrenchLocation) ||
             (image.category === 'europe' && isEuropeanLocation) ||
             (image.category === 'monde' && isWorldLocation);
    });
  });
};

// Fonction auxiliaire pour filtrer les images par catégorie
export const filterImagesByCategory = (
  images: PinterestImage[],
  category: 'monde' | 'europe' | 'france' | 'all'
): PinterestImage[] => {
  if (category === 'all') {
    return images;
  }
  
  return images.filter(image => image.category === category);
};

// Helper pour extraire les tags pertinents d'une image
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
