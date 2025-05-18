
import { KeywordSuggestion, SerpResult } from "@/types/seo/Keyword";

// Détermine l'intention de recherche du mot-clé
export const determineKeywordIntent = (keyword: string): 'informational' | 'navigational' | 'transactional' => {
  // Mots clés indiquant une intention informationnelle
  const informationalTerms = ['comment', 'pourquoi', 'que', 'quoi', 'guide', 'tutoriel', 'apprendre', 'comprendre', 'définition'];
  
  // Mots clés indiquant une intention transactionnelle
  const transactionalTerms = ['acheter', 'prix', 'achat', 'promo', 'commander', 'pas cher', 'meilleur', 'prix'];
  
  // Mots clés indiquant une intention navigationnelle
  const navigationalTerms = ['site', 'login', 'connexion', 'inscription', 'avis', 'adresse', 'contact'];
  
  const lowerKeyword = keyword.toLowerCase();
  
  // Vérification de l'intention
  for (const term of informationalTerms) {
    if (lowerKeyword.includes(term)) return 'informational';
  }
  
  for (const term of transactionalTerms) {
    if (lowerKeyword.includes(term)) return 'transactional';
  }
  
  for (const term of navigationalTerms) {
    if (lowerKeyword.includes(term)) return 'navigational';
  }
  
  // Par défaut, on considère comme informationnelle
  return 'informational';
};

// Enrichit les mots-clés avec des données supplémentaires
export const enrichKeywords = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return keywords.map(kw => {
    const intent = determineKeywordIntent(kw.keyword);
    const opportunity = Math.floor(Math.random() * 30) + 50; // Score d'opportunité entre 50 et 80
    const suggestedTitle = generateSuggestedTitle(kw.keyword);
    const suggestedDescription = generateSuggestedDescription(kw.keyword);
    const suggestedLongDescription = generateSuggestedLongDescription(kw.keyword);
    
    return {
      ...kw,
      intent,
      opportunity,
      suggestedTitle,
      suggestedDescription,
      suggestedLongDescription,
      type: kw.type || (kw.keyword.split(' ').length > 3 ? 'long-tail' : 'standard'),
    };
  });
};

// Génère des mots-clés sous forme de questions
export const generateQuestionKeywords = (keyword: string): string[] => {
  const questions = [
    `Comment ${keyword} fonctionne`,
    `Pourquoi choisir ${keyword}`,
    `Qu'est-ce que ${keyword}`,
    `Comment optimiser ${keyword}`,
    `Quelle est la différence entre ${keyword} et les alternatives`
  ];
  
  return questions;
};

// Génère un titre suggéré basé sur le mot-clé
export const generateSuggestedTitle = (keyword: string): string => {
  const titles = [
    `Guide complet sur ${keyword} : Tout ce que vous devez savoir en 2024`,
    `Les 10 meilleures pratiques pour ${keyword} en 2024`,
    `${keyword} : Conseils d'experts pour des résultats optimaux`,
    `Comment maximiser les performances de votre ${keyword}`,
    `${keyword} : Guide étape par étape pour débutants et professionnels`
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};

// Génère une méta description suggérée basée sur le mot-clé
export const generateSuggestedDescription = (keyword: string): string => {
  const descriptions = [
    `Découvrez les meilleures pratiques pour ${keyword}. Guide complet avec conseils d'experts, astuces et stratégies pour réussir.`,
    `Tout ce que vous devez savoir sur ${keyword} : techniques avancées, outils recommandés et astuces professionnelles.`,
    `Optimisez votre ${keyword} avec nos conseils d'experts. Maximisez vos résultats et dépassez la concurrence.`,
    `${keyword} expliqué simplement : apprenez les fondamentaux et les techniques avancées pour réussir dans ce domaine.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Génère une description longue suggérée basée sur le mot-clé
export const generateSuggestedLongDescription = (keyword: string): string => {
  return `Notre guide complet sur ${keyword} vous offre une analyse approfondie du sujet, avec des conseils d'experts, des études de cas et des stratégies éprouvées. Découvrez comment optimiser votre approche de ${keyword} pour obtenir les meilleurs résultats possibles, que vous soyez débutant ou professionnel. Ce guide contient également des ressources exclusives et des outils recommandés pour vous aider à exceller dans le domaine de ${keyword}.`;
};

// Génère des données SERP simulées pour un mot-clé
export const generateSerpData = (keyword: string): SerpResult[] => {
  const baseUrls = [
    'https://www.example.com',
    'https://www.guide-expert.com',
    'https://www.conseils-pro.fr',
    'https://www.tuto-web.org',
    'https://www.blog-specialise.net'
  ];
  
  const results: SerpResult[] = [];
  
  for (let i = 0; i < 5; i++) {
    let title = '';
    let description = '';
    
    // Générer des titres pertinents
    if (i === 0) {
      title = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} : Guide Complet (Édition 2024)`;
    } else if (i === 1) {
      title = `Les 10 Conseils d'Experts sur ${keyword} - Guide Pratique`;
    } else if (i === 2) {
      title = `Tout ce que vous devez savoir sur ${keyword} | Blog Spécialisé`;
    } else if (i === 3) {
      title = `Comment maîtriser ${keyword} : Stratégies avancées`;
    } else {
      title = `${keyword} - Définition, exemples et bonnes pratiques`;
    }
    
    // Générer des descriptions pertinentes
    description = `Découvrez notre guide complet sur ${keyword}. Apprenez les techniques avancées, astuces et stratégies pour optimiser vos résultats. Inclut des exemples concrets et études de cas.`;
    
    // Ajouter à nos résultats
    results.push({
      title,
      url: `${baseUrls[i]}/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description,
      position: i + 1
    });
  }
  
  return results;
};
