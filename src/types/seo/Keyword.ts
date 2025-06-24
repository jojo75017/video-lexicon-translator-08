
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string;
  trend?: string;
  type?: 'standard' | 'long-tail' | 'question' | 'ai-generated' | 'semantic' | 'intent-based' | 'competitor';
  intent?: 'informational' | 'commercial' | 'transactional' | 'mixed' | 'navigational';
  opportunity?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  searchVolume?: number;
  relevance?: number;
  count?: number;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string;
  trend?: string;
}
