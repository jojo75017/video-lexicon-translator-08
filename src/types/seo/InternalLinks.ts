
// Interface pour l'analyse des liens internes
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
}

export interface InternalLinkRecommendation {
  from: string;
  to: string;
  reason: string;
  priority?: string;
  type?: string;
  description?: string;
  source?: string;
  target?: string;
}

export interface PageMetric {
  url: string;
  inLinks: number;
  outLinks: number;
  importance: string;
  incomingLinks?: number;
  outgoingLinks?: number;
  depth?: number;
}

export interface PageLinkMetric extends PageMetric {
  incomingLinks: number;
  outgoingLinks: number;
  depth: number;
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

export interface LinkSuggestion {
  from: string;
  to: string;
  anchor: string;
  reason: string;
  targetUrl?: string;
  targetTitle?: string;
  anchorText?: string;
  priority?: string;
  placement?: string;
  sourceTitle?: string;
}
