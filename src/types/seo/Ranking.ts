
export interface RankingData {
  totalImpressions: number;
  totalClicks: number;
  averageCTR: string;
  averagePosition: number;
  impressions: number;
  clicks: number;
  position: number;
  historicalData: Array<{
    date: string;
    position: number;
  }>;
  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    change: number;
  }>;
  optimizationOpportunities: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    change: number;
  }>;
  topPages?: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

export interface SearchConsoleData {
  totalImpressions: number;
  totalClicks: number;
  averageCTR: number;
  averagePosition: number;
}
