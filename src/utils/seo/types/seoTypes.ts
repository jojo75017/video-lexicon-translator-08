
export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
  count?: number;
  position?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  relevance: number;
  searchVolume: number;
  difficulty: number;
  suggestedTitle: string;
  suggestedDescription: string;
  competition: number;
  cpc: number;
}
