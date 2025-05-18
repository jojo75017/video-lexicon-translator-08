
import { KeywordSuggestion, KeywordTrend } from '@/types/seo/Keyword';

export const calculateOpportunityScore = (keyword: KeywordSuggestion): number => {
  // Volume / Difficulté * CPC = Score d'opportunité
  if (!keyword.volume || !keyword.difficulty) {
    return 0;
  }
  
  // Éviter division par zéro
  const difficulty = keyword.difficulty === 0 ? 1 : keyword.difficulty;
  
  // Score de base
  let score = (keyword.volume / difficulty) * (keyword.cpc || 1);
  
  // Normaliser entre 0 et 100
  score = Math.min(Math.max(score / 10, 0), 100);
  
  return Math.round(score);
};

export const generateTrendData = (keyword: string, months: number = 12): KeywordTrend[] => {
  // Fonction pour générer des données de tendance simulées
  const trends: KeywordTrend[] = [];
  const currentDate = new Date();
  
  // Utiliser le mot-clé comme seed pour la génération pseudo-aléatoire
  const seed = keyword.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  
  // Volume de base (entre 100 et 10000, basé sur le seed)
  const baseVolume = 100 + (seed % 100) * 100;
  
  for (let i = months; i > 0; i--) {
    const monthDate = new Date(currentDate);
    monthDate.setMonth(currentDate.getMonth() - i);
    
    const monthName = monthDate.toLocaleDateString('fr-FR', { month: 'short' });
    const year = monthDate.getFullYear().toString().substr(2, 2);
    
    // Variation aléatoire mais cohérente basée sur le seed et le mois
    const monthSeed = seed + i;
    const randomFactor = 0.8 + (monthSeed % 100) / 250; // Entre 0.8 et 1.2
    
    // Ajouter une saisonnalité (plus élevé en hiver et été)
    const month = monthDate.getMonth();
    const seasonality = 
      (month >= 0 && month <= 1) || (month >= 6 && month <= 8) 
        ? 1.2 // Hiver et été
        : 1.0;
    
    // Ajouter une tendance générale à la hausse (5% par an)
    const trend = 1 + (months - i) / (months * 20);
    
    // Calculer le volume final
    const volume = Math.round(baseVolume * randomFactor * seasonality * trend);
    
    trends.push({
      month: `${monthName} ${year}`,
      volume: volume
    });
  }
  
  return trends;
};
