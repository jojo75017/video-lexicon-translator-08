
import { SeoAnalysis, ImageAnalysis } from '@/types/seo';
import { getSearchAnalytics } from './googleSearchConsole';

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const startTime = performance.now();

  // Analyse des performances
  const performanceEntries = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const loadTime = performanceEntries ? performanceEntries.loadEventEnd - performanceEntries.startTime : 0;
  const firstContentfulPaint = performanceEntries ? performanceEntries.domContentLoadedEventEnd - performanceEntries.startTime : 0;
  const domLoadTime = performanceEntries ? performanceEntries.domComplete - performanceEntries.startTime : 0;

  // Analyse des liens cassés améliorée
  const links = Array.from(doc.getElementsByTagName('a'));
  const brokenLinks = await Promise.all(
    links.map(async (link) => {
      try {
        if (!link.href || link.href.startsWith('javascript:') || link.href.startsWith('#')) {
          return null;
        }

        const linkUrl = new URL(link.href, url).href;
        
        console.log('Vérification du lien:', linkUrl);
        
        const response = await fetch(linkUrl, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        
        if (response.status >= 400) {
          console.log('Lien cassé trouvé:', linkUrl, 'Status:', response.status);
          return {
            url: linkUrl,
            statusCode: response.status,
            location: link.closest('h1,h2,h3,p')?.textContent?.trim() || 'Emplacement inconnu'
          };
        }
        return null;
      } catch (error) {
        console.log('Erreur lors de la vérification du lien:', link.href, error);
        return {
          url: link.href,
          statusCode: 404,
          location: link.closest('h1,h2,h3,p')?.textContent?.trim() || 'Emplacement inconnu'
        };
      }
    })
  );

  const filteredBrokenLinks = brokenLinks.filter((link): link is NonNullable<typeof link> => link !== null);

  // Récupération des données Google Search Console
  const searchConsoleData = await getSearchAnalytics(url);

  // Simulation des données d'analyse
  const analyticsData = {
    pageViews: Math.floor(Math.random() * 10000),
    uniqueVisitors: Math.floor(Math.random() * 8000),
    bounceRate: Math.random() * 100,
    averageTimeOnPage: Math.floor(Math.random() * 300),
    topCountries: [
      { country: "France", visits: Math.floor(Math.random() * 5000) },
      { country: "États-Unis", visits: Math.floor(Math.random() * 3000) },
      { country: "Canada", visits: Math.floor(Math.random() * 2000) },
    ]
  };

  // Simulation des métriques sociales
  const socialMetrics = {
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
  };

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
    brokenLinks: filteredBrokenLinks,
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
    analytics: analyticsData,
    searchConsole: {
      ...searchConsoleData,
      topQueries: [
        { query: "votre marque", clicks: Math.floor(Math.random() * 100), impressions: Math.floor(Math.random() * 1000) },
        { query: "votre produit", clicks: Math.floor(Math.random() * 80), impressions: Math.floor(Math.random() * 800) },
        { query: "votre service", clicks: Math.floor(Math.random() * 60), impressions: Math.floor(Math.random() * 600) },
      ]
    },
    socialMetrics,
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
    // Ajout des propriétés manquantes
    socialTags: {
      ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
      ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || null,
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
      twitterCard: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || null,
      twitterTitle: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || null,
      twitterDescription: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || null,
      twitterImage: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || null,
    },
    keywordSuggestions: [
      { keyword: "votre marque principale", relevance: 95, searchVolume: 1000, difficulty: 45 },
      { keyword: "produits associés", relevance: 85, searchVolume: 800, difficulty: 35 },
      { keyword: "services liés", relevance: 75, searchVolume: 600, difficulty: 25 },
    ],
  };
};
