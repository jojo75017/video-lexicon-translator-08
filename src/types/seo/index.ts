
export * from './Keyword';
export * from './InternalLinks';
export * from './Backlinks';
export * from './Social';

export interface CompetitorData {
  domain: string;
  title: string;
  description: string;
  keywords: string[];
  ranking: number;
  traffic: number;
  authority: number;
  name: string;
  url: string;
  strength: number;
  organic_traffic: number;
}

export interface SocialMetricsProps {
  metrics: {
    facebook: number;
    twitter: number;
    pinterest: number;
    linkedin: number;
  };
}

export interface OrganicSearchProps {
  keywords: string[];
  totalKeywords: number;
  averagePosition: number;
  visibility: number;
}

export interface AnalysisOptions {
  includeKeywords?: boolean;
  includeCompetitors?: boolean;
  includeBacklinks?: boolean;
  depth?: number;
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  domLoadTime: number;
  speedIndex: number;
  timeToInteractive: number;
  score: number;
  resourceCount: number;
  totalSize: number;
  resourceBreakdown: {
    js?: number;
    css?: number;
    images?: number;
    fonts?: number;
    other?: number;
    scripts?: number;
    styles?: number;
  };
}

export interface PageStructure {
  title: string;
  headings: Array<{
    level: number;
    text: string;
    id?: string;
  }>;
  links: Array<{
    text: string;
    href: string;
    internal: boolean;
  }>;
  images: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  meta: {
    description?: string;
    keywords?: string;
    canonical?: string;
  };
  optimizationStatus?: string;
}
