
interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  averageTimeOnPage: number;
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
    position: number;
    ctr: number;
  }>;
  topCountries: Array<{
    country: string;
    visits: number;
    percentage: number;
  }>;
  trafficSources: {
    organic: number;
    direct: number;
    referral: number;
    social: number;
    email: number;
    paid: number;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  timeOnSite: {
    '0-30s': number;
    '30s-2m': number;
    '2m-5m': number;
    '5m+': number;
  };
  trends: {
    visitors: Array<{ date: string; count: number }>;
    pageviews: Array<{ date: string; count: number }>;
    bounceRate: Array<{ date: string; rate: number }>;
  };
  userEngagement: {
    newUsers: number;
    returningUsers: number;
    averageSessionsPerUser: number;
    pagesPerSession: number;
  };
}

export const analyzeAnalytics = (): AnalyticsData => {
  // Générer des données plus riches et réalistes pour l'analyse
  const visitors = Math.floor(Math.random() * 80000) + 20000;
  const pageViews = visitors * (Math.random() * 4 + 2);
  const bounceRate = Math.random() * 60 + 20;
  
  // Générer les tendances sur les 30 derniers jours
  const trends = {
    visitors: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().slice(0, 10),
        count: Math.floor(visitors / 30 * (0.7 + Math.random() * 0.6))
      };
    }),
    pageviews: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().slice(0, 10),
        count: Math.floor(pageViews / 30 * (0.7 + Math.random() * 0.6))
      };
    }),
    bounceRate: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().slice(0, 10),
        rate: bounceRate * (0.85 + Math.random() * 0.3)
      };
    })
  };
  
  // Pages les plus visitées avec données plus détaillées
  const topPages = [
    {
      url: '/accueil',
      views: Math.floor(pageViews * 0.28),
      conversions: Math.floor(pageViews * 0.28 * 0.035)
    },
    {
      url: '/produits',
      views: Math.floor(pageViews * 0.22),
      conversions: Math.floor(pageViews * 0.22 * 0.042)
    },
    {
      url: '/blog',
      views: Math.floor(pageViews * 0.18),
      conversions: Math.floor(pageViews * 0.18 * 0.012)
    },
    {
      url: '/services',
      views: Math.floor(pageViews * 0.14),
      conversions: Math.floor(pageViews * 0.14 * 0.027)
    },
    {
      url: '/contact',
      views: Math.floor(pageViews * 0.09),
      conversions: Math.floor(pageViews * 0.09 * 0.058)
    },
    {
      url: '/a-propos',
      views: Math.floor(pageViews * 0.05),
      conversions: Math.floor(pageViews * 0.05 * 0.008)
    },
    {
      url: '/blog/seo-guide',
      views: Math.floor(pageViews * 0.04),
      conversions: Math.floor(pageViews * 0.04 * 0.015)
    }
  ];
  
  // Mots-clés avec plus de données
  const topKeywords = [
    {
      keyword: "marketing digital",
      clicks: Math.floor(Math.random() * 2000) + 1000,
      impressions: Math.floor(Math.random() * 15000) + 5000,
      position: Math.floor(Math.random() * 5) + 1,
      ctr: Math.random() * 10 + 2
    },
    {
      keyword: "seo optimisation",
      clicks: Math.floor(Math.random() * 1500) + 800,
      impressions: Math.floor(Math.random() * 12000) + 4000,
      position: Math.floor(Math.random() * 5) + 2,
      ctr: Math.random() * 8 + 1.5
    },
    {
      keyword: "référencement naturel",
      clicks: Math.floor(Math.random() * 1200) + 600,
      impressions: Math.floor(Math.random() * 10000) + 3000,
      position: Math.floor(Math.random() * 6) + 2,
      ctr: Math.random() * 7 + 1
    },
    {
      keyword: "agence marketing",
      clicks: Math.floor(Math.random() * 1000) + 500,
      impressions: Math.floor(Math.random() * 8000) + 2500,
      position: Math.floor(Math.random() * 7) + 3,
      ctr: Math.random() * 6 + 1
    },
    {
      keyword: "stratégie digitale",
      clicks: Math.floor(Math.random() * 800) + 400,
      impressions: Math.floor(Math.random() * 7000) + 2000,
      position: Math.floor(Math.random() * 8) + 3,
      ctr: Math.random() * 5 + 1
    }
  ];
  
  // Pays avec pourcentages
  const totalVisits = visitors;
  const franceVisits = Math.floor(totalVisits * (0.55 + Math.random() * 0.15));
  const belgiqueVisits = Math.floor(totalVisits * (0.12 + Math.random() * 0.08));
  const suisseVisits = Math.floor(totalVisits * (0.08 + Math.random() * 0.06));
  const canadaVisits = Math.floor(totalVisits * (0.05 + Math.random() * 0.05));
  const autresVisits = totalVisits - franceVisits - belgiqueVisits - suisseVisits - canadaVisits;
  
  const topCountries = [
    {
      country: "France",
      visits: franceVisits,
      percentage: Math.round(franceVisits / totalVisits * 100)
    },
    {
      country: "Belgique",
      visits: belgiqueVisits,
      percentage: Math.round(belgiqueVisits / totalVisits * 100)
    },
    {
      country: "Suisse",
      visits: suisseVisits,
      percentage: Math.round(suisseVisits / totalVisits * 100)
    },
    {
      country: "Canada",
      visits: canadaVisits,
      percentage: Math.round(canadaVisits / totalVisits * 100)
    },
    {
      country: "Autres",
      visits: autresVisits,
      percentage: Math.round(autresVisits / totalVisits * 100)
    }
  ];
  
  return {
    pageViews: Math.floor(pageViews),
    uniqueVisitors: visitors,
    bounceRate: bounceRate,
    avgSessionDuration: Math.floor(Math.random() * 240) + 60,
    averageTimeOnPage: Math.floor(Math.random() * 180) + 20,
    conversionRate: Math.random() * 5 + 1,
    topPages,
    topKeywords,
    topCountries,
    trafficSources: {
      organic: Math.floor(Math.random() * 20) + 20, // 20-40%
      direct: Math.floor(Math.random() * 20) + 15, // 15-35%
      referral: Math.floor(Math.random() * 15) + 5, // 5-20%
      social: Math.floor(Math.random() * 15) + 5, // 5-20%
      email: Math.floor(Math.random() * 10) + 3, // 3-13%
      paid: Math.floor(Math.random() * 10) + 2 // 2-12%
    },
    deviceBreakdown: {
      desktop: Math.floor(Math.random() * 20) + 30, // 30-50%
      mobile: Math.floor(Math.random() * 20) + 40, // 40-60%
      tablet: Math.floor(Math.random() * 10) + 5 // 5-15%
    },
    timeOnSite: {
      '0-30s': Math.floor(Math.random() * 1500) + 1000,
      '30s-2m': Math.floor(Math.random() * 1200) + 800,
      '2m-5m': Math.floor(Math.random() * 800) + 400,
      '5m+': Math.floor(Math.random() * 500) + 200
    },
    trends,
    userEngagement: {
      newUsers: Math.floor(visitors * (0.6 + Math.random() * 0.2)),
      returningUsers: Math.floor(visitors * (0.2 + Math.random() * 0.2)),
      averageSessionsPerUser: Math.random() * 2 + 1.2,
      pagesPerSession: Math.random() * 3 + 1.5
    }
  };
};
