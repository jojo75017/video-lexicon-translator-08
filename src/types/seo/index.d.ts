
export interface BrokenLink {
  url: string;
  statusCode?: number;
  status?: string;
  location?: string;
  text?: string;
}

export interface SeoAnalysis {
  title?: string;
  description?: string;
  keywords?: string[];
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  imgCount?: number;
  wordCount?: number;
  internalLinks?: number;
  externalLinks?: number;
  backlinks?: number | BacklinkInfo[];
  doFollowBacklinks?: number;
  noFollowBacklinks?: number;
  performance?: PerformanceData;
  topBacklinkDomains?: string[] | {domain: string}[];
  brokenLinks?: BrokenLink[];
  socialTags?: SocialTags;
  imagesDetails?: ImageDetail[];
  keywordSuggestions?: KeywordSuggestion[];
  socialMetrics?: SocialMetrics;
}

export interface ImageDetail {
  url: string;
  alt?: string;
  size?: string;
  width?: number;
  height?: number;
}

export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  dofollow: boolean;
  authority?: number;
}

export interface StructureItem {
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  content: string;
  id: string;
  items?: string[];
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

export interface SocialMetrics {
  facebook?: {
    shares?: number;
    comments?: number;
    likes?: number;
  };
  twitter?: {
    tweets?: number;
    retweets?: number;
    likes: number;
    shares?: number;
    replies?: number;
  };
  pinterest?: {
    pins?: number;
    saves?: number;
  };
  linkedin?: {
    shares?: number;
    engagements?: number;
  };
}

// Interface pour l'analyse des liens internes
export interface InternalLinkAnalysis {
  totalLinks?: number;
  uniquePages?: number;
  averageLinksPerPage?: number;
  recommendations?: InternalLinkRecommendation[];
  pageMetrics?: PageMetric[];
  linkDistribution?: LinkDistribution;
  orphanPages?: OrphanPage[];
  siloPagesFound?: boolean;
  siloStructure?: SiloStructure[];
}

export interface InternalLinkRecommendation {
  from: string;
  to: string;
  reason: string;
  priority?: string;
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
