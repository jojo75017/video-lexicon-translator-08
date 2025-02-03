interface SearchAnalyticsResult {
  clicks: number;
  impressions: number;
  position: number;
  ctr: number;
}

export const getSearchAnalytics = async (siteUrl: string): Promise<SearchAnalyticsResult> => {
  console.log('Simulating search analytics for:', siteUrl);
  
  // Retourner des données simulées
  return {
    clicks: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 5000),
    position: Math.floor(Math.random() * 100),
    ctr: Math.random() * 0.1
  };
};