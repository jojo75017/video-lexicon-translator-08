
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance: number;
  type: 'primary' | 'longtail' | 'competitor' | 'semantic';
  cpc?: number;
  competition?: string;
  trend?: 'rising' | 'stable' | 'declining';
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance: number;
  type: 'primary' | 'longtail' | 'competitor' | 'semantic';
  cpc?: number;
  competition?: string;
  trend?: 'rising' | 'stable' | 'declining';
  density?: number;
  count?: number;
  position?: number;
}
