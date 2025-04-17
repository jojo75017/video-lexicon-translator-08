
import { toast } from 'sonner';

export const generatePrompt = (
  title: string, 
  style: string, 
  mood: string, 
  quality: number, 
  detailLevel: number, 
  additionalElements?: string,
  language: 'fr' | 'en' = 'fr'
) => {
  if (!title) {
    toast.error(language === 'fr' ? 'Veuillez entrer un titre pour générer un prompt' : 'Please enter a title to generate a prompt');
    return null;
  }

  // Styles plus détaillés selon le type sélectionné
  const styleDetails = getStyleDetails(style);
  const moodDetails = getMoodDetails(mood);
  
  // Base du prompt en fonction de la langue
  let prompt = '';
  
  if (language === 'fr') {
    prompt = `Une image ${styleDetails} de ${title}, ambiance ${moodDetails}`;
  } else {
    prompt = `A ${styleDetails} image of ${title}, with ${moodDetails} atmosphere`;
  }
  
  // Quality modifiers
  if (quality > 50) {
    prompt += language === 'fr' ? ', haute résolution' : ', high resolution';
  }
  if (quality > 75) {
    prompt += language === 'fr' ? ', qualité exceptionnelle' : ', exceptional quality';
  }
  
  // Detail level modifiers
  if (detailLevel > 50) {
    prompt += language === 'fr' ? ', très détaillé' : ', highly detailed';
  }
  if (detailLevel > 75) {
    prompt += language === 'fr' ? ', extrêmement détaillé, avec textures riches' : ', extremely detailed with rich textures';
  }
  
  // Additional elements
  if (additionalElements) {
    prompt += language === 'fr' ? `, avec ${additionalElements}` : `, with ${additionalElements}`;
  }
  
  // Professional touches - plus spécifiques selon le style
  if (style === 'photo-realistic') {
    prompt += language === 'fr' 
      ? ', photographie professionnelle, prise de vue avec un appareil haute définition, éclairage d\'étude parfait, mise au point précise' 
      : ', professional photography, shot with high-end camera, perfect studio lighting, precise focus';
  } else if (style === 'digital-art') {
    prompt += language === 'fr'
      ? ', rendu numérique de haute qualité, effets visuels élaborés, couleurs éclatantes, composition artistique soignée'
      : ', high quality digital rendering, elaborate visual effects, vibrant colors, careful artistic composition';
  } else if (style === 'oil-painting') {
    prompt += language === 'fr'
      ? ', texture de toile visible, coups de pinceau expressifs, technique de peinture à l\'huile traditionnelle'
      : ', visible canvas texture, expressive brush strokes, traditional oil painting technique';
  } else {
    prompt += language === 'fr' 
      ? ', composition professionnelle, éclairage parfait, rendu détaillé' 
      : ', professional composition, perfect lighting, detailed rendering';
  }
  
  // Ajouter des mots-clés de qualité pour les modèles d'IA
  prompt += language === 'fr'
    ? ', image parfaite, travail d\'artiste, chef-d\'œuvre'
    : ', perfect image, artwork, masterpiece';
  
  return prompt;
};

// Fonction pour obtenir des détails plus riches pour chaque style
const getStyleDetails = (style: string): string => {
  switch (style) {
    case 'photo-realistic':
      return 'photographique ultra-réaliste';
    case 'illustration':
      return 'd\'illustration artistique dessinée à la main';
    case 'digital-art':
      return 'en art digital sophistiqué';
    case 'minimalistic':
      return 'minimaliste épurée';
    case 'vintage':
      return 'vintage avec effet rétro authentique';
    case 'watercolor':
      return 'à l\'aquarelle délicate avec des couleurs qui se fondent';
    case 'sketch':
      return 'de croquis détaillé au crayon';
    case 'oil-painting':
      return 'de peinture à l\'huile texturée';
    case 'pop-art':
      return 'pop art colorée et audacieuse';
    case 'anime':
      return 'de style anime japonais';
    default:
      return 'de haute qualité';
  }
};

// Fonction pour obtenir des détails plus riches pour chaque ambiance
const getMoodDetails = (mood: string): string => {
  switch (mood) {
    case 'bright':
      return 'lumineuse et éclatante';
    case 'dark':
      return 'sombre et mystérieuse';
    case 'vibrant':
      return 'vibrante avec des couleurs intenses';
    case 'warm':
      return 'chaleureuse aux tons orangés et dorés';
    case 'dramatic':
      return 'dramatique avec de forts contrastes';
    case 'peaceful':
      return 'paisible et sereine';
    case 'nostalgic':
      return 'nostalgique évoquant des souvenirs du passé';
    case 'futuristic':
      return 'futuriste et technologique';
    case 'ethereal':
      return 'éthérée et onirique';
    case 'mystical':
      return 'mystique avec des éléments fantastiques';
    default:
      return 'équilibrée';
  }
};

export const copyPromptToClipboard = (prompt: string) => {
  if (prompt) {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copié dans le presse-papier');
  }
};
