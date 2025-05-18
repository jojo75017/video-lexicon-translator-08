
import { KeywordSuggestion, CompetitorData, KeywordGroup, KeywordIntent, KeywordTrend, KeywordOpportunity, SerpResult } from '@/types/seo/Keyword';

/**
 * Détecte l'intention de recherche derrière un mot-clé
 */
export const detectKeywordIntent = (keyword: string): 'informational' | 'navigational' | 'transactional' | 'commercial' => {
  const keywordLower = keyword.toLowerCase();
  
  // Mots-clés informationnels
  if (keywordLower.includes('comment') || 
      keywordLower.includes('pourquoi') || 
      keywordLower.includes('qui') || 
      keywordLower.includes('que') || 
      keywordLower.includes('où') ||
      keywordLower.includes('quand') ||
      keywordLower.includes('guide') ||
      keywordLower.includes('tutoriel') ||
      keywordLower.includes('cours')) {
    return 'informational';
  }
  
  // Mots-clés transactionnels
  if (keywordLower.includes('acheter') || 
      keywordLower.includes('commander') || 
      keywordLower.includes('prix') || 
      keywordLower.includes('promotion') || 
      keywordLower.includes('soldes') ||
      keywordLower.includes('pas cher') ||
      keywordLower.includes('livraison')) {
    return 'transactional';
  }
  
  // Mots-clés navigationnels
  if (keywordLower.includes('login') || 
      keywordLower.includes('connexion') || 
      keywordLower.includes('site') || 
      keywordLower.includes('officiel') || 
      keywordLower.includes('page')) {
    return 'navigational';
  }
  
  // Par défaut, on considère que c'est commercial
  return 'commercial';
};

/**
 * Calcule un score d'opportunité pour un mot-clé
 */
export const calculateOpportunityScore = (keyword: KeywordSuggestion): number => {
  // Si le volume ou la difficulté n'est pas défini, on ne peut pas calculer
  if (keyword.volume === undefined || keyword.difficulty === undefined) {
    return 0;
  }
  
  // Formule: Plus de volume et moins de difficulté = plus d'opportunité
  // Normalisation: score de 0 à 100
  const volumeScore = Math.min(keyword.volume / 20, 50);
  const difficultyScore = Math.max(0, 50 - (keyword.difficulty / 2));
  const cpcBoost = keyword.cpc ? Math.min(keyword.cpc * 5, 20) : 0;
  
  // Boost pour les mots-clés à intention transactionnelle
  const intentBoost = keyword.intent === 'transactional' ? 10 : 0;
  
  return Math.min(Math.round(volumeScore + difficultyScore + cpcBoost + intentBoost), 100);
};

/**
 * Simule une analyse de tendance pour un mot-clé
 */
export const generateTrendData = (keyword: string, months: number = 12): KeywordTrend => {
  // Données simulées pour 12 mois
  const data: number[] = [];
  
  // Base pour la simulation
  const base = (keyword.length * 100) % 1000 + 500;
  
  // Générer une tendance qui peut être saisonnière ou en croissance
  const seasonal = Math.random() > 0.7;
  
  for (let i = 0; i < months; i++) {
    if (seasonal) {
      // Tendance saisonnière: augmentation en hiver (fin d'année) et été
      const seasonalFactor = Math.sin((i / 12) * Math.PI * 2) * 0.3 + 1;
      data.push(Math.round(base * seasonalFactor));
    } else {
      // Tendance générale en croissance légère
      const growthFactor = 1 + (i / months) * 0.3;
      const randomVariation = (Math.random() * 0.2) + 0.9;  // Variation de ±10%
      data.push(Math.round(base * growthFactor * randomVariation));
    }
  }
  
  // Calcul de la croissance: différence entre le dernier et le premier mois
  const growth = Math.round(((data[data.length - 1] - data[0]) / data[0]) * 100);
  
  return {
    keyword,
    data,
    growth,
    seasonal
  };
};

/**
 * Génère des données simulées de SERP pour un mot-clé
 */
export const generateSerpData = (keyword: string): SerpResult[] => {
  const domains = [
    'wikipedia.org',
    'amazon.fr',
    'fnac.com',
    'leboncoin.fr',
    'cdiscount.com',
    'journaldunet.fr',
    '01net.com',
    'leparisien.fr',
    'lemonde.fr',
    'commentcamarche.net'
  ];
  
  return Array.from({ length: 5 }, (_, i) => {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return {
      position: i + 1,
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - ${Math.random() > 0.5 ? 'Guide complet' : 'Meilleurs produits'} ${new Date().getFullYear()}`,
      url: `https://www.${domain}/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Découvrez tout sur ${keyword} dans notre ${Math.random() > 0.5 ? 'guide complet' : 'comparatif détaillé'}. Conseils d'experts et astuces pour choisir le meilleur ${keyword}.`
    };
  });
};

/**
 * Génère une liste de concurrents simulés pour un mot-clé
 */
export const generateCompetitors = (keyword: string): CompetitorData[] => {
  const competitorTemplates = [
    {
      name: "InfoBlog",
      url: "infoblog.fr",
      strength: 87,
      logo: "https://via.placeholder.com/50?text=IB"
    },
    {
      name: "ExpertAvis",
      url: "expertavis.com",
      strength: 75,
      logo: "https://via.placeholder.com/50?text=EA"
    },
    {
      name: "MeilleursChoix",
      url: "meilleurschoix.fr",
      strength: 92,
      logo: "https://via.placeholder.com/50?text=MC"
    },
    {
      name: "ComparaTout",
      url: "comparatout.fr",
      strength: 68,
      logo: "https://via.placeholder.com/50?text=CT"
    },
    {
      name: "GuideExpert",
      url: "guideexpert.com",
      strength: 81,
      logo: "https://via.placeholder.com/50?text=GE"
    }
  ];
  
  return competitorTemplates.map(template => {
    const keywordVariations = [
      keyword,
      `meilleur ${keyword}`,
      `${keyword} comparatif`,
      `${keyword} guide`,
      `${keyword} avis`
    ];
    
    return {
      ...template,
      organic_traffic: Math.floor(Math.random() * 50000) + 10000,
      keywords: Math.floor(Math.random() * 2000) + 500,
      commonKeywords: keywordVariations.slice(0, Math.floor(Math.random() * 3) + 2)
    };
  });
};

