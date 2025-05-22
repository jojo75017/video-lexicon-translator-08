
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
    
    // Vérifier les directives follow/nofollow
    if (robotsContent && robotsContent.includes('nofollow')) {
      results.reasons.push('La balise meta robots contient "nofollow", ce qui limite l\'exploration des liens.');
      results.recommendations.push('Envisagez de supprimer "nofollow" pour permettre aux moteurs de recherche de suivre les liens de cette page.');
    }
  }

  // Vérifier aussi la balise X-Robots-Tag spécifique à Google (simulé car on ne peut pas accéder aux en-têtes HTTP côté client)
  const googleBotTag = doc.querySelector('meta[name="googlebot"]');
  if (googleBotTag) {
    const googleBotContent = googleBotTag.getAttribute('content');
    if (googleBotContent && googleBotContent.includes('noindex')) {
      results.canIndex = false;
      results.reasons.push('La balise meta googlebot contient "noindex".');
      results.recommendations.push('Supprimez "noindex" de la balise meta googlebot si vous souhaitez que cette page soit indexée par Google.');
    }
  }

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

  // Vérifier la présence d'un sitemap
  const sitemaps = Array.from(doc.querySelectorAll('a')).filter(a => 
    a.href.includes('sitemap.xml') || 
    a.textContent?.toLowerCase().includes('sitemap')
  );
  
  if (sitemaps.length === 0) {
    results.recommendations.push('Aucun lien vers un sitemap n\'a été trouvé. Assurez-vous d\'avoir un sitemap.xml et de le référencer dans robots.txt.');
  }

  // Vérifier les références au fichier robots.txt
  const robotsTxtLinks = Array.from(doc.querySelectorAll('a')).filter(a => 
    a.href.includes('robots.txt') || 
    a.textContent?.toLowerCase().includes('robots.txt')
  );
  
  if (robotsTxtLinks.length === 0) {
    results.recommendations.push('Vérifiez que votre fichier robots.txt est correctement configuré et accessible.');
  }
  
  // Vérifier la compatibilité mobile (simulation basique)
  const viewportTag = doc.querySelector('meta[name="viewport"]');
  if (!viewportTag) {
    results.reasons.push('Pas de balise viewport trouvée, ce qui peut indiquer une mauvaise optimisation mobile.');
    results.recommendations.push('Ajoutez une balise meta viewport pour optimiser l\'affichage sur les appareils mobiles: <meta name="viewport" content="width=device-width, initial-scale=1">');
  } else {
    const viewportContent = viewportTag.getAttribute('content');
    if (!viewportContent || !viewportContent.includes('width=device-width')) {
      results.reasons.push('La balise viewport n\'est pas correctement configurée pour les appareils mobiles.');
      results.recommendations.push('Configurez correctement la balise viewport: <meta name="viewport" content="width=device-width, initial-scale=1">');
    }
  }

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

  // Vérifier la présence de contenu dupliqué (simulation basique)
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headingTexts = headings.map(h => h.textContent?.trim().toLowerCase());
  const uniqueHeadings = new Set(headingTexts);
  if (headingTexts.length > uniqueHeadings.size + 2) { // Une tolérance de 2 titres dupliqués
    results.recommendations.push('Plusieurs titres identiques détectés. Évitez le contenu dupliqué pour une meilleure indexation.');
  }

  // Vérifier la crawlabilité des liens importants (navigation)
  const navLinks = Array.from(doc.querySelectorAll('nav a, header a, footer a'));
  const uncrawlableNavLinks = navLinks.filter(a => {
    const hasOnClick = a.hasAttribute('onclick') || a.hasAttribute('ng-click') || a.hasAttribute('v-on:click');
    const hasHashOnly = a.getAttribute('href') === '#' || a.getAttribute('href') === 'javascript:void(0)';
    return hasOnClick || hasHashOnly;
  });
  
  if (uncrawlableNavLinks.length > 0) {
    results.reasons.push('Certains liens de navigation ne sont pas crawlables (utilisation de onclick/javascript).');
    results.recommendations.push('Remplacez les liens basés sur JavaScript par de vrais liens href pour améliorer la crawlabilité.');
  }

  // Vérifier la présence de contenus cachés qui pourraient être considérés comme du cloaking
  const hiddenElements = Array.from(doc.querySelectorAll('*')).filter(el => {
    const style = window.getComputedStyle(el as Element);
    return style.display === 'none' || style.visibility === 'hidden' || 
           (style.height === '0px' && style.overflow === 'hidden') ||
           parseFloat(style.opacity) === 0;
  });
  
  if (hiddenElements.length > 10) { // Seuil arbitraire
    results.recommendations.push('Nombreux éléments cachés détectés. Assurez-vous de ne pas masquer de contenu important aux moteurs de recherche.');
  }

  // Vérifier la présence de Schema.org markup
  const schemaScript = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  if (schemaScript.length === 0) {
    results.recommendations.push('Aucun balisage Schema.org détecté. Ajoutez des données structurées pour améliorer la compréhension de votre contenu par les moteurs de recherche.');
  }

  // Vérifier la vitesse de chargement (simulation)
  // Dans une vraie implémentation, on utiliserait l'API Performance ou des métriques réelles
  results.recommendations.push('Vérifiez la vitesse de chargement de votre page. Les pages lentes peuvent être moins bien indexées.');

  return results;
};

