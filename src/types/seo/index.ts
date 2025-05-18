
// src/types/seo/index.ts
export interface SeoAnalysis {
  url: string;
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  metadata?: {
    title: string;
    description: string;
    robots: string;
  };
  headings?: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
  };
  headingStructure?: any[];
  images?: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };
  links?: {
    internal: number;
    external: number;
  };
  performance?: Performance;
  mobile?: MobileAnalysis;
  authorityScore?: number;
  organicTraffic?: number;
  searchConsoleData?: any;
}

export interface Performance {
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
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}

export interface SeoAnalysisResult {
  score: number;
  issues: string[];
  recommendations: string[];
  details: Record<string, any>;
}

// Re-export des types de Keyword.ts pour les rendre disponibles via @/types/seo
export * from './Keyword';
