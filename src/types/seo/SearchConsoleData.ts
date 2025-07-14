
export interface SearchConsoleData {
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  queries?: Array<{
    query: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
  pages?: Array<{
    page: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
}
