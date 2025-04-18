
import { PinterestImage } from '@/types/pinterest';

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
  
  // Special cases for different countries
  if (image.country?.toLowerCase() === 'finlande' || image.title.toLowerCase().includes('finlande')) {
    return {
      title: 'Que faire en Finlande : nature, lacs',
      description: 'La Finlande offre des paysages naturels époustouflants avec ses milliers de lacs, ses forêts de pins et ses aurores boréales magiques. Une destination parfaite pour les amoureux de nature et d\'aventure.'
    };
  }
  
  if (image.country?.toLowerCase() === 'vietnam' || image.title.toLowerCase().includes('vietnam')) {
    return {
      title: 'Découvrez le Vietnam : traditions et paysages',
      description: 'Le Vietnam séduit par ses paysages variés entre rizières en terrasses, baie d\'Halong et villages traditionnels. Une culture riche et une gastronomie exceptionnelle vous attendent.'
    };
  }

  // Generate title and description using helper functions
  const title = generateTitle(location, subject);
  const description = generateDescription(locationType, location);
  
  return { title, description };
};

// Helper function to generate titles
const generateTitle = (location: string, subject?: string): string => {
  const titlePrefixes = [
    `Découvrez ${location}`,
    `Explorez ${location}`,
    `Voyage à ${location}`,
    `Visitez ${location}`,
    `Les merveilles de ${location}`
  ];
  
  const randomTitlePrefix = titlePrefixes[Math.floor(Math.random() * titlePrefixes.length)];
  let title = subject ? `${randomTitlePrefix} et ses ${subject}` : randomTitlePrefix;
  
  // Clean up and limit title length
  title = title.replace(/\s+/g, ' ').trim();
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  
  return title;
};

// Helper function to generate descriptions
const generateDescription = (locationType: string, location: string): string => {
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
  
  if (description.length > 280) {
    description = description.substring(0, 277) + '...';
  }
  
  return description;
};
