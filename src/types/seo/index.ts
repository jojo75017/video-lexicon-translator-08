
export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  domLoadTime: number;
  speedIndex: number;
  timeToInteractive: number;
  score: number;
  resourceCount: number;
  totalSize: number;
  resourceBreakdown: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
    js: string;
    css: string;
  };
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
  domLoadTime: number;
  speedIndex: number;
  timeToInteractive: number;
  score: number;
  resourceCount: number;
  totalSize: number;
  resourceBreakdown: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
    js: string;
    css: string;
  };
}

export interface PageStructure {
  title: string;
  h1: string[];
  h2: string[];
  h3: string[];
  images: number;
  links: number;
  optimizationStatus: 'good' | 'warning' | 'error';
}

export interface MobileAnalysis {
  isMobileFriendly: boolean;
  mobileScore: number;
  score: number;
  issues: string[];
}

export interface MetaTags {
  hasTitle: boolean;
  hasDescription: boolean;
  hasDescriptionTag: boolean;
  hasOpenGraphTags: boolean;
}

export interface SocialMetrics {
  facebook: number;
  twitter: number;
  pinterest: number;
  linkedin: number;
}

export interface SocialMetricsProps {
  metrics: SocialMetrics;
}

export interface OrganicSearchProps {
  keyword: string;
  keywords: string[];
  totalKeywords: number;
  averagePosition: number;
  visibility: number;
}

export interface RoiParameters {
  targetKeywords: number;
  averagePosition: number;
  clickThroughRate: number;
  conversionRate: number;
  averageOrderValue: number;
  acquisitionCost: number;
  contentCost: number;
  linkBuildingCost: number;
  timeInvestment: number;
  seoInvestment: number;
  organicTraffic?: number;
  timeFrame?: number;
}

export interface CompetitorData {
  domain: string;
  strength: number;
  keywords: string[];
  estimatedTraffic: number;
  topKeywords: { keyword: string; position: number; volume: number; }[];
  gaps: string[];
  title?: string;
}

export interface PageLinkMetric {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  linkStrength: number;
}

export interface PageMetric {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  linkStrength: number;
}

export interface AnalysisOptions {
  includeBacklinks: boolean;
  includePerformance: boolean;
  includeMobile: boolean;
}

export interface RoiResults {
  monthlyRevenue: number;
  yearlyRevenue: number;
  roi: number;
  breakEvenTime: number;
  totalRevenue?: number;
  totalConversions?: number;
  costSaved?: number;
  breakEvenMonth?: number;
  monthlyResults?: any[];
}

export interface LocalizationConfig {
  language: string;
  country: string;
  timezone: string;
}

export interface LocalizedKeyword {
  keyword: string;
  language: string;
  country: string;
  volume: number;
  difficulty: number;
  culturalRelevance: number;
  localCompetition: number;
  cpc?: number;
}

export interface VoiceSearchData {
  isVoiceOptimized: boolean;
  voiceScore: number;
  naturalLanguageQueries: string[];
  conversationalKeywords: string[];
  keyword?: string;
  questionFormat?: string;
  conversationalVariants?: string[];
  avgQuestionLength?: number;
  featuredSnippetChance?: number;
}

export interface MobileOptimization {
  keyword: string;
  isMobileFriendly: boolean;
  mobileScore: number;
  mobileVolume: number;
  mobilevsDesktop: number;
  localSearchIntent: boolean;
  voiceSearchCompatible: boolean;
  mobileCompetition: number;
  quickAnswerFormat: string;
  issues: string[];
  recommendations: string[];
}

export interface InternalLinkAnalysis {
  totalPages: number;
  totalInternalLinks: number;
  averageLinksPerPage: number;
  topLinkedPages: PageLinkMetric[];
  orphanedPages: string[];
  recommendations: string[];
  linkDepth: number;
  linkSuggestions: Array<{
    fromPage: string;
    toPage: string;
    anchorText: string;
    relevanceScore: number;
  }>;
}
