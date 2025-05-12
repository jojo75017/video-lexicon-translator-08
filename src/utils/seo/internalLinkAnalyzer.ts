
import { InternalLinkAnalysis, InternalLinkRecommendation } from '@/types/seo';

export const analyzeInternalLinks = (htmlContent: string, url: string): InternalLinkAnalysis => {
  if (!htmlContent || !url) {
    return createEmptyAnalysis();
  }

  try {
    // Parse HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const baseUrl = new URL(url).origin;
    
    // Get all links
    const allLinks = Array.from(doc.querySelectorAll('a[href]'));
    
    // Filter internal links (same origin)
    const internalLinks = allLinks.filter(link => {
      try {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
          return false;
        }
        
        const linkUrl = href.startsWith('/') 
          ? new URL(href, baseUrl).href
          : new URL(href);
          
        return linkUrl.origin === baseUrl;
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
    const pageMap = new Map();
    
    // Add current page
    pageMap.set(url, {
      url: url,
      title: doc.title,
      incomingLinks: 0,
      outgoingLinks: internalLinks.length,
      uniqueIncomingPages: 0,
      uniqueOutgoingPages: new Set(),
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
            title: link.textContent?.trim() || link.getAttribute('title') || fullUrl,
            incomingLinks: 1,
            outgoingLinks: 0,
            uniqueIncomingPages: new Set([url]),
            uniqueOutgoingPages: new Set(),
            depth: 1, // Direct link from current page
            importance: 0
          });
        } else {
          // Update existing page
          const pageData = pageMap.get(fullUrl);
          pageData.incomingLinks++;
          pageData.uniqueIncomingPages.add(url);
        }
        
        // Update current page's unique outgoing pages
        const currentPage = pageMap.get(url);
        currentPage.uniqueOutgoingPages.add(fullUrl);
        
      } catch (e) {
        console.error("Error processing link:", e);
      }
    });
    
    // Calculate importance and convert sets to counts
    const pageMetrics = Array.from(pageMap.values()).map(page => {
      // Calculate importance based on inbound links, depth, and main page
      let importance = page.url === url ? 100 : 0;
      
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
    
    // Calculate depth distribution
    const depthDistribution: Record<number, number> = {};
    pageMetrics.forEach(page => {
      if (!depthDistribution[page.depth]) {
        depthDistribution[page.depth] = 0;
      }
      depthDistribution[page.depth]++;
    });
    
    // Find orphaned pages (no incoming links except from current page)
    const orphanPages = pageMetrics
      .filter(page => page.url !== url && page.uniqueIncomingPages <= 1)
      .map(page => page.url);
    
    // Generate recommendations
    const recommendations: InternalLinkRecommendation[] = [];
    
    // Recommend linking orphaned pages
    orphanPages.forEach(orphanUrl => {
      const orphanPage = pageMetrics.find(p => p.url === orphanUrl);
      if (orphanPage) {
        recommendations.push({
          type: 'add',
          priority: 'high',
          impact: 85,
          source: findRelevantSourcePage(pageMetrics, orphanPage),
          target: orphanUrl,
          description: `Ajouter des liens vers la page orpheline ${new URL(orphanUrl).pathname}`,
          reason: "Les pages orphelines sont rarement indexées par les moteurs de recherche car elles sont difficiles à découvrir."
        });
      }
    });
    
    // Recommend improving deep pages
    pageMetrics
      .filter(page => page.depth > 3 && page.importance > 50)
      .forEach(deepPage => {
        recommendations.push({
          type: 'modify',
          priority: 'medium',
          impact: 65,
          source: url,
          target: deepPage.url,
          description: `Améliorer l'accessibilité de ${new URL(deepPage.url).pathname}`,
          reason: `Cette page importante est profondément enfouie (niveau ${deepPage.depth}). Ajoutez des liens directs depuis la page d'accueil ou la navigation principale.`
        });
      });
      
    // Add general recommendation about internal linking structure
    if (contentLinks < internalLinks.length * 0.3) {
      recommendations.push({
        type: 'info',
        priority: 'medium',
        impact: 70,
        description: "Augmenter le nombre de liens contextuels dans le contenu",
        reason: "La plupart de vos liens internes sont dans les menus de navigation. Ajouter des liens contextuels dans le contenu améliore l'expérience utilisateur et le référencement."
      });
    }
    
    // Detect if there might be a silo structure
    const potentialSilos = detectPotentialSilos(pageMetrics);
    
    // Return the full analysis
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
      recommendations
    };
  } catch (error) {
    console.error("Error analyzing internal links:", error);
    return createEmptyAnalysis();
  }
};

// Helper functions
function countLinksByContainer(links: HTMLAnchorElement[], selectors: string[]): number {
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

function calculateAverageDepth(pageMetrics: any[]): number {
  if (pageMetrics.length <= 1) return 0;
  
  // Exclude the current page from the calculation
  const filteredMetrics = pageMetrics.filter(page => page.depth > 0);
  if (filteredMetrics.length === 0) return 0;
  
  const sum = filteredMetrics.reduce((total, page) => total + page.depth, 0);
  return sum / filteredMetrics.length;
}

function findRelevantSourcePage(pageMetrics: any[], targetPage: any): string {
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

function detectPotentialSilos(pageMetrics: any[]): any[] {
  const silos: any[] = [];
  
  // Group pages by first path segment
  const pathGroups = new Map();
  
  pageMetrics.forEach(page => {
    try {
      const path = new URL(page.url).pathname;
      const parts = path.split('/').filter(Boolean);
      
      if (parts.length > 0) {
        const firstSegment = parts[0];
        
        if (!pathGroups.has(firstSegment)) {
          pathGroups.set(firstSegment, []);
        }
        
        pathGroups.get(firstSegment).push(page);
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

function createEmptyAnalysis(): InternalLinkAnalysis {
  return {
    totalLinks: 0,
    uniquePages: 0,
    linkDistribution: {
      navigationLinks: 0,
      contentLinks: 0,
      footerLinks: 0,
      sidebarLinks: 0,
      otherLinks: 0
    },
    linkDepth: {
      averageDepth: 0,
      maxDepth: 0,
      depthDistribution: {}
    },
    orphanPages: [],
    pageMetrics: [],
    siloPagesFound: false,
    recommendations: []
  };
}
