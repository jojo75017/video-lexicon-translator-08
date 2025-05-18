
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
    intent: kw.intent || determineKeywordIntent(kw.keyword)
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
