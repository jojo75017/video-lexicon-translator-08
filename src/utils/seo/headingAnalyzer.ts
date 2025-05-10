
import { HeadingStructure, HierarchyItem } from '@/types/seo';

export const analyzeHeadings = (doc: Document): HeadingStructure => {
  console.log("Analyzing document headings structure");
  
  // Initialize result
  const result: HeadingStructure = {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    h1Count: 0,
    h2Count: 0,
    h3Count: 0,
    hierarchy: [],
    paragraphs: [], // Added for compatibility
    headings: [] // Added for compatibility
  };

  try {
    // Extract all headings
    const h1Elements = Array.from(doc.querySelectorAll('h1'));
    const h2Elements = Array.from(doc.querySelectorAll('h2'));
    const h3Elements = Array.from(doc.querySelectorAll('h3'));
    const h4Elements = Array.from(doc.querySelectorAll('h4'));
    const h5Elements = Array.from(doc.querySelectorAll('h5'));
    const h6Elements = Array.from(doc.querySelectorAll('h6'));
    const pElements = Array.from(doc.querySelectorAll('p'));
    
    console.log(`Found: H1=${h1Elements.length}, H2=${h2Elements.length}, H3=${h3Elements.length}, p=${pElements.length}`);
    
    // Store heading content
    result.h1 = h1Elements.map(el => el.textContent || '');
    result.h2 = h2Elements.map(el => el.textContent || '');
    result.h3 = h3Elements.map(el => el.textContent || '');
    result.h4 = h4Elements.map(el => el.textContent || '');
    result.h5 = h5Elements.map(el => el.textContent || '');
    result.h6 = h6Elements.map(el => el.textContent || '');
    
    // Count headings
    result.h1Count = h1Elements.length;
    result.h2Count = h2Elements.length;
    result.h3Count = h3Elements.length;
    
    // For compatibility with existing code
    const allHeadings = [
      ...h1Elements.map((el, idx) => ({ 
        id: `h1-${idx}`,
        name: el.textContent || '',
        level: 1,
        text: el.textContent || '', 
        tagName: 'h1', 
        position: idx,
        children: []
      } as HierarchyItem)),
      ...h2Elements.map((el, idx) => ({ 
        id: `h2-${idx}`,
        name: el.textContent || '',
        level: 2,
        text: el.textContent || '', 
        tagName: 'h2', 
        position: idx,
        children: []
      } as HierarchyItem)),
      ...h3Elements.map((el, idx) => ({ 
        id: `h3-${idx}`,
        name: el.textContent || '',
        level: 3,
        text: el.textContent || '', 
        tagName: 'h3', 
        position: idx,
        children: []
      } as HierarchyItem)),
      ...h4Elements.map((el, idx) => ({ 
        id: `h4-${idx}`,
        name: el.textContent || '',
        level: 4,
        text: el.textContent || '', 
        tagName: 'h4', 
        position: idx,
        children: []
      } as HierarchyItem))
    ];
    
    // Sort all headings by their position in the document
    const sortedHeadings = allHeadings.sort((a, b) => {
      return (a.position || 0) - (b.position || 0);
    });
    
    result.headings = sortedHeadings;
    
    // Build hierarchy
    const hierarchy: HierarchyItem[] = [];
    let currentH1: HierarchyItem | null = null;
    let currentH2: HierarchyItem | null = null;
    let currentH3: HierarchyItem | null = null;
    
    for (const heading of sortedHeadings) {
      const level = heading.level;
      
      if (level === 1) {
        currentH1 = { ...heading, children: [] };
        hierarchy.push(currentH1);
        currentH2 = null;
        currentH3 = null;
      } 
      else if (level === 2) {
        currentH2 = { ...heading, children: [] };
        if (currentH1) {
          currentH1.children?.push(currentH2);
        } else {
          hierarchy.push(currentH2);
        }
        currentH3 = null;
      }
      else if (level === 3) {
        currentH3 = { ...heading, children: [] };
        if (currentH2) {
          currentH2.children?.push(currentH3);
        } else if (currentH1) {
          currentH1.children?.push(currentH3);
        } else {
          hierarchy.push(currentH3);
        }
      }
      else if (level === 4) {
        if (currentH3) {
          currentH3.children?.push(heading);
        } else if (currentH2) {
          currentH2.children?.push(heading);
        } else if (currentH1) {
          currentH1.children?.push(heading);
        } else {
          hierarchy.push(heading);
        }
      }
    }
    
    result.hierarchy = hierarchy;
    
    // Add paragraphs for compatibility
    result.paragraphs = pElements.map((el, idx) => ({
      text: el.textContent || '',
      position: idx,
    }));
    
  } catch (error) {
    console.error("Error analyzing headings structure:", error);
  }

  return result;
};

export const getHeadingIssues = (headingStructure: HeadingStructure): string[] => {
  const issues: string[] = [];
  
  // Check if there's an H1
  if (headingStructure.h1.length === 0) {
    issues.push('La page ne contient pas de titre H1. Chaque page devrait avoir un titre H1 unique.');
  }
  
  // Check if there are multiple H1s
  if (headingStructure.h1.length > 1) {
    issues.push('La page contient plusieurs titres H1. Pour une meilleure optimisation SEO, utilisez un seul titre H1 par page.');
  }
  
  // Check if the hierarchy is logical (H2 comes after H1, H3 after H2, etc.)
  let foundH1 = false;
  let foundH2 = false;
  let foundH3 = false;
  
  const allHeadings = headingStructure.headings || [];
  
  for (const heading of allHeadings) {
    if (heading.level === 1) foundH1 = true;
    else if (heading.level === 2) {
      foundH2 = true;
      if (!foundH1) issues.push('Un titre H2 apparaît avant tout titre H1. Respectez la hiérarchie des titres.');
    }
    else if (heading.level === 3) {
      foundH3 = true;
      if (!foundH2) issues.push('Un titre H3 apparaît avant tout titre H2. Respectez la hiérarchie des titres.');
    }
    else if (heading.level === 4) {
      if (!foundH3) issues.push('Un titre H4 apparaît avant tout titre H3. Respectez la hiérarchie des titres.');
    }
  }
  
  return issues;
};
