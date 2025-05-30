
export interface SearchConsoleData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  change?: number;
}

export interface RankingData {
  totalImpressions?: number;
  totalClicks?: number;
  averageCTR?: string;
  averagePosition?: number;
  impressions?: number;
  clicks?: number;
  position?: number;
  historicalData?: Array<{
    date: string;
    position: number;
  }>;
  topQueries?: SearchConsoleData[];
  topPages?: SearchConsoleData[];
  optimizationOpportunities?: SearchConsoleData[];
}
