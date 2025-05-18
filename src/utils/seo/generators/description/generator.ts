
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
  } else if (theme === 'restaurant') {
    description = `${keyword} : découvrez notre carte variée, nos spécialités culinaires et l'ambiance unique de notre établissement. Réservez votre table et venez déguster une cuisine authentique préparée avec passion.`;
  } else if (theme === 'sante') {
    description = `Informations complètes sur ${keyword} : symptômes, traitements, prévention et conseils pratiques. Consultez nos ressources validées par des professionnels de santé pour prendre soin de votre bien-être.`;
  } else if (theme === 'tech') {
    description = `Tout ce que vous devez savoir sur ${keyword} : fonctionnalités, comparatifs, tests et avis d'experts. Découvrez les dernières innovations technologiques et comment les utiliser efficacement.`;
  } else if (theme === 'education') {
    description = `Ressources pédagogiques sur ${keyword} : méthodes d'apprentissage, exercices pratiques et conseils pour progresser. Contenus adaptés pour tous les niveaux, des débutants aux plus avancés.`;
  } else {
    description = `Informations essentielles sur ${keyword} : guide pratique, conseils d'experts et ressources utiles. Contenu régulièrement mis à jour pour vous offrir les données les plus pertinentes sur ce sujet.`;
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
  } else if (theme === 'restaurant') {
    shortDesc = `${keyword} : découvrez notre carte variée, nos spécialités culinaires et l'ambiance unique de notre établissement. Réservation en ligne disponible.`;
    
    longDesc = `Bienvenue au ${keyword}, une expérience gastronomique unique au cœur de votre ville. Notre chef talentueux élabore des plats d'exception à partir de produits frais et locaux, renouvelés au fil des saisons. Découvrez notre menu varié qui saura satisfaire tous les palais, de l'amateur de cuisine traditionnelle au gourmet en quête de nouvelles sensations gustatives. Notre équipe attentionnée vous accueille dans un cadre chaleureux et élégant, idéal pour vos repas en famille, dîners romantiques ou événements professionnels. Réservez dès maintenant votre table et laissez-vous séduire par une cuisine authentique qui célèbre les saveurs et le partage.`;
  } else if (theme === 'sante') {
    shortDesc = `Informations complètes sur ${keyword} : symptômes, traitements, prévention et conseils pratiques validés par des professionnels de santé.`;
    
    longDesc = `Ressource fiable sur ${keyword} : explorez nos contenus détaillés concernant les symptômes, les méthodes de diagnostic, les options de traitement et les stratégies de prévention. Nos articles sont rédigés en collaboration avec des médecins spécialistes et régulièrement mis à jour selon les dernières avancées médicales. Découvrez des témoignages inspirants, des conseils pratiques pour la vie quotidienne et des exercices recommandés pour améliorer votre qualité de vie. Notre objectif est de vous fournir une information claire et précise pour vous accompagner dans votre parcours de santé, en complément du suivi médical professionnel. Consultez également notre FAQ et nos ressources complémentaires pour approfondir vos connaissances sur ce sujet.`;
  } else if (theme === 'tech') {
    shortDesc = `Tout ce que vous devez savoir sur ${keyword} : fonctionnalités, comparatifs, tests et avis d'experts sur les dernières innovations technologiques.`;
    
    longDesc = `Guide complet sur ${keyword} : plongez dans l'univers de cette technologie avec notre analyse approfondie. Découvrez ses caractéristiques techniques, ses applications pratiques et son potentiel d'évolution dans le marché actuel. Nos experts en technologies décomposent les fonctionnalités complexes en explications accessibles, comparent les différentes options disponibles et partagent leurs retours d'expérience après des tests approfondis. Que vous soyez novice ou technophile averti, vous trouverez des informations précieuses pour faire des choix éclairés : guides d'achat, astuces d'optimisation, solutions aux problèmes courants et perspectives d'avenir. Restez à la pointe de l'innovation avec nos contenus régulièrement actualisés.`;
  } else if (theme === 'education') {
    shortDesc = `Ressources pédagogiques sur ${keyword} : méthodes d'apprentissage, exercices pratiques et conseils pour progresser à votre rythme.`;
    
    longDesc = `Plateforme éducative complète sur ${keyword} : accédez à nos programmes structurés adaptés à tous les niveaux d'apprentissage. Nos ressources pédagogiques combinent explications théoriques claires, exemples concrets, exercices interactifs et évaluations progressives pour consolider vos acquis. Développées par des enseignants expérimentés, nos méthodes favorisent une compréhension profonde plutôt qu'une simple mémorisation. Profitez de nos outils de suivi personnalisés, forums d'entraide et sessions de tutorat pour surmonter vos difficultés. Que vous prépariez un examen, cherchiez à acquérir de nouvelles compétences ou souhaitiez approfondir vos connaissances par curiosité intellectuelle, notre plateforme vous accompagne avec des contenus engageants et pédagogiquement efficaces.`;
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

/**
 * Génère des descriptions SEO en utilisant l'API OpenAI si une clé est fournie
 * @param keyword Le mot-clé principal
 * @param apiKey Clé API OpenAI (optionnelle)
 * @returns Un objet contenant les descriptions courte et longue
 */
export const generateAIDescriptions = async (keyword: string, apiKey?: string): Promise<GeneratedDescriptions> => {
  // Si aucune clé API n'est fournie, utiliser le générateur local
  if (!apiKey) {
    return generateBothDescriptions(keyword);
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Tu es un expert SEO spécialisé dans la rédaction de méta-descriptions optimisées pour le référencement. Génère deux descriptions SEO pour le mot-clé fourni : une courte (max 155 caractères) et une longue (max 500 caractères). Elles doivent être naturelles, incitatives et optimisées pour le référencement. Réponds UNIQUEMENT au format JSON avec les clés 'short' et 'long'."
          },
          {
            role: "user",
            content: `Génère des descriptions SEO pour le mot-clé: ${keyword}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Erreur API OpenAI:", data.error);
      return generateBothDescriptions(keyword);
    }
    
    try {
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        short: truncateText(parsed.short, 155),
        long: truncateText(parsed.long, 500)
      };
    } catch (parseError) {
      console.error("Erreur de parsing:", parseError);
      return generateBothDescriptions(keyword);
    }
  } catch (error) {
    console.error("Erreur lors de la génération AI:", error);
    return generateBothDescriptions(keyword);
  }
};

/**
 * Détecte le thème d'un site web à partir d'un mot-clé
 * Cette fonction est déplacée ici depuis utils.ts pour être exportée
 * @param keyword Le mot-clé à analyser
 * @returns Le thème détecté
 */
export const detectWebsiteTheme = (keyword: string): string => {
  const keywordLower = keyword.toLowerCase();
  
  // Mots-clés liés aux voyages
  if (keywordLower.includes('voyage') || 
      keywordLower.includes('tourisme') || 
      keywordLower.includes('visit') || 
      keywordLower.includes('destination') || 
      keywordLower.includes('hotel') || 
      keywordLower.includes('vacances') ||
      keywordLower.includes('séjour') ||
      keywordLower.includes('plage') ||
      keywordLower.includes('trek')) {
    return 'travel';
  }
  
  // Mots-clés liés à l'aquariophilie
  if (keywordLower.includes('aqua') || 
      keywordLower.includes('poisson') || 
      keywordLower.includes('récif') || 
      keywordLower.includes('marin') ||
      keywordLower.includes('eau douce') ||
      keywordLower.includes('fish') ||
      keywordLower.includes('tank')) {
    return 'aquarium';
  }
  
  // Mots-clés liés à la restauration
  if (keywordLower.includes('restaurant') || 
      keywordLower.includes('cuisine') || 
      keywordLower.includes('gastronomie') || 
      keywordLower.includes('menu') ||
      keywordLower.includes('chef') ||
      keywordLower.includes('bistrot') ||
      keywordLower.includes('food')) {
    return 'restaurant';
  }
  
  // Mots-clés liés à la santé
  if (keywordLower.includes('santé') || 
      keywordLower.includes('médical') || 
      keywordLower.includes('thérapie') || 
      keywordLower.includes('bien-être') ||
      keywordLower.includes('médicament') ||
      keywordLower.includes('health') ||
      keywordLower.includes('clinique')) {
    return 'sante';
  }
  
  // Mots-clés liés à la technologie
  if (keywordLower.includes('tech') || 
      keywordLower.includes('digital') || 
      keywordLower.includes('informatique') || 
      keywordLower.includes('logiciel') ||
      keywordLower.includes('ordinateur') ||
      keywordLower.includes('web') ||
      keywordLower.includes('code') ||
      keywordLower.includes('app')) {
    return 'tech';
  }
  
  // Mots-clés liés à l'éducation
  if (keywordLower.includes('éducation') || 
      keywordLower.includes('formation') || 
      keywordLower.includes('cours') || 
      keywordLower.includes('apprendre') ||
      keywordLower.includes('école') ||
      keywordLower.includes('étude') ||
      keywordLower.includes('learn') ||
      keywordLower.includes('enseign')) {
    return 'education';
  }
  
  // Par défaut, retourner un thème générique
  return 'general';
};
