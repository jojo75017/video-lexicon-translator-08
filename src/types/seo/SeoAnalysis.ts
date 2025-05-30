
import { BacklinkInfo } from './Backlinks';
import { SocialTags, SocialMetrics } from './Social';
import { PerformanceData } from './Performance';
import { ImageDetail } from './ImageAnalysis';
import { KeywordSuggestion } from './Keyword';

export interface SeoAnalysis {
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
}

export interface BrokenLink {
  url: string;
  statusCode?: number;
  status?: string;
  location?: string;
  text?: string;
}
