
import { KeywordSuggestion } from "@/types/seo/Keyword";

/**
 * Generates standard keywords based on a base keyword
 */
export const generateStandardKeywords = (baseKeyword: string): KeywordSuggestion[] => {
  const keywords = [
    { keyword: baseKeyword, volume: Math.floor(Math.random() * 5000) + 1000, difficulty: Math.floor(Math.random() * 50) + 30 },
    { keyword: `meilleur ${baseKeyword}`, volume: Math.floor(Math.random() * 3000) + 500, difficulty: Math.floor(Math.random() * 40) + 40 },
    { keyword: `${baseKeyword} pas cher`, volume: Math.floor(Math.random() * 2500) + 800, difficulty: Math.floor(Math.random() * 40) + 35 },
    { keyword: `${baseKeyword} avis`, volume: Math.floor(Math.random() * 2000) + 700, difficulty: Math.floor(Math.random() * 30) + 30 },
    { keyword: `comparatif ${baseKeyword}`, volume: Math.floor(Math.random() * 1800) + 600, difficulty: Math.floor(Math.random() * 50) + 40 },
    { keyword: `acheter ${baseKeyword}`, volume: Math.floor(Math.random() * 1500) + 800, difficulty: Math.floor(Math.random() * 50) + 45 },
    { keyword: `${baseKeyword} professionnel`, volume: Math.floor(Math.random() * 1200) + 400, difficulty: Math.floor(Math.random() * 60) + 30 },
    { keyword: `prix ${baseKeyword}`, volume: Math.floor(Math.random() * 1000) + 500, difficulty: Math.floor(Math.random() * 40) + 30 },
    { keyword: `${baseKeyword} en ligne`, volume: Math.floor(Math.random() * 900) + 400, difficulty: Math.floor(Math.random() * 45) + 35 },
    { keyword: `top ${baseKeyword}`, volume: Math.floor(Math.random() * 800) + 300, difficulty: Math.floor(Math.random() * 40) + 40 }
  ];

  return keywords.map(k => ({
    keyword: k.keyword,
    volume: k.volume,
    difficulty: k.difficulty,
    cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
    competition: parseFloat((Math.random() * 0.8).toFixed(2)),
    suggestedTitle: `${k.keyword.charAt(0).toUpperCase() + k.keyword.slice(1)} - Guide complet et conseils`,
    suggestedDescription: `Découvrez tout sur ${k.keyword}. Conseils d'experts, astuces pratiques et guide complet pour vous aider.`
  }));
};

/**
 * Generates long-tail keywords based on a base keyword
 */
export const generateLongTailKeywords = (baseKeyword: string): KeywordSuggestion[] => {
  const keywords = [
    { keyword: `comment choisir le meilleur ${baseKeyword}`, volume: Math.floor(Math.random() * 800) + 200, difficulty: Math.floor(Math.random() * 30) + 20 },
    { keyword: `où trouver un ${baseKeyword} pas cher`, volume: Math.floor(Math.random() * 700) + 150, difficulty: Math.floor(Math.random() * 25) + 25 },
    { keyword: `${baseKeyword} pour débutant guide complet`, volume: Math.floor(Math.random() * 600) + 100, difficulty: Math.floor(Math.random() * 25) + 20 },
    { keyword: `quels sont les avantages d'un ${baseKeyword}`, volume: Math.floor(Math.random() * 500) + 100, difficulty: Math.floor(Math.random() * 20) + 15 },
    { keyword: `${baseKeyword} comparatif des meilleurs modèles`, volume: Math.floor(Math.random() * 450) + 150, difficulty: Math.floor(Math.random() * 35) + 25 },
    { keyword: `comment utiliser efficacement un ${baseKeyword}`, volume: Math.floor(Math.random() * 400) + 100, difficulty: Math.floor(Math.random() * 25) + 15 },
    { keyword: `quel est le prix moyen d'un ${baseKeyword}`, volume: Math.floor(Math.random() * 350) + 80, difficulty: Math.floor(Math.random() * 20) + 20 },
    { keyword: `${baseKeyword} professionnel ou amateur différences`, volume: Math.floor(Math.random() * 300) + 70, difficulty: Math.floor(Math.random() * 30) + 25 },
    { keyword: `${baseKeyword} les erreurs à éviter absolument`, volume: Math.floor(Math.random() * 250) + 50, difficulty: Math.floor(Math.random() * 25) + 15 },
    { keyword: `comment entretenir son ${baseKeyword} conseils pratiques`, volume: Math.floor(Math.random() * 200) + 50, difficulty: Math.floor(Math.random() * 20) + 10 }
  ];

  return keywords.map(k => ({
    keyword: k.keyword,
    volume: k.volume,
    difficulty: k.difficulty,
    cpc: parseFloat((Math.random() * 1 + 0.3).toFixed(2)),
    competition: parseFloat((Math.random() * 0.5).toFixed(2)),
    suggestedTitle: `${k.keyword.charAt(0).toUpperCase() + k.keyword.slice(1)} | Guide étape par étape`,
    suggestedDescription: `Découvrez comment ${k.keyword}. Nos conseils d'experts vous guideront dans toutes les étapes.`
  }));
};
