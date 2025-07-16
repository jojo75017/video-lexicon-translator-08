
import { SearchConsoleData } from '@/types/seo';

export const analyzeTrafficData = (searchConsoleData: SearchConsoleData) => {
  // Génère des données de trafic simulées pour les 6 derniers mois
  const trafficHistory = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      date: date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
      traffic: Math.floor(searchConsoleData.impressions * (0.8 + Math.random() * 0.4))
    };
  }).reverse();

  // Top mots-clés basés sur les données de Search Console
  const topKeywords = searchConsoleData.topQueries.map(query => ({
    keyword: query.query,
    volume: Math.floor(query.impressions),
    count: Math.floor(Math.random() * 10) + 1
  }));

  // Pages les plus populaires basées sur les données de Search Console
  const topPages = searchConsoleData.topPages.map(page => ({
    url: page.url,
    traffic: Math.floor(page.impressions),
    title: page.url.split('/').pop() || page.url
  }));

  return {
    monthlyVisitors: searchConsoleData.impressions,
    trafficHistory,
    topKeywords,
    topPages
  };
};
