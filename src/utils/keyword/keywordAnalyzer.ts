
import { KeywordSuggestion } from "@/types/seo/Keyword";

// Génération de questions en fonction d'un mot-clé
export const generateQuestionKeywords = (keyword: string): string[] => {
  const questions = [
    `Comment ${keyword}`,
    `Pourquoi ${keyword}`,
    `Quand ${keyword}`,
    `Où trouver ${keyword}`,
    `Quel ${keyword} choisir`,
    `${keyword} pour débutant`,
    `${keyword} vs`,
    `Meilleur ${keyword}`,
    `${keyword} prix`
  ];
  
  return questions;
};

// Enrichissement des mots-clés avec des données supplémentaires
export const enrichKeywords = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return keywords.map(kw => ({
    ...kw,
    opportunity: calculateOpportunityScore(kw),
    serps: generateMockSerps(kw.keyword),
    intent: kw.intent || determineKeywordIntent(kw.keyword),
    suggestedTitle: generateSuggestedTitle(kw.keyword),
    suggestedDescription: generateSuggestedDescription(kw.keyword),
    suggestedLongDescription: generateSuggestedLongDescription(kw.keyword)
  }));
};

// Calcul du score d'opportunité basé sur le volume et la difficulté
export const calculateOpportunityScore = (keyword: KeywordSuggestion): number => {
  if (!keyword.volume || !keyword.difficulty) {
    return Math.floor(Math.random() * 50) + 30;
  }
  
  // Formule simple: plus le volume est élevé et la difficulté basse, meilleure est l'opportunité
  const volumeScore = Math.min(keyword.volume / 20, 50);
  const difficultyScore = Math.max(100 - keyword.difficulty, 10);
  
  const opportunityScore = Math.floor((volumeScore + difficultyScore) / 2);
  return Math.min(Math.max(opportunityScore, 10), 99); // Garder entre 10 et 99
};

// Déterminer l'intention de recherche d'un mot-clé
export const determineKeywordIntent = (keyword: string): 'informational' | 'navigational' | 'transactional' | 'commercial' => {
  const keywordLower = keyword.toLowerCase();
  
  if (keywordLower.includes('comment') || 
      keywordLower.includes('pourquoi') || 
      keywordLower.includes('qu\'est-ce') || 
      keywordLower.includes('guide') || 
      keywordLower.includes('tutoriel')) {
    return 'informational';
  } else if (keywordLower.includes('acheter') || 
             keywordLower.includes('prix') || 
             keywordLower.includes('tarif') || 
             keywordLower.includes('commander')) {
    return 'transactional';
  } else if (keywordLower.includes('vs') || 
             keywordLower.includes('comparatif') || 
             keywordLower.includes('meilleur') || 
             keywordLower.includes('avis')) {
    return 'commercial';
  } else {
    return 'navigational';
  }
};

// Génération de résultats SERP fictifs pour un mot-clé
export const generateMockSerps = (keyword: string): any[] => {
  const domains = [
    "wikipedia.org", 
    "amazon.fr", 
    "youtube.com", 
    "lemonde.fr", 
    "20minutes.fr", 
    "doctissimo.fr", 
    "fnac.com", 
    "pinterest.fr", 
    "lefigaro.fr"
  ];
  
  return Array(5).fill(0).map((_, index) => {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return {
      position: index + 1,
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${index === 0 ? "Guide complet" : index === 1 ? "Meilleurs conseils" : index === 2 ? "Comparatif" : "Informations"} (${new Date().getFullYear()})`,
      url: `https://www.${domain}/search/${keyword.replace(/\s+/g, "-").toLowerCase()}`,
      description: `Découvrez tout sur ${keyword}. Des conseils d'experts et des astuces pour ${keyword} facilement. Guide mis à jour en ${new Date().getFullYear()}.`,
      domain: domain,
      features: {
        hasSnippet: index === 0,
        hasSitelinks: index === 0,
        hasImage: index < 2,
        hasVideo: index === 2,
        hasReviews: index === 1
      }
    };
  });
};

