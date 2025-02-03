import { SeoAnalysis, ImageAnalysis } from '@/types/seo';

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const startTime = performance.now();

  // Analyse des performances
  const performanceEntries = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const loadTime = performanceEntries ? performanceEntries.loadEventEnd - performanceEntries.startTime : 0;
  const firstContentfulPaint = performanceEntries ? performanceEntries.domContentLoadedEventEnd - performanceEntries.startTime : 0;
  const domLoadTime = performanceEntries ? performanceEntries.domComplete - performanceEntries.startTime : 0;

  // Analyse des liens cassés
  const links = Array.from(doc.getElementsByTagName('a'));
  const brokenLinks = await Promise.all(
    links.map(async (link) => {
      try {
        const response = await fetch(link.href, { method: 'HEAD' });
        if (response.status >= 400) {
          return {
            url: link.href,
            statusCode: response.status,
            location: link.closest('h1,h2,h3,p')?.textContent || 'Unknown location'
          };
        }
        return null;
      } catch {
        return {
          url: link.href,
          statusCode: 404,
          location: link.closest('h1,h2,h3,p')?.textContent || 'Unknown location'
        };
      }
    })
  ).then(results => results.filter(Boolean));

  // Analyse des balises sociales
  const socialTags = {
    ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
    ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || null,
    ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
    twitterCard: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || null,
    twitterTitle: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || null,
    twitterDescription: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || null,
    twitterImage: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || null,
  };

  // Analyse des mots-clés basée sur le contenu
  const content = doc.body.textContent || '';
  const words = content.toLowerCase().split(/\W+/).filter(word => word.length > 3);
  const wordFrequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const keywordSuggestions = Object.entries(wordFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([keyword, frequency]) => ({
      keyword,
      relevance: Math.min(Math.round((frequency / words.length) * 1000), 100),
      searchVolume: Math.floor(Math.random() * 10000),
      difficulty: Math.floor(Math.random() * 100),
    }));

  // Analyse basique des images
  const images = Array.from(doc.getElementsByTagName('img'));
  const imagesDetails: ImageAnalysis[] = images.map(img => ({
    url: new URL(img.src, url).href,
    hasAlt: !!img.alt,
    alt: img.alt || undefined
  }));

  // Analyse des titres
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map((heading, index) => ({
    text: heading.textContent || '',
    level: parseInt(heading.tagName.substring(1)),
    position: index
  }));

  // Analyse des paragraphes
  const paragraphs = Array.from(doc.getElementsByTagName('p')).map((p, index) => ({
    text: p.textContent || '',
    position: index
  }));

  // Analyse des liens
  const internalLinks = links.filter(link => {
    try {
      const linkUrl = new URL(link.href);
      const pageUrl = new URL(url);
      return linkUrl.hostname === pageUrl.hostname;
    } catch {
      return false;
    }
  }).length;

  const externalLinks = links.length - internalLinks;

  // Analyse du contenu
  const text = doc.body.textContent || '';
  const wordCount = text.trim().split(/\s+/).length;

  return {
    title: doc.title || "Pas de titre",
    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1Count: doc.getElementsByTagName('h1').length,
    h2Count: doc.getElementsByTagName('h2').length,
    h3Count: doc.getElementsByTagName('h3').length,
    headings,
    paragraphs,
    imgCount: images.length,
    imgWithoutAlt: images.filter(img => !img.alt).length,
    imagesDetails,
    metaTagsCount: doc.getElementsByTagName('meta').length,
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    robotsMeta: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
    brokenLinks,
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
    wordCount,
    textToHtmlRatio: 0,
    internalLinks,
    externalLinks,
    socialTags,
    keywordSuggestions,
    securityHeaders: {
      https: url.startsWith('https'),
      hsts: false,
      xFrameOptions: false,
      contentSecurityPolicy: false,
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
    }
  };
};