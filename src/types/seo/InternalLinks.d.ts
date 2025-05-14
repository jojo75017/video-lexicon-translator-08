
// Types pour l’analyse des liens internes

export interface InternalLinkAnalysis {
  totalLinks: number;
  uniquePages: number;
  linkDistribution: LinkDistribution;
  linkDepth: LinkDepth;
  orphanPages: string[];
  pageMetrics: PageLinkMetric[];
  siloPagesFound: boolean;
  siloStructure?: SiloStructure[];
  recommendations: InternalLinkRecommendation[];
}

export interface LinkDistribution {
  navigationLinks: number;
  contentLinks: number;
  footerLinks: number;
  sidebarLinks: number;
  otherLinks: number;
}

export interface LinkDepth {
  averageDepth: number;
  maxDepth: number;
  depthDistribution: Record<number, number>;
}

// "uniqueIncomingPages" et "uniqueOutgoingPages" sont des nombres ici pour l'affichage.
export interface PageLinkMetric {
  url: string;
  title: string | null;
  incomingLinks: number;
  outgoingLinks: number;
  uniqueIncomingPages: number;
  uniqueOutgoingPages: number;
  depth: number;
  importance: number;
}

export interface SiloStructure {
  name: string;
  mainPage: string;
  subPages: string[];
}

export interface InternalLinkRecommendation {
  type: 'add' | 'remove' | 'modify' | 'info';
  priority: 'high' | 'medium' | 'low';
  impact: number;
  source?: string;
  target?: string;
  description: string;
  reason: string;
}
