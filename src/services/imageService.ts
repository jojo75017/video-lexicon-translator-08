
import { PinterestImage } from '@/types/pinterest';
import { 
  FRANCE_LOCATIONS, 
  EUROPE_LOCATIONS, 
  WORLD_LOCATIONS 
} from '@/types/pinterest';

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

