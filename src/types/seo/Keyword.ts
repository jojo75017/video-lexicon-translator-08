
export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc?: number;
  competition?: string; // Changé de number à string pour compatibilité
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
  clicks?: number;
  impressions?: number;
  ctr?: number;
  averagePosition?: number;
  rankingHistory?: number[];
  seasonality?: 'high' | 'medium' | 'low';
  localSearchVolume?: number;
  mobileSearchVolume?: number;
  brandAffinity?: number;
  commercialIntent?: number;
  costPerClick?: number;
  conversionRate?: number;
  competitorDensity?: number;
  searchTrend?: 'rising' | 'stable' | 'declining';
  relatedQueries?: string[];
  featuredSnippetOpportunity?: boolean;
  paaQuestions?: string[];
  entityScore?: number;
  topicalAuthority?: number;
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

export interface KeywordTrend {
  data: number[];
  growth: number;
  seasonal: boolean;
  peakMonths?: string[];
  averageVolume?: number;
  volatility?: number;
}

export interface ContentSuggestion {
  title: string;
  description: string;
  longDescription: string;
  faqQuestions: string[];
  headings: string[];
  type: 'blog' | 'landing' | 'product' | 'service';
  contentStructure?: {
    introduction: string;
    mainPoints: string[];
    conclusion: string;
  };
  targetWordCount?: number;
  readabilityScore?: number;
  semanticKeywords?: string[];
}

export interface CompetitorData {
  name: string;
  url: string;
  strength: number;
  organic_traffic: number;
  keywords: string[];
  domain: string;
  estimatedTraffic: number;
  topKeywords: string[];
  gaps: string[];
  contentGaps?: string[];
  backlinks?: number;
  domainAuthority?: number;
  pageAuthority?: number;
  socialSignals?: number;
  brandMentions?: number;
}

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
  type?: 'organic' | 'featured-snippet' | 'paa' | 'local-pack' | 'shopping';
  domain?: string;
  wordCount?: number;
  socialShares?: number;
  backlinks?: number;
  lastUpdated?: string;
}

export interface SerpFeature {
  type: 'featured-snippet' | 'paa' | 'local-pack' | 'images' | 'videos' | 'shopping' | 'ads';
  present: boolean;
  position?: number;
  content?: string;
}

export interface LocalSeoData {
  businessName: string;
  address: string;
  phone: string;
  reviews: number;
  rating: number;
  categories: string[];
  localKeywords: string[];
}

export interface VoiceSearchData {
  conversationalKeywords: string[];
  questionBasedQueries: string[];
  voiceSearchVolume: number;
  averageQueryLength: number;
  deviceUsage: {
    mobile: number;
    smartSpeaker: number;
    desktop: number;
  };
}

export interface SemanticCluster {
  mainTopic: string;
  keywords: string[];
  intent: string;
  difficulty: number;
  opportunity: number;
  contentType: string;
}

export interface ContentGap {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  currentRanking: number | null;
  competitorRanking: number[];
  contentSuggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RankingData {
  keyword: string;
  position: number;
  previousPosition?: number;
  change?: number;
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  page: string;
}

export interface TechnicalSeoData {
  pageSpeed: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  mobileUsability: number;
  https: boolean;
  structuredData: boolean;
  xmlSitemap: boolean;
  robotsTxt: boolean;
}
