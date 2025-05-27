
export interface HeadingStructure {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  hierarchy: HierarchyItem[];
  headings: HeadingData[];
  issues: string[];
}

export interface HierarchyItem {
  level: number;
  text: string;
  tagName: string;
  parentFound: boolean;
  children: HierarchyItem[];
}

export interface HeadingData {
  level: number;
  text: string;
  position: number;
}

export function analyzeHeadings(doc: Document): HeadingStructure {
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingData: HeadingData[] = [];
  const hierarchy: HierarchyItem[] = [];
  const issues: string[] = [];
  
  let h1Count = 0, h2Count = 0, h3Count = 0, h4Count = 0, h5Count = 0, h6Count = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    const text = heading.textContent?.trim() || '';
    
    // Count headings by level
    switch (level) {
      case 1: h1Count++; break;
      case 2: h2Count++; break;
      case 3: h3Count++; break;
      case 4: h4Count++; break;
      case 5: h5Count++; break;
      case 6: h6Count++; break;
    }
    
    headingData.push({
      level,
      text,
      position: index
    });
    
    // Build hierarchy
    const hierarchyItem: HierarchyItem = {
      level,
      text,
      tagName: heading.tagName.toLowerCase(),
      parentFound: level === 1 || findParentInHierarchy(hierarchy, level),
      children: []
    };
    
    if (level === 1) {
      hierarchy.push(hierarchyItem);
    } else {
      addToHierarchy(hierarchy, hierarchyItem);
    }
  });
  
  // Check for issues
  if (h1Count === 0) {
    issues.push("Aucune balise H1 trouvée");
  } else if (h1Count > 1) {
    issues.push(`${h1Count} balises H1 trouvées (recommandé: 1)`);
  }
  
  if (h2Count === 0) {
    issues.push("Aucune balise H2 trouvée");
  }
  
  return {
    h1Count,
    h2Count,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    hierarchy,
    headings: headingData,
    issues
  };
}

function findParentInHierarchy(hierarchy: HierarchyItem[], level: number): boolean {
  return hierarchy.some(item => item.level < level);
}

function addToHierarchy(hierarchy: HierarchyItem[], item: HierarchyItem) {
  for (let i = hierarchy.length - 1; i >= 0; i--) {
    if (hierarchy[i].level < item.level) {
      hierarchy[i].children.push(item);
      return;
    }
  }
  hierarchy.push(item);
}
