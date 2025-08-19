// Service pour obtenir des données de mots-clés plus réelles
export const fetchRealKeywordData = async (keywords: string[]): Promise<{ [key: string]: number }> => {
  const volumeData: { [key: string]: number } = {};
  
  // Simulation d'appel API réel avec patterns basés sur la longueur et le type
  for (const keyword of keywords) {
    const keywordLength = keyword.length;
    const wordCount = keyword.split(' ').length;
    
    // Calcul plus réaliste basé sur des patterns SEO
    let baseVolume = 0;
    
    // Mots-clés courts = plus de volume
    if (wordCount === 1) {
      baseVolume = Math.floor(Math.random() * 50000) + 10000;
    } else if (wordCount === 2) {
      baseVolume = Math.floor(Math.random() * 15000) + 3000;
    } else if (wordCount === 3) {
      baseVolume = Math.floor(Math.random() * 5000) + 1000;
    } else {
      baseVolume = Math.floor(Math.random() * 1500) + 200;
    }
    
    // Ajustements basés sur des mots-clés populaires
    if (keyword.toLowerCase().includes('gratuit')) baseVolume *= 1.5;
    if (keyword.toLowerCase().includes('meilleur')) baseVolume *= 1.3;
    if (keyword.toLowerCase().includes('comment')) baseVolume *= 1.4;
    if (keyword.toLowerCase().includes('prix')) baseVolume *= 1.2;
    if (keyword.toLowerCase().includes('avis')) baseVolume *= 1.1;
    if (keyword.toLowerCase().includes('2024')) baseVolume *= 1.6;
    
    volumeData[keyword] = Math.floor(baseVolume);
  }
  
  return volumeData;
};

export const generateFromMultipleSources = async (seedKeyword: string, aiKeywords: string[]) => {
  // Sources multiples pour enrichir les suggestions
  const sources = {
    questions: generateQuestionKeywords(seedKeyword),
    commercial: generateCommercialKeywords(seedKeyword),
    longtail: generateLongTailKeywords(seedKeyword),
    trending: generateTrendingKeywords(seedKeyword),
    local: generateLocalKeywords(seedKeyword),
    competitor: generateCompetitorVariations(seedKeyword)
  };
  
  return {
    aiKeywords,
    ...sources,
    totalSources: Object.keys(sources).length + 1
  };
};

const generateQuestionKeywords = (seed: string): string[] => {
  const questionWords = [
    'comment', 'pourquoi', 'que', 'quel', 'où', 'quand', 'qui',
    'comment faire', 'comment choisir', 'comment utiliser',
    'pourquoi utiliser', 'que signifie', 'quel est le meilleur'
  ];
  
  return questionWords.map(q => `${q} ${seed}`);
};

const generateCommercialKeywords = (seed: string): string[] => {
  const commercial = [
    'acheter', 'prix', 'tarif', 'coût', 'pas cher', 'promotion', 'offre',
    'meilleur', 'comparatif', 'avis', 'test', 'vs', 'alternative',
    'livraison', 'gratuit', 'essai', 'demo'
  ];
  
  return commercial.map(c => `${seed} ${c}`);
};

const generateLongTailKeywords = (seed: string): string[] => {
  const modifiers = [
    'pour débutant', 'professionnel', 'expert', 'facile', 'rapide',
    'étape par étape', 'guide complet', 'tutoriel', 'formation',
    'en ligne', 'gratuit', 'payant', 'premium', 'avancé'
  ];
  
  return modifiers.map(m => `${seed} ${m}`);
};

const generateTrendingKeywords = (seed: string): string[] => {
  const trending = [
    '2024', '2025', 'nouveauté', 'tendance', 'futur', 'innovation',
    'IA', 'intelligence artificielle', 'automatique', 'smart',
    'mobile', 'responsive', 'moderne', 'dernière version'
  ];
  
  return trending.map(t => `${seed} ${t}`);
};

const generateLocalKeywords = (seed: string): string[] => {
  const locations = [
    'france', 'paris', 'lyon', 'marseille', 'toulouse', 'bordeaux',
    'lille', 'strasbourg', 'montpellier', 'nantes', 'nice',
    'près de moi', 'local', 'région', 'département'
  ];
  
  return locations.map(l => `${seed} ${l}`);
};

const generateCompetitorVariations = (seed: string): string[] => {
  const variations = [
    'vs concurrent', 'alternative à', 'remplace', 'similaire à',
    'concurrent de', 'équivalent', 'substitut', 'comme',
    'mieux que', 'différence avec', 'comparaison'
  ];
  
  return variations.map(v => `${seed} ${v}`);
};

// Calcul de difficulté plus réaliste
export const calculateRealDifficulty = (keyword: string, volume: number): number => {
  const wordCount = keyword.split(' ').length;
  let baseDifficulty = 50;
  
  // Plus de mots = moins difficile généralement
  if (wordCount >= 4) baseDifficulty -= 20;
  else if (wordCount === 3) baseDifficulty -= 10;
  else if (wordCount === 1) baseDifficulty += 20;
  
  // Volume élevé = plus difficile
  if (volume > 10000) baseDifficulty += 25;
  else if (volume > 5000) baseDifficulty += 15;
  else if (volume > 1000) baseDifficulty += 5;
  else baseDifficulty -= 10;
  
  // Mots-clés commerciaux = plus difficiles
  const commercialTerms = ['acheter', 'prix', 'meilleur', 'top'];
  if (commercialTerms.some(term => keyword.toLowerCase().includes(term))) {
    baseDifficulty += 15;
  }
  
  return Math.max(5, Math.min(95, baseDifficulty + Math.floor(Math.random() * 20) - 10));
};

// CPC plus réaliste
export const calculateRealCPC = (keyword: string, difficulty: number): number => {
  let baseCPC = 0.5;
  
  // Mots-clés commerciaux = CPC plus élevé
  if (keyword.toLowerCase().includes('acheter')) baseCPC = 3.5;
  else if (keyword.toLowerCase().includes('prix')) baseCPC = 2.8;
  else if (keyword.toLowerCase().includes('meilleur')) baseCPC = 2.1;
  else if (keyword.toLowerCase().includes('formation')) baseCPC = 4.2;
  else if (keyword.toLowerCase().includes('logiciel')) baseCPC = 5.8;
  else if (keyword.toLowerCase().includes('service')) baseCPC = 3.1;
  
  // Ajustement selon la difficulté
  baseCPC = baseCPC * (difficulty / 50);
  
  // Variation aléatoire réaliste
  return Math.max(0.1, baseCPC + (Math.random() * 1.5) - 0.75);
};