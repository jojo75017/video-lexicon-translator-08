
export interface InternalLinkAnalysis {
  totalLinks?: number;
  uniquePages?: number;
  linkDistribution?: {
    navigationLinks: number;
    contentLinks: number;
    footerLinks: number;
    sidebarLinks: number;
    otherLinks: number;
  };
  linkDepth?: {
    averageDepth: number;
    maxDepth: number;
    depthDistribution: Record<string, number>;
  };
  pageMetrics?: PageLinkMetric[];
  recommendations?: InternalLinkRecommendation[];
  orphanPages: OrphanPage[];
  siloPagesFound?: boolean;
  siloStructure?: SiloStructure[];
  averageDepth?: number;
  linkSuggestions?: LinkSuggestion[];
}

export interface LinkSuggestion {
  sourceUrl: string;
  sourceTitle: string;
  targetUrl: string;
  targetTitle: string;
  anchorText: string;
  reason: string;
  priority: "high" | "medium" | "low";
  contextualRelevance: number;
  seoValue: number;
  placement: "header" | "content" | "sidebar" | "footer";
}

export interface InternalLinkRecommendation {
  type: string;
  source?: string;
  target?: string;
  reason: string;
  priority: "high" | "medium" | "low";
  description?: string;
  impact?: string | number;
  anchorText?: string;
  placement?: string;
}

export interface PageLinkMetric {
  url: string;
  title?: string | null;
  incomingLinks: number;
  outgoingLinks: number;
  depth: number;
  importance?: number;
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
