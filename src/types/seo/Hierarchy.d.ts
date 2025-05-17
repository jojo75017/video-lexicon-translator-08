
export interface HierarchyItem {
  id: string;
  content: string;
  children?: HierarchyItem[];
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  depth?: number;
  parentId?: string;
}

export interface HeadingStructure {
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
}

export interface StructureItem {
  content: string;
  id: string;
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  items?: string[];
}
