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
    clicks: 0,
    impressions: 0,
    position: 0,
    ctr: 0
  };
};