
// Types de mots-clés et suggestions

export interface KeywordFrequency {
  keyword: string;
  count: number;
  density: number;
  position?: number; // Position ajoutée pour compatibilité
}

export interface KeywordData {
  keyword: string;
  searchVolume?: number;
  competition?: number;
  cpc?: number;
  relevance?: number;
  count?: number;
  density?: number;
  position?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  relevance: number;
  searchVolume?: number;
  cpc?: number;
  competition?: number;
  clicks?: number;
  position?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedShortDescription?: string;
  suggestedLongDescription?: string;
}

export interface KeywordGroup {
  name: string;
  keywords: KeywordSuggestion[];
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
  organic_traffic?: number;
  keywords?: number;
}
