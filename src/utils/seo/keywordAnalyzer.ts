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
  suggestedTitle: string;
  suggestedDescription: string;
  competition: number;
  cpc: number;
}

const stopWords = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'est', 'et', 'en', 'à', 'pour',
  'dans', 'par', 'sur', 'de', 'du', 'ce', 'cette', 'ces', 'mon', 'ton',
  'son', 'notre', 'votre', 'leur', 'qui', 'que', 'quoi', 'dont', 'où'
]);

export const analyzeKeywords = (textContent: string): KeywordAnalysis[] => {
  console.log("ANALYZING KEYWORDS: Text length:", textContent?.length || 0);
  
  if (!textContent || textContent.length === 0) {
    console.log("WARNING: Empty text content for keyword analysis");
    return generateMockKeywordAnalysis();
  }
  
  // Nettoyage et normalisation du texte
  const cleanText = textContent.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
    
  const words = cleanText.split(' ');
  console.log("KEYWORDS: Found", words.length, "words after cleaning");
  
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

  // Display top keywords in console for debugging
  console.log("KEYWORDS TOP 5:", Array.from(keywordDensity.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([kw, freq]) => `${kw}: ${freq}`)
    .join(', '));

  const results = Array.from(keywordDensity.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([keyword, frequency], index) => ({
      keyword,
      frequency,
      density: (frequency / words.length) * 100,
      count: frequency,
      position: index + 1
    }));
    
  console.log(`KEYWORDS ANALYSIS COMPLETE: Found ${results.length} keywords`);
  return results.length > 0 ? results : generateMockKeywordAnalysis();
};

const calculateRelevanceScore = (frequency: number, length: number): number => {
  // Les mots-clés plus longs sont généralement plus pertinents
  const lengthBonus = Math.min(length / 10, 1) * 20;
  // La fréquence contribue également à la pertinence
  const frequencyScore = Math.min(frequency * 10, 50);
  
  return Math.min(lengthBonus + frequencyScore, 100);
};

const generateSeoTitle = (keyword: string): string => {
  const prefixes = [
    "Guide Ultime : ", 
    "Comment ", 
    "Les Meilleurs ", 
    "Tout Savoir sur ", 
    "Optimisez vos ", 
    "Découvrez ", 
    "Améliorez votre "
  ];
  
  const suffixes = [
    " - Guide Complet", 
    " - Conseils d'Experts", 
    " en 2024", 
    " pour Débutants", 
    " | Techniques Avancées", 
    " pour de Meilleurs Résultats"
  ];
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  let title = (prefix + keyword.charAt(0).toUpperCase() + keyword.slice(1) + suffix).trim();
  
  // Ensure exactly 60 characters
  if (title.length > 60) {
    title = title.substring(0, 57) + "...";
  } else if (title.length < 60) {
    // Pad with spaces or add more context
    title = title.padEnd(60, ' ');
  }
  
  return title;
};

// Génère une meta description SEO optimisée basée sur un mot-clé (max 155 caractères)
const generateSeoDescription = (keyword: string): string => {
  const templates = [
    `Découvrez les meilleures stratégies pour ${keyword}. Nos conseils d'experts vous aideront à maximiser vos résultats et améliorer votre visibilité en ligne.`,
    `Vous cherchez à optimiser ${keyword}? Notre guide complet présente les techniques éprouvées et les dernières tendances pour des résultats garantis.`,
    `Améliorez vos performances avec nos astuces spécialisées sur ${keyword}. Conseils pratiques, études de cas et stratégies recommandées par les experts.`,
    `Tout ce que vous devez savoir sur ${keyword} en un seul endroit. Guide pratique avec exemples concrets et méthodes efficaces pour progresser rapidement.`,
    `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} : stratégies avancées et conseils d'experts pour maximiser votre ROI. Techniques testées et approuvées par les professionnels.`
  ];
  
  let description = templates[Math.floor(Math.random() * templates.length)];
  
  // Tronquer à 155 caractères si nécessaire
  if (description.length > 155) {
    description = description.substring(0, 152) + "...";
  }
  
  return description;
};

export const generateKeywordSuggestions = (keywords: KeywordAnalysis[]): KeywordSuggestion[] => {
  console.log("GENERATING KEYWORD SUGGESTIONS:", keywords.length);
  
  if (!keywords || keywords.length === 0) {
    console.log("WARNING: Empty keywords array for suggestions");
    return [];
  }
  
  const suggestions = keywords.map(({ keyword, frequency }) => {
    const relevance = calculateRelevanceScore(frequency, keyword.length);
    const searchVolume = Math.floor(Math.random() * 10000); // Simulation
    const title = generateSeoTitle(keyword);
    const description = generateSeoDescription(keyword);
    
    console.log(`Generated suggestion for "${keyword}": Title (${title.length} chars), Description (${description.length} chars)`);
    
    return {
      keyword,
      volume: frequency,
      relevance,
      searchVolume,
      difficulty: Math.floor(Math.random() * 100),
      suggestedTitle: title,
      suggestedDescription: description,
      competition: Math.random(),
      cpc: Math.random() * 5
    };
  });
  
  console.log(`Generated ${suggestions.length} keyword suggestions with titles and descriptions`);
  return suggestions;
};

// Génère des mots-clés fictifs pour les tests
const generateMockKeywordAnalysis = (): KeywordAnalysis[] => {
  console.log("GENERATING MOCK KEYWORD ANALYSIS");
  return [
    { keyword: "aquarium", frequency: 15, density: 2.5, count: 15, position: 1 },
    { keyword: "poisson", frequency: 12, density: 2.0, count: 12, position: 2 },
    { keyword: "eau douce", frequency: 10, density: 1.7, count: 10, position: 3 },
    { keyword: "plante aquatique", frequency: 8, density: 1.3, count: 8, position: 4 },
    { keyword: "entretien", frequency: 7, density: 1.2, count: 7, position: 5 },
    { keyword: "filtre", frequency: 6, density: 1.0, count: 6, position: 6 },
    { keyword: "température", frequency: 5, density: 0.8, count: 5, position: 7 },
    { keyword: "aquariophilie", frequency: 5, density: 0.8, count: 5, position: 8 },
    { keyword: "débutant", frequency: 4, density: 0.7, count: 4, position: 9 },
    { keyword: "éclairage", frequency: 4, density: 0.7, count: 4, position: 10 }
  ];
};
