
export interface HierarchyItem {
  id?: string;
  content?: string;
  text?: string;
  tagName?: string;
  children?: HierarchyItem[];
  type?: "h1" | "h2" | "h3" | "h4" | "p" | "list" | string;
  depth?: number;
  parentId?: string;
  position?: number;
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
  type: "list" | "h3" | "p" | "h1" | "h2" | "h4" | string;
  items?: string[];
}
