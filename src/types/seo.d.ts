
// Types for SEO Analysis

export interface SeoAnalysis {
  url: string;
  title: string;
  description: string;
  keywords: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  internalLinks: number;
  externalLinks: number;
  imgCount: number;
  imgWithoutAlt: number;
  wordCount: number;
  metaTagsAnalysis: MetaTagsAnalysis;
  topKeywords: KeywordFrequency[];
  backlinks: BacklinkInfo[] | number;
  doFollowBacklinks: number;
  noFollowBacklinks: number;
  socialMetrics: SocialMetrics;
  socialTags?: SocialTags;
  imagesDetails: ImageDetails[];
  performance?: PerformanceData;
  mobileAnalysis?: MobileAnalysis;
  technicalSuggestions: string[];
  readabilityScore: number;
  searchConsoleData: SearchConsoleData;
  topBacklinkDomains: string[];
  keywordSuggestions?: KeywordSuggestion[];
  brokenLinks?: BrokenLink[];
  internalLinkAnalysis?: InternalLinkAnalysis; // New property for internal link analysis
}

export interface MetaTagsAnalysis {
  hasTitleTag: boolean;
  hasDescriptionTag: boolean;
  hasCanonicalTag: boolean; // Changed to match implementation
  hasRobotsTag: boolean;
  hasOpenGraphTags: boolean;
  hasTwitterTags?: boolean;
  titleLength: number;
  descriptionLength: number;
  canonicalUrl: string | null;
  robotsContent: string | null;
}

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
}

export interface BacklinkInfo {
  domain: string;
  url: string;
  anchor: string; // Added to match implementation
  doFollow: boolean;
}

export interface SocialMetrics {
  facebook: {
    likes: number;
    shares: number;
    comments: number;
    engagements?: number; // Added to match implementation
  };
  twitter: {
    tweets: number;
    retweets: number;
    likes: number;
    shares?: number;
    replies?: number;
  };
  linkedin: {
    shares: number;
    engagements: number;
  };
  pinterest: {
    pins: number;
    saves?: number; // Made optional to match implementation
  };
}

export interface SocialTags {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

export interface ImageDetails {
  url: string;
  alt: string;
  hasAlt: boolean;
  width: number | null;
  height: number | null;
  isDecorative?: boolean; // Added to match implementation
  needsOptimization?: boolean; // Added to match implementation
  estimatedSize?: string;
  lazyLoaded?: boolean;
  index?: number;
  size?: number; // Added to fix typings
  format?: string; // Added to fix typings
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  resourceCount: number;
  score: number;
  speedIndex?: number; // Added to match Performance interface
  totalBlockingTime?: number; // Added to match Performance interface
  largestContentfulPaint?: number; // Added to match Performance interface
  cumulativeLayoutShift?: number; // Added to match Performance interface
  performanceScore?: number; // Added to match Performance interface
}

export interface MobileAnalysis {
  score: number;
  isMobileFriendly: boolean;
  issues: string[];
}

export interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  keywords: SearchKeyword[]; // Changed to match implementation
  topPages: TopPage[];
  trend: TrendData[];
  countries: Record<string, number>;
  topQueries?: TopQuery[];
}

export interface SearchKeyword { // Renamed from Keyword to avoid conflicts
  keyword: string;
  position: number;
  clicks: number;
  impressions: number;
}

export interface TopPage {
  url: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface TrendData {
  date: string;
  clicks: number;
  impressions: number;
  position: number;
}

export interface TopQuery extends SearchKeyword {
  trend: {
    date: string;
    position: number;
    clicks: number;
  }[];
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance: number; // Added to match implementation
}

export interface BrokenLink {
  url: string;
  anchor: string;
  statusCode: number;
}

export interface HierarchyItem {
  level: number;
  tagName?: string;
  text?: string;
  name?: string;
  children?: HierarchyItem[];
  parentFound?: boolean; // Added to match implementation
}

export interface HeadingStructure {
  hierarchy: HierarchyItem[];
  issues?: string[];
}

export interface StructureItem {
  id: string;
  content: string;
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  items?: string[];
}

// New interfaces for internal link analysis
export interface InternalLinkAnalysis {
  totalLinks: number;
  uniquePages: number;
  linkDistribution: LinkDistribution;
  linkDepth: LinkDepth;
  orphanPages: string[];
  pageMetrics: PageLinkMetric[];
  siloPagesFound: boolean;
  siloStructure?: SiloStructure[];
  recommendations: InternalLinkRecommendation[];
}

export interface LinkDistribution {
  navigationLinks: number;
  contentLinks: number;
  footerLinks: number;
  sidebarLinks: number;
  otherLinks: number;
}

export interface LinkDepth {
  averageDepth: number;
  maxDepth: number;
  depthDistribution: Record<number, number>;
}

export interface PageLinkMetric {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  uniqueIncomingPages: number;
  uniqueOutgoingPages: number;
  depth: number;
  importance: number;
}

export interface SiloStructure {
  name: string;
  mainPage: string;
  subPages: string[];
}

export interface InternalLinkRecommendation {
  type: 'add' | 'remove' | 'modify' | 'info';
  priority: 'high' | 'medium' | 'low';
  impact: number;
  source?: string;
  target?: string;
  description: string;
  reason: string;
}
