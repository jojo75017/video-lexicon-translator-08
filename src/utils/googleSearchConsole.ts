
interface SearchAnalyticsData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  queries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
  }>;
  pages?: Array<{
    url: string;
    clicks: number;
    impressions: number;
  }>;
  devices?: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  countries?: Array<{
    country: string;
    clicks: number;
  }>;
}

export class GoogleSearchConsole {
  async getSearchAnalytics(url: string): Promise<SearchAnalyticsData> {
    try {
      // Utilisez l'API Google Search Console ici
      const response = await fetch(`/api/search-console?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur Search Console:', error);
      throw error;
    }
  }
}
