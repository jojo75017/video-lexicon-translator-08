
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

// Additional types needed by components
export interface HierarchyItem {
  title: string;
  id: string;
  children?: HierarchyItem[];
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
  metrics: any;
}

export interface BacklinksAnalysisProps {
  backlinks: any[];
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
