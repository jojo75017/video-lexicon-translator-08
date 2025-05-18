
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
