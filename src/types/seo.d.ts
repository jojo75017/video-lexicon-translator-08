export interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedShortDescription?: string;
  suggestedLongDescription?: string;
  relevance: number;
  competition: number;
  cpc: number;
  volume: number;
}
