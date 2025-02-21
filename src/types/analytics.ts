
export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageTimeOnPage: number;
  topPages: Array<{
    url: string;
    visits: number;
    seoTraffic: number;
  }>;
  topCountries: Array<{ 
    country: string; 
    visits: number; 
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  timeOnSite: {
    '0-30s': number;
    '30s-2m': number;
    '2m-5m': number;
    '5m+': number;
  };
  topKeywords: Array<{
    keyword: string;
    volume: number;
    competition: number;
  }>;
}
