
import { AnalyticsStats, generateBaseStats } from './analysisTypes';

export const analyzeAnalytics = () => {
  const { pageViews, uniqueVisitors } = generateBaseStats();
  
  // Réduire les valeurs pour plus de réalisme
  const adjustedPageViews = Math.floor(pageViews * 0.05); // Réduire d'un facteur de 20
  const adjustedVisitors = Math.floor(uniqueVisitors * 0.05); // Réduire d'un facteur de 20
  
  return {
    pageViews: adjustedPageViews,
    uniqueVisitors: adjustedVisitors,
    bounceRate: Math.floor(Math.random() * 25) + 45, // Entre 45-70% (plus réaliste)
    averageTimeOnPage: Math.floor(Math.random() * 40) + 15, // Entre 15-55 secondes
    topCountries: [
      { country: "France", visits: Math.floor(adjustedVisitors * 0.5) },
      { country: "États-Unis", visits: Math.floor(adjustedVisitors * 0.15) },
      { country: "Canada", visits: Math.floor(adjustedVisitors * 0.1) },
      { country: "Belgique", visits: Math.floor(adjustedVisitors * 0.08) },
      { country: "Suisse", visits: Math.floor(adjustedVisitors * 0.07) }
    ],
    deviceBreakdown: {
      desktop: 48,
      mobile: 45,
      tablet: 7,
    },
    timeOnSite: {
      '0-30s': Math.floor(adjustedPageViews * 0.45),
      '30s-2m': Math.floor(adjustedPageViews * 0.35),
      '2m-5m': Math.floor(adjustedPageViews * 0.15),
      '5m+': Math.floor(adjustedPageViews * 0.05),
    }
  };
};
