
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
}

export interface MetaTagsAnalysis {
  hasTitleTag: boolean;
  hasDescriptionTag: boolean;
  hasCanonicalTag: boolean;
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
  anchor: string;
  doFollow: boolean;
}

export interface SocialMetrics {
  facebook: {
    likes: number;
    shares: number;
    comments: number;
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
  isDecorative?: boolean;
  needsOptimization?: boolean;
  estimatedSize?: string;
  lazyLoaded?: boolean;
  index?: number;
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  resourceCount: number;
  score: number;
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
  keywords: Keyword[];
  topPages: TopPage[];
  trend: TrendData[];
  countries: Record<string, number>;
  topQueries?: TopQuery[];
}

export interface Keyword {
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

export interface TopQuery extends Keyword {
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
  parentFound?: boolean;
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
