
interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
  count?: number;
  position?: number;
}

interface KeywordSuggestion {
  keyword: string;
  volume: number;
  relevance: number;
  searchVolume: number;
  difficulty: number;
}

const stopWords = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'est', 'et', 'en', 'à', 'pour',
  'dans', 'par', 'sur', 'de', 'du', 'ce', 'cette', 'ces', 'mon', 'ton',
  'son', 'notre', 'votre', 'leur', 'qui', 'que', 'quoi', 'dont', 'où'
]);

export const analyzeKeywords = (textContent: string): KeywordAnalysis[] => {
  // Nettoyage et normalisation du texte
  const cleanText = textContent.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  const words = cleanText.split(' ');
  const keywordDensity = new Map<string, number>();
  
  // Analyse des mots et phrases
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    if (word.length > 3 && !stopWords.has(word)) {
      keywordDensity.set(word, (keywordDensity.get(word) || 0) + 1);
      
      // Analyse des phrases de 2-3 mots
      if (i < words.length - 1) {
        const phrase2 = `${word} ${words[i + 1]}`;
        if (!stopWords.has(words[i + 1])) {
          keywordDensity.set(phrase2, (keywordDensity.get(phrase2) || 0) + 1);
        }
        
        if (i < words.length - 2) {
          const phrase3 = `${phrase2} ${words[i + 2]}`;
          if (!stopWords.has(words[i + 2])) {
            keywordDensity.set(phrase3, (keywordDensity.get(phrase3) || 0) + 1);
          }
        }
      }
    }
  }

  return Array.from(keywordDensity.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([keyword, frequency], index) => ({
      keyword,
      frequency,
      density: (frequency / words.length) * 100,
      count: frequency,
      position: index + 1
    }));
};

const calculateRelevanceScore = (frequency: number, length: number): number => {
  // Les mots-clés plus longs sont généralement plus pertinents
  const lengthBonus = Math.min(length / 10, 1) * 20;
  // La fréquence contribue également à la pertinence
  const frequencyScore = Math.min(frequency * 10, 50);
  
  return Math.min(lengthBonus + frequencyScore, 100);
};

export const generateKeywordSuggestions = (keywords: KeywordAnalysis[]): KeywordSuggestion[] => {
  return keywords.map(({ keyword, frequency }) => {
    const relevance = calculateRelevanceScore(frequency, keyword.length);
    const searchVolume = Math.floor(Math.random() * 10000); // Simulation
    return {
      keyword,
      volume: frequency,
      relevance,
      searchVolume,
      difficulty: Math.floor(Math.random() * 100)
    };
  });
};
