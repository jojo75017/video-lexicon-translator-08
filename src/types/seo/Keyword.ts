
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  type: 'primary' | 'secondary' | 'long-tail' | 'question' | 'commercial' | 'informational';
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  opportunity: number;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trends: number[];
  relatedKeywords: string[];
  questions: string[];
  competition: number;
}

// Ajout des types manquants pour corriger les erreurs
export interface ContentGap {
  keyword: string;
  type: 'missing' | 'weak' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  searchVolume: number;
  difficulty: number;
  currentRanking?: number;
  competitorRanking: number;
  contentSuggestion: string;
}

export interface KeywordTrend {
  month: string;
  volume: number;
  data: number[];
  growth: number;
  seasonal: boolean;
}

export interface SemanticCluster {
  id: string;
  name: string;
  mainTopic: string;
  contentType: string;
  difficulty: number;
  opportunity: number;
  keywords: string[];
}

export interface SerpFeature {
  type: string;
  title: string;
  description?: string;
  position: number;
  content: string;
}

export interface VoiceSearchData {
  keyword: string;
  voiceScore: number;
  naturalLanguageQueries: string[];
  conversationalKeywords: string[];
  isVoiceOptimized: boolean;
  questionFormat: string;
  conversationalVariants: string[];
  avgQuestionLength: number;
  featuredSnippetChance: number;
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
}

export interface SerpResult {
  position: number;
  title: string;
  url: string;
  description: string;
  domain: string;
  authority: number;
  estimatedTraffic: number;
  titleLength: number;
  descriptionLength: number;
  hasStructuredData: boolean;
  loadTime: number;
  mobileOptimized: boolean;
}
