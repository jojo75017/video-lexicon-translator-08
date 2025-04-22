
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

// Interfaces manquantes pour corriger les erreurs de compilation
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
  searchConsole?: { clicks: number; impressions: number };
  keywordSuggestions?: KeywordSuggestion[];
}

export interface SeoAnalysisResult {
  success: boolean;
  data?: SeoAnalysis;
  error?: string;
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
  domLoadTime?: number; // Ajout pour compatibilité
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
}

export interface ImageDetails {
  url: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

export interface BacklinkInfo {
  url: string;
  anchorText: string;
  domainAuthority: number;
  isDofollow: boolean;
  firstDetected: string;
  lastDetected: string;
}

export interface HeadingStructure {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
}

export interface HierarchyItem {
  id: string;
  name: string;
  level: number;
  children?: HierarchyItem[];
}

export interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: number;
  cpc: number;
  relevance: number;
}

export interface SearchConsoleData {
  queries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  pages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countries: Record<string, number>;
}

export interface SocialMetrics {
  facebook: {
    shares: number;
    comments: number;
    likes: number;
  };
  twitter: {
    tweets: number;
    retweets: number;
    likes: number;
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
