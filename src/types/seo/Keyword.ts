
// src/types/seo/Keyword.ts
export interface KeywordSuggestion {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number; 
  relevance?: number; 
  intent?: string;
  type?: string;
  volume?: number;
  opportunity?: number;
  trend?: number[];
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
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

export interface BacklinkInfo {
  url: string;
  domain: string;
  authority: number;
  anchorText?: string;
  date: string;
}

export interface BrokenLink {
  url: string;
  status?: number;
  location?: string;
  text?: string;
  type: string;
}

export interface KeywordData {
  keyword: string;
  difficulty: number;
  searchVolume: number;
  count?: number;
  density?: number;
  position?: number;
  volume?: number;
}

export interface KeywordTrend {
  keyword: string;
  period: string;
  volume: number;
  data?: number[];
  growth?: number;
  seasonal?: boolean;
}

export interface MobileAnalysis {
  score?: number;
  issues: string[];
  recommendations: string[];
}

// Types additionnels pour résoudre les erreurs de build
export interface KeywordIntent {
  name: string;
  description: string;
  examples: string[];
}
