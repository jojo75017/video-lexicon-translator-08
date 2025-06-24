
import { KeywordSuggestion } from '@/types/seo/Keyword';

export const generateStandardKeywords = (baseKeyword: string): KeywordSuggestion[] => {
  const variations = [
    baseKeyword,
    `${baseKeyword} gratuit`,
    `${baseKeyword} en ligne`,
    `meilleur ${baseKeyword}`,
    `${baseKeyword} 2024`,
    `guide ${baseKeyword}`,
    `${baseKeyword} pas cher`,
    `comparatif ${baseKeyword}`,
    `${baseKeyword} français`,
    `tutoriel ${baseKeyword}`
  ];

  return variations.map(keyword => ({
    keyword,
    volume: Math.floor(Math.random() * 5000) + 100,
    difficulty: Math.floor(Math.random() * 80) + 10,
    cpc: parseFloat((Math.random() * 3).toFixed(2)),
    type: 'standard' as 'standard',
    intent: 'mixed' as 'mixed',
    opportunity: Math.floor(Math.random() * 40) + 50,
    trend: generateTrendData(keyword)
  }));
};

export const generateLongTailKeywords = (baseKeyword: string): KeywordSuggestion[] => {
  const longTailVariations = [
    `comment utiliser ${baseKeyword} efficacement`,
    `les avantages de ${baseKeyword} pour`,
    `${baseKeyword} vs alternatives gratuites`,
    `où trouver le meilleur ${baseKeyword}`,
    `${baseKeyword} pour débutants guide complet`,
    `prix ${baseKeyword} comparaison détaillée`,
    `${baseKeyword} professionnel ou gratuit`,
    `tutoriel ${baseKeyword} étape par étape`
  ];

  return longTailVariations.map(keyword => ({
    keyword,
    volume: Math.floor(Math.random() * 800) + 50,
    difficulty: Math.floor(Math.random() * 60) + 15,
    cpc: parseFloat((Math.random() * 2).toFixed(2)),
    type: 'long-tail' as 'long-tail',
    intent: 'informational' as 'informational',
    opportunity: Math.floor(Math.random() * 30) + 60,
    trend: generateTrendData(keyword)
  }));
};

export const generateTrendData = (keyword: string): string => {
  const trends = ['croissant', 'stable', 'décroissant'];
  return trends[Math.floor(Math.random() * trends.length)];
};

export const rankKeywordsByVolume = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => (b.volume || 0) - (a.volume || 0));
};

export const rankKeywordsByDifficulty = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => (a.difficulty || 0) - (b.difficulty || 0));
};

export const sortKeywordsByScore = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return [...keywords].sort((a, b) => {
    const scoreA = (a.opportunity || 0);
    const scoreB = (b.opportunity || 0);
    return scoreB - scoreA;
  });
};
