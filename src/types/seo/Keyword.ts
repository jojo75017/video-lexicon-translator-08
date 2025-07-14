
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
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance?: number;
  cpc?: number;
  competition?: string;
  intent?: KeywordIntent;
  trends?: number[];
  clicks?: number;
  searchVolume?: number;
  type?: 'primary' | 'longtail' | 'competitor' | 'semantic';
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
  domain?: string;
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

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
}

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
  keywords: string[];
  topKeywords: string[];
  gaps: string[];
  backlinks?: number;
  authority?: number;
}
