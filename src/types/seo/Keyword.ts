
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition?: number;
  trend?: number;
  intent?: 'informational' | 'commercial' | 'transactional' | 'navigational';
  type?: 'primary' | 'secondary' | 'long-tail' | 'semantic' | 'related' | 'question' | 'ai-generated';
  opportunity?: number;
  searchVolume?: number;
  relevance?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
  seasonality?: {
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
  };
}

export interface KeywordGroup {
  id: string;
  name: string;
  keywords: KeywordSuggestion[];
  totalVolume: number;
  averageDifficulty: number;
  intent: string;
}

export interface KeywordCluster {
  name: string;
  keywords: string[];
  volume: number;
  difficulty: number;
  intent: string;
}

export interface KeywordAnalysis {
  keyword: string;
  competitors: string[];
  opportunities: string[];
  questions: string[];
  relatedTopics: string[];
  searchVolume: number;
  difficulty: number;
  trends: number[];
}

export interface SemanticCluster {
  id: string;
  name: string;
  mainTopic: string;
  keywords: string[];
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  difficulty: number;
  opportunity: number;
  contentType: string;
}

export interface ContentGap {
  keyword: string;
  volume: number;
  difficulty: number;
  currentRanking: number;
  opportunity: number;
  content: {
    title: string;
    description: string;
    recommendedWordCount: number;
    suggestedFormat: string;
  };
}

export interface VoiceSearchData {
  keyword: string;
  voiceScore: number;
  naturalLanguageQueries: string[];
  conversationalKeywords: string[];
  isVoiceOptimized: boolean;
  questionFormat: string;
  conversationalVariants: string[];
  avgQuestionLength: number;
  featuredSnippetChance: number;
}

export interface SerpFeature {
  type: string;
  title: string;
  content: string;
  present: boolean;
  position?: number;
}

export interface CompetitorData {
  name: string;
  url: string;
  domain: string;
  title: string;
  description: string;
  ranking: number;
  traffic: number;
  strength: number;
  organic_traffic: number;
  estimatedTraffic: number;
  keywords: number;
  topKeywords: string[];
  gaps: string[];
  backlinks: number;
  domainAuthority: number;
  contentGaps: string[];
}

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
  domain: string;
}
