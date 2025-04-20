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
  
  // Analyze keyword to determine the type of content
  const lowercaseKeyword = keyword.toLowerCase();
  
  // Detect geographic locations or complex expressions
  const isGeographic = detectGeographicKeyword(keyword);
  const containsMultipleEntities = keyword.includes(" et ") || keyword.includes(" & ") || 
                                  keyword.includes(" vs ") || keyword.includes(" ou ");
  
  let title = "";
  
  if (isGeographic) {
    // Travel/Geographic content
    if (containsMultipleEntities) {
      // Multiple geographic entities (e.g., "Namibie et Botswana")
      const entities = keyword.split(/ et | & | vs | ou /);
      if (entities.length >= 2) {
        const options = [
          `Circuit ${entities[0]} et ${entities[1]} : Guide Complet | Voyage 2024`,
          `Voyage ${entities[0]}-${entities[1]} : Itinéraire et Conseils Pratiques`,
          `Explorer ${entities[0]} et ${entities[1]} : Circuit Optimal | Guide`,
          `${entities[0]} et ${entities[1]} : Comparatif et Itinéraire | Voyage`,
          `Guide de Voyage : ${entities[0]} et ${entities[1]} | Circuit Idéal`
        ];
        title = options[Math.floor(Math.random() * options.length)];
      }
    } else {
      // Single geographic entity
      const options = [
        `Guide Voyage ${keyword} : 10 Sites Incontournables | Conseils 2024`,
        `Visiter ${keyword} : Itinéraire, Budget et Astuces | Guide Pratique`,
        `Que Faire en ${keyword} ? Top 15 Activités | Guide de Voyage`,
        `Découvrir ${keyword} : Conseils, Hébergements et Gastronomie`,
        `${keyword} : Guide Complet, Monuments et Paysages | Voyage 2024`
      ];
      title = options[Math.floor(Math.random() * options.length)];
    }
  } else if (lowercaseKeyword.includes("comment") || lowercaseKeyword.includes("faire") || 
      lowercaseKeyword.includes("créer") || lowercaseKeyword.includes("utiliser")) {
    // How-to content
    const options = [
      `Comment ${keyword} : Guide Étape par Étape | Conseils d'Experts`,
      `${keyword} Facilement : Méthode Complète | Tutoriel Détaillé`,
      `Guide Pratique : ${keyword} en 5 Étapes | Résultats Garantis`,
      `Tutoriel : ${keyword} | Technique Professionnelle Simplifiée`,
      `${keyword} : Mode d'Emploi Complet | Astuces et Bonnes Pratiques`
    ];
    title = options[Math.floor(Math.random() * options.length)];
  } else if (lowercaseKeyword.includes("meilleur") || lowercaseKeyword.includes("top") || 
             lowercaseKeyword.includes("comparatif") || lowercaseKeyword.includes("vs")) {
    // Comparison content
    const options = [
      `Top 10 ${keyword} : Comparatif Complet | Guide d'Achat 2024`,
      `Meilleurs ${keyword} : Tests et Avis | Comparatif Détaillé`,
      `Comparatif ${keyword} : Quel Modèle Choisir ? | Guide Ultime`,
      `Guide d'Achat ${keyword} : Notre Sélection | Critères de Choix`,
      `${keyword} : Analyse Comparative | Rapport Qualité-Prix Optimal`
    ];
    title = options[Math.floor(Math.random() * options.length)];
  } else {
    // Default informational content
    const options = [
      `${keyword} : Guide Complet et Conseils | Tout Savoir en 2024`,
      `Guide Ultime du ${keyword} : Principes et Applications Pratiques`,
      `${keyword} Expliqué : Concepts Clés | Guide Approfondi`,
      `Tout Comprendre sur ${keyword} : Analyse Complète | Guide 2024`,
      `${keyword} : Guide Définitif | Techniques et Stratégies Essentielles`
    ];
    title = options[Math.floor(Math.random() * options.length)];
  }
  
  // Ensure exactly 60 characters
  if (title.length > 60) {
    title = title.substring(0, 57) + "...";
  } else if (title.length < 60) {
    // Padding with spaces or relevant content
    const padding = " • Guide Expert".substring(0, 60 - title.length);
    title = title + padding;
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

  // Analyze for geographic or complex expressions
  const isGeographic = detectGeographicKeyword(keyword);
  const containsMultipleEntities = keyword.includes(" et ") || keyword.includes(" & ") || 
                                  keyword.includes(" vs ") || keyword.includes(" ou ");
  
  let description = "";
  
  if (isGeographic) {
    if (containsMultipleEntities) {
      // Multiple geographic entities (e.g., "Namibie et Botswana")
      const entities = keyword.split(/ et | & | vs | ou /);
      if (entities.length >= 2) {
        const options = [
          `Planifiez votre circuit combiné ${entities[0]}-${entities[1]} avec notre guide voyage. Itinéraires optimisés, visites incontournables et conseils pratiques pour un séjour réussi.`,
          `Guide complet pour voyager entre ${entities[0]} et ${entities[1]}. Découvrez le meilleur itinéraire, les transports, hébergements et sites à ne pas manquer pour votre aventure.`,
          `Comparatif détaillé ${entities[0]} et ${entities[1]} : paysages, culture, coût de la vie et activités. Organisez votre circuit idéal avec nos conseils d'experts.`,
          `Circuit ${entities[0]}-${entities[1]} : itinéraire optimal, durée recommandée, budget et astuces locales. Notre guide complet pour une expérience de voyage inoubliable.`,
          `Découvrez comment combiner ${entities[0]} et ${entities[1]} dans un seul voyage. Frontières, transports, attractions incontournables et conseils d'organisation pratiques.`
        ];
        description = options[Math.floor(Math.random() * options.length)];
      }
    } else {
      // Single geographic entity
      const options = [
        `Découvrez notre guide complet sur ${keyword}. Sites incontournables, meilleurs hébergements, spécialités culinaires et conseils pratiques pour un voyage réussi.`,
        `Planifiez votre voyage à ${keyword} avec notre guide expert. Monuments historiques, parcs naturels, plages magnifiques et expériences culturelles à ne pas manquer.`,
        `Guide de voyage ${keyword} : quand partir, budget nécessaire, transports locaux et attractions populaires. Préparez votre séjour idéal avec nos conseils.`,
        `Explorez les merveilles de ${keyword} avec notre guide détaillé. Itinéraires recommandés, astuces locales et meilleures activités pour une expérience authentique.`,
        `Visitez ${keyword} en toute sérénité grâce à nos recommandations d'experts. Météo idéale, quartiers à privilégier et bonnes adresses pour un voyage mémorable.`
      ];
      description = options[Math.floor(Math.random() * options.length)];
    }
  } else if (lowercaseKeyword.includes("comment") || lowercaseKeyword.includes("faire") || 
      lowercaseKeyword.includes("créer") || lowercaseKeyword.includes("utiliser")) {
    // How-to content
    const options = [
      `Apprenez à ${keyword} avec notre guide étape par étape. Méthodes testées, astuces professionnelles et solutions aux problèmes courants pour des résultats optimaux.`,
      `Guide complet pour ${keyword} efficacement. Techniques éprouvées, exemples pratiques et erreurs à éviter pour maîtriser le sujet et obtenir les meilleurs résultats.`,
      `Découvrez comment ${keyword} grâce à notre tutoriel détaillé. Conseils d'experts, outils recommandés et procédures simplifiées pour réussir à chaque fois.`,
      `Tutoriel pratique : ${keyword} en suivant notre méthode claire et précise. Étapes détaillées, démonstrations et astuces pour faciliter votre apprentissage.`,
      `Maîtrisez l'art de ${keyword} avec nos explications professionnelles. Techniques avancées, exercices pratiques et conseils personnalisés pour progresser rapidement.`
    ];
    description = options[Math.floor(Math.random() * options.length)];
  } else if (lowercaseKeyword.includes("meilleur") || lowercaseKeyword.includes("top") || 
             lowercaseKeyword.includes("comparatif") || lowercaseKeyword.includes("vs")) {
    // Comparison content
    const options = [
      `Découvrez notre sélection des meilleurs ${keyword}. Analyse comparative détaillée, tests approfondis et avis d'utilisateurs pour vous aider à faire le choix idéal.`,
      `Comparatif complet des ${keyword} disponibles sur le marché. Critères essentiels, rapport qualité-prix et performances pour un achat éclairé et sans regret.`,
      `Guide d'achat ${keyword} : notre top 10 basé sur des tests rigoureux. Avantages, inconvénients et recommandations selon différents besoins et budgets.`,
      `Trouvez le meilleur ${keyword} grâce à notre analyse d'experts. Caractéristiques techniques, performances réelles et retours d'expérience pour un choix optimal.`,
      `${keyword} : notre comparatif détaillé pour vous aider à choisir. Modèles premium et options abordables analysés selon des critères objectifs et pratiques.`
    ];
    description = options[Math.floor(Math.random() * options.length)];
  } else {
    // Default informational content
    const options = [
      `Tout ce que vous devez savoir sur ${keyword}. Guide complet avec définitions, concepts clés, applications pratiques et dernières évolutions du domaine.`,
      `Découvrez notre guide détaillé sur ${keyword}. Principes fondamentaux, techniques avancées et stratégies optimales pour maîtriser parfaitement le sujet.`,
      `${keyword} expliqué simplement : origines, développements récents et perspectives d'avenir. Informations vérifiées et conseils d'experts pour tous niveaux.`,
      `Approfondissez vos connaissances sur ${keyword} avec notre analyse complète. Fondamentaux théoriques, applications concrètes et ressources complémentaires.`,
      `Guide définitif sur ${keyword} : concepts essentiels, méthodologies éprouvées et conseils pratiques pour développer votre expertise dans ce domaine.`
    ];
    description = options[Math.floor(Math.random() * options.length)];
  }
  
  // Ensure exactly 155 characters
  if (description.length > 155) {
    description = description.substring(0, 152) + "...";
  } else if (description.length < 155) {
    // Add relevant context to reach 155 characters
    const extraContext = " Informations vérifiées et conseils d'experts pour des résultats optimaux.";
    description = description + extraContext.substring(0, 155 - description.length);
  }
  
  // Final check to ensure exactly 155 characters
  return description.padEnd(155, ' ');
};

