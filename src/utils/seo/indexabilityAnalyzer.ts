
/**
 * Analyser l'indexabilité d'un site web avec des analyses avancées
 */

export interface DetailedLinkStats {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  noFollowLinks: number;
  doFollowLinks: number;
  brokenLinksEstimate: number;
  averageLinksPerPage: number;
  linkDistribution: {
    navigation: number;
    content: number;
    footer: number;
    sidebar: number;
  };
}

export interface SchemaAnalysis {
  hasSchema: boolean;
  schemaTypes: string[];
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface IndexabilityReport {
  canIndex: boolean;
  indexablePages: number;
  reasons: string[];
  recommendations: string[];
  linkStats: DetailedLinkStats;
  schemaAnalysis: SchemaAnalysis;
  mobileScore: number;
  performanceIssues: string[];
  securityIssues: string[];
  technicalSeo: {
    hasRobotsTxt: boolean;
    hasSitemap: boolean;
    hasSSL: boolean;
    pageSpeed: number;
    coreWebVitals: {
      lcp: string;
      fid: string;
      cls: string;
    };
  };
}

/**
 * Analyser l'indexabilité d'un site web
 */
export const analyzeIndexability = (doc: Document): IndexabilityReport => {
  const results: IndexabilityReport = {
    canIndex: true,
    indexablePages: 0,
    reasons: [],
    recommendations: [],
    linkStats: {
      totalLinks: 0,
      internalLinks: 0,
      externalLinks: 0,
      noFollowLinks: 0,
      doFollowLinks: 0,
      brokenLinksEstimate: 0,
      averageLinksPerPage: 0,
      linkDistribution: {
        navigation: 0,
        content: 0,
        footer: 0,
        sidebar: 0
      }
    },
    schemaAnalysis: {
      hasSchema: false,
      schemaTypes: [],
      errors: [],
      warnings: [],
      recommendations: []
    },
    mobileScore: 0,
    performanceIssues: [],
    securityIssues: [],
    technicalSeo: {
      hasRobotsTxt: false,
      hasSitemap: false,
      hasSSL: false,
      pageSpeed: 0,
      coreWebVitals: {
        lcp: 'unknown',
        fid: 'unknown',
        cls: 'unknown'
      }
    }
  };

  // Analyser les balises robots
  const robotsTag = doc.querySelector('meta[name="robots"]');
  if (robotsTag) {
    const robotsContent = robotsTag.getAttribute('content');
    if (robotsContent && robotsContent.includes('noindex')) {
      results.canIndex = false;
      results.reasons.push('La balise meta robots contient "noindex".');
      results.recommendations.push('Supprimez "noindex" de la balise meta robots si vous souhaitez que cette page soit indexée.');
    }
    
    if (robotsContent && robotsContent.includes('nofollow')) {
      results.reasons.push('La balise meta robots contient "nofollow", ce qui limite l\'exploration des liens.');
      results.recommendations.push('Envisagez de supprimer "nofollow" pour permettre aux moteurs de recherche de suivre les liens de cette page.');
    }
  }

  // Analyser les liens en détail
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

  results.linkStats.totalLinks = allLinks.length;
  results.linkStats.internalLinks = internalLinks.length;
  results.linkStats.externalLinks = allLinks.length - internalLinks.length;
  results.linkStats.noFollowLinks = allLinks.filter(a => a.rel && a.rel.includes('nofollow')).length;
  results.linkStats.doFollowLinks = allLinks.length - results.linkStats.noFollowLinks;

  // Distribution des liens
  results.linkStats.linkDistribution.navigation = allLinks.filter(a => 
    a.closest('nav') || a.closest('header')
  ).length;
  results.linkStats.linkDistribution.footer = allLinks.filter(a => 
    a.closest('footer')
  ).length;
  results.linkStats.linkDistribution.sidebar = allLinks.filter(a => 
    a.closest('aside') || a.closest('.sidebar')
  ).length;
  results.linkStats.linkDistribution.content = allLinks.length - 
    results.linkStats.linkDistribution.navigation - 
    results.linkStats.linkDistribution.footer - 
    results.linkStats.linkDistribution.sidebar;

  // Analyser les schémas JSON-LD
  const schemaScripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  results.schemaAnalysis.hasSchema = schemaScripts.length > 0;
  
  if (schemaScripts.length > 0) {
    schemaScripts.forEach(script => {
      try {
        const schemaData = JSON.parse(script.textContent || '');
        if (schemaData['@type']) {
          results.schemaAnalysis.schemaTypes.push(schemaData['@type']);
        }
      } catch (e) {
        results.schemaAnalysis.errors.push('Erreur de parsing JSON-LD détectée');
      }
    });
  } else {
    results.schemaAnalysis.recommendations.push('Ajoutez des données structurées JSON-LD pour améliorer la compréhension par les moteurs de recherche');
  }

  // Analyser la compatibilité mobile
  const viewportTag = doc.querySelector('meta[name="viewport"]');
  let mobileScore = 0;
  
  if (viewportTag) {
    const viewportContent = viewportTag.getAttribute('content');
    if (viewportContent && viewportContent.includes('width=device-width')) {
      mobileScore += 25;
    }
  } else {
    results.reasons.push('Pas de balise viewport trouvée');
    results.recommendations.push('Ajoutez une balise meta viewport pour l\'optimisation mobile');
  }

  // Vérifier les images responsives
  const images = Array.from(doc.querySelectorAll('img'));
  const responsiveImages = images.filter(img => 
    img.hasAttribute('srcset') || 
    img.style.maxWidth === '100%' ||
    img.style.width === '100%'
  );
  
  if (responsiveImages.length > images.length * 0.7) {
    mobileScore += 25;
  } else {
    results.recommendations.push('Optimisez vos images pour les appareils mobiles avec srcset ou CSS responsive');
  }

  // Vérifier la taille des zones tactiles
  const buttons = Array.from(doc.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));
  let touchTargetScore = 0;
  buttons.forEach(button => {
    const rect = button.getBoundingClientRect();
    if (rect.width >= 44 && rect.height >= 44) {
      touchTargetScore++;
    }
  });
  
