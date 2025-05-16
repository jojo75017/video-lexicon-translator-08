
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  relevance?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  searchVolume?: number;
  clicks?: number;
  position?: number;
}

export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
  count?: number;
  position?: number;
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

export interface KeywordStrategyResponse {
  mainKeywords: KeywordSuggestion[];
  longTail: KeywordSuggestion[];
  questions: KeywordSuggestion[];
  related: KeywordSuggestion[];
  semantic: string[];
  competitors: CompetitorData[];
  serps: SerpResult[];
  contentIdeas: {
    title: string;
    type: string;
  }[];
  byIntent: {
    informational: KeywordSuggestion[];
    transactional: KeywordSuggestion[];
    navigational: KeywordSuggestion[];
  };
}
