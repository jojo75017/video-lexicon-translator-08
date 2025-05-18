
export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  competition?: number;
  cpc?: number;
  difficulty?: number;
  trend?: number[];
  type?: 'standard' | 'long-tail' | 'question' | 'related';
  selected?: boolean;
  relevance?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  searchVolume?: number;
  clicks?: number;
  position?: number;
  opportunity?: number;
  intent?: 'informational' | 'navigational' | 'transactional' | 'commercial';
  serps?: SerpResult[];
  seasonal?: boolean;
  seasonality?: number[];
}

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
}

export interface KeywordData extends KeywordFrequency {
  volume?: number;
  difficulty?: number;
  cpc?: number;
  trend?: number[];
  position?: number;
  count?: number;
}

export interface KeywordIntent {
  informational: KeywordSuggestion[];
  transactional: KeywordSuggestion[];
  navigational: KeywordSuggestion[];
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
  commonKeywords?: string[];
  logo?: string;
}

export interface KeywordOpportunity {
  keyword: string;
  score: number;
  difficulty: number;
  volume: number;
  potentialTraffic: number;
  currentRanking?: number;
}

export interface KeywordGroup {
  name: string;
  keywords: string[];
  totalVolume: number;
  averageDifficulty: number;
  mainKeyword: string;
}

export interface KeywordTrend {
  keyword: string;
  data: number[];
  growth: number;
  seasonal: boolean;
}
