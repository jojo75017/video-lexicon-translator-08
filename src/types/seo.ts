
// Point d'entrée centralisé pour les types SEO

export type { SeoAnalysis } from './seo/SeoAnalysis';
export type { MetaTagsAnalysis } from './seo/MetaTags';
export type { BacklinkInfo, BrokenLink } from './seo/Backlinks';
export type { SocialMetrics, SocialTags } from './seo/Social';
export type { ImageDetails } from './seo/Image';
export type { PerformanceData, Performance, MobileAnalysis } from './seo/Performance';
export type { InternalLinkAnalysis, PageLinkMetric, LinkSuggestion } from './seo/InternalLinks';
export type { KeywordData, KeywordSuggestion } from './seo/Keyword';
export type { HierarchyItem, HeadingStructure, StructureItem } from './seo/Hierarchy';
export type { RankingData } from './seo/Ranking';
export type { ImageAnalysis, ImageDetail } from './seo/ImageAnalysis';
export type { SeoAnalysisResult } from './seo/SeoAnalysisResult';
export type { SearchConsoleData } from './seo/SearchConsole';

// Réexporter tous les types de l'index
export * from './seo/index';

// Types supplémentaires pour la compatibilité
export type { 
  OrganicSearchProps,
  AnalysisOptions,
  PageStructure,
  RoiParameters,
  RoiResults,
  LocalizationConfig,
  LocalizedKeyword,
  VoiceSearchData,
  MobileOptimization
} from './seo/index';
