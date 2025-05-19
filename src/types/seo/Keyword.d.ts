
export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent?: string;
  serp?: SerpResult[];
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  intent?: KeywordIntent;
  score?: number;
  trend?: 'up' | 'down' | 'stable';
  searchVolume?: number;
  competition?: number;
  competitionIndex?: number;
}

export interface KeywordIntent {
  commercial: number;
  informational?: number;
  navigational?: number;
  transactional?: number;
}

export interface SerpResult {
  title: string;
  url: string;
  position: number;
  description: string;
  domain?: string;
}
