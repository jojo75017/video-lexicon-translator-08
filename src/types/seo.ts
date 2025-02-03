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
  socialTags: SocialTags;
  keywordSuggestions: KeywordSuggestion[];
  performance: Performance;
  securityHeaders: {
    https: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
    contentSecurityPolicy: boolean;
  };
}
