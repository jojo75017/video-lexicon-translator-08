
export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageTimeOnPage: number;
  conversionRate: number;
  trends: {
    visitors: Array<{ date: string; count: number }>;
    pageviews: Array<{ date: string; count: number }>;
  };
  trafficSources: {
    organic: number;
    direct: number;
    social: number;
    referral: number;
    email: number;
    paid: number;
  };
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  timeOnSite: {
    '0-30s': number;
    '30s-2m': number;
    '2m-5m': number;
    '5m+': number;
  };
  topPages: Array<{
    url: string;
    views: number;
    conversions: number;
  }>;
  userEngagement: {
    newUsers: number;
    returningUsers: number;
  };
  campaignPerformance?: Array<{
    name: string;
    clicks: number;
    impressions: number;
    ctr: number;
    conversions: number;
    roi: number;
  }>;
  conversionFunnels?: Array<{
    name: string;
    stages: Array<{
      name: string;
      users: number;
      dropoffRate: number;
    }>;
  }>;
}

export const analyzeAnalytics = (timeRange: string): AnalyticsData => {
  // Générer des données fictives mais réalistes
  const generateTrendData = (days: number) => {
    const data = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const baseVisitors = 800 + Math.floor(Math.random() * 400);
      const basePageviews = baseVisitors * (1.5 + Math.random() * 1.5);
      
      data.push({
        visitors: {
          date: date.toISOString().split('T')[0],
          count: baseVisitors
        },
        pageviews: {
          date: date.toISOString().split('T')[0],
          count: Math.floor(basePageviews)
        }
      });
    }
    
    return {
      visitors: data.map(d => d.visitors),
      pageviews: data.map(d => d.pageviews)
    };
  };

  const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
  const trends = generateTrendData(days);

  return {
    pageViews: 45231,
    uniqueVisitors: 12458,
    bounceRate: 42.5,
    averageTimeOnPage: 156,
    conversionRate: 3.2,
    trends,
    trafficSources: {
      organic: 65,
      direct: 20,
      social: 8,
      referral: 4,
      email: 2,
      paid: 1
    },
    deviceBreakdown: {
      mobile: 58,
      desktop: 35,
      tablet: 7
    },
    timeOnSite: {
      '0-30s': 25,
      '30s-2m': 35,
      '2m-5m': 28,
      '5m+': 12
    },
    topPages: [
      { url: '/', views: 15420, conversions: 485 },
      { url: '/products', views: 8932, conversions: 312 },
      { url: '/about', views: 5621, conversions: 89 },
      { url: '/contact', views: 3456, conversions: 156 },
      { url: '/blog', views: 2890, conversions: 67 }
    ],
    userEngagement: {
      newUsers: 7845,
      returningUsers: 4613
    },
    campaignPerformance: [
      {
        name: 'Campagne Google Ads',
        clicks: 1250,
        impressions: 25000,
        ctr: 5.0,
        conversions: 45,
        roi: 320
      },
      {
        name: 'Campagne Facebook',
        clicks: 890,
        impressions: 18500,
        ctr: 4.8,
        conversions: 28,
        roi: 280
      }
    ],
    conversionFunnels: [
      {
        name: 'Achat produit',
        stages: [
          { name: 'Visite du site', users: 10000, dropoffRate: 0 },
          { name: 'Page produit', users: 6500, dropoffRate: 35 },
          { name: 'Ajout au panier', users: 2800, dropoffRate: 57 },
          { name: 'Checkout', users: 1200, dropoffRate: 57 },
          { name: 'Achat finalisé', users: 320, dropoffRate: 73 }
        ]
      }
    ]
  };
};
