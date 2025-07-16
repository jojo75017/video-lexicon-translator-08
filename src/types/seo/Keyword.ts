
export interface KeywordFrequency {
  keyword: string;
  frequency: number;
  density?: number;
}

export interface KeywordData {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number;
  intent?: KeywordIntent;
  trends?: number[];
  frequency: number;
  density?: number;
  count?: number;
  position?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string;
  intent?: KeywordIntent;
  trends?: number[];
  clicks?: number;
  searchVolume?: number;
  relevance?: number;
  type?: 'primary' | 'longtail' | 'competitor' | 'semantic' | 'ai-generated' | 'long-tail' | 'question';
  opportunity?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  trend?: 'rising' | 'stable' | 'declining';
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
}

// Export CompetitorData and SerpResult from CompetitorData.ts
export type { CompetitorData } from './CompetitorData';
