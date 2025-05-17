
import { KeywordSuggestion } from '@/types/seo/Keyword';

// Génère des mots-clés standards basés sur le mot-clé principal
export const generateStandardKeywords = (keyword: string): KeywordSuggestion[] => {
  // Simulation de données
  return [
    {
      keyword: keyword,
      volume: Math.floor(Math.random() * 5000) + 1000,
      difficulty: Math.floor(Math.random() * 70) + 30,
      cpc: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
      competition: parseFloat((Math.random() * 0.7).toFixed(2)),
      relevance: 95,
    },
    {
      keyword: `meilleur ${keyword}`,
      volume: Math.floor(Math.random() * 3000) + 500,
      difficulty: Math.floor(Math.random() * 60) + 20,
      cpc: parseFloat((Math.random() * 2.5 + 1).toFixed(2)),
      competition: parseFloat((Math.random() * 0.8).toFixed(2)),
      relevance: 85,
    },
    {
      keyword: `${keyword} pas cher`,
      volume: Math.floor(Math.random() * 2500) + 300,
      difficulty: Math.floor(Math.random() * 50) + 10,
      cpc: parseFloat((Math.random() * 1.5 + 0.2).toFixed(2)),
      competition: parseFloat((Math.random() * 0.6).toFixed(2)),
      relevance: 80,
    },
    {
      keyword: `${keyword} en ligne`,
      volume: Math.floor(Math.random() * 2000) + 200,
      difficulty: Math.floor(Math.random() * 45) + 15,
      cpc: parseFloat((Math.random() * 1.8 + 0.3).toFixed(2)),
      competition: parseFloat((Math.random() * 0.5).toFixed(2)),
      relevance: 75,
    },
    {
      keyword: `acheter ${keyword}`,
      volume: Math.floor(Math.random() * 1800) + 100,
      difficulty: Math.floor(Math.random() * 55) + 25,
      cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      competition: parseFloat((Math.random() * 0.9).toFixed(2)),
      relevance: 90,
    }
  ];
};

// Génère des mots-clés longue traîne basés sur le mot-clé principal
export const generateLongTailKeywords = (keyword: string): KeywordSuggestion[] => {
  // Simulation de données
  const prefixes = ['comment', 'pourquoi', 'quel est', 'où trouver', 'quand'];
  const suffixes = ['en 2025', 'pour débutants', 'pas cher', 'près de chez moi', 'avis'];
  
  const results: KeywordSuggestion[] = [];
  
  // Génère des combinaisons de préfixes et suffixes
  for (let i = 0; i < 5; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[i % suffixes.length];
    
    results.push({
      keyword: `${prefix} ${keyword} ${suffix}`,
      volume: Math.floor(Math.random() * 500) + 50,
      difficulty: Math.floor(Math.random() * 40) + 10,
      cpc: parseFloat((Math.random() * 1 + 0.1).toFixed(2)),
      competition: parseFloat((Math.random() * 0.4).toFixed(2)),
      relevance: 70,
    });
  }
  
  return results;
};

// Classe les mots-clés par difficulté
export const rankKeywordsByDifficulty = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => {
    // Si la difficulté n'est pas définie, considérer comme très difficile
    const diffA = a.difficulty === undefined ? 100 : a.difficulty;
    const diffB = b.difficulty === undefined ? 100 : b.difficulty;
    return diffA - diffB;
  });
};

// Classe les mots-clés par volume
export const rankKeywordsByVolume = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => {
    // Si le volume n'est pas défini, considérer comme très bas
    const volA = a.volume === undefined ? 0 : a.volume;
    const volB = b.volume === undefined ? 0 : b.volume;
    return volB - volA;
  });
};

// Calcule un score composite pour chaque mot-clé
export const calculateKeywordScore = (keyword: KeywordSuggestion): number => {
  const volume = keyword.volume || 0;
  const difficulty = keyword.difficulty || 100; // Si pas défini, considérer comme très difficile
  const cpc = keyword.cpc || 0;
  const competition = keyword.competition || 1; // Si pas défini, considérer comme très compétitif
  
  // Formule de score: plus de volume, moins de difficulté, plus de CPC = meilleur
  return (volume / 1000) * (1 / (difficulty / 50)) * (cpc + 0.5) * (1 - competition / 2);
};

// Trie les mots-clés par score composite
export const sortKeywordsByScore = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => {
    const scoreA = calculateKeywordScore(a);
    const scoreB = calculateKeywordScore(b);
    return scoreB - scoreA; // Tri décroissant
  });
};
