
import { HeadingStructure } from '@/types/seo';

export const analyzeHeadings = (doc: Document) => {
  return {
    h1Count: doc.getElementsByTagName('h1').length,
    h2Count: doc.getElementsByTagName('h2').length,
    h3Count: doc.getElementsByTagName('h3').length,
    headings: Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((heading, index) => ({
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
      position: index
    })),
  };
};
