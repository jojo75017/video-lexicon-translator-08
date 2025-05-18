
export type HierarchyItem = {
  text: string;
  tagName: string;
  position: number;
  children: HierarchyItem[];
};

export type StructureItemType = "h1" | "h2" | "h3" | "h4" | "p" | "list";

export type StructureItem = {
  content: string;
  id: string;
  type: StructureItemType;
  items?: string[];
};

export type PageMetric = {
  url: string;
  title: string;
  incomingLinks: number;
  outgoingLinks: number;
  depth: number;
  importance?: number;
};

export type SocialTags = {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
};

export type SocialMetrics = {
  facebook: number;
  twitter: number;
  pinterest: number;
  linkedin: number;
};

export type BacklinkInfo = {
  url: string;
  domain: string;
  anchorText: string;
  isDoFollow: boolean;
  domainAuthority: number;
};

export interface SocialMetricsProps {
  facebook: number;
  twitter: number;
  pinterest: number;
  linkedin: number;
}

export interface BacklinksAnalysisProps {
  backlinks: BacklinkInfo[];
  doFollowCount: number;
  noFollowCount: number;
  topDomains: any[];
  qualityScore: number;
  relevanceScore: number;
  trustScore: number;
}
