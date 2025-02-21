
interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  topPages: Array<{
    url: string;
    views: number;
    conversions: number;
  }>;
  topKeywords: Array<{
    keyword: string;
    clicks: number;
    impressions: number;
  }>;
  trafficSources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export const analyzeAnalytics = (): AnalyticsData => {
  return {
    pageViews: Math.floor(Math.random() * 100000),
    uniqueVisitors: Math.floor(Math.random() * 50000),
    bounceRate: Math.random() * 100,
    avgSessionDuration: Math.floor(Math.random() * 300),
    conversionRate: Math.random() * 10,
    topPages: [
      {
        url: '/accueil',
        views: Math.floor(Math.random() * 10000),
        conversions: Math.floor(Math.random() * 100)
      },
      {
        url: '/produits',
        views: Math.floor(Math.random() * 8000),
        conversions: Math.floor(Math.random() * 80)
      },
      {
        url: '/blog',
        views: Math.floor(Math.random() * 5000),
        conversions: Math.floor(Math.random() * 50)
      }
    ],
    topKeywords: [
      {
        keyword: 'marketing digital',
        clicks: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 5000)
      },
      {
        keyword: 'seo optimisation',
        clicks: Math.floor(Math.random() * 800),
        impressions: Math.floor(Math.random() * 4000)
      },
      {
        keyword: 'stratégie digitale',
        clicks: Math.floor(Math.random() * 600),
        impressions: Math.floor(Math.random() * 3000)
      }
    ],
    trafficSources: {
      organic: Math.random() * 100,
      direct: Math.random() * 100,
      referral: Math.random() * 100,
      social: Math.random() * 100
    },
    deviceBreakdown: {
      desktop: Math.random() * 100,
      mobile: Math.random() * 100,
      tablet: Math.random() * 100
    }
  };
};
