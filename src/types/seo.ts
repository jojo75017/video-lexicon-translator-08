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

export interface SeoAnalysis {
  title: string;
  description: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  headings: HeadingStructure[];
  imgCount: number;
  imgWithoutAlt: number;
  imagesDetails: ImageAnalysis[];
  metaTagsCount: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  brokenLinks: number;
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
  socialMetaTags: {
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterCard: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
  };
  securityHeaders: {
    https: boolean;
    hsts: boolean;
    xFrameOptions: boolean;
    contentSecurityPolicy: boolean;
  };
  performance: {
    totalSize: number;
    scriptCount: number;
    styleCount: number;
    responseTime: number;
  };
}