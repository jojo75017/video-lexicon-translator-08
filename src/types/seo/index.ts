
import { Home, BarChart3, FileText, MessageSquare, Settings, Mail, LineChart } from "lucide-react";

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  domLoadTime: number;
  speedIndex: number;
  timeToInteractive: number;
  score: number;
  resourceCount: number;
  totalSize: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
  performanceScore?: number;
  resourceBreakdown: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
    js: number;
    css: number;
  };
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
  domLoadTime: number;
  speedIndex: number;
  timeToInteractive: number;
  score: number;
  resourceCount: number;
  totalSize: number;
  cumulativeLayoutShift?: number;
  performanceScore?: number;
  resourceBreakdown: {
    images: number;
    scripts: number;
    styles: number;
    fonts: number;
    other: number;
    js: number;
    css: number;
  };
}

export interface PageStructure {
  title: string;
  h1: string[];
  h2: string[];
  h3: string[];
  images: number;
  links: number;
  optimizationStatus: 'good' | 'warning' | 'error';
}

export interface MobileAnalysis {
  isMobileFriendly: boolean;
  mobileScore: number;
  score: number;
  issues: string[];
}

export interface MetaTags {
  hasTitle: boolean;
  hasDescription: boolean;
  hasDescriptionTag: boolean;
  hasOpenGraphTags: boolean;
  hasTwitterTags?: boolean;
  titleLength?: number;
  descriptionLength?: number;
  canonicalUrl?: string | null;
  robotsContent?: string | null;
  hasTitleTag?: boolean;
  hasCanonical?: boolean;
  hasRobotsTag?: boolean;
}

export interface MetaTagsAnalysis {
  hasTitleTag: boolean;
  hasDescriptionTag: boolean;
  hasCanonical: boolean;
  hasRobotsTag: boolean;
  hasOpenGraphTags: boolean;
  hasTwitterTags?: boolean;
  titleLength: number;
  descriptionLength: number;
  canonicalUrl: string | null;
  robotsContent: string | null;
  hasTitle: boolean;
  hasDescription: boolean;
}

export interface SocialMetrics {
  facebook: number;
  twitter: number;
  pinterest: number;
  linkedin: number;
}

export interface SocialMetricsProps {
  metrics: SocialMetrics;
}

export interface OrganicSearchProps {
  keyword: string;
  keywords: string[];
  totalKeywords: number;
  averagePosition: number;
  visibility: number;
}

export interface RoiParameters {
  targetKeywords: number;
  averagePosition: number;
  clickThroughRate: number;
  conversionRate: number;
  averageOrderValue: number;
  acquisitionCost: number;
  contentCost: number;
  linkBuildingCost: number;
  timeInvestment: number;
  seoInvestment: number;
  organicTraffic?: number;
  timeFrame?: number;
}

export interface CompetitorData {
  domain: string;
  strength: number;
  keywords: string[];
  estimatedTraffic: number;
  topKeywords: { keyword: string; position: number; volume: number; }[];
  gaps: string[];
  title?: string;
}

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
}

export interface PageLinkMetric {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  linkStrength: number;
}

export interface PageMetric {
  url: string;
  title: string;
  incomingLinks?: number;
  outgoingLinks?: number;
  linkStrength?: number;
}

export interface AnalysisOptions {
  includeBacklinks: boolean;
  includePerformance: boolean;
  includeMobile: boolean;
}

export interface RoiResults {
  monthlyRevenue: number;
  yearlyRevenue: number;
  roi: number;
  breakEvenTime: number;
  totalRevenue?: number;
  totalConversions?: number;
  costSaved?: number;
  breakEvenMonth?: number;
  monthlyResults?: any[];
}

export interface LocalizationConfig {
  language: string;
  country: string;
  timezone: string;
}

export interface LocalizedKeyword {
  keyword: string;
  language: string;
  country: string;
  volume: number;
  difficulty: number;
  culturalRelevance: number;
  localCompetition: number;
  cpc?: number;
}

export interface VoiceSearchData {
  isVoiceOptimized: boolean;
  voiceScore: number;
  naturalLanguageQueries: string[];
  conversationalKeywords: string[];
  keyword?: string;
  questionFormat?: string;
  conversationalVariants?: string[];
  avgQuestionLength?: number;
  featuredSnippetChance?: number;
}

export interface MobileOptimization {
  keyword: string;
  isMobileFriendly: boolean;
  mobileScore: number;
  mobileVolume: number;
  mobilevsDesktop: number;
  localSearchIntent: boolean;
  voiceSearchCompatible: boolean;
  mobileCompetition: number;
  quickAnswerFormat: string;
  issues: string[];
  recommendations: string[];
}

export interface InternalLinkAnalysis {
  totalPages: number;
  totalInternalLinks: number;
  averageLinksPerPage: number;
  topLinkedPages: PageLinkMetric[];
  orphanedPages: string[];
  recommendations: string[];
  linkDepth: number;
  linkSuggestions: Array<{
    fromPage: string;
    toPage: string;
    anchorText: string;
    relevanceScore: number;
  }>;
}

export interface SearchConsoleData {
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  topQueries: Array<{
    query: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
  topPages: Array<{
    url: string;
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
}

export interface SeoAnalysisResult {
  url: string;
  timestamp: string;
  status: 'success' | 'error';
  success: boolean;
  data?: any;
  error?: string;
}

export interface SeoAnalysis {
  url?: string;
  title: string;
  description: string;
  keywords: string[];
  headings: any[];
  images: any[];
  links: any[];
  meta: any;
  performance: any;
  mobile: any;
  accessibility: any;
  seo: any;
  score?: number;
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  imgCount?: number;
  wordCount?: number;
  internalLinks?: number;
  externalLinks?: number;
  backlinks?: number | BacklinkInfo[];
  doFollowBacklinks?: number;
  noFollowBacklinks?: number;
  topBacklinkDomains?: string[] | {domain: string}[];
  brokenLinks?: BrokenLink[];
  socialTags?: SocialTags;
  imagesDetails?: ImageDetail[];
  keywordSuggestions?: KeywordSuggestion[];
  socialMetrics?: SocialMetrics;
  metaTagsAnalysis?: MetaTagsAnalysis;
  topKeywords?: any[];
  technicalSuggestions?: string[];
  readabilityScore?: number;
  searchConsoleData?: SearchConsoleData;
  mobileAnalysis?: MobileAnalysis;
  imgWithoutAlt?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  competition: number;
  relevance: number;
  suggestedTitle?: string;
  suggestedDescription?: string;
  suggestedLongDescription?: string;
  searchVolume?: number;
}

export interface BrokenLink {
  url: string;
  statusCode?: number;
  status?: string;
  location?: string;
  text?: string;
  anchor?: string;
}

export interface ImageDetail {
  url: string;
  alt?: string;
  size?: string;
  width?: number;
  height?: number;
}

export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  dofollow: boolean;
  authority?: number;
}

export interface StructureItem {
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  content: string;
  id: string;
  items?: string[];
}

export interface SocialTags {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}
