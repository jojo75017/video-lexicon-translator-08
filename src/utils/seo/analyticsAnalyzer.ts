
import { AnalyticsStats } from './analysisTypes';

export const analyzeAnalytics = async () => {
  try {
    // Appel à l'API Google Analytics
    const response = await fetch('/api/analytics');
    const data = await response.json();
    
    return {
      pageViews: data.pageViews || 0,
      uniqueVisitors: data.uniqueVisitors || 0,
      bounceRate: data.bounceRate || 0,
      averageTimeOnPage: data.averageTimeOnPage || 0,
      topCountries: data.topCountries || [
        { country: "France", visits: 0 }
      ],
      deviceBreakdown: data.deviceBreakdown || {
        desktop: 0,
        mobile: 0,
        tablet: 0,
      },
      timeOnSite: data.timeOnSite || {
        '0-30s': 0,
        '30s-2m': 0,
        '2m-5m': 0,
        '5m+': 0,
      }
    };
  } catch (error) {
    console.error('Erreur Analytics:', error);
    return {
      pageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      averageTimeOnPage: 0,
      topCountries: [
        { country: "France", visits: 0 }
      ],
      deviceBreakdown: {
        desktop: 0,
        mobile: 0,
        tablet: 0,
      },
      timeOnSite: {
        '0-30s': 0,
        '30s-2m': 0,
        '2m-5m': 0,
        '5m+': 0,
      }
    };
  }
};
