
import { BacklinkInfo, SocialMetricsProps } from './Hierarchy';
import { SearchConsoleData } from './Ranking';

export interface SeoAnalysis {
  url?: string;
  title?: string;
  meta?: Meta[];
  headings?: Heading[];
  headingStructure?: any;
  links?: Link[];
  images?: Image[];
  textContent?: string;
  wordCount?: number;
  readabilityScore?: number;
  hierarchy?: HierarchyItem[];
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  authorityScore?: number;
  organicTraffic?: number;
  searchConsoleData?: SearchConsoleData;
  metadata?: {
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  performance?: Performance;
}

export interface Meta {
  name: string;
  content: string;
}

export interface Heading {
  level: number;
  text: string;
  position?: number;
}

export interface Link {
  href: string;
  text: string;
  isExternal?: boolean;
  isNoFollow?: boolean;
}

export interface Image {
  src: string;
  alt: string;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface HierarchyItem {
  text: string;
  tagName: string;
  position: number;
  children: HierarchyItem[];
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
    js: { count: number; size: number };
    css: { count: number; size: number };
    images: { count: number; size: number };
    fonts: { count: number; size: number };
    other: { count: number; size: number };
  };
}

export interface MobileAnalysis {
  score: number;
  loadTime: number;
  firstContentfulPaint: number;
}

export interface SeoAnalysisResult {
  score: number;
  issues: {
    critical: number;
    warnings: number;
    opportunities: number;
  };
  metrics: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  details: {
    title: string;
    description: string;
    headings: Heading[];
    links: Link[];
    images: Image[];
  };
}

export interface BrokenLink {
  url: string;
  status: number;
  location: string;
  text: string;
}

export interface OrphanPage {
  url: string;
  title: string;
  suggestions: string[];
}

export interface PageLinkMetric {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  depth: number;
  importance?: number;
}

export interface InternalLinkRecommendation {
  from: string;
  to: string;
  reason: string;
  relevanceScore: number;
}
