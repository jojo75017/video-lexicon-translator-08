
// Note: Ce fichier est référencé par MetaDescriptionGenerator.tsx mais manque dans les fichiers fournis
// Je vais l'implémenter pour résoudre l'erreur

import { detectWebsiteTheme, truncateText } from './utils';

// Interface pour les descriptions générées
export interface GeneratedDescriptions {
  short: string;
  long: string;
}

/**
 * Génère une description SEO optimisée à partir d'un mot-clé
 * @param keyword Le mot-clé principal
 * @returns Une description SEO optimisée
 */
export const generateSeoDescription = (keyword: string): string => {
  const theme = detectWebsiteTheme(keyword);
  let description = '';

  if (theme === 'travel') {
    description = `Découvrez nos conseils et guides complets sur ${keyword}. Des itinéraires personnalisés, des bons plans hébergement, des astuces pour voyager comme un local et des photos inspirantes pour préparer votre prochain voyage.`;
  } else if (theme === 'aquarium') {
    description = `Tout savoir sur ${keyword} : guides d'entretien, conseils d'experts, sélection de matériel et astuces pour créer un écosystème équilibré. Idéal pour débutants et aquariophiles confirmés.`;
  } else {
    description = `Découvrez notre guide complet sur ${keyword}. Informations essentielles, conseils d'experts, et ressources pratiques pour tout comprendre sur ce sujet. Contenu mis à jour régulièrement.`;
  }

  // Limiter à 155 caractères pour la méta-description standard
  return truncateText(description, 155);
};

/**
 * Génère à la fois une description courte et longue à partir d'un mot-clé
 * @param keyword Le mot-clé principal
 * @returns Un objet contenant les descriptions courte et longue
 */
export const generateBothDescriptions = (keyword: string): GeneratedDescriptions => {
  const theme = detectWebsiteTheme(keyword);
  let shortDesc = '';
  let longDesc = '';

  if (theme === 'travel') {
    shortDesc = `Découvrez nos conseils et guides complets sur ${keyword}. Des itinéraires personnalisés, des bons plans et des astuces pour voyager comme un local.`;
    
    longDesc = `Explorez ${keyword} avec notre guide de voyage détaillé : itinéraires personnalisés, bons plans hébergement, conseils de transport, activités incontournables et expériences authentiques. Nos experts voyageurs partagent leurs astuces pour découvrir les trésors cachés, les meilleurs restaurants locaux et les panoramas à ne pas manquer. Planifiez votre aventure idéale avec nos recommandations testées et approuvées, que vous voyagiez en famille, en couple ou en solo. Retrouvez également notre sélection de photos inspirantes et nos conseils pratiques pour optimiser votre budget et profiter pleinement de votre séjour.`;
  } else if (theme === 'aquarium') {
    shortDesc = `Tout savoir sur ${keyword} : guides d'entretien, conseils d'experts, sélection de matériel et astuces pour créer un écosystème équilibré.`;
    
    longDesc = `Guide complet sur ${keyword} : découvrez comment créer et maintenir un aquarium équilibré avec nos conseils d'experts en aquariophilie. Nous couvrons tout : choix des espèces compatibles, équipements recommandés, paramètres d'eau optimaux, cycles de l'azote, alimentation adaptée et prévention des maladies. Apprenez à entretenir efficacement votre bac, à créer un décor naturel et esthétique, et à résoudre les problèmes courants. Que vous soyez débutant ou aquariophile confirmé, nos guides détaillés, photos et vidéos explicatives vous aideront à réussir votre projet aquatique et à comprendre les besoins spécifiques de vos habitants aquatiques.`;
  } else {
    shortDesc = `Découvrez notre guide complet sur ${keyword}. Informations essentielles, conseils d'experts et ressources pratiques pour comprendre ce sujet.`;
    
    longDesc = `Explorez notre guide exhaustif sur ${keyword} : concepts fondamentaux, analyses approfondies, études de cas pertinentes et perspectives d'experts du domaine. Notre contenu régulièrement mis à jour vous offre les informations les plus récentes et fiables pour maîtriser ce sujet complexe. Nous abordons les aspects théoriques et pratiques avec des exemples concrets, des conseils personnalisés et des ressources complémentaires pour approfondir vos connaissances. Que vous soyez novice ou expert, notre approche pédagogique vous permettra de progresser à votre rythme et d'appliquer efficacement ces concepts dans votre contexte spécifique. Retrouvez également nos recommandations d'outils, nos tutoriels étape par étape et notre FAQ pour répondre à toutes vos questions.`;
  }

  // Limiter les descriptions aux longueurs appropriées
  return {
    short: truncateText(shortDesc, 155),
    long: truncateText(longDesc, 500)
  };
};
