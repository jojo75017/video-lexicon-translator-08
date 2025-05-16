
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
}

export interface PerformanceData {
  score?: number;
  loadTime?: number;
  firstContentfulPaint?: number;
  domLoadTime?: number;
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
}
