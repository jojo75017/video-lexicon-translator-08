
export interface KeywordFrequency {
  keyword: string;
  frequency: number;
  density?: number;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: number;
  intent?: KeywordIntent;
  trends?: number[];
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
