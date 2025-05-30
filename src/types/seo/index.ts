
export * from './Keyword';
export * from './InternalLinks';
export * from './Backlinks';
export * from './Social';
export * from './Performance';
export * from './ImageAnalysis';
export * from './SeoAnalysisResult';
export * from './SearchConsole';

export interface SocialMetricsProps {
  metrics: {
    facebook: number;
    twitter: number;
    pinterest: number;
    linkedin: number;
  };
}

export interface OrganicSearchProps {
  keywords: string[];
  totalKeywords: number;
  averagePosition: number;
  visibility: number;
}

export interface AnalysisOptions {
  includeKeywords?: boolean;
  includeCompetitors?: boolean;
  includeBacklinks?: boolean;
  depth?: number;
}

export interface PageStructure {
  title: string;
  headings: Array<{
    level: number;
    text: string;
    id?: string;
  }>;
  links: Array<{
    text: string;
    href: string;
    internal: boolean;
  }>;
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  meta: {
    description?: string;
    keywords?: string;
    canonical?: string;
  };
  optimizationStatus?: string;
}

// Types pour le calculateur de ROI
export interface RoiParameters {
  seoInvestment: number;
  acquisitionCost: number;
  conversionRate: number;
  averageOrderValue: number;
  organicTraffic: number;
  timeFrame: number;
}

export interface RoiResults {
  roi: number;
  totalRevenue: number;
  totalConversions: number;
  costSaved: number;
  breakEvenMonth: number | null;
  monthlyResults: Array<{
    month: number;
    traffic: number;
    conversions: number;
    revenue: number;
    cumulativeRevenue: number;
    cumulativeInvestment: number;
    monthlyRoi: number;
  }>;
}

// Types pour le support multi-langues
export interface LocalizationConfig {
  language: string;
  country: string;
  searchEngine: 'google' | 'bing' | 'yandex' | 'baidu';
  currency: string;
}

export interface LocalizedKeyword {
  keyword: string;
  language: string;
  country: string;
  volume: number;
  difficulty: number;
  cpc: number;
  localCompetition: number;
  culturalRelevance: number;
}

// Types pour la recherche vocale
export interface VoiceSearchData {
  keyword: string;
  isVoiceOptimized: boolean;
  questionFormat: string;
  conversationalVariants: string[];
  avgQuestionLength: number;
  featuredSnippetChance: number;
}

// Types pour l'optimisation mobile
export interface MobileOptimization {
  keyword: string;
  mobileVolume: number;
  mobilevsDesktop: number;
  localSearchIntent: boolean;
  voiceSearchCompatible: boolean;
  mobileCompetition: number;
  quickAnswerFormat: string;
}

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
  hasAlt?: boolean;
}

export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  dofollow: boolean;
  authority?: number;
  isDofollow?: boolean;
  anchorText?: string;
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
