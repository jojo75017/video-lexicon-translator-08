
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

// Identifier un sujet potentiel à partir du titre de l'image
const identifySubject = (title: string): string => {
  if (!title) return '';
  
  const titleLower = title.toLowerCase();
  if (titleLower.includes('plage') || titleLower.includes('mer')) {
    return 'plages';
  } else if (titleLower.includes('montagne') || titleLower.includes('alpes')) {
    return 'montagnes';
  } else if (titleLower.includes('ville') || titleLower.includes('cité')) {
    return 'villes historiques';
  } else if (titleLower.includes('château') || titleLower.includes('monument')) {
    return 'monuments';
  }
  
  return '';
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

// Fonction pour générer une description globale basée sur un titre
export const generateGlobalDescriptionFromTitle = (title: string): string => {
  // Nettoyer le titre des préfixes communs
  let cleanTitle = title
    .replace(/^Découvrez\s+/i, '')
    .replace(/^Explorez\s+/i, '')
    .replace(/^Voyage\s+à\s+/i, '')
    .replace(/^Visitez\s+/i, '')
    .replace(/^Les\s+merveilles\s+de\s+/i, '');
  
  // Détecter des mots-clés spécifiques pour personnaliser la description
  let description = '';
  
  if (title.toLowerCase().includes('finlande')) {
    description = "La Finlande est un pays nordique aux paysages naturels époustouflants. Découvrez ses milliers de lacs, ses forêts infinies de pins et ses aurores boréales magiques. Explorez les activités incontournables comme le sauna finlandais traditionnel, les safaris en chiens de traîneau et la rencontre avec le Père Noël à Rovaniemi.";
  } else if (title.toLowerCase().includes('vietnam')) {
    description = "Le Vietnam est une destination fascinante qui offre une diversité de paysages et d'expériences culturelles. Des rizières en terrasses du nord aux plages paradisiaques du centre, en passant par la mythique baie d'Halong, chaque région vous dévoile ses trésors.";
  } else if (title.toLowerCase().includes('grèce') || title.toLowerCase().includes('grece')) {
    description = "La Grèce est un pays aux paysages variés, entre mer azur, îles idylliques et sites antiques fascinants. Découvrez la richesse de sa culture millénaire, sa gastronomie méditerranéenne et l'hospitalité légendaire de ses habitants.";
  } else if (title.toLowerCase().includes('paris') || title.toLowerCase().includes('france')) {
    description = "Paris, capitale mondiale de l'art et de la culture, vous invite à découvrir ses trésors. Entre la majestueuse Tour Eiffel, le musée du Louvre et ses collections inestimables, chaque quartier raconte une histoire fascinante.";
  } else {
    // Description générique basée sur le titre nettoyé
    description = `Explorez ${cleanTitle}. Nous vous proposons un guide complet avec des conseils pratiques et des informations essentielles pour profiter pleinement de cette destination. Découvrez nos recommandations d'experts pour un voyage réussi et des expériences inoubliables.`;
  }
  
  // Limiter la longueur de la description
  if (description.length > 400) {
    description = description.substring(0, 397) + '...';
  }
  
  return description;
};
