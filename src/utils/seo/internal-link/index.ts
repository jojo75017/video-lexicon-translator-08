
// Point d'entrée unique pour l'analyse des liens internes

import type { InternalLinkAnalysis } from "@/types/seo/InternalLinks";
import { countLinksByContainer, calculateAverageDepth } from "./helper-functions";
import { processPageMetrics, calculateDepthDistribution, findOrphanedPages } from "./page-metrics";
import { detectPotentialSilos } from "./silo-detector";
import { generateRecommendations } from "./recommendations";
import { generateLinkSuggestions } from "./linkSuggestionGenerator";
import { createEmptyAnalysis } from "./empty-analysis";
import { PageData } from "./types";

/**
 * Main function to analyze internal links from HTML content
 */
export function analyzeInternalLinks(htmlContent: string, url: string): InternalLinkAnalysis {
  if (!htmlContent || !url) {
    return createEmptyAnalysis();
  }

  try {
    // Parse HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const currentUrl = new URL(url);
    const baseUrl = currentUrl.origin;
    
    // Get all links
    const allLinks = Array.from(doc.querySelectorAll('a[href]')) as HTMLAnchorElement[];
    
    // Filter internal links (same origin)
    const internalLinks = allLinks.filter(link => {
      try {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
          return false;
        }
        
        const linkUrl = href.startsWith('/') 
          ? new URL(href, baseUrl)
          : new URL(href);
          
        // Check if the URL is from the same origin
        return linkUrl.toString().startsWith(baseUrl);
      } catch {
        return false;
      }
    });
    
    // Count links by type based on their position in the document
    const navigationLinks = countLinksByContainer(internalLinks, ['nav', 'header']);
    const footerLinks = countLinksByContainer(internalLinks, ['footer']);
    const sidebarLinks = countLinksByContainer(internalLinks, ['.sidebar', '[class*="sidebar"]', 'aside']);
    const contentLinks = internalLinks.length - navigationLinks - footerLinks - sidebarLinks;
    
    // Build page metrics
    const pageMap = new Map<string, PageData>();
    
    // Add current page
    pageMap.set(url, {
      url: url,
      title: doc.title,
      incomingLinks: 0,
      outgoingLinks: internalLinks.length,
      uniqueIncomingPages: new Set<string>(),
      uniqueOutgoingPages: new Set<string>(),
      depth: 0,
      importance: 100 // Current page has max importance
    });
    
    // Process links
    internalLinks.forEach(link => {
      try {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const fullUrl = href.startsWith('/')
          ? new URL(href, baseUrl).href
          : href;
          
        // Skip anchor links to same page
        if (fullUrl === url) return;
        
        // Add outgoing page if not exists
        if (!pageMap.has(fullUrl)) {
          pageMap.set(fullUrl, {
            url: fullUrl,
            title: link.textContent?.trim() || link.getAttribute('title') || null,
            incomingLinks: 1,
            outgoingLinks: 0,
            uniqueIncomingPages: new Set<string>([url]),
            uniqueOutgoingPages: new Set<string>(),
            depth: 1, // Direct link from current page
            importance: 0
          });
        } else {
          // Update existing page
          const pageData = pageMap.get(fullUrl);
          if (pageData) {
            pageData.incomingLinks++;
            pageData.uniqueIncomingPages.add(url);
          }
        }
        
        // Update current page's unique outgoing pages
        const currentPage = pageMap.get(url);
        if (currentPage) {
          currentPage.uniqueOutgoingPages.add(fullUrl);
        }
        
      } catch (e) {
        console.error("Error processing link:", e);
      }
    });
    
    // Process page metrics
    const pageMetrics = processPageMetrics(pageMap);

    // Calculate depth distribution
    const depthDistribution = calculateDepthDistribution(pageMetrics);

    // Find orphaned pages
    const orphanPages = findOrphanedPages(pageMetrics, url);

    // Generate recommendations
    const recommendations = generateRecommendations(
      pageMetrics, 
      orphanPages, 
      url, 
      contentLinks, 
      internalLinks.length
    );

    // Generate link suggestions
    const linkSuggestions = generateLinkSuggestions(pageMetrics, url);

    // Detect silo pages
    const potentialSilos = detectPotentialSilos(pageMetrics);

    return {
      totalLinks: internalLinks.length,
      uniquePages: pageMap.size,
      linkDistribution: {
        navigationLinks,
        contentLinks,
        footerLinks,
        sidebarLinks,
        otherLinks: 0
      },
      linkDepth: {
        averageDepth: calculateAverageDepth(pageMetrics),
        maxDepth: Math.max(...pageMetrics.map(p => p.depth)),
        depthDistribution
      },
      orphanPages,
      pageMetrics,
      siloPagesFound: potentialSilos.length > 0,
      siloStructure: potentialSilos,
      recommendations,
      linkSuggestions
    };
  } catch (error) {
    console.error("Error analyzing internal links:", error);
    return createEmptyAnalysis();
  }
}

// Re-export de toutes les fonctions utiles
export * from "./helper-functions";
export * from "./page-metrics";
export * from "./silo-detector";
export * from "./recommendations";
export * from "./linkSuggestionGenerator";
export * from "./empty-analysis";
export * from "./types";
