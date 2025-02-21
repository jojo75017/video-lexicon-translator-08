
interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
}

export const analyzeKeywords = (textContent: string): KeywordAnalysis[] => {
  const words = textContent.toLowerCase().split(/\s+/);
  const keywordDensity = new Map<string, number>();
  const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'est', 'et', 'en', 'à', 'pour']);
  
  words.forEach(word => {
    if (word.length > 3 && !stopWords.has(word)) {
      keywordDensity.set(word, (keywordDensity.get(word) || 0) + 1);
    }
  });

  return Array.from(keywordDensity.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({
      keyword,
      frequency: count,
      density: (count / words.length) * 100
    }));
};

export const generateKeywordSuggestions = (keywords: KeywordAnalysis[]) => {
  return keywords.map(({ keyword }) => ({
    keyword,
    volume: Math.floor(Math.random() * 10000), // Simulation du volume de recherche
    relevance: Math.floor(Math.random() * 30) + 70, // Score de pertinence entre 70-100
    searchVolume: Math.floor(Math.random() * 1000), // Volume de recherche plus réaliste
    difficulty: Math.floor(Math.random() * 100), // Difficulté d'optimisation
  }));
};

