
export interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedShortDescription?: string;
  suggestedLongDescription?: string;
  relevance: number;
  competition: number;
  cpc: number;
  volume: number;
}

export interface KeywordData {
  keyword: string;
  count: number;
  density: number;
  searchVolume?: number; 
  competition?: number;
  cpc?: number;
  relevance?: number;
}

export type BacklinkInfo = {
  url: string;
  anchorText: string;
  pageTitle?: string;
  targetUrl?: string;
  isDofollow: boolean;
  domainAuthority?: number;
  pageAuthority?: number;
  firstSeen?: Date | string;
  lastSeen?: Date | string;
};

export interface HierarchyItem {
  id: string;
  name: string;
  level: number;
  text?: string;
  tagName?: string;
  position?: number;
  children?: HierarchyItem[];
}

export interface HeadingStructure {
  headings: HierarchyItem[];
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  isEmpty: boolean;
  isValid: boolean;
  issues: string[];
}

export interface ImageDetails {
  src: string;
  alt: string;
  width: number;
  height: number;
  fileSize?: number;
  hasAltText: boolean;
  isOptimized?: boolean;
  optimizationScore?: number;
  compressionPotential?: number;
  lazyLoaded?: boolean;
}

export interface Performance {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  speedIndex: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
  domLoadTime: number;
  resourceCount: number;
  scriptCount: number;
  cssCount: number;
  imageCount: number;
  totalResourceSize: number;
  performanceScore: number;
  serverResponseTime: number;
  redirectTime: number;
  dnsLookupTime: number;
  sslTime: number;
  tcpTime: number;
  bounceRate: number;
  clickThroughRate: number;
}

export interface SearchConsoleData {
  clicks: Record<string, number>;
  impressions: Record<string, number>;
  ctr: Record<string, number>;
  position: Record<string, number>;
  keywords: {
    keyword: string;
    position: number;
    clicks: number;
    impressions: number;
  }[];
  topQueries: any;
  topPages: any;
  devices: any;
  countries: any;
}

export interface OpenAIKeywordResponse {
  keyword: string;
  suggestions: string[];
  relatedQueries: string[];
  searchVolume: number;
  competition: number;
  cpc: number;
  userIntent: string[];
}
