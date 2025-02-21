export interface HeadingStructure {
  text: string;
  level: number;
  position: number;
}

export interface ImageAnalysis {
  url: string;
  hasAlt: boolean;
  alt?: string;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  format?: string;
  compression?: number;
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
}

export interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: Array<{
    query: string;
    clicks: number;
    impressions: number;
  }>;
  topPages: Array<{ 
    url: string;
    clicks: number;
    impressions: number;
  }>;
  devices: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  countries: Array<{
    country: string;
    clicks: number;
  }>;
}

export interface SocialMetrics {
  facebook: {
    shares: number;
    likes: number;
    comments: number;
    reach?: number;
  };
  twitter: {
    shares: number;
    likes: number;
    replies: number;
    impressions?: number;
  };
  linkedin: {
    shares: number;
    engagements: number;
    clickThroughRate?: number;
  };
  instagram?: {
    likes: number;
    comments: number;
    reach: number;
  };
}

export interface Performance {
  totalSize: number;
  scriptCount: number;
  styleCount: number;
  responseTime: number;
  impressions: number;
  clickThroughRate: number;
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  speedIndex?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  score: number;
  resourceBreakdown?: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
  };
}

export interface BrokenLink {
  url: string;
  statusCode: number;
  location: string;
  lastChecked?: string;
  type?: 'internal' | 'external';
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

export interface KeywordSuggestion {
  keyword: string;
  relevance: number;
  volume: number;
  searchVolume?: number;
  difficulty?: number;
  trend?: 'up' | 'down' | 'stable';
  competition?: number;
  cpc?: number;
  seasonality?: {
    peak: string[];
    low: string[];
  };
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
    permissions?: string[];
    cookies?: {
      secure: boolean;
      httpOnly: boolean;
      sameSite: string;
    };
  };
  semanticStructure: Record<string, number>;
  linkAnalysis: {
    total: number;
    internal: number;
    external: number;
    withTitle: number;
    withDescription: number;
    nofollow: number;
    dofollow: number;
    broken: number;
    redirects: number;
  };
  readabilityScore: number;
  topKeywords: {
    keyword: string;
    frequency: number;
    density: number;
    competition?: number;
    difficulty?: number;
  }[];
  technologies: {
    frameworks: string[];
    analytics: string[];
    advertising: string[];
    cms: string[];
    server: string[];
    libraries?: string[];
    hosting?: string;
    cdn?: string[];
  };
  mobilePerformance: {
    viewportMeta: boolean;
    responsiveImages: boolean;
    touchTargetSize: boolean;
    fontScale: boolean;
    score: number;
    speedScore?: number;
    usabilityScore?: number;
    viewportScore?: number;
  };
  metaTagsAnalysis: Record<string, string>;
  contentQuality?: {
    uniqueness: number;
    grammar: number;
    spelling: number;
    readingTime: number;
    complexity: number;
  };
  schemaMarkup?: {
    present: boolean;
    types: string[];
    errors: string[];
    warnings: string[];
  };
  accessibility?: {
    score: number;
    errors: string[];
    warnings: string[];
    aria: {
      present: boolean;
      missing: string[];
    };
    contrast: {
      pass: boolean;
      failures: string[];
    };
  };
  indexability?: {
    canIndex: boolean;
    indexablePages: number;
    reasons: string[];
    recommendations: string[];
  };
  socialTags: SocialTags;
  keywordSuggestions: {
    keyword: string;
    relevance: number;
    volume: number;
    searchVolume?: number;
    difficulty?: number;
    trend?: 'up' | 'down' | 'stable';
    competition?: number;
    cpc?: number;
    seasonality?: {
      peak: string[];
      low: string[];
    };
  }[];
  mobileAnalysis: {
    viewportMeta: boolean;
    responsiveImages: boolean;
    touchTargetSize: boolean;
    fontScale: boolean;
    score: number;
    speedScore?: number;
    usabilityScore?: number;
    viewportScore?: number;
  };
  technicalSuggestions: string[];
}
