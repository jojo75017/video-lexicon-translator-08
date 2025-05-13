
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
  internalLinkAnalysis?: InternalLinkAnalysis; // Property for internal link analysis
  sourceCode?: string; // Added for internal link analyzer
  textContent?: string; // Added for content analysis
}

export interface MetaTagsAnalysis {
  hasTitleTag: boolean;
  hasDescriptionTag: boolean;
  hasCanonical: boolean; // Changed from hasCanonicalTag
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
    saves?: number; // Made optional
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
  isDecorative?: boolean; // Added for image analyzer
  needsOptimization?: boolean; // Added for image analyzer
  estimatedSize?: string;
  lazyLoaded?: boolean;
  index?: number;
  size?: number; 
  format?: string;
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  resourceCount: number;
  score: number;
  speedIndex: number;
  totalBlockingTime: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  performanceScore: number;
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
  keywords: SearchKeyword[]; 
  topPages: TopPage[];
  trend: TrendData[]; // Adding trend for internal links
  countries: Record<string, number>;
  topQueries?: TopQuery[];
}

export interface SearchKeyword {
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
  relevance: number;
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
  parentFound?: boolean; // Added for SeoStructureVisualizer
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

// Types for internal link analysis
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
  title: string | null;
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
