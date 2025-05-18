
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
