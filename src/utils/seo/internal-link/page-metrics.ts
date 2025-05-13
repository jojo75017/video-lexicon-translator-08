
import { PageData } from './types';

/**
 * Process page metrics and calculate importance
 */
export function processPageMetrics(pageMap: Map<string, PageData>): any[] {
  // Calculate importance and convert sets to counts
  return Array.from(pageMap.values()).map(page => {
    // Calculate importance based on inbound links, depth, and main page
    let importance = 0;
    
    // Pages with more incoming links are more important
    importance += Math.min(page.incomingLinks * 5, 50);
    
    // Pages with more unique incoming pages are more important
    importance += Math.min(page.uniqueIncomingPages.size * 10, 40);
    
    // Lower depth is better
    importance -= page.depth * 5;
    
    // Cap importance between 0-100
    importance = Math.max(0, Math.min(100, importance));
    
    return {
      ...page,
      uniqueIncomingPages: page.uniqueIncomingPages.size,
      uniqueOutgoingPages: page.uniqueOutgoingPages.size,
      importance: Math.round(importance)
    };
  });
}

/**
 * Calculate depth distribution from page metrics
 */
export function calculateDepthDistribution(pageMetrics: any[]): Record<number, number> {
  const depthDistribution: Record<number, number> = {};
  pageMetrics.forEach(page => {
    if (!depthDistribution[page.depth]) {
      depthDistribution[page.depth] = 0;
    }
    depthDistribution[page.depth]++;
  });
  return depthDistribution;
}

/**
 * Identify orphaned pages (pages with no incoming links except from current page)
 */
export function findOrphanedPages(pageMetrics: any[], currentPageUrl: string): string[] {
  return pageMetrics
    .filter(page => page.url !== currentPageUrl && page.uniqueIncomingPages <= 1)
    .map(page => page.url);
}
