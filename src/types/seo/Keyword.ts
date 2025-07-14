
export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string;
  trend?: number[];
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  relatedKeywords?: string[];
  questions?: string[];
  longtail?: string[];
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance?: number;
  cpc?: number;
  competition?: string;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
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
  keywords: number; // Changed from string[] to number to match usage
  topKeywords: string[];
  gaps: string[];
  backlinks?: number;
  authority?: number;
}

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
  domain?: string;
}

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
}
