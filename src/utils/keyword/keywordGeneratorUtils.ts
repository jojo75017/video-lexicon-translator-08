
import { KeywordSuggestion } from '@/types/seo/Keyword';

export const generateTrendData = (keyword: string): number[] => {
  // Générer des données de tendance basées sur le mot-clé
  const baseValue = Math.floor(Math.random() * 100) + 50;
  return Array.from({length: 12}, (_, i) => {
    const variation = Math.sin(i * 0.5) * 20 + Math.random() * 30;
    return Math.max(0, Math.floor(baseValue + variation));
  });
};

export const generateStandardKeywords = (seedKeyword: string): KeywordSuggestion[] => {
  const variations = [
    `${seedKeyword}`,
    `${seedKeyword} guide`,
    `meilleur ${seedKeyword}`,
    `${seedKeyword} conseils`,
    `${seedKeyword} prix`,
    `${seedKeyword} avis`,
    `comment ${seedKeyword}`,
    `${seedKeyword} 2024`,
    `${seedKeyword} comparatif`,
    `${seedKeyword} test`
  ];

  return variations.map(keyword => ({
    keyword,
    volume: Math.floor(Math.random() * 2000) + 100,
    difficulty: Math.floor(Math.random() * 80) + 10,
    cpc: parseFloat((Math.random() * 3).toFixed(2)),
    type: 'standard' as const,
    intent: ['informational', 'commercial', 'navigational', 'transactional', 'mixed'][Math.floor(Math.random() * 5)] as any,
    opportunity: Math.floor(Math.random() * 50) + 30,
    trend: generateTrendData(keyword),
    searchVolume: Math.floor(Math.random() * 2000) + 100,
    relevance: Math.floor(Math.random() * 40) + 60
  }));
};

export const generateLongTailKeywords = (seedKeyword: string): KeywordSuggestion[] => {
  const longTailVariations = [
    `comment bien choisir ${seedKeyword}`,
    `${seedKeyword} pour débutant`,
    `${seedKeyword} pas cher`,
    `où trouver ${seedKeyword}`,
    `${seedKeyword} de qualité`,
    `${seedKeyword} en ligne`,
    `${seedKeyword} livraison rapide`,
    `${seedKeyword} garantie`,
    `${seedKeyword} sur mesure`,
    `${seedKeyword} professionnel`
  ];

  return longTailVariations.map(keyword => ({
    keyword,
    volume: Math.floor(Math.random() * 500) + 10,
    difficulty: Math.floor(Math.random() * 40) + 5,
    cpc: parseFloat((Math.random() * 1.5).toFixed(2)),
    type: 'long-tail' as const,
    intent: ['informational', 'commercial', 'navigational', 'transactional', 'mixed'][Math.floor(Math.random() * 5)] as any,
    opportunity: Math.floor(Math.random() * 40) + 50,
    trend: generateTrendData(keyword),
    searchVolume: Math.floor(Math.random() * 500) + 10,
    relevance: Math.floor(Math.random() * 30) + 70
  }));
};

export const rankKeywordsByVolume = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => b.volume - a.volume);
};

export const rankKeywordsByDifficulty = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => a.difficulty - b.difficulty);
};

export const sortKeywordsByScore = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => b.opportunity - a.opportunity);
};
