
export interface SeoAnalysisResult {
  title?: string;
  description?: string;
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  wordCount?: number;
  readabilityScore?: number;
  imageCount?: number;
  hasCanonical?: boolean;
  hasSitemap?: boolean;
  hasRobots?: boolean;
  loadTime?: number;
  mobileCompatible?: boolean;
  secureConnection?: boolean;
  brokenLinksCount?: number;
  keywordDensity?: {
    [keyword: string]: number;
  };
  
  // Added missing properties that were causing errors
  backlinks?: number;
  authorityScore?: number;
  doFollowBacklinks?: number;
  noFollowBacklinks?: number;
}

// Add all the missing interface definitions
export interface SeoAnalysis {
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  headings: HeadingStructure[];
  paragraphs: {
    text: string;
    position: number;
  }[];
  imgCount: number;
  imgWithoutAlt: number;
  imagesDetails: ImageDetails[];
  metaTagsCount: number;
  metaTagsAnalysis: MetaTagsAnalysis;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  brokenLinks: BrokenLink[];
  keywords: string[];
  googlePosition: number | null;
  authorityScore: number;
  organicTraffic: number;
  backlinks: number;
  backlinkDetails: BacklinkInfo[];
  topBacklinkDomains: {domain: string, count: number}[];
  doFollowBacklinks: number;
  noFollowBacklinks: number;
  wordCount: number;
  textToHtmlRatio: number;
  internalLinks: number;
  externalLinks: number;
  analytics: any;
  searchConsole: SearchConsoleData;
  socialMetrics: SocialMetrics;
  performance: Performance;
  securityHeaders: SecurityHeaders;
  semanticStructure: Record<string, number>;
  linkAnalysis: {
    internal: number;
    external: number;
    broken: number;
    redirects: number;
    links: {
      url: string;
      text: string;
      isExternal: boolean;
      isNofollow: boolean;
    }[];
  };
  readabilityScore: number;
  topKeywords: KeywordData[];
  technologies: string[];
  mobileAnalysis: {
    viewportMeta: boolean;
    responsiveImages: boolean;
    touchTargetSize: boolean;
    fontScale: boolean;
    score: number;
  };
  mobilePerformance: {
    viewportMeta: boolean;
    responsiveImages: boolean;
    touchTargetSize: boolean;
    fontScale: boolean;
    score: number;
  };
  socialTags: {
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
  };
  contentQuality: {
    readingTime: number;
    complexity: number;
    uniqueness?: number;
  };
  schemaMarkup: boolean;
  accessibility: {
    contrast: {
      issues: number;
      score: number;
    };
    aria: {
      issues: number;
      present: boolean;
    };
    labels: number;
    score: number;
  };
  indexability: {
    canIndex: boolean;
    reasons: string[];
  };
  keywordSuggestions: KeywordSuggestion[];
  technicalSuggestions: string[];
}

export interface HeadingStructure {
  text: string;
  level: number;
  position: number;
}

export interface BacklinkInfo {
  domain: string;
  url: string;
  anchorText: string;
  followType: 'follow' | 'nofollow';
  authority: number;
  date: string;
  // Add properties that were causing errors
  isDoFollow?: boolean;
  firstSeen?: string;
}

export interface ImageAnalysis {
  url: string;
  dimensions: {
    width: number;
    height: number;
  };
  size: number;
  format: string;
  lazyLoaded: boolean;
  compressed: boolean;
  // Add properties that were causing errors
  hasAlt?: boolean;
  alt?: string;
}

export interface ImageDetails {
  url: string;
  alt: string | null;
  dimensions: {
    width: number;
    height: number;
  };
  size: number;
  format: string;
  lazyLoaded?: boolean;
  compressed?: boolean;
}

export interface KeywordData {
  keyword: string;
  count: number;
  density: number;
}

export interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  competition: number;
  cpc: number;
  relevance: number;
  // Add properties that were causing errors
  difficulty?: number;
  volume?: number;
  trend?: string;
}

export interface Performance {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  speedIndex?: number;
  timeToInteractive?: number;
  domLoadTime: number;
  resourceCount: number;
  scriptCount: number;
  cssCount: number;
  imageCount: number;
  cacheLifetime: number;
  score: number;
  resourceBreakdown?: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
  };
  // Add properties that were causing errors
  totalSize?: number;
  styleCount?: number;
  responseTime?: number;
  impressions?: number;
  clickThroughRate?: number;
}

export interface SocialMetrics {
  facebook: {
    shares: number;
    comments: number;
    likes: number;
  };
  twitter: {
    shares: number;
    likes: number;
    // Add missing property
    replies?: number;
  };
  linkedin: {
    shares: number;
    // Add missing property
    engagements?: number;
  };
  pinterest: {
    pins: number;
  };
}

export interface MetaTagsAnalysis {
  hasTitleTag: boolean;
  hasDescriptionTag: boolean;
  hasOpenGraphTags: boolean;
  hasTwitterTags: boolean;
  hasCanonicalTag: boolean;
  hasRobotsTag: boolean;
  hasViewportTag: boolean;
  hasHreflangTags: boolean;
  hasStructuredData: boolean;
}

export interface SearchConsoleData {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  keywords: {
    keyword: string;
    position: number;
    clicks: number;
    impressions: number;
  }[];
  // Add missing property
  topQueries?: any[];
  topPages?: any[];
  devices?: any;
}

export interface SecurityHeaders {
  https: boolean;
  hsts: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  contentSecurityPolicy: boolean;
  referrerPolicy: boolean;
  permissions: boolean;
}

export interface SiteStructure {
  name: string;
  children: {
    name: string;
    path: string;
    children: {
      name: string;
      path: string;
      children: any[];
    }[];
  }[];
}

// Additional interface for broken links
export interface BrokenLink {
  url: string;
  statusCode: number;
  message: string;
}

// Create a KeywordAnalysis interface that matches what's expected
export interface KeywordAnalysis extends KeywordData {
  // Make sure it has all properties needed
}
