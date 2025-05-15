
export interface HierarchyItem {
  title: string;
  level: number;
  id: string;
  content?: string;
  children?: HierarchyItem[];
  type?: string;
}

export interface HeadingStructure {
  h1?: HierarchyItem[];
  h2?: HierarchyItem[];
  h3?: HierarchyItem[];
  h4?: HierarchyItem[];
  h5?: HierarchyItem[];
  h6?: HierarchyItem[];
  items?: HierarchyItem[];
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  h4Count?: number;
  h5Count?: number;
  h6Count?: number;
}

export interface StructureItem {
  content: string;
  id: string;
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  items?: string[];
}
