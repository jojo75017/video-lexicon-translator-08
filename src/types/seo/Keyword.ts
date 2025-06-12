
export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number | string;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  type?: 'standard' | 'longtail' | 'question' | 'ai-generated';
  relevance?: number;
  opportunity?: number;
  trend?: number[] | string;
  suggestedTitle?: string;
  suggestedDescription?: string;
}
