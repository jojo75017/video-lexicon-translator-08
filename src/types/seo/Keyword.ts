
export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  relevance?: number;
  trend?: number[];
  seasonality?: 'high' | 'medium' | 'low';
  longTail?: boolean;
  opportunity?: number;
  type?: 'standard' | 'long-tail' | 'question' | 'competitor' | 'semantic' | 'intent-based';
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
  searchVolume?: number;
  count?: number;
  position?: number;
}

export interface KeywordTrend {
  keyword: string;
  data: number[];
  period: string;
  growth: number;
  seasonal?: boolean;
}

export interface LocalizedKeyword {
  keyword: string;
  language: string;
  country: string;
  volume: number;
  difficulty: number;
  culturalRelevance: number;
  localCompetition: number;
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

export interface KeywordCluster {
  name: string;
  keywords: KeywordSuggestion[];
  intent: string;
  difficulty: number;
  volume: number;
}

export interface KeywordAnalysis {
  keyword: string;
  metrics: {
    volume: number;
    difficulty: number;
    opportunity: number;
    trend: number;
  };
  insights: string[];
  recommendations: string[];
}

export type ExpansionType = 'standard' | 'long-tail' | 'question' | 'competitor' | 'semantic' | 'intent-based';

export interface KeywordExpansion {
  type: ExpansionType;
  keywords: string[];
  description: string;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  competition: number;
  cpc: number;
  trend: number[];
  density?: number;
  count?: number;
  position?: number;
}
