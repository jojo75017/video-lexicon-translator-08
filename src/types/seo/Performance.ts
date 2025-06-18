
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
