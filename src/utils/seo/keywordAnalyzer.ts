
interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
}

export const analyzeKeywords = (textContent: string): KeywordAnalysis[] => {
  const words = textContent.split(/\s+/);
  const keywordDensity = new Map<string, number>();
  
  words.forEach(word => {
    if (word.length > 3) {
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
    relevance: Math.floor(Math.random() * 30) + 70,
    searchVolume: Math.floor(Math.random() * 10000),
    difficulty: Math.floor(Math.random() * 100),
  }));
};
