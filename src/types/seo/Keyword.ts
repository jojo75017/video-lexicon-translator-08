
export interface KeywordFrequency {
  keyword: string;
  frequency: number;
  density?: number;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: number;
  intent?: KeywordIntent;
  trends?: number[];
  density?: number;
  count?: number;
  position?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume?: number;
  difficulty?: number;
  cpc?: number;
  competition?: number;
  intent?: KeywordIntent;
  trend?: number[];
  type?: string;
  opportunity?: number;
  searchVolume?: number;
  relevance?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
}

export type KeywordIntent = 'informational' | 'navigational' | 'transactional' | 'commercial' | 'mixed';

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
  domain?: string;
  authority?: number;
  estimatedTraffic?: number;
  titleLength?: number;
  loadTime?: number;
  hasStructuredData?: boolean;
}

export interface SerpsResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

export interface KeywordTrend {
  data: number[];
  growth: number;
  seasonal: boolean;
}

export interface ContentGap {
  keyword: string;
  missingContent: string[];
  opportunity: number;
}

export interface SemanticCluster {
  id: string;
  name: string;
  mainTopic: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'transactional';
  difficulty: number;
  opportunity: number;
  contentType: string;
}
