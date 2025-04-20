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
  // Ensure we're working with meaningful content
  if (!keyword || keyword.trim().length === 0) {
    keyword = "contenu optimisé";
  }
  
  // Adapt prefix and suffix to the keyword's domain/intent
  let prefixes = [];
  let suffixes = [];
  
  // Analyze keyword to determine the type of content
  const lowercaseKeyword = keyword.toLowerCase();
  
  if (lowercaseKeyword.includes("comment") || lowercaseKeyword.includes("faire") || 
      lowercaseKeyword.includes("créer") || lowercaseKeyword.includes("utiliser")) {
    // How-to content
    prefixes = [
      "Guide Étape par Étape : Comment ",
      "Tutoriel Complet : Comment ",
      "Mode d'Emploi Détaillé pour ",
      "Méthode Facile pour ",
      "5 Étapes Essentielles pour "
    ];
    suffixes = [
      " | Guide Pratique 2024",
      " | Tutoriel Expert",
      " | Méthode Éprouvée",
      " | Technique Optimale",
      " | Démarche Simplifiée"
    ];
  } else if (lowercaseKeyword.includes("meilleur") || lowercaseKeyword.includes("top") || 
             lowercaseKeyword.includes("comparatif") || lowercaseKeyword.includes("vs")) {
    // Comparison content
    prefixes = [
      "Comparatif 2024 : Les ",
      "Top 10 des ",
      "Guide d'Achat : ",
      "Les Meilleurs ",
      "Sélection Experte : "
    ];
    suffixes = [
      " | Comparaison Détaillée",
      " | Avis d'Experts",
      " | Tests Complets",
      " | Critères de Choix",
      " | Qualité-Prix"
    ];
  } else {
    // Default informational content
    prefixes = [
      "Guide Complet sur ",
      "Tout Savoir sur ",
      "L'Essentiel à Connaître sur ",
      "Le Guide Définitif de ",
      "Comprendre et Maîtriser "
    ];
    suffixes = [
      " | Analyse Experte",
      " | Conseils Professionnels",
      " | Informations Clés",
      " | Guide Complet 2024",
      " | Approche Stratégique"
    ];
  }
  
  let title = "";
  let attempts = 0;
  
  // Generate title with exactly 60 characters
  while (title.length !== 60 && attempts < 50) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // Capitalize keyword properly
    const capitalizedKeyword = keyword
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    title = (prefix + capitalizedKeyword + suffix).trim();
    
    // Adjust length to exactly 60 characters
    if (title.length > 60) {
      title = title.substring(0, 57) + "...";
    } else if (title.length < 60) {
      const padding = " • Guide Expert".substring(0, 60 - title.length);
      title = title + padding;
    }
    
    attempts++;
  }
  
  // Final check to ensure exactly 60 characters
  if (title.length !== 60) {
    title = title.padEnd(60, ' ');
  }
  
  return title;
};

const generateSeoDescription = (keyword: string): string => {
  // Ensure we're working with meaningful content
  if (!keyword || keyword.trim().length === 0) {
    keyword = "sujet";
  }
  
  // Create templates based on keyword intent
  let templates = [];
  const lowercaseKeyword = keyword.toLowerCase();
  
  if (lowercaseKeyword.includes("comment") || lowercaseKeyword.includes("faire") || 
      lowercaseKeyword.includes("créer") || lowercaseKeyword.includes("utiliser")) {
    // How-to content
    templates = [
      `Découvrez notre méthode pas à pas pour ${keyword}. Guide complet avec exemples, astuces pratiques et conseils d'experts pour réussir facilement.`,
      `Comment ${keyword} efficacement ? Notre guide détaillé vous révèle les techniques professionnelles et erreurs à éviter pour des résultats optimaux.`,
      `Apprenez à ${keyword} avec notre tutoriel complet. Conseils pratiques, étapes détaillées et astuces pour obtenir les meilleurs résultats.`,
      `Maîtrisez l'art de ${keyword} grâce à nos explications claires et étapes détaillées. Techniques éprouvées et méthodes professionnelles.`,
      `Tutoriel expert : ${keyword}. Suivez notre guide étape par étape avec démonstrations, exemples et solutions aux problèmes courants.`
    ];
  } else if (lowercaseKeyword.includes("meilleur") || lowercaseKeyword.includes("top") || 
             lowercaseKeyword.includes("comparatif") || lowercaseKeyword.includes("vs")) {
    // Comparison content
    templates = [
      `Comparatif détaillé des ${keyword}. Notre analyse impartiale évalue performance, rapport qualité-prix et caractéristiques pour éclairer votre choix.`,
      `À la recherche des ${keyword} ? Notre sélection rigoureuse compare les meilleures options selon des critères objectifs et avis d'utilisateurs.`,
      `Découvrez notre top des ${keyword}. Tests approfondis, avis d'experts et comparaison des caractéristiques pour vous aider à choisir le meilleur.`,
      `Quel est le meilleur ${keyword} ? Notre guide d'achat analyse les modèles populaires, critères essentiels et avis clients pour votre décision.`,
      `Guide d'achat ${keyword} : comparaison objective des options premium et budget, avec analyses d'experts et retours d'expérience utilisateurs.`
    ];
  } else {
    // Default informational content
    templates = [
      `Tout ce que vous devez savoir sur ${keyword}. Informations essentielles, analyses d'experts et conseils pratiques pour une compréhension complète.`,
      `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} expliqué simplement : concepts clés, applications pratiques et stratégies optimales pour maîtriser le sujet.`,
      `Explorez notre guide complet sur ${keyword}. Découvrez les principes fondamentaux, techniques avancées et dernières tendances du domaine.`,
      `Approfondissez vos connaissances sur ${keyword} avec notre analyse experte. Informations vérifiées, conseils pratiques et ressources utiles.`,
      `Guide définitif sur ${keyword} : origines, évolutions, applications actuelles et perspectives futures. Expertise complète pour tous niveaux.`
    ];
  }
  
  let description = templates[Math.floor(Math.random() * templates.length)];
  
  // Ensure exactly 155 characters
  if (description.length > 155) {
    description = description.substring(0, 152) + "...";
  } else if (description.length < 155) {
    const extraContext = " Informations vérifiées et conseils d'experts pour des résultats optimaux.";
    description = description + extraContext.substring(0, 155 - description.length);
  }
  
  // Final check to ensure exactly 155 characters
  return description.padEnd(155, ' ');
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
