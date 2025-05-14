
// Types de hiérarchie de contenus

export interface HierarchyItem {
  level: number;
  tagName?: string;
  text?: string;
  name?: string;
  children?: HierarchyItem[];
  parentFound?: boolean;
}

export interface HeadingStructure {
  hierarchy: HierarchyItem[];
  issues?: string[];
}

export type StructureItemType = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'list';

export interface StructureItem {
  id: string;
  content: string;
  type: StructureItemType;
  items?: string[];
}
