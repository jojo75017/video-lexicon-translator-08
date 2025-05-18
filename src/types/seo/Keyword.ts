
export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  serps: SerpResult[];
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  type: string;
  opportunity: number;
  parentKeyword?: string;
  searchVolume?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
}

export interface SerpResult {
  position: number;
  url: string;
  title: string;
  description: string;
}

export interface KeywordTrend {
  month: string;
  volume: number;
}
