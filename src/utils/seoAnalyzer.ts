import { SeoAnalysis, ImageAnalysis } from '@/types/seo';
import { getSearchAnalytics } from './googleSearchConsole';

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const startTime = performance.now();

  // Analyse des performances
  const performanceEntries = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const loadTime = performanceEntries ? performanceEntries.loadEventEnd - performanceEntries.startTime : 0;
  const firstContentfulPaint = performanceEntries ? performanceEntries.domContentLoadedEventEnd - performanceEntries.startTime : 0;
  const domLoadTime = performanceEntries ? performanceEntries.domComplete - performanceEntries.startTime : 0;

  // Analyse des mots-clés et de leur densité
  const textContent = doc.body.textContent?.toLowerCase() || '';
  const words = textContent.split(/\s+/);
  const keywordDensity = new Map<string, number>();
  words.forEach(word => {
    if (word.length > 3) { // Ignorer les mots trop courts
      keywordDensity.set(word, (keywordDensity.get(word) || 0) + 1);
    }
  });

  // Trier les mots-clés par fréquence
  const sortedKeywords = Array.from(keywordDensity.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({
      keyword,
      frequency: count,
      density: (count / words.length) * 100
    }));

  // Analyse de la structure sémantique
  const semanticTags = [
    'article', 'aside', 'footer', 'header', 'main', 'nav', 'section'
  ].reduce((acc, tag) => {
    acc[tag] = doc.getElementsByTagName(tag).length;
    return acc;
  }, {} as Record<string, number>);

  // Analyse approfondie des liens
  const links = Array.from(doc.getElementsByTagName('a'));
  const internalLinks = links.filter(link => {
    try {
      const linkUrl = new URL(link.href);
      const pageUrl = new URL(url);
      return linkUrl.hostname === pageUrl.hostname;
    } catch {
      return false;
    }
  });

  const linkAnalysis = {
    total: links.length,
    internal: internalLinks.length,
    external: links.length - internalLinks.length,
    withTitle: links.filter(link => link.title).length,
    withDescription: links.filter(link => link.getAttribute('aria-label')).length,
    nofollow: links.filter(link => link.rel.includes('nofollow')).length,
    dofollow: links.filter(link => !link.rel.includes('nofollow')).length
  };

  // Analyse de la lisibilité (score simple basé sur la longueur des phrases)
  const sentences = textContent.split(/[.!?]+/);
  const readabilityScore = Math.min(100, Math.max(0, 100 - (
    sentences.reduce((acc, sentence) => acc + sentence.split(/\s+/).length, 0) / sentences.length - 15
  ) * 5));

  // Suggestions de mots-clés améliorées basées sur l'analyse du contenu
  const keywordSuggestions = sortedKeywords.map(({ keyword }) => ({
    keyword,
    relevance: Math.floor(Math.random() * 30) + 70, // Simulation de la pertinence
    searchVolume: Math.floor(Math.random() * 10000),
    difficulty: Math.floor(Math.random() * 100),
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }));

  // Analyse des balises meta enrichie
  const metaTags = Array.from(doc.getElementsByTagName('meta')).reduce((acc, meta) => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      acc[name] = content;
    }
    return acc;
  }, {} as Record<string, string>);

  // Analyse des performances mobile (simulation)
  const mobilePerformance = {
    viewportMeta: !!doc.querySelector('meta[name="viewport"]'),
    responsiveImages: Array.from(doc.getElementsByTagName('img')).every(img => img.getAttribute('srcset') || img.getAttribute('sizes')),
    touchTargetSize: Array.from(doc.querySelectorAll('button, a, input, select, textarea')).every(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44;
    }),
    fontScale: true,
    score: Math.floor(Math.random() * 30) + 70
  };

  // Analyse des technologies utilisées (simulation)
  const technologies = {
    frameworks: ['React', 'Vue.js', 'Angular'].filter(() => Math.random() > 0.7),
    analytics: ['Google Analytics', 'Matomo'].filter(() => Math.random() > 0.7),
    advertising: ['Google Ads', 'Facebook Pixel'].filter(() => Math.random() > 0.7),
    cms: ['WordPress', 'Drupal'].filter(() => Math.random() > 0.7),
    server: ['Apache', 'Nginx'].filter(() => Math.random() > 0.7)
  };

  return {
    title: doc.title || "Pas de titre",
    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1Count: doc.getElementsByTagName('h1').length,
    h2Count: doc.getElementsByTagName('h2').length,
    h3Count: doc.getElementsByTagName('h3').length,
    headings: Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((heading, index) => ({
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1)),
      position: index
    })),
    paragraphs: Array.from(doc.getElementsByTagName('p')).map((p, index) => ({
      text: p.textContent || '',
      position: index
    })),
    imgCount: Array.from(doc.getElementsByTagName('img')).length,
    imgWithoutAlt: Array.from(doc.getElementsByTagName('img')).filter(img => !img.alt).length,
    imagesDetails: Array.from(doc.getElementsByTagName('img')).map(img => ({
      url: new URL(img.src, url).href,
      hasAlt: !!img.alt,
      alt: img.alt || undefined
    })),
    metaTagsCount: doc.getElementsByTagName('meta').length,
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    robotsMeta: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
    brokenLinks: [], // Placeholder for broken links analysis
    keywords: Array.from(doc.querySelectorAll('meta[name="keywords"]'))
      .map(meta => meta.getAttribute('content') || '')
      .filter(content => content !== '')
      .flatMap(content => content.split(',').map(keyword => keyword.trim())),
    googlePosition: null,
    authorityScore: 0,
    organicTraffic: 0,
    backlinks: 0,
    backlinkDetails: [],
    topBacklinkDomains: [],
    doFollowBacklinks: 0,
    noFollowBacklinks: 0,
    wordCount: textContent.trim().split(/\s+/).length,
    textToHtmlRatio: 0,
    internalLinks: 0, // Placeholder for internal links count
    externalLinks: 0, // Placeholder for external links count
    analytics: {
      pageViews: Math.floor(Math.random() * 10000),
      uniqueVisitors: Math.floor(Math.random() * 8000),
      bounceRate: Math.random() * 100,
      averageTimeOnPage: Math.floor(Math.random() * 300),
      topCountries: [
        { country: "France", visits: Math.floor(Math.random() * 5000) },
        { country: "États-Unis", visits: Math.floor(Math.random() * 3000) },
        { country: "Canada", visits: Math.floor(Math.random() * 2000) },
      ]
    },
    searchConsole: await getSearchAnalytics(url),
    socialMetrics: {
      facebook: {
        shares: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 2000),
        comments: Math.floor(Math.random() * 500)
      },
      twitter: {
        shares: Math.floor(Math.random() * 800),
        likes: Math.floor(Math.random() * 1500),
        replies: Math.floor(Math.random() * 300)
      },
      linkedin: {
        shares: Math.floor(Math.random() * 500),
        engagements: Math.floor(Math.random() * 1000)
      }
    },
    performance: {
      totalSize: 0,
      scriptCount: doc.getElementsByTagName('script').length,
      styleCount: doc.getElementsByTagName('link').length + doc.getElementsByTagName('style').length,
      responseTime: performance.now() - startTime,
      impressions: 0,
      clickThroughRate: 0,
      loadTime,
      firstContentfulPaint,
      domLoadTime
    },
    securityHeaders: {
      https: url.startsWith('https'),
      hsts: false,
      xFrameOptions: false,
      contentSecurityPolicy: false,
    },
    // Ajout des nouvelles analyses
    semanticStructure: semanticTags,
    linkAnalysis,
    readabilityScore,
    topKeywords: sortedKeywords,
    technologies,
    mobilePerformance,
    metaTagsAnalysis: metaTags,
    
    // Mise à jour des suggestions de mots-clés
    keywordSuggestions: keywordSuggestions.map(({ keyword, relevance, searchVolume, difficulty }) => ({
      keyword,
      relevance,
      searchVolume,
      difficulty
    })),
    socialTags: {
      ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
      ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || null,
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
      twitterCard: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || null,
      twitterTitle: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || null,
      twitterDescription: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || null,
      twitterImage: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || null,
    },
  };
};
