
import { InternalLinkRecommendation } from '@/types/seo';
import { findRelevantSourcePage } from './helper-functions';

/**
 * Generate recommendations based on the analysis
 */
export function generateRecommendations(
  pageMetrics: any[], 
  orphanPages: string[],
  currentUrl: string,
  contentLinks: number,
  totalLinks: number
): InternalLinkRecommendation[] {
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
        source: currentUrl,
        target: deepPage.url,
        description: `Améliorer l'accessibilité de ${new URL(deepPage.url).pathname}`,
        reason: `Cette page importante est profondément enfouie (niveau ${deepPage.depth}). Ajoutez des liens directs depuis la page d'accueil ou la navigation principale.`
      });
    });

  // Add general recommendation about internal linking structure
  if (contentLinks < totalLinks * 0.3) {
    recommendations.push({
      type: 'info',
      priority: 'medium',
      impact: 70,
      description: "Augmenter le nombre de liens contextuels dans le contenu",
      reason: "La plupart de vos liens internes sont dans les menus de navigation. Ajouter des liens contextuels dans le contenu améliore l'expérience utilisateur et le référencement."
    });
  }

  return recommendations;
}
