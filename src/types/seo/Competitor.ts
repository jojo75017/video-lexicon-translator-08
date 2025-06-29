
export interface CompetitorData {
  name: string;
  url: string;
  domain: string;
  title: string;
  description: string;
  ranking: number;
  traffic: number;
  strength: number;
  organic_traffic: number;
  estimatedTraffic: number;
  keywords: number;
  topKeywords: string[];
  gaps: string[];
  backlinks?: number;
  authority?: number;
}

export interface SerpFeature {
  type: string;
  present: boolean;
  position?: number;
  title: string;
  content: string;
}

export interface SemanticCluster {
  id: string;
  name: string;
  mainTopic: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'transactional';
  difficulty: number;
  opportunity: number;
  contentType: string;
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
  toolsCost: number;
}
