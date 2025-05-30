
export interface HierarchyItem {
  level: number;
  text: string;
  id?: string;
}

export interface HeadingStructure {
  h1: HierarchyItem[];
  h2: HierarchyItem[];
  h3: HierarchyItem[];
  h4: HierarchyItem[];
  h5: HierarchyItem[];
  h6: HierarchyItem[];
}

export interface StructureItem {
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  content: string;
  id: string;
  items?: string[];
}
