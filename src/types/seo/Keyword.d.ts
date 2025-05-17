
export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  competition?: number;
  cpc?: number;
  difficulty?: number;
  trend?: number[];
  type?: 'standard' | 'long-tail';
  selected?: boolean;
  relevance?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  searchVolume?: number;
  clicks?: number;
  density?: number;
  position?: number;
}

export interface KeywordData {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  trend?: number[];
  density?: number;
  position?: number;
}