/**
 * Analyse la structure des liens internes pour l'indexabilité
 */
export const analyzeLinkStructure = (doc: Document) => {
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

  // Analyse de la profondeur des liens (pour estimer la profondeur de crawl)
  const linkDepths = internalLinks.map(a => {
    const href = a.getAttribute('href') || '';
    return href.split('/').filter(Boolean).length;
  });
  
  const maxDepth = Math.max(...linkDepths, 0);
  const avgDepth = linkDepths.reduce((sum, depth) => sum + depth, 0) / (linkDepths.length || 1);
  
  return {
    totalLinks: allLinks.length,
    internalLinks: internalLinks.length,
    externalLinks: allLinks.length - internalLinks.length,
    maxDepth,
    avgDepth,
    percentageNofollow: allLinks.filter(a => a.rel && a.rel.includes('nofollow')).length / allLinks.length * 100
  };
};

/**
 * Analyse l'accessibilité d'un site pour les moteurs de recherche
 */
export const analyzeCrawlability = (doc: Document) => {
  const results = {
    factors: [] as {factor: string, status: 'good' | 'warning' | 'bad', message: string}[]
  };
  
  // Vérifier les balises de base
  const hasTitle = !!doc.querySelector('title');
  results.factors.push({
    factor: 'Balise title',
    status: hasTitle ? 'good' : 'bad',
    message: hasTitle ? 'Présente' : 'Absente - critique pour l\'indexation'
  });
  
  const hasDescription = !!doc.querySelector('meta[name="description"]');
  results.factors.push({
    factor: 'Meta description',
    status: hasDescription ? 'good' : 'warning',
    message: hasDescription ? 'Présente' : 'Absente - recommandée pour l\'indexation'
  });
  
  // Vérifier la structure HTML
  const hasHeadings = doc.querySelectorAll('h1, h2, h3').length > 0;
  results.factors.push({
    factor: 'Structure de titres',
    status: hasHeadings ? 'good' : 'warning',
    message: hasHeadings ? 'Présente' : 'Absente - importante pour la compréhension du contenu'
  });
  
  // Vérifier les images
  const imagesWithoutAlt = Array.from(doc.querySelectorAll('img')).filter(img => !img.hasAttribute('alt'));
  results.factors.push({
    factor: 'Attributs ALT des images',
    status: imagesWithoutAlt.length === 0 ? 'good' : 'warning',
    message: imagesWithoutAlt.length === 0 ? 
      'Toutes les images ont des attributs alt' : 
      `${imagesWithoutAlt.length} images sans attribut alt - peut affecter l'indexation des images`
  });
  
  return results;
};
