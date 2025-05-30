
import { BacklinkInfo } from './Backlinks';
import { SocialTags, SocialMetrics } from './Social';
import { PerformanceData } from './Performance';
import { ImageDetail } from './ImageAnalysis';
import { KeywordSuggestion } from './Keyword';

export interface SeoAnalysis {
  url?: string;
  title?: string;
  description?: string;
  keywords?: string[];
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
  performance?: PerformanceData;
  topBacklinkDomains?: string[] | {domain: string}[];
  brokenLinks?: BrokenLink[];
  socialTags?: SocialTags;
  imagesDetails?: ImageDetail[];
  keywordSuggestions?: KeywordSuggestion[];
  socialMetrics?: SocialMetrics;
  sourceCode?: string;
  textContent?: string;
  region?: string;
  country?: string;
  language?: string;
  gdprCompliant?: boolean;
  metadata?: {
    title?: string;
    description?: string;
    robots?: string;
    hasTitleTag?: boolean;
    hasDescriptionTag?: boolean;
    lang?: string;
    charset?: string;
    viewport?: string;
    locale?: string;
  };
  headings?: {
    h1?: string[];
    h2?: string[];
    h3?: string[];
    h4?: string[];
    length?: number;
    hierarchy?: any[];
  };
  headingStructure?: any[];
  imgWithoutAlt?: number;
  authorityScore?: number;
  topKeywords?: KeywordSuggestion[];
  organicTraffic?: number;
  mobileAnalysis?: {
    isMobileFriendly: boolean;
    mobileScore: number;
    issues: string[];
  };
  readabilityScore?: number;
  metaTagsAnalysis?: {
    hasTitle: boolean;
    hasDescription: boolean;
  };
  technicalSuggestions?: string[];
  searchConsole?: any;
}

export interface BrokenLink {
  url: string;
  statusCode?: number;
  status?: string;
  location?: string;
  text?: string;
  anchor?: string;
}
