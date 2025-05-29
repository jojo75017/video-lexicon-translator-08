
export * from './Keyword';
export * from './InternalLinks';
export * from './Backlinks';
export * from './Social';

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

export interface PerformanceData {
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
    js?: number;
    css?: number;
    images?: number;
    fonts?: number;
    other?: number;
    scripts?: number;
    styles?: number;
  };
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
