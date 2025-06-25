
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  type: 'standard' | 'long-tail' | 'question' | 'semantic' | 'ai-generated' | 'intent-based' | 'competitor';
  intent: 'informational' | 'commercial' | 'navigational' | 'transactional' | 'mixed';
  opportunity: number;
  trend?: number[];
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
}

export interface ContentSuggestion {
  title: string;
  description: string;
  longDescription: string;
  faqQuestions: string[];
  headings: string[];
  type: 'blog' | 'product' | 'service' | 'guide';
}

export interface CompetitorData {
  name: string;
  url: string;
  domain: string;
  strength: number;
  organic_traffic: number;
  estimatedTraffic: number;
  keywords: number;
  topKeywords: string[];
  gaps: string[];
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
  toolsCost: number;
  maintenanceCost: number;
}
