
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
    conversions?: Array<{ date: string; count: number }>;
  };
  userEngagement: {
    newUsers: number;
    returningUsers: number;
    averageSessionsPerUser: number;
    pagesPerSession: number;
  };
  contentPerformance?: Array<{
    contentType: string;
    views: number;
    avgTimeOnPage: number;
    bounceRate: number;
    conversions: number;
  }>;
  conversionFunnels?: Array<{
    name: string;
    stages: Array<{
      name: string;
      users: number;
      dropoffRate: number;
    }>;
  }>;
  campaignPerformance?: Array<{
    name: string;
    clicks: number;
    impressions: number;
    ctr: number;
    conversions: number;
    cost: number;
    roi: number;
  }>;
}

export const analyzeAnalytics = (period: string = '30days'): AnalyticsData => {
  // Ajuster les facteurs de multiplicateurs basés sur la période
  const periodMultiplier = {
    '7days': 0.3,
    '30days': 1,
    '90days': 3.2,
    'custom': 1.5
  };
  
  const multiplier = periodMultiplier[period as keyof typeof periodMultiplier] || 1;
  
  // Générer des données plus riches et réalistes pour l'analyse
  const visitors = Math.floor((Math.random() * 80000) + 20000) * multiplier;
  const pageViews = visitors * (Math.random() * 4 + 2);
  const bounceRate = Math.random() * 60 + 20;
  
  // Nombre de jours pour la tendance basé sur la période
  const trendDays = period === '7days' ? 7 : period === '30days' ? 30 : 90;
  
  // Générer les tendances sur la période sélectionnée
  const generateTrends = (days: number) => {
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (days - 1 - i));
      
      // Ajouter une fluctuation plus réaliste avec une progression légère
      const dayProgress = i / (days - 1); // 0 au début, 1 à la fin
      const randomVariation = 0.7 + Math.random() * 0.6; // Entre 0.7 et 1.3
      
      // Inclure une tendance légèrement à la hausse
      const trendFactor = 1 + dayProgress * 0.4; // De 1 à 1.4
      
      return {
        date: date.toISOString().slice(0, 10),
        count: Math.floor((visitors / days) * randomVariation * trendFactor)
      };
    });
  };
  
  const trends = {
    visitors: generateTrends(trendDays),
    pageviews: generateTrends(trendDays).map(item => ({
      date: item.date,
      count: Math.floor(item.count * (Math.random() * 2 + 2))
    })),
    bounceRate: generateTrends(trendDays).map(item => ({
      date: item.date,
      rate: bounceRate * (0.85 + Math.random() * 0.3)
    })),
    conversions: generateTrends(trendDays).map(item => ({
      date: item.date,
      count: Math.floor(item.count * (Math.random() * 0.05 + 0.01))
    }))
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
      clicks: Math.floor((Math.random() * 2000) + 1000) * multiplier,
      impressions: Math.floor((Math.random() * 15000) + 5000) * multiplier,
      position: Math.floor(Math.random() * 5) + 1,
      ctr: Math.random() * 10 + 2
    },
    {
      keyword: "seo optimisation",
      clicks: Math.floor((Math.random() * 1500) + 800) * multiplier,
      impressions: Math.floor((Math.random() * 12000) + 4000) * multiplier,
      position: Math.floor(Math.random() * 5) + 2,
      ctr: Math.random() * 8 + 1.5
    },
    {
      keyword: "référencement naturel",
      clicks: Math.floor((Math.random() * 1200) + 600) * multiplier,
      impressions: Math.floor((Math.random() * 10000) + 3000) * multiplier,
      position: Math.floor(Math.random() * 6) + 2,
      ctr: Math.random() * 7 + 1
    },
    {
      keyword: "agence marketing",
      clicks: Math.floor((Math.random() * 1000) + 500) * multiplier,
      impressions: Math.floor((Math.random() * 8000) + 2500) * multiplier,
      position: Math.floor(Math.random() * 7) + 3,
      ctr: Math.random() * 6 + 1
    },
    {
      keyword: "stratégie digitale",
      clicks: Math.floor((Math.random() * 800) + 400) * multiplier,
      impressions: Math.floor((Math.random() * 7000) + 2000) * multiplier,
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
  
  // Nouvelles données pour la performance du contenu
  const contentPerformance = [
    {
      contentType: "Articles de blog",
      views: Math.floor(pageViews * 0.35),
      avgTimeOnPage: Math.floor(Math.random() * 180) + 120,
      bounceRate: Math.floor(Math.random() * 20) + 40,
      conversions: Math.floor(pageViews * 0.35 * 0.02)
    },
    {
      contentType: "Pages produits",
      views: Math.floor(pageViews * 0.25),
      avgTimeOnPage: Math.floor(Math.random() * 100) + 60,
      bounceRate: Math.floor(Math.random() * 15) + 25,
      conversions: Math.floor(pageViews * 0.25 * 0.05)
    },
    {
      contentType: "Pages services",
      views: Math.floor(pageViews * 0.20),
      avgTimeOnPage: Math.floor(Math.random() * 120) + 90,
      bounceRate: Math.floor(Math.random() * 20) + 30,
      conversions: Math.floor(pageViews * 0.20 * 0.04)
    },
    {
      contentType: "Pages d'atterrissage",
      views: Math.floor(pageViews * 0.10),
      avgTimeOnPage: Math.floor(Math.random() * 60) + 40,
      bounceRate: Math.floor(Math.random() * 30) + 40,
      conversions: Math.floor(pageViews * 0.10 * 0.08)
    },
    {
      contentType: "Pages ressources",
      views: Math.floor(pageViews * 0.10),
      avgTimeOnPage: Math.floor(Math.random() * 150) + 100,
      bounceRate: Math.floor(Math.random() * 25) + 35,
      conversions: Math.floor(pageViews * 0.10 * 0.03)
    }
  ];
  
  // Entonnoirs de conversion
  const conversionFunnels = [
    {
      name: "Inscription newsletter",
      stages: [
        { name: "Visite page", users: Math.floor(visitors * 0.4), dropoffRate: 0 },
        { name: "Clic sur CTA", users: Math.floor(visitors * 0.4 * 0.25), dropoffRate: 75 },
        { name: "Formulaire affiché", users: Math.floor(visitors * 0.4 * 0.25 * 0.8), dropoffRate: 20 },
        { name: "Formulaire soumis", users: Math.floor(visitors * 0.4 * 0.25 * 0.8 * 0.6), dropoffRate: 40 },
        { name: "Confirmation email", users: Math.floor(visitors * 0.4 * 0.25 * 0.8 * 0.6 * 0.9), dropoffRate: 10 }
      ]
    },
    {
      name: "Achat produit",
      stages: [
        { name: "Visite catalogue", users: Math.floor(visitors * 0.6), dropoffRate: 0 },
        { name: "Fiche produit", users: Math.floor(visitors * 0.6 * 0.45), dropoffRate: 55 },
        { name: "Ajout au panier", users: Math.floor(visitors * 0.6 * 0.45 * 0.25), dropoffRate: 75 },
        { name: "Checkout", users: Math.floor(visitors * 0.6 * 0.45 * 0.25 * 0.7), dropoffRate: 30 },
        { name: "Paiement", users: Math.floor(visitors * 0.6 * 0.45 * 0.25 * 0.7 * 0.85), dropoffRate: 15 }
      ]
    }
  ];
  
  // Performance des campagnes
  const campaignPerformance = [
    {
      name: "SEA - Recherche",
      clicks: Math.floor(Math.random() * 5000 + 2000) * multiplier,
      impressions: Math.floor(Math.random() * 50000 + 20000) * multiplier,
      ctr: Math.random() * 5 + 4,
      conversions: Math.floor(Math.random() * 200 + 50) * multiplier,
      cost: Math.floor(Math.random() * 2000 + 1000) * multiplier,
      roi: Math.random() * 300 + 150
    },
    {
      name: "Facebook Ads",
      clicks: Math.floor(Math.random() * 4000 + 1500) * multiplier,
      impressions: Math.floor(Math.random() * 80000 + 40000) * multiplier,
      ctr: Math.random() * 3 + 2,
      conversions: Math.floor(Math.random() * 150 + 30) * multiplier,
      cost: Math.floor(Math.random() * 1500 + 800) * multiplier,
      roi: Math.random() * 200 + 100
    },
    {
      name: "Display",
      clicks: Math.floor(Math.random() * 3000 + 1000) * multiplier,
      impressions: Math.floor(Math.random() * 120000 + 60000) * multiplier,
      ctr: Math.random() * 1.5 + 1,
      conversions: Math.floor(Math.random() * 80 + 20) * multiplier,
      cost: Math.floor(Math.random() * 1200 + 600) * multiplier,
      roi: Math.random() * 150 + 80
    },
    {
      name: "Email Marketing",
      clicks: Math.floor(Math.random() * 2500 + 800) * multiplier,
      impressions: Math.floor(Math.random() * 30000 + 10000) * multiplier,
      ctr: Math.random() * 8 + 6,
      conversions: Math.floor(Math.random() * 100 + 40) * multiplier,
      cost: Math.floor(Math.random() * 500 + 200) * multiplier,
      roi: Math.random() * 500 + 300
    }
  ];
  
  // Répartition des appareils (s'assurer que les pourcentages totalisent 100%)
  const desktopPercentage = Math.floor(Math.random() * 20) + 30; // 30-50%
  const mobilePercentage = Math.floor(Math.random() * 20) + 40; // 40-60%
  const tabletPercentage = 100 - desktopPercentage - mobilePercentage; // Le reste pour totaliser 100%
  
  // Sources de trafic (s'assurer que les pourcentages totalisent 100%)
  const organicPercentage = Math.floor(Math.random() * 20) + 20; // 20-40%
  const directPercentage = Math.floor(Math.random() * 20) + 15; // 15-35%
  const referralPercentage = Math.floor(Math.random() * 15) + 5; // 5-20%
  const socialPercentage = Math.floor(Math.random() * 15) + 5; // 5-20%
  const emailPercentage = Math.floor(Math.random() * 10) + 3; // 3-13%
  const paidPercentage = 100 - organicPercentage - directPercentage - referralPercentage - socialPercentage - emailPercentage;
  
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
      organic: organicPercentage,
      direct: directPercentage,
      referral: referralPercentage,
      social: socialPercentage,
      email: emailPercentage,
      paid: paidPercentage
    },
    deviceBreakdown: {
      desktop: desktopPercentage,
      mobile: mobilePercentage,
      tablet: tabletPercentage
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
    },
    contentPerformance,
    conversionFunnels,
    campaignPerformance
  };
};
