
export interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number; }[];
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number; }[];
  dateRange: {
    start: string;
    end: string;
  };
  totalQueries: number;
  totalPages: number;
}
