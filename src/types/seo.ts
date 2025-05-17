
export interface SeoAnalysis {
  url?: string;
  title?: string;
  description?: string;
  keywords?: string[] | string;
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  imgCount?: number;
  wordCount?: number;
  internalLinks?: number;
  externalLinks?: number;
  titleLength?: number;
  descriptionLength?: number;
  loadTime?: number;
  performance?: PerformanceData;
  canonicalUrl?: string;
  isSecure?: boolean;
  hasViewport?: boolean;
  hasSchema?: boolean;
  socialTags?: SocialTags;
  backlinks?: BacklinkInfo[] | number;
  doFollowBacklinks?: number;
  noFollowBacklinks?: number;
  images?: ImageInfo[];
  imagesDetails?: ImageInfo[];
  brokenLinks?: BrokenLink[];
  socialMetrics?: SocialMetrics;
  topBacklinkDomains?: BacklinkDomain[] | string[];
  keywordSuggestions?: KeywordSuggestion[];
  metadata?: any;
  headings?: any;
  headingStructure?: any;
  authorityScore?: number;
  topKeywords?: KeywordData[];
  organicTraffic?: number;
  imgWithoutAlt?: ImageInfo[];
  
  // Propriétés supplémentaires pour la compatibilité avec les services
  success?: boolean;
  error?: string;
  data?: any;
}

export interface PerformanceData {
  score?: number;
  loadTime?: number;
  firstContentfulPaint?: number;
  domLoadTime?: number;
  timeToInteractive?: number;
  totalSize?: number;
  scriptCount?: number;
  styleCount?: number;
  responseTime?: number;
  impressions?: number;
  clickThroughRate?: number;
  largestContentfulPaint?: number;
  resourceBreakdown?: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
    scripts?: number;  // Pour la compatibilité
    styles?: number;   // Pour la compatibilité
  };
}

export interface SocialTags {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface ImageInfo {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  type?: string;
  hasAlt?: boolean;
}

export interface BrokenLink {
  url: string;
  status?: number;
  statusCode?: number;
  location?: string;
  text?: string;
  internal?: boolean;
}

export interface SocialMetrics {
  facebook: {
    shares: number;
    comments: number;
    likes: number;
  };
  twitter: {
    tweets?: number;
    retweets?: number;
    likes: number;
    shares?: number;
    replies?: number;
  };
  pinterest: {
    pins: number;
    saves?: number;
  };
  linkedin: {
    shares: number;
    engagements?: number;
  };
}

export interface BacklinkInfo {
  url: string;
  domain?: string;
  title?: string;
  anchorText?: string;
  pageRank?: number;
  followType?: string;
  isDofollow?: boolean;
}

export interface BacklinkDomain {
  domain: string;
  count: number;
  quality?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  competition?: number;
  cpc?: number;
  difficulty?: number;
  trend?: number[];
  type?: 'standard' | 'long-tail';
  selected?: boolean;
  relevance?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  searchVolume?: number;
  clicks?: number;
}

// Types exportés pour la compatibilité avec les composants existants
export type ImageAnalysis = ImageInfo;
export type Performance = PerformanceData;
export type SeoAnalysisResult = SeoAnalysis;
export interface InternalLinkAnalysis {
  pages?: any[];
  recommendations?: InternalLinkRecommendation[];
  totalLinks?: number;
  uniquePages?: number;
  linkDepth?: number;
  averageDepth?: number;
  depthDistribution?: Record<string, number>;
  orphanPages?: OrphanPage[];
  siloPagesFound?: boolean;
  siloStructure?: SiloStructure[];
  pageMetrics?: PageMetric[];
  linkDistribution?: LinkDistribution;
}
export interface PageLinkMetric {
  url: string;
  incomingLinks: number;
  outgoingLinks: number;
  pageRank?: number;
  title?: string;
}
export interface InternalLinkRecommendation {
  sourcePage: string;
  targetPage: string;
  reason: string;
  relevanceScore?: number;
  priority?: string;
  description?: string;
  type?: string;
  impact?: string;
  source?: string;
  target?: string;
}

export interface PageMetric {
  url: string;
  inLinks: number;
  outLinks: number;
  importance: string;
}

export interface LinkDistribution {
  [key: string]: number;
}

export interface OrphanPage {
  url: string;
  title?: string;
  suggestions?: string[];
}

export interface SiloStructure {
  theme: string;
  pages: string[];
}

export interface KeywordData {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  trend?: number[];
  density?: number;
}

// Pour compatibilité avec le composant ContentStructureTool
export type StructureItem = {
  content: string;
  id: string;
  type: "list" | "h3" | "p" | "h2" | "h1" | "h4" | string;
  items?: string[];
};
