
// Point d'entrée centralisé pour les types SEO

export type { SeoAnalysis, BrokenLink } from './SeoAnalysis';
export type { MetaTagsAnalysis } from './MetaTags';
export type { BacklinkInfo } from './Backlinks';
export type { SocialMetrics, SocialTags } from './Social';
export type { ImageDetails } from './Image';
export type { PerformanceData, Performance, MobileAnalysis } from './Performance';
export type { InternalLinkAnalysis, PageLinkMetric, LinkSuggestion, PageMetric, InternalLinkRecommendation, LinkDistribution, OrphanPage, SiloStructure } from './InternalLinks';
export type { KeywordData, KeywordSuggestion } from './Keyword';
export type { HierarchyItem, HeadingStructure, StructureItem } from './Hierarchy';
export type { RankingData, SearchConsoleData } from './Ranking';
export type { ImageAnalysis, ImageDetail } from './ImageAnalysis';
export type { SeoAnalysisResult } from './SeoAnalysisResult';

// Types supplémentaires pour la compatibilité
export interface OrganicSearchProps {
  keyword: string;
  data?: any[];
}

export interface AnalysisOptions {
  includeImages?: boolean;
  includePerformance?: boolean;
  includeBacklinks?: boolean;
}

export interface PageStructure {
  title: string;
  url: string;
  level: number;
  children?: PageStructure[];
}

export interface RoiParameters {
  investment: number;
  traffic: number;
  conversionRate: number;
  averageOrderValue: number;
  customerAcquisitionCost: number;
  timeFrame: number;
}

export interface RoiResults {
  revenue: number;
  profit: number;
  roi: number;
  paybackPeriod: number;
}

export interface LocalizationConfig {
  language: string;
  region: string;
  currency: string;
}

export interface LocalizedKeyword {
  keyword: string;
  language: string;
  volume: number;
  difficulty: number;
  cpc: number;
}

export interface VoiceSearchData {
  query: string;
  isVoiceOptimized: boolean;
  conversationalScore: number;
  questionType?: string;
}

export interface MobileOptimization {
  isMobileFriendly: boolean;
  mobileScore: number;
  issues: string[];
  recommendations: string[];
}

export interface CompetitorData {
  domain: string;
  title: string;
  description: string;
  ranking: number;
  traffic: number;
  keywords: number;
}
