
// Types de mots-clés et suggestions

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
}
export interface KeywordData {
  keyword: string;
  searchVolume?: number;
  competition?: number;
  cpc?: number;
  relevance?: number;
  count?: number;
  density?: number;
  position?: number;
}
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance: number;
}