// Fonction pour détecter si un mot-clé est géographique
const detectGeographicKeyword = (keyword: string): boolean => {
  const geographicTerms = [
    // Pays 
    "france", "espagne", "italie", "allemagne", "portugal", "états-unis", "canada", 
    "japon", "chine", "australie", "brésil", "mexique", "maroc", "égypte", "thaïlande",
    "vietnam", "cambodge", "inde", "namibie", "botswana", "afrique", "europe", "asie",
    "amérique", "océanie",
    
    // Villes
    "paris", "lyon", "marseille", "bordeaux", "lille", "toulouse", "nice", "nantes",
    "strasbourg", "montpellier", "barcelone", "madrid", "rome", "berlin", "munich",
    "londres", "new york", "tokyo", "kyoto", "bangkok", "prague", "vienne", "amsterdam",
    "lisbonne", "porto",
    
    // Régions
    "bretagne", "normandie", "provence", "alsace", "corse", "alpes", "pyrénées",
    "côte d'azur", "toscane", "andalousie", "bavière", "catalogne"
  ];
  
  const lowercaseKeyword = keyword.toLowerCase();
  
  // Vérifier si le mot-clé contient un terme géographique
  return geographicTerms.some(term => 
    lowercaseKeyword.includes(term) || 
    // Gestion des mots composés et des accents
    lowercaseKeyword.replace(/[-']/g, " ").includes(term)
  );
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
