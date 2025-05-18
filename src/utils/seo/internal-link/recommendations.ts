
import { InternalLinkRecommendation, PageLinkMetric } from '@/types/seo/InternalLinks';

/**
 * Generate recommendations based on the analysis
 */
export function generateRecommendations(
  pageMetrics: PageLinkMetric[], 
  orphanPages: OrphanPage[],
  currentUrl: string,
  contentLinks: number,
  totalLinks: number
): InternalLinkRecommendation[] {
  const recommendations: InternalLinkRecommendation[] = [];

  // Recommend linking orphaned pages
  orphanPages.forEach(orphanPage => {
    // Find the most relevant pages to link from
    const relevantSources = findRelevantSourcePages(pageMetrics, orphanPage);
    
    relevantSources.forEach(sourcePage => {
      recommendations.push({
        type: 'add',
        priority: 'high',
        source: sourcePage.url,
        target: orphanPage.url,
        description: `Ajouter un lien depuis "${truncateTitle(sourcePage.title || sourcePage.url)}" vers la page orpheline "${truncateTitle(orphanPage.title || orphanPage.url)}"`,
        reason: "Les pages orphelines sont rarement indexées par les moteurs de recherche car elles sont difficiles à découvrir."
      });
    });
  });

  // Recommend improving deep pages
  pageMetrics
    .filter(page => page.depth > 3 && page.importance > 50)
    .forEach(deepPage => {
      recommendations.push({
        type: 'modify',
        priority: 'medium',
        source: findShallowPage(pageMetrics).url,
        target: deepPage.url,
        description: `Améliorer l'accessibilité de "${truncateTitle(deepPage.title || deepPage.url)}"`,
        reason: `Cette page importante est profondément enfouie (niveau ${deepPage.depth}). Ajoutez des liens directs depuis la page d'accueil ou la navigation principale.`
      });
    });

  // Add content link recommendations
  if (contentLinks < totalLinks * 0.3) {
    // Find pages with high importance but few outgoing links
    const highImportanceLowLinks = pageMetrics
      .filter(p => p.importance > 70 && p.outgoingLinks < 5)
      .slice(0, 3);
      
    highImportanceLowLinks.forEach(page => {
      // Find good target pages for this page
      const goodTargets = findGoodTargets(pageMetrics, page);
      
      goodTargets.forEach(target => {
        recommendations.push({
          type: 'content',
          priority: 'medium',
          source: page.url,
          target: target.url,
          description: `Ajouter des liens contextuels depuis "${truncateTitle(page.title || page.url)}" vers "${truncateTitle(target.title || target.url)}"`,
          reason: "Les liens contextuels dans le contenu améliorent l'expérience utilisateur et le référencement."
        });
      });
    });
  }

  // Add pillar content recommendations if we have high authority pages
  const pillarPages = pageMetrics.filter(p => p.importance > 85);
  if (pillarPages.length > 0) {
    pillarPages.forEach(pillar => {
      recommendations.push({
        type: 'pillar',
        priority: 'low',
        source: pillar.url,
        target: '',
        description: `Utilisez "${truncateTitle(pillar.title || pillar.url)}" comme contenu pilier`,
        reason: "Cette page a une autorité élevée et pourrait servir de contenu pilier pour structurer votre maillage thématique."
      });
    });
  }

  // Ensure we have a reasonable number of recommendations
  return recommendations.slice(0, 12);
}

/**
 * Find pages that would be good source pages for linking to an orphan page
 */
function findRelevantSourcePages(pageMetrics: PageLinkMetric[], orphanPage: OrphanPage): PageLinkMetric[] {
  // For demo, return a couple of pages with high importance
  return pageMetrics
    .filter(page => page.importance > 60 && page.url !== orphanPage.url)
    .slice(0, 2);
}

/**
 * Find a shallow page (low depth) to link from
 */
function findShallowPage(pageMetrics: PageLinkMetric[]): PageLinkMetric {
  // Find the shallowest page with decent importance
  const shallowPages = pageMetrics
    .filter(page => page.importance > 50)
    .sort((a, b) => a.depth - b.depth);
  
  return shallowPages[0] || pageMetrics[0];
}

/**
 * Find good target pages to link to from a source page
 */
function findGoodTargets(pageMetrics: PageLinkMetric[], sourcePage: PageLinkMetric): PageLinkMetric[] {
  // Find pages that might be topically related (in real implementation this would use content analysis)
  return pageMetrics
    .filter(page => 
      page.url !== sourcePage.url &&
      page.importance > 40 &&
      page.incomingLinks < 5
    )
    .slice(0, 2);
}

/**
 * Truncate title for display
 */
function truncateTitle(title: string): string {
  if (title.length <= 40) return title;
  return title.substring(0, 37) + '...';
}

// For TypeScript compatibility with existing imports
interface OrphanPage {
  url: string;
  title?: string | null;
  suggestions?: string[];
}
