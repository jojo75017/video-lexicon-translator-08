
export interface SearchConsoleData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  change?: number;
}

export interface RankingData {
  totalImpressions: number;
  totalClicks: number;
  averageCTR: string;
  averagePosition: number;
  keywords?: SearchConsoleData[];
  topPages?: SearchConsoleData[];
  topQueries: SearchConsoleData[];
  optimizationOpportunities: SearchConsoleData[];
  clicks: number;
  impressions: number;
  position: number;
  historicalData?: Array<{
    date: string;
    position: number;
  }>;
}
