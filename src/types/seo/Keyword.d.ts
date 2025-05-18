
export interface KeywordData {
  keyword: string;
  count: number;
  density: number;
  volume?: number;
  difficulty?: number;
  position?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number;
  relevance?: number;
  position?: number;
  opportunity?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
  type?: 'question' | 'standard' | 'long-tail' | 'related';
  intent?: 'informational' | 'navigational' | 'transactional' | 'commercial';
  serps?: any[];
  trend?: number[];
  searchVolume?: number;
  clicks?: number;
}

export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
  count?: number;
  position?: number;
}

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

export interface CompetitorData {
  name: string;
  url: string;
  strength: number;
  organic_traffic: number;
  keywords: number;
}

export interface KeywordStrategyResponse {
  mainKeywords: KeywordSuggestion[];
  longTail: KeywordSuggestion[];
  questions: KeywordSuggestion[];
  related: KeywordSuggestion[];
  semantic: string[];
  competitors: CompetitorData[];
  serps: SerpResult[];
  contentIdeas: {
    title: string;
    type: string;
  }[];
  byIntent: {
    informational: KeywordSuggestion[];
    transactional: KeywordSuggestion[];
    navigational: KeywordSuggestion[];
  };
}

export interface KeywordIntent {
  informational: KeywordSuggestion[];
  transactional: KeywordSuggestion[];
  navigational: KeywordSuggestion[];
}

export interface SerpsResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

export interface KeywordTrend {
  dates: string[];
  values: number[];
}
