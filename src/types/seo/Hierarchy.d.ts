
export interface HierarchyItem {
  text: string;
  tagName: string;
  position: number;
  children: HierarchyItem[];
}

export interface StructureItem {
  content: string;
  id: string;
  type: "h1" | "h2" | "h3" | "h4" | "p" | "list";
  items?: string[];
}
