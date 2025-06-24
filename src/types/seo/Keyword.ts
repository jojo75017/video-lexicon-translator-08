
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string;
  trend?: string;
  type?: 'standard' | 'long-tail' | 'question' | 'ai-generated';
  intent?: 'informational' | 'commercial' | 'transactional' | 'mixed';
  opportunity?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
}
