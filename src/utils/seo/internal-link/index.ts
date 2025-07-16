
// Point d'entrée unique pour l'analyse des liens internes

import type { InternalLinkAnalysis } from "@/types/seo/InternalLinks";
import { OrphanPage } from "@/types/seo/OrphanPage";
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
    console.log("Analyzing internal links for:", url);
    
    // Parse HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const currentUrl = new URL(url);
    const baseUrl = currentUrl.origin;
    
    console.log("Base URL:", baseUrl);
    
    // Get all links
    const allLinks = Array.from(doc.querySelectorAll('a[href]')) as HTMLAnchorElement[];
    console.log("Total links found:", allLinks.length);
    
    // Filter internal links (same origin)
    const internalLinks = allLinks.filter(link => {
      try {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
          return false;
        }
        
        const linkUrl = href.startsWith('/') 
          ? new URL(href, baseUrl)
          : new URL(href);
          
        // Check if the URL is from the same origin
        return linkUrl.origin === baseUrl;
      } catch {
        return false;
      }
    });
    
    console.log("Internal links found:", internalLinks.length);
    
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
    
    // Process links and discover pages
    const discoveredPages = new Set<string>();
    
    internalLinks.forEach(link => {
      try {
        const href = link.getAttribute('href');
        if (!href) return;
        
        const fullUrl = href.startsWith('/')
          ? new URL(href, baseUrl).href
          : href;
          
        // Skip anchor links to same page
        if (fullUrl === url) return;
        
        discoveredPages.add(fullUrl);
        
        // Add outgoing page if not exists
        if (!pageMap.has(fullUrl)) {
          pageMap.set(fullUrl, {
            url: fullUrl,
            title: link.textContent?.trim() || link.getAttribute('title') || extractTitleFromUrl(fullUrl),
            incomingLinks: 1,
            outgoingLinks: 0,
            uniqueIncomingPages: new Set<string>([url]),
            uniqueOutgoingPages: new Set<string>(),
            depth: 1, // Direct link from current page
            importance: calculatePageImportance(fullUrl, link.textContent?.trim() || '')
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
    
    // Add additional simulated pages for better suggestions
    addSimulatedPages(pageMap, baseUrl, discoveredPages);
    
    // Process page metrics
    const pageMetrics = processPageMetrics(pageMap);
    console.log("Page metrics processed:", pageMetrics.length, "pages");

    // Calculate depth distribution
    const depthDistribution = calculateDepthDistribution(pageMetrics);

    // Find orphaned pages - convert to OrphanPage objects
    const orphanPageUrls = findOrphanedPages(pageMetrics, url);
    const orphanPages: OrphanPage[] = orphanPageUrls.map(pageUrl => ({
      url: pageUrl,
      title: extractTitleFromUrl(pageUrl),
      lastModified: new Date().toISOString(),
      pageRank: 0,
      internalLinks: 0
    }));

    // Generate recommendations
    const recommendations = generateRecommendations(
      pageMetrics, 
      orphanPageUrls, 
      url, 
      contentLinks, 
      internalLinks.length
    );

    // Generate link suggestions
    const linkSuggestions = generateLinkSuggestions(pageMetrics, url);
    console.log("Link suggestions generated:", linkSuggestions.length);

    // Detect silo pages
    const potentialSilos = detectPotentialSilos(pageMetrics);

    const result = {
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
    
    console.log("Analysis complete:", result);
    return result;
  } catch (error) {
    console.error("Error analyzing internal links:", error);
    return createEmptyAnalysis();
  }
}

// Helper function to extract title from URL
function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const segments = path.split('/').filter(Boolean);
    
    if (segments.length === 0) return "Accueil";
    
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .replace(/[-_]/g, ' ')
      .replace(/\.(html|php|aspx?)$/i, '')
      .replace(/\b\w/g, l => l.toUpperCase());
  } catch {
    return "Page";
  }
}

// Helper function to calculate page importance
function calculatePageImportance(url: string, linkText: string): number {
  let importance = 50; // Base importance
  
  // URL-based importance
  if (url.includes('/blog/') || url.includes('/article/')) importance += 20;
  if (url.includes('/product/') || url.includes('/service/')) importance += 25;
  if (url.includes('/about') || url.includes('/contact')) importance += 15;
  if (url.includes('/category/') || url.includes('/tag/')) importance += 10;
  
  // Link text-based importance
  if (linkText.length > 20) importance += 10;
  if (linkText.toLowerCase().includes('important') || linkText.toLowerCase().includes('essentiel')) importance += 15;
  
  return Math.min(100, importance);
}

// Add simulated pages for better link suggestions
function addSimulatedPages(pageMap: Map<string, PageData>, baseUrl: string, discoveredPages: Set<string>) {
  const commonPages = [
    '/blog', '/articles', '/services', '/produits', '/a-propos', '/contact',
    '/actualites', '/ressources', '/guides', '/tutoriels', '/faq'
  ];
  
  commonPages.forEach(path => {
    const fullUrl = baseUrl + path;
    if (!pageMap.has(fullUrl) && !discoveredPages.has(fullUrl)) {
      pageMap.set(fullUrl, {
        url: fullUrl,
        title: extractTitleFromUrl(fullUrl),
        incomingLinks: 0,
        outgoingLinks: 0,
        uniqueIncomingPages: new Set<string>(),
        uniqueOutgoingPages: new Set<string>(),
        depth: 2,
        importance: calculatePageImportance(fullUrl, '')
      });
    }
  });
}

// Re-export de toutes les fonctions utiles
export * from "./helper-functions";
export * from "./page-metrics";
export * from "./silo-detector";
export * from "./recommendations";
export * from "./linkSuggestionGenerator";
export * from "./empty-analysis";
export * from "./types";
