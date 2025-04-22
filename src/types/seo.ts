export interface AnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface AnalysisOptions {
  useProxy?: boolean;
  timeout?: number;
  depth?: number;
  useOpenAI?: boolean;
}

export interface KeywordSuggestion {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  relevance: number;
  competition?: number;
  cpc?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
}

export interface OpenAIKeywordResponse {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
}
