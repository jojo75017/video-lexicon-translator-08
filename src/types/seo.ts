export interface SeoAnalysisResult {
  title?: string;
  description?: string;
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  wordCount?: number;
  readabilityScore?: number;
  imageCount?: number;
  hasCanonical?: boolean;
  hasSitemap?: boolean;
  hasRobots?: boolean;
  loadTime?: number;
  mobileCompatible?: boolean;
  secureConnection?: boolean;
  brokenLinksCount?: number;
  keywordDensity?: {
    [keyword: string]: number;
  };
}
