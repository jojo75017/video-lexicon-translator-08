
export interface InternalLinkAnalysis {
  totalLinks?: number;
  uniquePages?: number;
  averageLinksPerPage?: number;
  recommendations?: InternalLinkRecommendation[];
  pageMetrics?: PageMetric[];
  linkDistribution?: LinkDistribution;
  orphanPages?: OrphanPage[];
  siloPagesFound?: boolean;
  siloStructure?: SiloStructure[];
  averageDepth?: number;
  depthDistribution?: Record<string, number>;
}

export interface InternalLinkRecommendation {
  from?: string;
  to?: string;
  reason: string;
  priority?: string;
  description?: string;
  type?: string;
  impact?: string;
  source?: string;
  target?: string;
  sourcePage?: string;
  targetPage?: string;
  relevanceScore?: number;
}

export interface PageMetric {
  url: string;
  inLinks: number;
  outLinks: number;
  importance: string;
}

export interface LinkDistribution {
  [key: string]: number;
}

export interface OrphanPage {
  url: string;
  title?: string;
  suggestions?: string[];
}

export interface SiloStructure {
  theme: string;
  pages: string[];
}
