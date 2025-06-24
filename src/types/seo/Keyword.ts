
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
  suggestedLongDescription?: string;
  searchVolume?: number;
  relevance?: number;
  count?: number;
  density?: number;
  position?: number;
}

export interface KeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string;
  trend?: string;
  density?: number;
  count?: number;
  position?: number;
}

export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  density: number;
  count: number;
  position: number;
}

export interface ContentSuggestion {
  title: string;
  description: string;
  longDescription: string;
  faqQuestions: string[];
  headings: string[];
  type: 'blog' | 'landing' | 'product' | 'service';
}
