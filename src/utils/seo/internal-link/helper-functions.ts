
/**
 * Helper functions for internal link analysis
 */

/**
 * Count links by their container elements
 */
export function countLinksByContainer(links: HTMLAnchorElement[], selectors: string[]): number {
  return links.filter(link => {
    let parent = link.parentElement;
    while (parent) {
      for (const selector of selectors) {
        if (selector.startsWith('.') || selector.startsWith('[')) {
          if (parent.matches(selector)) return true;
        } else {
          if (parent.tagName.toLowerCase() === selector.toLowerCase()) return true;
        }
      }
      parent = parent.parentElement;
    }
    return false;
  }).length;
}

/**
 * Calculate average depth of pages in the site
 */
export function calculateAverageDepth(pageMetrics: any[]): number {
  if (pageMetrics.length <= 1) return 0;
  
  // Exclude the current page from the calculation
  const filteredMetrics = pageMetrics.filter(page => page.depth > 0);
  if (filteredMetrics.length === 0) return 0;
  
  const sum = filteredMetrics.reduce((total, page) => total + page.depth, 0);
  return sum / filteredMetrics.length;
}

/**
 * Find a relevant source page for orphaned pages
 */
export function findRelevantSourcePage(pageMetrics: any[], targetPage: any): string {
  // Find a relevant page to link from based on URL similarity or importance
  const sourcePages = pageMetrics
    .filter(page => page.url !== targetPage.url)
    .sort((a, b) => b.importance - a.importance);
  
  if (sourcePages.length === 0) return '';
  
  // Try to find a thematically related page
  for (const page of sourcePages) {
    try {
      const sourcePath = new URL(page.url).pathname;
      const targetPath = new URL(targetPage.url).pathname;
      
      // Check if paths share a common directory structure
      const sourceParts = sourcePath.split('/').filter(Boolean);
      const targetParts = targetPath.split('/').filter(Boolean);
      
      if (sourceParts.length > 0 && targetParts.length > 0) {
        if (sourceParts[0] === targetParts[0]) {
          return page.url;
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }
  
  // Default to most important page
  return sourcePages[0].url;
}
