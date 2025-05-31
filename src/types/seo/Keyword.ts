
export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition?: number;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  type?: 'standard' | 'long-tail' | 'question' | 'competitor';
  relevance?: number;
  opportunity?: number;
  trend?: any[];
  suggestedTitle?: string;
  suggestedDescription?: string;
}

export interface KeywordSuggestion extends KeywordData {}
