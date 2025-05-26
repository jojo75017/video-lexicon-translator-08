
import { PageLinkMetric, LinkSuggestion } from '@/types/seo/InternalLinks';

export function generateLinkSuggestions(
  pages: PageLinkMetric[],
  siteUrl: string
): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  
  // Analyser chaque page pour trouver des opportunités de liens
  pages.forEach(sourcePage => {
    // Trouver les pages cibles potentielles
    const potentialTargets = findPotentialTargets(sourcePage, pages);
    
    potentialTargets.forEach(target => {
      const suggestion = createLinkSuggestion(sourcePage, target, siteUrl);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    });
  });
  
  // Trier par priorité et pertinence
  return suggestions
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.seoValue - a.seoValue;
    })
    .slice(0, 20); // Limiter à 20 suggestions
}

function findPotentialTargets(
  sourcePage: PageLinkMetric,
  allPages: PageLinkMetric[]
): PageLinkMetric[] {
  return allPages.filter(page => {
    // Ne pas se lier à soi-même
    if (page.url === sourcePage.url) return false;
    
    // Privilégier les pages avec peu de liens entrants
    if (page.incomingLinks < 3) return true;
    
    // Privilégier les pages importantes mais peu connectées
    if ((page.importance || 0) > 70 && page.incomingLinks < 5) return true;
    
    // Éviter les pages déjà bien connectées
    if (page.incomingLinks > 10) return false;
    
    return Math.random() > 0.7; // Ajouter de la variété
  });
}

function createLinkSuggestion(
  source: PageLinkMetric,
  target: PageLinkMetric,
  siteUrl: string
): LinkSuggestion | null {
  // Générer un texte d'ancrage pertinent
  const anchorText = generateAnchorText(target);
  
  // Calculer la pertinence contextuelle
  const contextualRelevance = calculateContextualRelevance(source, target);
  
  // Calculer la valeur SEO
  const seoValue = calculateSeoValue(source, target);
  
  // Déterminer la priorité
  const priority = determinePriority(contextualRelevance, seoValue, target);
  
  // Générer la raison
  const reason = generateReason(source, target, contextualRelevance, seoValue);
  
  return {
    sourceUrl: source.url,
    sourceTitle: source.title || extractPageName(source.url),
    targetUrl: target.url,
    targetTitle: target.title || extractPageName(target.url),
    anchorText,
    reason,
    priority,
    contextualRelevance,
    seoValue,
    placement: suggestPlacement(source, target)
  };
}

function generateAnchorText(target: PageLinkMetric): string {
  const title = target.title || '';
  const urlPath = extractPageName(target.url);
  
  // Extraire des mots-clés du titre ou de l'URL
  if (title && title.length < 50) {
    return title;
  }
  
  // Générer un texte d'ancrage basé sur l'URL
  const cleanPath = urlPath
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
    
  if (cleanPath.length < 40) {
    return cleanPath;
  }
  
  return "En savoir plus";
}

function calculateContextualRelevance(
  source: PageLinkMetric,
  target: PageLinkMetric
): number {
  // Analyser la similarité des URL pour déterminer la pertinence
  const sourcePathSegments = new URL(source.url).pathname.split('/').filter(Boolean);
  const targetPathSegments = new URL(target.url).pathname.split('/').filter(Boolean);
  
  // Calculer les segments communs
  const commonSegments = sourcePathSegments.filter(segment => 
    targetPathSegments.includes(segment)
  );
  
  const maxSegments = Math.max(sourcePathSegments.length, targetPathSegments.length);
  const relevance = maxSegments > 0 ? (commonSegments.length / maxSegments) * 100 : 50;
  
  return Math.min(100, relevance + Math.random() * 20);
}

function calculateSeoValue(
  source: PageLinkMetric,
  target: PageLinkMetric
): number {
  let value = 50; // Valeur de base
  
  // Augmenter la valeur si la page cible a peu de liens entrants
  if (target.incomingLinks === 0) value += 30;
  else if (target.incomingLinks < 3) value += 20;
  else if (target.incomingLinks < 5) value += 10;
  
  // Augmenter la valeur si la page cible est importante
  if ((target.importance || 0) > 80) value += 20;
  else if ((target.importance || 0) > 60) value += 10;
  
  // Diminuer la valeur si la page source a déjà beaucoup de liens sortants
  if (source.outgoingLinks > 15) value -= 20;
  else if (source.outgoingLinks > 10) value -= 10;
  
  return Math.max(0, Math.min(100, value));
}

function determinePriority(
  contextualRelevance: number,
  seoValue: number,
  target: PageLinkMetric
): "high" | "medium" | "low" {
  const score = (contextualRelevance + seoValue) / 2;
  
  // Priorité haute pour les pages orphelines ou très importantes
  if (target.incomingLinks === 0 || (target.importance || 0) > 90) {
    return "high";
  }
  
  if (score > 75) return "high";
  if (score > 50) return "medium";
  return "low";
}

function generateReason(
  source: PageLinkMetric,
  target: PageLinkMetric,
  contextualRelevance: number,
  seoValue: number
): string {
  const reasons = [];
  
  if (target.incomingLinks === 0) {
    reasons.push("Page orpheline qui nécessite des liens");
  }
  
  if (target.incomingLinks < 3) {
    reasons.push("Page avec peu de liens entrants");
  }
  
  if ((target.importance || 0) > 80) {
    reasons.push("Page importante à promouvoir");
  }
  
  if (contextualRelevance > 70) {
    reasons.push("Forte pertinence thématique");
  }
  
  if (target.depth > 3) {
    reasons.push("Améliorer l'accessibilité de cette page profonde");
  }
  
  if (reasons.length === 0) {
    reasons.push("Opportunité d'améliorer le maillage interne");
  }
  
  return reasons.join(", ");
}

function suggestPlacement(
  source: PageLinkMetric,
  target: PageLinkMetric
): "header" | "content" | "sidebar" | "footer" {
  // Les liens contextuels dans le contenu sont les plus valorisés
  if ((target.importance || 0) > 70) return "content";
  
  // Les pages importantes dans la sidebar
  if ((target.importance || 0) > 50) return "sidebar";
  
  // Par défaut, dans le contenu
  return "content";
}

function extractPageName(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) return "Accueil";
    
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment
      .replace(/[-_]/g, ' ')
      .replace(/\.(html|php|aspx?)$/i, '')
      .replace(/\b\w/g, l => l.toUpperCase());
  } catch {
    return url.substring(url.lastIndexOf('/') + 1) || "Page";
  }
}
