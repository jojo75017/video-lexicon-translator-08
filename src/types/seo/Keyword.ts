
export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number | string;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational' | 'mixed';
  type?: 'standard' | 'longtail' | 'question' | 'ai-generated' | 'long-tail' | 'semantic' | 'intent-based' | 'competitor';
  relevance?: number;
  opportunity?: number;
  trend?: number[] | string;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
  count?: number;
  density?: number;
  position?: number;
}

export interface KeywordData {
  keyword: string;
  count: number;
  density: number;
  volume?: number;
  difficulty?: number;
  position?: number;
  cpc?: number;
}

export interface KeywordTrend {
  data: number[];
  growth: number;
  seasonal: boolean;
}

export interface CompetitorData {
  domain: string;
  strength: number;
  keywords: string[];
  estimatedTraffic: number;
  topKeywords: { keyword: string; position: number; volume: number; }[];
  gaps: string[];
  title?: string;
}

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
}