  if (buttons.length > 0 && touchTargetScore / buttons.length > 0.8) {
    mobileScore += 25;
  } else {
    results.recommendations.push('Assurez-vous que les zones tactiles font au moins 44x44px');
  }

  // Vérifier les polices
  const hasFlexibleFonts = !doc.querySelector('*[style*="font-size"][style*="px"]');
  if (hasFlexibleFonts) {
    mobileScore += 25;
  } else {
    results.recommendations.push('Utilisez des unités relatives (em, rem) pour les tailles de police');
  }

  results.mobileScore = mobileScore;

  // Analyser les performances
  const hasLargeImages = images.some(img => {
    const src = img.getAttribute('src');
    return src && (src.includes('.jpg') || src.includes('.png')) && !src.includes('optimized');
  });
  
  if (hasLargeImages) {
    results.performanceIssues.push('Images non optimisées détectées');
    results.recommendations.push('Optimisez vos images avec des formats modernes (WebP, AVIF)');
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

  // Vérifier HTTPS
  results.technicalSeo.hasSSL = window.location.protocol === 'https:';
  if (!results.technicalSeo.hasSSL) {
    results.securityIssues.push('Le site n\'utilise pas HTTPS');
    results.recommendations.push('Migrez vers HTTPS pour améliorer la sécurité et le SEO');
  }

  // Estimer le nombre de pages indexables
  results.indexablePages = Math.max(1, new Set(internalLinks.map(a => a.getAttribute('href'))).size);

  // Vérifier la présence d'un sitemap et robots.txt
  const sitemaps = Array.from(doc.querySelectorAll('a')).filter(a => 
    a.href.includes('sitemap.xml') || 
    a.textContent?.toLowerCase().includes('sitemap')
  );
  
  results.technicalSeo.hasSitemap = sitemaps.length > 0;
  if (!results.technicalSeo.hasSitemap) {
    results.recommendations.push('Ajoutez un sitemap.xml et référencez-le dans robots.txt');
  }

  // Vérifier les contenus cachés (cloaking potentiel)
  const hiddenElements = Array.from(doc.querySelectorAll('*')).filter(el => {
    const style = window.getComputedStyle(el as Element);
    return style.display === 'none' || style.visibility === 'hidden' || 
           (style.height === '0px' && style.overflow === 'hidden') ||
           parseFloat(style.opacity) === 0;
  });
  
  if (hiddenElements.length > 10) {
    results.recommendations.push('Nombreux éléments cachés détectés. Assurez-vous de ne pas masquer de contenu important aux moteurs de recherche.');
  }

  return results;
};

/**
 * Générer un rapport téléchargeable
 */
export const generateDownloadableReport = (results: IndexabilityReport, url: string): string => {
  const report = `
RAPPORT D'ANALYSE D'INDEXABILITÉ
================================

URL analysée: ${url}
Date d'analyse: ${new Date().toLocaleDateString('fr-FR')}

RÉSUMÉ EXÉCUTIF
===============
Statut d'indexabilité: ${results.canIndex ? 'INDEXABLE' : 'NON INDEXABLE'}
Pages indexables estimées: ${results.indexablePages}
Score mobile: ${results.mobileScore}/100

ANALYSE DES LIENS
=================
Total des liens: ${results.linkStats.totalLinks}
Liens internes: ${results.linkStats.internalLinks}
Liens externes: ${results.linkStats.externalLinks}
Liens nofollow: ${results.linkStats.noFollowLinks}
Liens dofollow: ${results.linkStats.doFollowLinks}

Distribution:
- Navigation: ${results.linkStats.linkDistribution.navigation}
- Contenu: ${results.linkStats.linkDistribution.content}
- Pied de page: ${results.linkStats.linkDistribution.footer}
- Barre latérale: ${results.linkStats.linkDistribution.sidebar}

ANALYSE DES SCHÉMAS STRUCTURÉS
==============================
Présence de Schema.org: ${results.schemaAnalysis.hasSchema ? 'OUI' : 'NON'}
Types de schémas détectés: ${results.schemaAnalysis.schemaTypes.join(', ') || 'Aucun'}

SEO TECHNIQUE
=============
Robots.txt: ${results.technicalSeo.hasRobotsTxt ? 'Détecté' : 'Non détecté'}
Sitemap: ${results.technicalSeo.hasSitemap ? 'Détecté' : 'Non détecté'}
HTTPS: ${results.technicalSeo.hasSSL ? 'Activé' : 'Non activé'}

PROBLÈMES IDENTIFIÉS
====================
${results.reasons.map(reason => `- ${reason}`).join('\n')}

RECOMMANDATIONS
===============
${results.recommendations.map(rec => `- ${rec}`).join('\n')}

PROBLÈMES DE PERFORMANCE
========================
${results.performanceIssues.map(issue => `- ${issue}`).join('\n')}

PROBLÈMES DE SÉCURITÉ
=====================
${results.securityIssues.map(issue => `- ${issue}`).join('\n')}
`;

  return report;
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

  // Analyse de la profondeur des liens
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
