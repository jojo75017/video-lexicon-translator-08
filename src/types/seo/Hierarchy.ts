
export interface SiteStructureNode {
  name: string;
  path?: string;
  children: SiteStructureNode[];
  [key: string]: any;
}

export interface SiteStructure {
  name: string;
  url?: string;
  children: SiteStructureNode[];
  headings?: HeadingInfo[];
  links?: {
    internal: number;
    external: number;
    broken: number;
  };
  depth?: number;
  [key: string]: any;
}

export interface HeadingInfo {
  level: number;
  text: string;
  id?: string;
}

export interface StructureAnalysisResult {
  structure: SiteStructure;
  links: {
    internal: number;
    external: number;
    broken: number;
  };
  headings: HeadingInfo[];
  depth: number;
  analysisDate: string;
}

export interface HierarchyItem {
  title?: string;
  id?: string;
  tagName?: string;
  text?: string;
  children?: HierarchyItem[];
  level?: number;
  position?: number;
  name?: string;
  parentFound?: boolean;
}

export interface HeadingStructure {
  level: number;
  text: string;
  id: string;
  children?: HeadingStructure[];
}

export interface StructureItem {
  type: string;
  content: string;
  id: string;
  items?: string[];
}

export interface SocialMetricsProps {
  metrics: {
    facebook?: number;
    twitter?: number;
    pinterest?: number;
    linkedin?: number;
    [key: string]: any;
  };
  facebook?: any;
  twitter?: any;
  pinterest?: any;
  linkedin?: any;
}

export interface BacklinksAnalysisProps {
  backlinks: any[];
  doFollowCount?: number;
  noFollowCount?: number;
  topDomains?: any[];
  qualityScore?: number;
  relevanceScore?: number;
  trustScore?: number;
}

export interface SocialTags {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

export interface BrokenLink {
  url: string;
  statusCode?: number;
  anchor?: string;
}
