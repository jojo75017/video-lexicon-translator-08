
/**
 * Analyser l'indexabilité d'un site web
 */
export const analyzeIndexability = (doc: Document) => {
  const results = {
    canIndex: true,
    indexablePages: 0,
    reasons: [] as string[],
    recommendations: [] as string[],
  };

  // Vérifier si robots noindex est présent
  const robotsTag = doc.querySelector('meta[name="robots"]');
  if (robotsTag) {
    const robotsContent = robotsTag.getAttribute('content');
    if (robotsContent && robotsContent.includes('noindex')) {
      results.canIndex = false;
      results.reasons.push('La balise meta robots contient "noindex".');
      results.recommendations.push('Supprimez "noindex" de la balise meta robots si vous souhaitez que cette page soit indexée.');
    }
  }

  // Vérifier si X-Robots-Tag HTTP header est présent (simulé car nous ne pouvons pas le vérifier côté client)
  
  // Vérifier les balises canoniques
  const canonicalTag = doc.querySelector('link[rel="canonical"]');
  if (canonicalTag) {
    const canonicalUrl = canonicalTag.getAttribute('href');
    const currentUrl = window.location.href;
    if (canonicalUrl && canonicalUrl !== currentUrl) {
      results.reasons.push(`La balise canonique pointe vers une URL différente: ${canonicalUrl}`);
      results.recommendations.push('Assurez-vous que la balise canonique pointe vers l\'URL correcte.');
    }
  } else {
    results.recommendations.push('Ajoutez une balise canonique pour aider les moteurs de recherche à comprendre l\'URL principale.');
  }

  // Vérifier le sitemap
  const sitemaps = Array.from(doc.querySelectorAll('a')).filter(a => 
    a.href.includes('sitemap.xml') || 
    a.textContent?.toLowerCase().includes('sitemap')
  );
  
  if (sitemaps.length === 0) {
    results.recommendations.push('Aucun lien vers un sitemap n\'a été trouvé. Assurez-vous d\'avoir un sitemap.xml.');
  }

  // Vérifier le fichier robots.txt (simulé)
  results.recommendations.push('Vérifiez que votre fichier robots.txt est correctement configuré.');

  // Vérifier les codes de statut HTTP (simulé car nous ne pouvons pas le faire côté client)
  
  // Estimer le nombre de pages indexables
  const allLinks = Array.from(doc.querySelectorAll('a[href]'));
  const internalLinks = allLinks.filter(a => {
    const href = a.getAttribute('href');
    if (!href) return false;
    if (href.startsWith('/')) return true;
    try {
      const url = new URL(href);
      return url.hostname === window.location.hostname;
    } catch (e) {
      return false;
    }
  });
  
  // Estimation très approximative
  results.indexablePages = Math.max(1, new Set(internalLinks.map(a => a.getAttribute('href'))).size);

  // Vérifier les redirections (simulé)
  
  // Vérifier la structure des URL
  const complexURLs = allLinks.filter(a => {
    const href = a.getAttribute('href');
    if (!href) return false;
    return href.includes('?') && href.split('?')[1].length > 20;
  });
  
  if (complexURLs.length > 0) {
    results.recommendations.push('Certaines URL sont complexes avec beaucoup de paramètres. Simplifiez vos URL pour une meilleure indexation.');
  }

  // Vérifier si JavaScript est requis pour le contenu principal
  const mainContent = doc.querySelector('main') || doc.querySelector('article') || doc.body;
  if (mainContent && mainContent.querySelectorAll('*').length < 10) {
    results.recommendations.push('Le contenu principal semble minime. Vérifiez que votre contenu n\'est pas entièrement généré par JavaScript, ce qui pourrait poser des problèmes d\'indexation.');
  }

  return results;
};
