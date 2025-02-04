export interface HeadingStructure {
  text: string;
  level: number;
  position: number;
}

export interface ImageAnalysis {
  url: string;
  hasAlt: boolean;
  alt?: string;
}

export interface BacklinkInfo {
  url: string;
  domain: string;
  authority: number;
  isDoFollow: boolean;
  anchorText: string;
  firstSeen: string;
}

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageTimeOnPage: number;
  topCountries: { country: string; visits: number }[];
}

export interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: { query: string; clicks: number; impressions: number }[];
}

export interface SocialMetrics {
  facebook: {
    shares: number;
    likes: number;
    comments: number;
  };
  twitter: {
    shares: number;
    likes: number;
    replies: number;
  };
  linkedin: {
    shares: number;
    engagements: number;
  };
}

interface Performance {
  totalSize: number;
  scriptCount: number;
  styleCount: number;
  responseTime: number;
  impressions: number;
  clickThroughRate: number;
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
}

interface BrokenLink {
  url: string;
  statusCode: number;
  location: string;
}

interface SocialTags {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

interface KeywordSuggestion {
  keyword: string;
  relevance: number;
  searchVolume?: number;
  difficulty?: number;
}

export interface SeoAnalysis {
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  headings: HeadingStructure[];
  paragraphs: { text: string; position: number; }[];
  imgCount: number;
  imgWithoutAlt: number;
  imagesDetails: ImageAnalysis[];
  metaTagsCount: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  brokenLinks: BrokenLink[];
  keywords: string[];
  googlePosition: number | null;
  authorityScore: number;
  organicTraffic: number;
  backlinks: number;
  backlinkDetails: BacklinkInfo[];
  topBacklinkDomains: { domain: string; count: number }[];
  doFollowBacklinks: number;
  noFollowBacklinks: number;
  wordCount: number;
  textToHtmlRatio: number;
  internalLinks: number;
  externalLinks: number;
  analytics: AnalyticsData;
  searchConsole: SearchConsoleData;
  socialMetrics: SocialMetrics;
  performance: Performance;
  securityHeaders: {
    https: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
    contentSecurityPolicy: boolean;
  };
  socialTags: SocialTags;
  keywordSuggestions: KeywordSuggestion[];
  semanticStructure: Record<string, number>;
  linkAnalysis: {
    total: number;
    internal: number;
    external: number;
    withTitle: number;
    withDescription: number;
    nofollow: number;
    dofollow: number;
  };
  readabilityScore: number;
  topKeywords: {
    keyword: string;
    frequency: number;
    density: number;
  }[];
  technologies: {
    frameworks: string[];
    analytics: string[];
    advertising: string[];
    cms: string[];
    server: string[];
  };
  mobilePerformance: {
    viewportMeta: boolean;
    responsiveImages: boolean;
    touchTargetSize: boolean;
    fontScale: boolean;
    score: number;
  };
  metaTagsAnalysis: Record<string, string>;
}
