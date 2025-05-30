
export interface KeywordFrequency {
  keyword: string;
  frequency: number;
  density?: number;
  count?: number;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: number;
  intent?: KeywordIntent;
  trends?: number[];
  density?: number;
  count?: number;
  position?: number;
  frequency?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: number;
  intent?: KeywordIntent;
  trends?: number[];
  clicks?: number;
  searchVolume?: number;
  relevance?: number; 
  position?: number;
  type?: 'question' | 'standard' | 'long-tail' | 'related' | 'semantic' | 'intent-based' | 'competitor';
  opportunity?: number;
  trend?: number[];
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
  density?: number;
  count?: number;
  frequency?: number;
}

export type KeywordIntent = 'informational' | 'navigational' | 'transactional' | 'commercial';

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

export interface SerpsResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

export interface KeywordTrend {
  data: number[];
  growth: number;
  seasonal: boolean;
  keyword?: string;
  period?: string;
  volume?: number;
}

export interface CompetitorData {
  domain: string;
  title: string;
  description: string;
  keywords: string[];
  ranking: number;
  traffic: number;
  authority: number;
  name: string;
  url: string;
  strength: number;
  organic_traffic: number;
}
