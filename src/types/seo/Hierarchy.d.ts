
export interface StructureItem {
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list" | string;
  content: string;
  id: string;
  items?: string[];
}

export interface HierarchyData {
  items: StructureItem[];
  title?: string;
  url?: string;
}

export interface TitleTag {
  text: string;
  length: number;
  containsKeyword: boolean;
  isTruncated: boolean;
  recommendedLength: {
    min: number;
    max: number;
  };
}

export interface HeadingStructure {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  missingH1: boolean;
  headingOrder: boolean;
  structure: StructureItem[];
}
