
import { AnalyticsStats, generateBaseStats } from './analysisTypes';

export const analyzeAnalytics = () => {
  const { pageViews, uniqueVisitors } = generateBaseStats();
  
  return {
    pageViews,
    uniqueVisitors,
    bounceRate: Math.floor(Math.random() * 30) + 40,
    averageTimeOnPage: Math.floor(Math.random() * 120) + 30,
    topCountries: [
      { country: "France", visits: Math.floor(uniqueVisitors * 0.6) },
      { country: "États-Unis", visits: Math.floor(uniqueVisitors * 0.2) },
      { country: "Canada", visits: Math.floor(uniqueVisitors * 0.1) },
    ],
    deviceBreakdown: {
      desktop: 45,
      mobile: 40,
      tablet: 15,
    },
    timeOnSite: {
      '0-30s': Math.floor(pageViews * 0.3),
      '30s-2m': Math.floor(pageViews * 0.4),
      '2m-5m': Math.floor(pageViews * 0.2),
      '5m+': Math.floor(pageViews * 0.1),
    }
  };
};
