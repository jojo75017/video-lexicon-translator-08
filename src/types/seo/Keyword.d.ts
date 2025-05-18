
export interface KeywordData {
  keyword: string;
  count: number;
  density: number;
  volume?: number;
  difficulty?: number;
  position?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number;
  relevance?: number;
  position?: number;
  opportunity?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  type?: 'question' | 'standard' | 'long-tail' | 'related';
  intent?: 'informational' | 'navigational' | 'transactional' | 'commercial';
  serps?: any[];
}
