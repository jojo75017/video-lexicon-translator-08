
// Interface pour l'analyse des liens internes
export interface InternalLinkAnalysis {
  totalLinks?: number;
  uniquePages?: number;
  averageLinksPerPage?: number;
  recommendations?: InternalLinkRecommendation[];
  pageMetrics?: PageLinkMetric[];
  linkDistribution?: LinkDistribution;
  orphanPages?: OrphanPage[];
  siloPagesFound?: boolean;
  siloStructure?: SiloStructure[];
  linkDepth?: {
    averageDepth: number;
    maxDepth: number;
    depthDistribution: Record<string, number>;
  };
  linkSuggestions?: LinkSuggestion[];
}

export interface InternalLinkRecommendation {
  type: 'add' | 'modify' | 'content' | 'pillar';
  priority: 'high' | 'medium' | 'low';
  source?: string;
  target?: string;
  description?: string;
  reason: string;
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

export interface PageLinkMetric {
  url: string;
  title?: string | null;
  incomingLinks: number;
  outgoingLinks: number;
  depth: number;
  importance?: number;
}

export interface LinkDistribution {
  navigationLinks: number;
  contentLinks: number;
  footerLinks: number;
  sidebarLinks: number;
  otherLinks: number;
}

export interface OrphanPage {
  url: string;
  title?: string | null;
  suggestions?: string[];
}

export interface SiloStructure {
  name: string;
  mainPage: string;
  subPages: string[];
  theme: string;
  pages: string[];
}

export interface LinkSuggestion {
  sourceUrl: string;
  sourceTitle: string;
  targetUrl: string;
  targetTitle: string;
  anchorText: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  contextualRelevance: number;
  seoValue: number;
  placement: 'header' | 'content' | 'sidebar' | 'footer';
}
