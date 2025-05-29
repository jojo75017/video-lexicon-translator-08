
// Point d'entrée centralisé pour les types SEO

export type { SeoAnalysis } from './seo/SeoAnalysis';
export type { MetaTagsAnalysis } from './seo/MetaTags';
export type { BacklinkInfo } from './seo/Backlinks';
export type { SocialMetrics, SocialTags } from './seo/Social';
export type { ImageDetails } from './seo/Image';
export type { PerformanceData, MobileAnalysis } from './seo/Performance';
export type { InternalLinkAnalysis } from './seo/InternalLinks';
export type { KeywordData, KeywordSuggestion } from './seo/Keyword';
export type { HierarchyItem, HeadingStructure, StructureItem } from './seo/Hierarchy';
export type { RankingData } from './seo/Ranking';

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
