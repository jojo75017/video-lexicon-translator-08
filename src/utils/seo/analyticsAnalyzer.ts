
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
  
  // Génération de données plus réalistes
  const baseVisitors = Math.floor((Math.random() * 50000) + 20000);
  const visitors = Math.floor(baseVisitors * multiplier);
  const pageViews = Math.floor(visitors * (Math.random() * 2.5 + 2.2));
  const bounceRate = 35 + Math.random() * 15; // Entre 35% et 50%
  
  // Nombre de jours pour la tendance basé sur la période
  const trendDays = period === '7days' ? 7 : period === '30days' ? 30 : 90;
  
  // Constantes pour les tendances
  const WEEKEND_DECREASE = 0.7; // Réduction du trafic le week-end
  const GROWTH_FACTOR = 1.002; // Légère croissance quotidienne
  const SEASONAL_AMPLITUDE = 0.1; // Amplitude des variations saisonnières
  const RANDOM_VARIATION = 0.15; // Amplitude des variations aléatoires
  
  // Générer des tendances avec un modèle plus réaliste, incluant les variations hebdomadaires
  const generateTrends = (days: number, baseValue: number, variation: number = RANDOM_VARIATION) => {
    const today = new Date();
    const startingDate = new Date();
    startingDate.setDate(today.getDate() - days);
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(startingDate);
      date.setDate(startingDate.getDate() + i);
      
      // Facteur de progression (tendance à la hausse)
      const progress = Math.pow(GROWTH_FACTOR, i);
      
      // Variation hebdomadaire (moins de trafic le weekend)
      const dayOfWeek = date.getDay(); // 0 = Dimanche, 6 = Samedi
      const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? WEEKEND_DECREASE : 1;
      
      // Variation saisonnière (cycle sinusoïdal)
      const seasonalFactor = 1 + SEASONAL_AMPLITUDE * Math.sin(2 * Math.PI * i / 30);
      
      // Variation aléatoire
      const randomFactor = 1 + (Math.random() * 2 - 1) * variation;
      
      // Valeur finale = base * progression * weekend * saison * aléatoire
      const value = Math.floor(baseValue / days * progress * weekendFactor * seasonalFactor * randomFactor);
      
      return {
        date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
        count: value
      };
    });
  };
  
  // Générer des tendances pour les visiteurs, pages vues, taux de rebond et conversions
  const baseDailyVisitors = visitors / trendDays;
  const baseDailyPageviews = pageViews / trendDays;
  const baseDailyConversions = visitors * 0.02 / trendDays; // Taux de conversion moyen de 2%
  
  const visitorsTrend = generateTrends(trendDays, visitors);
  const pageviewsTrend = visitorsTrend.map(item => ({
    date: item.date,
    count: Math.floor(item.count * (2.2 + Math.random() * 0.8)) // Pages vues = Visiteurs * facteur moyen de pages par visite
  }));
  
  const bounceRateTrend = visitorsTrend.map(item => {
    // Le taux de rebond est inversement proportionnel au nombre de visiteurs (plus de visiteurs = meilleur engagement)
    const visitorRatio = item.count / baseDailyVisitors;
    const inverseFactor = 2 - visitorRatio; // Effet inverse
    const adjustment = Math.min(Math.max(inverseFactor, 0.7), 1.3); // Limiter l'effet
    
    return {
      date: item.date,
      rate: bounceRate * adjustment * (0.9 + Math.random() * 0.2) // Ajouter un peu de variation aléatoire
    };
  });
  
  const conversionsTrend = visitorsTrend.map(item => ({
    date: item.date,
    count: Math.floor(item.count * 0.02 * (0.8 + Math.random() * 0.4)) // Taux de conversion variable
  }));
  
  // Pages les plus visitées avec données plus détaillées et réalistes
  const commonUrls = [
    '/accueil',
    '/produits',
    '/blog',
    '/services',
    '/contact',
    '/a-propos',
    '/blog/seo-guide',
    '/produits/best-seller',
    '/faq',
    '/blog/marketing-digital'
  ];
  
  const totalPageViews = pageViews;
  let remainingViews = totalPageViews;
  
  const topPagesDistribution = [0.28, 0.22, 0.15, 0.08, 0.06, 0.05, 0.04, 0.04, 0.04, 0.04];
  const conversionRates = [0.035, 0.042, 0.012, 0.027, 0.058, 0.008, 0.015, 0.065, 0.02, 0.01];
  
  const topPages = commonUrls.map((url, index) => {
    const distribution = topPagesDistribution[index];
    const views = Math.floor(totalPageViews * distribution);
    remainingViews -= views;
    
    return {
      url,
      views,
      conversions: Math.floor(views * conversionRates[index])
    };
  });
  
  // Ajout de pages supplémentaires si nécessaire
  if (remainingViews > 0) {
    topPages.push({
      url: '/autres-pages',
      views: remainingViews,
      conversions: Math.floor(remainingViews * 0.01)
    });
  }
  
  // Mots-clés avec plus de données
  const keywordsList = [
    {
      keyword: "marketing digital",
      popularity: 0.25,
      position: 1,
      ctrFactor: 1.2
    },
    {
      keyword: "seo optimisation",
      popularity: 0.22,
      position: 2,
      ctrFactor: 1.1
    },
    {
      keyword: "référencement naturel",
      popularity: 0.18,
      position: 3,
      ctrFactor: 1.0
    },
    {
      keyword: "agence marketing",
      popularity: 0.15,
      position: 4,
      ctrFactor: 0.9
    },
    {
      keyword: "stratégie digitale",
      popularity: 0.12,
      position: 5,
      ctrFactor: 0.85
    },
    {
      keyword: "améliorer seo",
      popularity: 0.08,
      position: 3,
      ctrFactor: 1.0
    },
    {
      keyword: "audit seo",
      popularity: 0.07,
      position: 6,
      ctrFactor: 0.7
    },
    {
      keyword: "content marketing",
      popularity: 0.06,
      position: 4,
      ctrFactor: 0.9
    },
    {
      keyword: "analytics seo",
      popularity: 0.05,
      position: 7,
      ctrFactor: 0.6
    },
    {
      keyword: "backlinks quality",
      popularity: 0.04,
      position: 8,
      ctrFactor: 0.5
    }
  ];
  
  const searchVolumeFactor = visitors * 25; // Un multiplicateur pour simuler un volume de recherche plus élevé que les visiteurs
  
  const topKeywords = keywordsList.map(keywordInfo => {
    const impressions = Math.floor(searchVolumeFactor * keywordInfo.popularity * multiplier);
    const positionFactor = Math.max(0, 1 - keywordInfo.position * 0.1); // Plus la position est basse, moins de clics
    const baseCTR = 12 * positionFactor * keywordInfo.ctrFactor; // CTR de base ajusté par position
    const ctr = baseCTR * (0.9 + Math.random() * 0.2); // Ajout de variation
    const clicks = Math.floor(impressions * ctr / 100);
    
    return {
      keyword: keywordInfo.keyword,
      clicks: clicks,
      impressions: impressions,
      position: keywordInfo.position,
      ctr: ctr
    };
  });
  
  // Pays avec pourcentages
  const totalVisits = visitors;
  const countryDistribution = [
    { country: "France", percent: 0.55 + Math.random() * 0.15 },
    { country: "Belgique", percent: 0.12 + Math.random() * 0.08 },
    { country: "Suisse", percent: 0.08 + Math.random() * 0.06 },
    { country: "Canada", percent: 0.05 + Math.random() * 0.05 }
  ];
  
  // S'assurer que le total fait bien 100%
  const distributedPercent = countryDistribution.reduce((sum, item) => sum + item.percent, 0);
  const remainingPercent = Math.max(0, 1 - distributedPercent);
  
  const topCountries = countryDistribution.map(item => ({
    country: item.country,
    visits: Math.floor(totalVisits * item.percent),
    percentage: Math.round(item.percent * 100)
  }));
  
  if (remainingPercent > 0) {
    topCountries.push({
      country: "Autres",
      visits: Math.floor(totalVisits * remainingPercent),
      percentage: Math.round(remainingPercent * 100)
    });
  }
  
  // Nouvelles données pour la performance du contenu
  const contentTypes = [
    {
      contentType: "Articles de blog",
      viewsPercent: 0.35,
      avgTimeOnPage: 120 + Math.floor(Math.random() * 180),
      bounceRateAdjustment: 0.9 + Math.random() * 0.2,
      conversionRate: 0.02
    },
    {
      contentType: "Pages produits",
      viewsPercent: 0.25,
      avgTimeOnPage: 60 + Math.floor(Math.random() * 100),
      bounceRateAdjustment: 0.7 + Math.random() * 0.15,
      conversionRate: 0.05
    },
    {
      contentType: "Pages services",
      viewsPercent: 0.20,
      avgTimeOnPage: 90 + Math.floor(Math.random() * 120),
      bounceRateAdjustment: 0.8 + Math.random() * 0.2,
      conversionRate: 0.04
    },
    {
      contentType: "Pages d'atterrissage",
      viewsPercent: 0.10,
      avgTimeOnPage: 40 + Math.floor(Math.random() * 60),
      bounceRateAdjustment: 1.1 + Math.random() * 0.3,
      conversionRate: 0.08
    },
    {
      contentType: "Pages ressources",
      viewsPercent: 0.10,
      avgTimeOnPage: 100 + Math.floor(Math.random() * 150),
      bounceRateAdjustment: 0.85 + Math.random() * 0.25,
      conversionRate: 0.03
    }
  ];
  
  const contentPerformance = contentTypes.map(content => {
    const views = Math.floor(pageViews * content.viewsPercent);
    
    return {
      contentType: content.contentType,
      views: views,
      avgTimeOnPage: content.avgTimeOnPage,
      bounceRate: Math.floor(bounceRate * content.bounceRateAdjustment),
      conversions: Math.floor(views * content.conversionRate)
    };
  });
  
  // Entonnoirs de conversion - Refactorisation pour plus de réalisme
  const newsletterFunnel = {
    name: "Inscription newsletter",
    stages: [
      { 
        name: "Visite page", 
        users: Math.floor(visitors * 0.4), 
        dropoffRate: 0 
      }
    ]
  };
  
  // Calculer chaque étape en utilisant le drop-off à partir de l'étape précédente
  const newsletterDropoffs = [75, 20, 40, 10]; // pourcentages de drop-off à chaque étape
  const newsletterStageNames = ["Clic sur CTA", "Formulaire affiché", "Formulaire soumis", "Confirmation email"];
  
  let previousStageUsers = newsletterFunnel.stages[0].users;
  
  for (let i = 0; i < newsletterDropoffs.length; i++) {
    const dropoffRate = newsletterDropoffs[i];
    const remainingRate = (100 - dropoffRate) / 100;
    const currentStageUsers = Math.floor(previousStageUsers * remainingRate);
    
    newsletterFunnel.stages.push({
      name: newsletterStageNames[i],
      users: currentStageUsers,
      dropoffRate: dropoffRate
    });
    
    previousStageUsers = currentStageUsers;
  }
  
  // Entonnoir d'achat
  const purchaseFunnel = {
    name: "Achat produit",
    stages: [
      { 
        name: "Visite catalogue", 
        users: Math.floor(visitors * 0.6), 
        dropoffRate: 0 
      }
    ]
  };
  
  // Calculer chaque étape en utilisant le drop-off
  const purchaseDropoffs = [55, 75, 30, 15]; // pourcentages de drop-off à chaque étape
  const purchaseStageNames = ["Fiche produit", "Ajout au panier", "Checkout", "Paiement"];
  
  previousStageUsers = purchaseFunnel.stages[0].users;
  
  for (let i = 0; i < purchaseDropoffs.length; i++) {
    const dropoffRate = purchaseDropoffs[i];
    const remainingRate = (100 - dropoffRate) / 100;
    const currentStageUsers = Math.floor(previousStageUsers * remainingRate);
    
    purchaseFunnel.stages.push({
      name: purchaseStageNames[i],
      users: currentStageUsers,
      dropoffRate: dropoffRate
    });
    
    previousStageUsers = currentStageUsers;
  }
  
  const conversionFunnels = [purchaseFunnel, newsletterFunnel];
  
  // Performance des campagnes avec des valeurs plus réalistes
  const campaignInfo = [
    {
      name: "SEA - Recherche",
      clicksBase: 5000,
      impressionsMultiplier: 10,
      ctrBase: 4.5,
      conversionRate: 0.025,
      costPerClick: 0.5,
      roiMultiplier: 2.5
    },
    {
      name: "Facebook Ads",
      clicksBase: 4000,
      impressionsMultiplier: 20,
      ctrBase: 2.5,
      conversionRate: 0.02,
      costPerClick: 0.4,
      roiMultiplier: 2.0
    },
    {
      name: "Display",
      clicksBase: 3000,
      impressionsMultiplier: 40,
      ctrBase: 1.2,
      conversionRate: 0.01,
      costPerClick: 0.3,
      roiMultiplier: 1.5
    },
    {
      name: "Email Marketing",
      clicksBase: 2500,
      impressionsMultiplier: 5,
      ctrBase: 7.0,
      conversionRate: 0.04,
      costPerClick: 0.2,
      roiMultiplier: 4.0
    }
  ];
  
  const campaignPerformance = campaignInfo.map(campaign => {
    const clicks = Math.floor(campaign.clicksBase * (0.8 + Math.random() * 0.4) * multiplier);
    const impressions = Math.floor(clicks * campaign.impressionsMultiplier * (0.9 + Math.random() * 0.2));
    const ctr = campaign.ctrBase * (0.9 + Math.random() * 0.2);
    const conversions = Math.floor(clicks * campaign.conversionRate * (0.8 + Math.random() * 0.4));
    const cost = Math.floor(clicks * campaign.costPerClick * (0.9 + Math.random() * 0.2));
    const averageOrderValue = 75; // Valeur moyenne d'une commande
    const revenue = conversions * averageOrderValue;
    const roi = (revenue - cost) / cost * 100;
    
    return {
      name: campaign.name,
      clicks,
      impressions,
      ctr,
      conversions,
      cost,
      roi
    };
  });
  
  // Répartition des appareils - plus réaliste avec mobile dominant
  const mobilePercentage = 45 + Math.floor(Math.random() * 15); // 45-60%
  const desktopPercentage = 35 + Math.floor(Math.random() * 15); // 35-50%
  const tabletPercentage = 100 - mobilePercentage - desktopPercentage; // Le reste
  
  // Sources de trafic plus réalistes avec une distribution standard
  const organicPercentage = 35 + Math.floor(Math.random() * 10); // 35-45%
  const directPercentage = 20 + Math.floor(Math.random() * 10); // 20-30%
  const socialPercentage = 10 + Math.floor(Math.random() * 8); // 10-18%
  const referralPercentage = 8 + Math.floor(Math.random() * 7); // 8-15%
  const emailPercentage = 5 + Math.floor(Math.random() * 5); // 5-10%
  const paidPercentage = 100 - organicPercentage - directPercentage - referralPercentage - socialPercentage - emailPercentage;
  
  // Temps passé sur site - valeurs plus réalistes
  const shortVisits = Math.floor(visitors * 0.35); // 0-30s: 35% des visites
  const mediumVisits = Math.floor(visitors * 0.30); // 30s-2m: 30% des visites
  const longVisits = Math.floor(visitors * 0.20); // 2m-5m: 20% des visites
  const veryLongVisits = visitors - shortVisits - mediumVisits - longVisits; // 5m+: le reste
  
  // Engagement utilisateurs avec des proportions plus réalistes
  const newUsersPercentage = 0.65 + Math.random() * 0.15; // 65-80% nouveaux utilisateurs
  const newUsers = Math.floor(visitors * newUsersPercentage);
  const returningUsers = visitors - newUsers;
  
  return {
    pageViews: pageViews,
    uniqueVisitors: visitors,
    bounceRate: bounceRate,
    avgSessionDuration: Math.floor(120 + Math.random() * 180), // Entre 2 et 5 minutes
    averageTimeOnPage: Math.floor(60 + Math.random() * 120), // Entre 1 et 3 minutes
    conversionRate: 1.8 + Math.random() * 1.7, // Entre 1.8% et 3.5%
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
      '0-30s': shortVisits,
      '30s-2m': mediumVisits,
      '2m-5m': longVisits,
      '5m+': veryLongVisits
    },
    trends: {
      visitors: visitorsTrend,
      pageviews: pageviewsTrend,
      bounceRate: bounceRateTrend,
      conversions: conversionsTrend
    },
    userEngagement: {
      newUsers: newUsers,
      returningUsers: returningUsers,
      averageSessionsPerUser: 1.2 + Math.random() * 0.8, // Entre 1.2 et 2.0
      pagesPerSession: 2.2 + Math.random() * 1.3 // Entre 2.2 et 3.5
    },
    contentPerformance,
    conversionFunnels,
    campaignPerformance
  };
};
