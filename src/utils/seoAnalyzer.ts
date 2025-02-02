import { SeoAnalysis, ImageAnalysis } from '@/types/seo';

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const startTime = performance.now();

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
  const links = Array.from(doc.getElementsByTagName('a'));
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
    brokenLinks: 0,
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
    socialMetaTags: {
      ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
      ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || null,
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
      twitterCard: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || null,
      twitterTitle: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || null,
      twitterDescription: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || null,
      twitterImage: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || null,
    },
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
      clickThroughRate: 0
    }
  };
};