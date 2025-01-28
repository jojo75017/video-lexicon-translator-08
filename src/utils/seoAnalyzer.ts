import { SeoAnalysis, ImageAnalysis } from '@/types/seo';
import { getSearchAnalytics } from './googleSearchConsole';

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const startTime = performance.now();

  // Récupérer uniquement les données de Google Search Console
  const searchConsoleData = await getSearchAnalytics(url);
  
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

  return {
    title: doc.title || "Pas de titre",
    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1Count: doc.getElementsByTagName('h1').length,
    h2Count: doc.getElementsByTagName('h2').length,
    h3Count: doc.getElementsByTagName('h3').length,
    headings,
    imgCount: images.length,
    imgWithoutAlt: images.filter(img => !img.alt).length,
    imagesDetails,
    metaTagsCount: doc.getElementsByTagName('meta').length,
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    robotsMeta: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
    brokenLinks: 0,
    keywords: [],
    googlePosition: searchConsoleData?.position || null,
    organicTraffic: searchConsoleData?.clicks || 0,
    authorityScore: 0,
    backlinks: 0,
    doFollowBacklinks: 0,
    noFollowBacklinks: 0,
    backlinkDetails: [],
    topBacklinkDomains: [],
    wordCount: 0,
    textToHtmlRatio: 0,
    internalLinks: 0,
    externalLinks: 0,
    socialMetaTags: {
      ogTitle: null,
      ogDescription: null,
      ogImage: null,
      twitterCard: null,
      twitterTitle: null,
      twitterDescription: null,
      twitterImage: null,
    },
    securityHeaders: {
      https: false,
      hsts: false,
      xFrameOptions: false,
      contentSecurityPolicy: false,
    },
    performance: {
      totalSize: 0,
      scriptCount: 0,
      styleCount: 0,
      responseTime: performance.now() - startTime,
      impressions: searchConsoleData?.impressions || 0,
      clickThroughRate: searchConsoleData?.ctr || 0
    }
  };
};