/**
 * Regroupe les mots-clés par thématiques
 */
export const groupKeywordsByTheme = (keywords: KeywordSuggestion[]): KeywordGroup[] => {
  // Version simplifiée pour la démonstration
  // Dans un cas réel, on utiliserait des algorithmes de clustering
  
  const groups: Record<string, KeywordSuggestion[]> = {};
  
  keywords.forEach(keyword => {
    const words = keyword.keyword.toLowerCase().split(' ');
    let mainTheme = '';
    
    // Recherche d'un thème parmi les mots du mot-clé
    for (const word of words) {
      if (word.length > 3) {
        if (!mainTheme) mainTheme = word;
        
        if (!groups[word]) groups[word] = [];
        groups[word].push(keyword);
        break;
      }
    }
    
    // Si aucun thème trouvé, utiliser le premier mot
    if (!mainTheme) {
      mainTheme = words[0] || 'autres';
      if (!groups[mainTheme]) groups[mainTheme] = [];
      groups[mainTheme].push(keyword);
    }
  });
  
  // Conversion en format KeywordGroup
  return Object.entries(groups).map(([name, groupKeywords]) => {
    const totalVolume = groupKeywords.reduce((sum, kw) => sum + (kw.volume || 0), 0);
    const totalDifficulty = groupKeywords.reduce((sum, kw) => sum + (kw.difficulty || 0), 0);
    
    return {
      name,
      keywords: groupKeywords.map(kw => kw.keyword),
      totalVolume,
      averageDifficulty: groupKeywords.length > 0 ? Math.round(totalDifficulty / groupKeywords.length) : 0,
      mainKeyword: groupKeywords[0]?.keyword || name
    };
  }).sort((a, b) => b.totalVolume - a.totalVolume);
};

/**
 * Sépare les mots-clés par intention de recherche
 */
export const groupKeywordsByIntent = (keywords: KeywordSuggestion[]): KeywordIntent => {
  const result: KeywordIntent = {
    informational: [],
    transactional: [],
    navigational: []
  };
  
  keywords.forEach(keyword => {
    const intent = keyword.intent || detectKeywordIntent(keyword.keyword);
    
    if (intent === 'informational') {
      result.informational.push(keyword);
    } else if (intent === 'transactional' || intent === 'commercial') {
      result.transactional.push(keyword);
    } else {
      result.navigational.push(keyword);
    }
  });
  
  return result;
};

/**
 * Identifie les opportunités de mots-clés
 */
export const identifyKeywordOpportunities = (keywords: KeywordSuggestion[]): KeywordOpportunity[] => {
  return keywords
    .map(keyword => {
      const score = calculateOpportunityScore(keyword);
      return {
        keyword: keyword.keyword,
        score,
        difficulty: keyword.difficulty || 50,
        volume: keyword.volume || 0,
        potentialTraffic: Math.round(((keyword.volume || 0) * 0.3) * (1 - ((keyword.difficulty || 50) / 100))),
        currentRanking: keyword.position
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

/**
 * Génère des questions associées à un mot-clé
 */
export const generateQuestionKeywords = (keyword: string): string[] => {
  const prefixes = ['comment', 'pourquoi', 'quel', 'quand', 'où', 'qui', 'combien'];
  const suffixes = ['meilleur', 'facile', 'rapide', 'pas cher', 'gratuit', 'efficace', 'professionnel', 'avis', 'prix'];
  
  const questions = [];
  
  prefixes.forEach(prefix => {
    const question = `${prefix} ${keyword}`;
    questions.push(question);
    
    // Ajouter quelques variations avec des suffixes
    const suffixesSubset = suffixes.slice(0, 3);
    suffixesSubset.forEach(suffix => {
      questions.push(`${prefix} ${keyword} ${suffix}`);
    });
  });
  
  // Prendre un sous-ensemble aléatoire
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 8);
};

/**
 * Enrichir les mots-clés avec des données supplémentaires comme l'intention,
 * les opportunités, les tendances, etc.
 */
export const enrichKeywords = (keywords: KeywordSuggestion[]): KeywordSuggestion[] => {
  return keywords.map(keyword => {
    const intent = detectKeywordIntent(keyword.keyword);
    const trend = generateTrendData(keyword.keyword).data;
    const opportunity = calculateOpportunityScore(keyword);
    const seasonal = Math.random() > 0.7;
    const serps = generateSerpData(keyword.keyword);
    
    // Génération de données de saisonnalité
    const seasonality = Array(12).fill(0).map((_, i) => {
      if (seasonal) {
        // Simulation de saisonnalité
        return Math.round(100 * (1 + Math.sin((i / 12) * Math.PI * 2) * 0.5));
      } else {
        // Variation aléatoire légère
        return Math.round(100 * (0.8 + Math.random() * 0.4));
      }
    });
    
    return {
      ...keyword,
      intent,
      trend,
      opportunity,
      seasonal,
      seasonality,
      serps
    };
  });
};
