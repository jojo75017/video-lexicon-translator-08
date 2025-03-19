
import { HeadingStructure } from '@/types/seo';

export const analyzeHeadings = (doc: Document): HeadingStructure => {
  // Get all headings
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  
  // Get all paragraphs
  const paragraphs = Array.from(doc.querySelectorAll('p'));
  
  // Create a combined array of headings and paragraphs to maintain document flow
  const contentElements = [...headings, ...paragraphs].sort((a, b) => {
    // Sort by position in the document
    const posA = Array.from(doc.body.querySelectorAll('*')).indexOf(a);
    const posB = Array.from(doc.body.querySelectorAll('*')).indexOf(b);
    return posA - posB;
  });
  
  // Build a hierarchical structure
  const hierarchy = [];
  let currentH1 = null;
  let currentH2 = null;
  let currentH3 = null;
  
  for (const element of contentElements) {
    const tagName = element.tagName.toLowerCase();
    const content = element.textContent?.trim() || '';
    const position = Array.from(doc.body.querySelectorAll('*')).indexOf(element);
    
    if (tagName === 'h1') {
      currentH1 = { text: content, children: [], tagName, position };
      currentH2 = null;
      currentH3 = null;
      hierarchy.push(currentH1);
    } else if (tagName === 'h2' && currentH1) {
      currentH2 = { text: content, children: [], tagName, position };
      currentH3 = null;
      currentH1.children.push(currentH2);
    } else if (tagName === 'h3' && currentH2) {
      currentH3 = { text: content, children: [], tagName, position };
      currentH2.children.push(currentH3);
    } else if (tagName === 'p') {
      const paragraph = { text: content, tagName, position };
      if (currentH3) {
        currentH3.children.push(paragraph);
      } else if (currentH2) {
        currentH2.children.push(paragraph);
      } else if (currentH1) {
        currentH1.children.push(paragraph);
      } else {
        hierarchy.push(paragraph);
      }
    }
  }
  
  return {
    h1Count: doc.getElementsByTagName('h1').length,
    h2Count: doc.getElementsByTagName('h2').length,
    h3Count: doc.getElementsByTagName('h3').length,
    headings: headings.map((heading, index) => ({
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
      position: index
    })),
    paragraphs: paragraphs.map((p, index) => ({
      text: p.textContent || '',
      position: index
    })),
    hierarchy
  };
};
