
import { KeywordFrequency } from '@/types/seo/KeywordFrequency';

export const extractKeywords = (text: string, minLength: number = 3): KeywordFrequency[] => {
  // Nettoyer le texte
  const cleanText = text.toLowerCase()
    .replace(/[^\w\sàâäéèêëïîôöùûüÿç]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleanText.split(' ').filter(word => 
    word.length >= minLength && 
    !isStopWord(word)
  );

  const wordCount: Record<string, number> = {};
  const wordPositions: Record<string, number[]> = {};

  words.forEach((word, index) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
    if (!wordPositions[word]) {
      wordPositions[word] = [];
    }
    wordPositions[word].push(index);
  });

  const totalWords = words.length;

  return Object.entries(wordCount)
    .map(([keyword, count]) => ({
      keyword,
      count,
      frequency: count / totalWords,
      density: (count / totalWords) * 100,
      position: wordPositions[keyword][0]
    }))
    .sort((a, b) => b.count - a.count);
};

const isStopWord = (word: string): boolean => {
  const stopWords = [
    'le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour',
    'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se', 'pas', 'tout', 'plus',
    'par', 'grand', 'en', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans'
  ];
  return stopWords.includes(word);
};

export const generateKeywordSuggestions = (keywords: KeywordFrequency[], limit: number = 10) => {
  return keywords
    .slice(0, limit)
    .map(kw => ({
      keyword: kw.keyword,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      competition: Math.random(),
      difficulty: Math.floor(Math.random() * 100),
      relevance: Math.min(kw.frequency * 100, 100)
    }));
};

export const analyzeKeywordDensity = (keywords: KeywordFrequency[], targetKeyword?: string) => {
  const target = targetKeyword?.toLowerCase();
  const targetData = target ? keywords.find(k => k.keyword === target) : null;
  
  return {
    totalKeywords: keywords.length,
    topKeywords: keywords.slice(0, 5),
    targetKeywordDensity: targetData?.density || 0,
    recommendations: generateDensityRecommendations(keywords, targetData)
  };
};

const generateDensityRecommendations = (keywords: KeywordFrequency[], targetData: KeywordFrequency | null): string[] => {
  const recommendations = [];
  
  if (targetData) {
    if (targetData.density < 0.5) {
      recommendations.push(`Augmenter la densité du mot-clé principal "${targetData.keyword}" (actuellement ${targetData.density.toFixed(2)}%)`);
    } else if (targetData.density > 3) {
      recommendations.push(`Réduire la densité du mot-clé principal "${targetData.keyword}" (actuellement ${targetData.density.toFixed(2)}%)`);
    }
  }
  
  const highDensityWords = keywords.filter(k => k.density > 5);
  if (highDensityWords.length > 0) {
    recommendations.push('Réduire la sur-optimisation de certains mots-clés');
  }
  
  return recommendations;
};
