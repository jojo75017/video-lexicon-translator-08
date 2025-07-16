
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance?: number;
  type?: 'primary' | 'longtail' | 'competitor' | 'semantic' | 'ai-generated' | 'long-tail' | 'question';
  cpc?: number;
  competition?: string;
  trend?: 'rising' | 'stable' | 'declining';
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  opportunity?: number;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance?: number;
  type?: 'primary' | 'longtail' | 'competitor' | 'semantic' | 'ai-generated' | 'long-tail' | 'question';
  cpc?: number;
  competition?: string;
  trend?: 'rising' | 'stable' | 'declining';
  density?: number;
  count?: number;
  position?: number;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  opportunity?: number;
}
