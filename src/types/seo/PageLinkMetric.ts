
export interface PageLinkMetric {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  depth: number;
}

export interface OrphanPage {
  url: string;
  title: string;
}
