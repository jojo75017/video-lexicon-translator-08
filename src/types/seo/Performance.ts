
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
  scriptCount?: number;
  styleCount?: number;
  responseTime?: number;
  impressions?: number;
  clickThroughRate?: number;
  imageCount?: number;
  cls?: number;
  fid?: number;
  recommendations?: string[];
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

export interface Performance extends PerformanceData {}

export interface MobileAnalysis {
  isMobileFriendly: boolean;
  mobileScore: number;
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface MetaTagsAnalysis {
  hasTitle: boolean;
  hasDescription: boolean;
  hasDescriptionTag: boolean;
  hasOpenGraphTags: boolean;
}

export interface VoiceSearchData {
  keyword: string;
  isVoiceOptimized: boolean;
  questionFormat: string;
  conversationalVariants: string[];
  avgQuestionLength: number;
  featuredSnippetChance: number;
  voiceScore: number;
  naturalLanguageQueries: string[];
  conversationalKeywords: string[];
}

export interface MobileOptimization extends MobileAnalysis {
  keyword: string;
  mobileVolume: number;
  mobilevsDesktop: number;
  localSearchIntent: boolean;
  voiceSearchCompatible: boolean;
  mobileCompetition: number;
  quickAnswerFormat: string;
}

export interface RoiParameters {
  seoInvestment: number;
  acquisitionCost: number;
  conversionRate: number;
  averageOrderValue: number;
  organicTraffic: number;
  timeFrame: number;
  targetKeywords: string[];
  averagePosition: number;
  clickThroughRate: number;
  contentCost: number;
  linkBuildingCost: number;
  technicalSeoHours: number;
}

export interface RoiResults {
  roi: number;
  totalRevenue: number;
  totalCost: number;
  monthlyRevenue: number;
  paybackPeriod: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
}

export interface GeneratedContent {
  title: string;
  intro: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
}

export interface PageStructure {
  title: string;
  h1: string[];
  h2: string[];
  h3: string[];
  images: number;
  links: number;
  optimizationStatus?: string;
}
