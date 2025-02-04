
interface SearchAnalyticsResult {
  clicks: number;
  impressions: number;
  position: number;
  ctr: number;
  topQueries: { query: string; clicks: number; impressions: number }[];
}

export const getSearchAnalytics = async (siteUrl: string): Promise<SearchAnalyticsResult> => {
  console.log('Simulating search analytics for:', siteUrl);
  
  // Retourner des données simulées incluant topQueries
  return {
    clicks: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 5000),
    position: Math.floor(Math.random() * 100),
    ctr: Math.random() * 0.1,
    topQueries: [
      {
        query: "recherche populaire 1",
        clicks: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 500)
      },
      {
        query: "recherche populaire 2",
        clicks: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 500)
      },
      {
        query: "recherche populaire 3",
        clicks: Math.floor(Math.random() * 100),
        impressions: Math.floor(Math.random() * 500)
      }
    ]
  };
};
