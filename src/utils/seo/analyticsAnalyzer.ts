
import { AnalyticsStats, generateBaseStats } from './analysisTypes';

export const analyzeAnalytics = () => {
  const { pageViews, uniqueVisitors } = generateBaseStats();
  
  // Réduire les valeurs pour plus de réalisme
  const adjustedPageViews = Math.floor(pageViews * 0.1); // Réduire d'un facteur de 10
  const adjustedVisitors = Math.floor(uniqueVisitors * 0.1); // Réduire d'un facteur de 10
  
  return {
    pageViews: adjustedPageViews,
    uniqueVisitors: adjustedVisitors,
    bounceRate: Math.floor(Math.random() * 30) + 40, // Entre 40-70%
    averageTimeOnPage: Math.floor(Math.random() * 60) + 20, // Entre 20-80 secondes
    topCountries: [
      { country: "France", visits: Math.floor(adjustedVisitors * 0.6) },
      { country: "États-Unis", visits: Math.floor(adjustedVisitors * 0.2) },
      { country: "Canada", visits: Math.floor(adjustedVisitors * 0.1) },
    ],
    deviceBreakdown: {
      desktop: 55,
      mobile: 35,
      tablet: 10,
    },
    timeOnSite: {
      '0-30s': Math.floor(adjustedPageViews * 0.4),
      '30s-2m': Math.floor(adjustedPageViews * 0.3),
      '2m-5m': Math.floor(adjustedPageViews * 0.2),
      '5m+': Math.floor(adjustedPageViews * 0.1),
    }
  };
};
