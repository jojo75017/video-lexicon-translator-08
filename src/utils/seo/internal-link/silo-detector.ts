
import { SiloStructure } from './types';

/**
 * Detect potential silo structures in the website
 */
export function detectPotentialSilos(pageMetrics: any[]): SiloStructure[] {
  const silos: SiloStructure[] = [];
  
  // Group pages by first path segment
  const pathGroups = new Map<string, any[]>();
  
  pageMetrics.forEach(page => {
    try {
      const pageUrl = new URL(page.url);
      const path = pageUrl.pathname;
      const parts = path.split('/').filter(Boolean);
      
      if (parts.length > 0) {
        const firstSegment = parts[0];
        
        if (!pathGroups.has(firstSegment)) {
          pathGroups.set(firstSegment, []);
        }
        
        pathGroups.get(firstSegment)?.push(page);
      }
    } catch {
      // Ignore URL parsing errors
    }
  });
  
  // Create silos from large enough groups
  pathGroups.forEach((pages, segment) => {
    if (pages.length >= 3) {
      // Find the most important page as the main page
      const sortedPages = [...pages].sort((a, b) => b.importance - a.importance);
      const mainPage = sortedPages[0];
      
      silos.push({
        name: segment.charAt(0).toUpperCase() + segment.slice(1),
        mainPage: mainPage.url,
        subPages: sortedPages.slice(1).map(page => page.url)
      });
    }
  });
  
  return silos;
}