// Grouper les mots-clés par intention
export const groupKeywordsByIntent = (keywords: KeywordSuggestion[]): Record<string, KeywordSuggestion[]> => {
  const groupedKeywords: Record<string, KeywordSuggestion[]> = {
    informational: [],
    navigational: [],
    transactional: [],
    commercial: [],
    unknown: []
  };
  
  keywords.forEach(kw => {
    if (!kw.intent) {
      groupedKeywords.unknown.push(kw);
    } else {
      groupedKeywords[kw.intent].push(kw);
    }
  });
  
  return groupedKeywords;
};

// Générer des données de tendance pour un mot-clé
export const generateTrendData = (keyword: string): number[] => {
  // Génère 12 points de données (un par mois)
  return Array(12).fill(0).map(() => Math.floor(Math.random() * 100));
};

// Générer des compétiteurs fictifs pour un mot-clé
export const generateCompetitors = (keyword: string): any[] => {
  const competitors = [
    { 
      name: "competitor1.com", 
      url: "https://www.competitor1.com", 
      strength: 85, 
      organic_traffic: 45000, 
      keywords: 1200 
    },
    { 
      name: "competitor2.com", 
      url: "https://www.competitor2.com", 
      strength: 72, 
      organic_traffic: 28000, 
      keywords: 850 
    },
    { 
      name: "competitor3.com", 
      url: "https://www.competitor3.com", 
      strength: 63, 
      organic_traffic: 17500, 
      keywords: 520 
    }
  ];
  
  return competitors;
};

// Générer un titre suggéré pour un mot-clé
export const generateSuggestedTitle = (keyword: string): string => {
  const templates = [
    `Guide Complet: ${keyword} - Tout Ce Que Vous Devez Savoir en ${new Date().getFullYear()}`,
    `Les 10 Meilleurs Conseils pour ${keyword} [Guide Actualisé]`,
    `Comment Optimiser Votre ${keyword} - Conseils d'Experts`,
    `${keyword}: Stratégies Efficaces et Astuces Professionnelles`,
    `Le Guide Ultime du ${keyword} pour les Débutants et Experts`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

// Générer une description suggérée pour un mot-clé
export const generateSuggestedDescription = (keyword: string): string => {
  const templates = [
    `Découvrez nos conseils experts sur ${keyword}. Guide complet avec stratégies efficaces et méthodes éprouvées pour améliorer vos résultats.`,
    `Tout ce que vous devez savoir sur ${keyword}. Astuces, bonnes pratiques et erreurs à éviter pour optimiser votre approche.`,
    `Guide pratique sur ${keyword} avec exemples concrets et démarche pas à pas. Conseils actualisés pour ${new Date().getFullYear()}.`,
    `Explorez nos ressources sur ${keyword} et améliorez vos performances grâce à nos techniques éprouvées et conseils d'experts.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

// Générer une description longue pour un mot-clé
export const generateSuggestedLongDescription = (keyword: string): string => {
  const templates = [
    `Bienvenue dans notre guide complet sur ${keyword}. Nous avons rassemblé pour vous les meilleures pratiques, conseils d'experts et stratégies éprouvées pour vous aider à maîtriser ce sujet. Que vous soyez débutant ou expert, vous trouverez des informations précieuses pour améliorer vos résultats et éviter les erreurs courantes. Notre équipe a analysé les dernières tendances et méthodes pour vous proposer un contenu actualisé et pertinent.`,
    
    `Découvrez comment optimiser votre approche de ${keyword} grâce à notre guide détaillé. Nous abordons tous les aspects essentiels avec une méthodologie claire et des exemples concrets. Apprenez à identifier les opportunités, surmonter les obstacles communs et mettre en place des stratégies efficaces. Ce guide s'appuie sur des années d'expérience et de recherche pour vous offrir les informations les plus pertinentes et actuelles.`,
    
    `Vous cherchez à améliorer vos connaissances sur ${keyword}? Notre guide exhaustif couvre tous les aspects importants que vous devez maîtriser. De la théorie fondamentale aux techniques avancées, nous explorons chaque facette avec des explications claires et des conseils pratiques. Restez à jour avec les meilleures pratiques et évitez les pièges courants grâce à nos recommandations basées sur l'expertise de professionnels du secteur.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};
