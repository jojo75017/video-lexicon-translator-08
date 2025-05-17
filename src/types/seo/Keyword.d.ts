
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
  position?: number;
}

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
}

export interface KeywordData extends KeywordFrequency {
  volume?: number;
  difficulty?: number;
  cpc?: number;
  trend?: number[];
  position?: number;
}

export interface KeywordIntent {
  informational: KeywordSuggestion[];
  transactional: KeywordSuggestion[];
  navigational: KeywordSuggestion[];
}

export interface SerpsResult {
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
