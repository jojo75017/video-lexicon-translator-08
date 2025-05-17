
import React from 'react';

// Données simulées pour la console de recherche Google
const mockSearchData = {
  clicks: 2450,
  impressions: 45600,
  ctr: 5.37,
  position: 14.2,
  timeSeries: {
    dates: ["2023-01-01", "2023-01-08", "2023-01-15", "2023-01-22", "2023-01-29", "2023-02-05"],
    clicks: [210, 245, 275, 302, 410, 432],
    impressions: [4200, 4500, 4800, 5100, 5400, 5700]
  },
  keywords: [
    { keyword: "marketing digital", clicks: 340, impressions: 4500, position: 3.2, ctr: 7.5 },
    { keyword: "agence seo", clicks: 290, impressions: 3800, position: 4.1, ctr: 7.6 },
    { keyword: "référencement naturel", clicks: 250, impressions: 3200, position: 5.3, ctr: 7.8 },
    { keyword: "stratégie digitale", clicks: 210, impressions: 2900, position: 6.2, ctr: 7.2 },
    { keyword: "audit seo", clicks: 190, impressions: 2500, position: 7.4, ctr: 7.6 }
  ],
  pages: [
    { page: "/services/seo", clicks: 520, impressions: 8900, position: 2.8, ctr: 5.8 },
    { page: "/blog/optimisation-seo", clicks: 410, impressions: 6500, position: 3.7, ctr: 6.3 },
    { page: "/services/sea", clicks: 380, impressions: 5200, position: 4.2, ctr: 7.3 },
    { page: "/blog/tendances-marketing", clicks: 320, impressions: 4800, position: 5.1, ctr: 6.7 },
    { page: "/contact", clicks: 280, impressions: 4100, position: 7.3, ctr: 6.8 }
  ],
  devices: {
    mobile: 65,
    desktop: 30,
    tablet: 5
  },
  countries: {
    "France": 65,
    "Belgique": 12,
    "Suisse": 8,
    "Canada": 7,
    "Autres": 8
  }
};

// Fonction pour analyser les données de la Search Console
export const analyzeSearchConsoleData = () => {
  const data = mockSearchData;
  
  // Calcul de la tendance des clics
  let clickTrend = 0;
  const clicks = data.timeSeries.clicks;
  if (clicks.length > 1) {
    const firstHalfAvg = clicks.slice(0, Math.floor(clicks.length / 2)).reduce((sum, val) => sum + val, 0) / Math.floor(clicks.length / 2);
    const secondHalfAvg = clicks.slice(Math.floor(clicks.length / 2)).reduce((sum, val) => sum + val, 0) / (clicks.length - Math.floor(clicks.length / 2));
    clickTrend = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  }
  
  // Calcul de la tendance de positions
  const topKeywords = data.keywords.sort((a, b) => a.position - b.position).slice(0, 3);
  
  // Identifier les pages qui ont besoin d'optimisation (position entre 5 et 15)
  const pagesNeedingOptimization = data.pages
    .filter(page => page.position > 5 && page.position <= 15)
    .sort((a, b) => a.position - b.position);
  
  return {
    overview: {
      clicks: data.clicks,
      impressions: data.impressions,
      ctr: data.ctr,
      position: data.position,
      clickTrend: clickTrend.toFixed(1)
    },
    topKeywords,
    pagesNeedingOptimization,
    devices: data.devices,
    countries: data.countries,
    timeSeries: data.timeSeries
  };
};

export const analyzeSearchConsole = analyzeSearchConsoleData;

export default analyzeSearchConsoleData;
