
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance?: number;
  cpc?: number;
  competition?: string;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  trends?: number[];
  clicks?: number;
  searchVolume?: number;
  type?: 'primary' | 'longtail' | 'competitor' | 'semantic';
  opportunity?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  trend?: 'rising' | 'stable' | 'declining';
}
