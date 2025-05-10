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
  suggestedShortDescription?: string;  // Description courte (155 caractères max)
  suggestedLongDescription?: string;   // Description longue (500 caractères max)
  volume?: number; // Ajouté pour compatibilité
}

export interface OpenAIKeywordResponse {
  keyword: string;
  searchVolume?: number;
  difficulty?: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedShortDescription?: string;  // Description courte
  suggestedLongDescription?: string;   // Description longue
}

export interface SeoAnalysis {
  url: string;
  score: number;
  keywordDensity?: Record<string, number>;
  metadata?: MetaTagsAnalysis;
  performance?: Performance;
  issues?: SeoIssue[];
  title?: string;
  description?: string;
  keywords?: string[];
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  imgCount?: number;
  headings?: any[];
  paragraphs?: any[];
  wordCount?: number;
  internalLinks?: number;
  externalLinks?: number;
  headingStructure?: { hierarchy?: HierarchyItem[] };
  technicalSuggestions?: string[];
  contentQuality?: { readingTime: number; complexity: number };
  searchConsole?: { clicks: number; impressions: number; position?: number; keywords?: any[]; topPages?: any[] };
  keywordSuggestions?: KeywordSuggestion[];
  sourceCode?: string;  // Ajouté pour corriger les erreurs
  textContent?: string; // Ajouté pour corriger les erreurs
  
  // Ajouts pour compatibilité avec les composants
  backlinkDetails?: BacklinkInfo[];
  topBacklinkDomains?: {domain: string; count: number}[] | string[];
  doFollowBacklinks?: number;
  noFollowBacklinks?: number;
  organicTraffic?: number;
  readabilityScore?: number;
  topKeywords?: KeywordData[];
  socialMetrics?: SocialMetrics;
  mobileAnalysis?: any;
  imgWithoutAlt?: number;
  metaTagsAnalysis?: any;
  imagesDetails?: ImageDetails[];
  socialTags?: Record<string, string>;
  brokenLinks?: any[];
  backlinks?: BacklinkInfo[];
  
  // Métriques d'autorité et autres statistiques
  authorityScore?: number;
  paidKeywords?: number;
  paidTraffic?: number;
}

export interface SeoAnalysisResult {
  success: boolean;
  data?: SeoAnalysis;
  error?: string;
  backlinks?: BacklinkInfo[];
  authorityScore?: number;
  doFollowBacklinks?: number;
  noFollowBacklinks?: number;
}

export interface MetaTagsAnalysis {
  title: string;
  description: string;
  keywords: string[];
  hasCanonical: boolean;
  hasFavicon: boolean;
  socialTags: Record<string, string>;
  hasTitleTag?: boolean;
  hasDescriptionTag?: boolean;
  hasOpenGraphTags?: boolean; // Ajouté pour compatibilité
}

export interface Performance {
  loadTime: number;
  speedIndex: number;
  firstContentfulPaint: number;
  totalBlockingTime: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  performanceScore: number;
  timeToInteractive?: number;
  resourceBreakdown?: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
  };
  totalSize?: number;
  scriptCount?: number;
  styleCount?: number;
  responseTime?: number;
  impressions?: number;
  clickThroughRate?: number;
  domLoadTime: number;
  mobilePerformance?: any; // Ajout pour corriger les erreurs
  desktopPerformance?: any; // Ajout pour corriger les erreurs
  
  // Propriétés supplémentaires
  score?: number;
  resourceCount?: number;
  imageCount?: number;
  cacheLifetime?: number; // Ajouté pour compatibilité
}

export interface SeoIssue {
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
}

export interface ImageAnalysis {
  url: string;
  hasAlt: boolean;
  altText?: string;
  alt?: string; // Pour compatibilité
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  isOptimized?: boolean;
  optimizationSuggestions?: string[];
  dimensions?: any; // Ajouté pour compatibilité
}

export interface ImageDetails extends ImageAnalysis {
  url: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  format: string;
  hasAlt: boolean;
  lazyLoaded?: boolean; // Ajouté pour corriger les erreurs
}

export interface BacklinkInfo {
  url: string;
  anchorText: string;
  domainAuthority?: number;
  isDofollow: boolean;
  firstDetected?: string;
  lastDetected?: string;
  domain?: string; // Ajouté pour compatibilité
  authority?: number; // Ajouté pour compatibilité
  firstSeen?: string; // Ajouté pour compatibilité
  followType?: string; // Ajouté pour compatibilité
  date?: string; // Ajouté pour compatibilité
}

export interface HeadingStructure {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  hierarchy?: HierarchyItem[];
  headings?: any[]; // Ajouté pour compatibilité
  paragraphs?: any[]; // Ajouté pour corriger les erreurs
  issues?: string[]; // Ajouté pour le support des problèmes de structure
}

export interface HierarchyItem {
  id: string;
  name: string;
  level: number;
  children?: HierarchyItem[];
  tagName?: string; // Ajouté pour compatibilité
  text?: string; // Ajouté pour compatibilité
  position?: number; // Ajouté pour compatibilité
}

export interface KeywordData {
  keyword: string;
  searchVolume?: number;
  competition?: number;
  cpc?: number;
  relevance?: number;
  count?: number; // Ajouté pour compatibilité
  density?: number; // Ajouté pour compatibilité
  position?: number; // Ajouté pour compatibilité
}

export interface SearchConsoleData {
  queries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  pages?: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  devices?: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countries?: Record<string, number>;
  position?: number; // Ajouté pour compatibilité
  clicks?: Record<string, number> | any; // Ajouté pour corriger les erreurs
  impressions?: Record<string, number> | any; // Ajouté pour corriger les erreurs
  keywords?: any[]; // Ajouté pour compatibilité
  topPages?: any[]; // Ajouté pour compatibilité
  ctr?: Record<string, number> | any; // Ajouté pour corriger les erreurs
  topQueries?: any[]; // Ajouté pour compatibilité
}

export interface SocialMetrics {
  facebook: {
    shares: number;
    comments: number;
    likes: number;
    engagements?: number; // Ajouté pour compatibilité
  };
  twitter: {
    tweets: number;
    retweets: number;
    likes: number;
    shares?: number; // Ajouté pour compatibilité
    replies?: number; // Ajouté pour compatibilité
  };
  linkedin: {
    shares: number;
    comments: number;
    likes: number;
  };
  pinterest: {
    pins: number;
    saves: number;
  };
}

// Type pour la compatibilité avec PerformanceTabContent
export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  speedIndex: number;
  totalBlockingTime: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  domLoadTime: number;
  resourceBreakdown?: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
  };
}

// Nouveau type pour la structure de contenu
export type StructureItemType = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'list';

export interface StructureItem {
  id: string;
  content: string;
  type: StructureItemType;
  items?: string[];
}
