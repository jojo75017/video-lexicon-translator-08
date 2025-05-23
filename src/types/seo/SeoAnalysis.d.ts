
// Type principal de l'analyse SEO

import { MetaTagsAnalysis } from "./MetaTags";
import { BacklinkInfo, BrokenLink } from "./Backlinks";
import { SocialMetrics, SocialTags } from "./Social";
import { ImageDetails } from "./Image";
import { PerformanceData, MobileAnalysis } from "./Performance";
import { InternalLinkAnalysis } from "./InternalLinks";
import { KeywordFrequency, KeywordData, KeywordSuggestion } from "./Keyword";
import { HierarchyItem, HeadingStructure, StructureItem } from "./Hierarchy";

export interface SeoAnalysis {
  url: string;
  title: string;
  description: string;
  keywords: string;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  internalLinks: number;
  externalLinks: number;
  imgCount: number;
  imgWithoutAlt: number;
  wordCount: number;
  metaTagsAnalysis: MetaTagsAnalysis;
  topKeywords: KeywordFrequency[];
  backlinks: BacklinkInfo[] | number;
  doFollowBacklinks: number;
  noFollowBacklinks: number;
  socialMetrics: SocialMetrics;
  socialTags?: SocialTags;
  imagesDetails: ImageDetails[];
  performance?: PerformanceData;
  mobileAnalysis?: MobileAnalysis;
  technicalSuggestions: string[];
  readabilityScore: number;
  searchConsoleData: any;
  topBacklinkDomains: string[];
  keywordSuggestions?: KeywordSuggestion[];
  brokenLinks?: BrokenLink[];
  internalLinkAnalysis?: InternalLinkAnalysis;
  sourceCode?: string;
  textContent?: string;
  // Add missing properties
  metadata?: {
    title: string;
    description: string;
    robots: string;
    hasTitleTag?: boolean;
    hasDescriptionTag?: boolean;
  };
  headings?: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    length?: number;
    hierarchy?: any[];
  };
  headingStructure?: any[];
  authorityScore?: number;
  organicTraffic?: number;
}

export interface SeoAnalysisResult {
  score: number;
  issues: string[];
  recommendations: string[];
  details: Record<string, any>;
  success?: boolean;
  error?: string;
  data?: SeoAnalysis;
}
