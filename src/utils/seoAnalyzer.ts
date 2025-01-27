import { SeoAnalysis, ImageAnalysis } from '@/types/seo';
import axios from 'axios';

const SEMRUSH_API_KEY = process.env.NEXT_PUBLIC_SEMRUSH_API_KEY;
const SEMRUSH_API_URL = 'https://api.semrush.com/analytics/v1/';

async function getSemrushMetrics(domain: string) {
  try {
    const authorityResponse = await axios.get(`${SEMRUSH_API_URL}?type=domain_ranks&key=${SEMRUSH_API_KEY}&export_columns=Ot,Ob,Ot&domain=${domain}&database=fr`);
    const trafficResponse = await axios.get(`${SEMRUSH_API_URL}?type=domain_organic&key=${SEMRUSH_API_KEY}&export_columns=Tr&domain=${domain}&database=fr`);
    const backlinksResponse = await axios.get(`${SEMRUSH_API_URL}?type=backlinks_overview&key=${SEMRUSH_API_KEY}&export_columns=total&target=${domain}`);

    return {
      authorityScore: parseInt(authorityResponse.data.split('\n')[1].split(';')[0]),
      organicTraffic: parseInt(trafficResponse.data.split('\n')[1]),
      backlinks: parseInt(backlinksResponse.data.split('\n')[1])
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques SEMrush:', error);
    return {
      authorityScore: 0,
      organicTraffic: 0,
      backlinks: 0
    };
  }
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

function calculateTextToHtmlRatio(doc: Document): number {
  const htmlSize = doc.documentElement.outerHTML.length;
  const textSize = doc.body.textContent?.length || 0;
  return Math.round((textSize / htmlSize) * 100);
}

function getSocialMetaTags(doc: Document) {
  return {
    ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
    ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || null,
    ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
    twitterCard: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || null,
    twitterTitle: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || null,
    twitterDescription: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || null,
    twitterImage: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || null,
  };
}

function getSecurityHeaders(doc: Document) {
  const isHttps = window.location.protocol === 'https:';
  return {
    https: isHttps,
    hsts: document.querySelector('meta[http-equiv="Strict-Transport-Security"]') !== null,
    xFrameOptions: document.querySelector('meta[http-equiv="X-Frame-Options"]') !== null,
    contentSecurityPolicy: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
  };
}

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const domain = new URL(url).hostname;
  const startTime = performance.now();

  // Analyse des images
  const images = Array.from(doc.getElementsByTagName('img'));
  const imagesDetails: ImageAnalysis[] = images.map(img => ({
    url: new URL(img.src, url).href,
    hasAlt: !!img.alt,
    alt: img.alt || undefined
  }));

  const keywords = Array.from(doc.querySelectorAll('meta[name="keywords"]'))
    .map(meta => meta.getAttribute('content')?.split(',').map(k => k.trim()))
    .flat()
    .filter(Boolean) as string[];

  const headings = ['h1', 'h2', 'h3'].reduce((acc, tag) => {
    const elements = Array.from(doc.getElementsByTagName(tag));
    return [...acc, ...elements.map((heading, index) => ({
      text: heading.textContent?.trim() || '',
      level: parseInt(tag.charAt(1)),
      position: index
    }))];
  }, [] as any[]);

  // Nouvelles métriques
  const internalLinks = Array.from(doc.querySelectorAll('a'))
    .filter(link => link.href.includes(domain)).length;

  const externalLinks = Array.from(doc.querySelectorAll('a'))
    .filter(link => !link.href.includes(domain)).length;

  const scripts = doc.getElementsByTagName('script');
  const styles = doc.getElementsByTagName('link');
  const totalSize = doc.documentElement.outerHTML.length / 1024; // Conversion en Ko

  const responseTime = performance.now() - startTime;

  // Récupération des métriques SEMrush
  const semrushMetrics = await getSemrushMetrics(domain);

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
    keywords,
    googlePosition: null,
    ...semrushMetrics,
    // Nouvelles métriques
    wordCount: countWords(doc.body.textContent || ''),
    textToHtmlRatio: calculateTextToHtmlRatio(doc),
    internalLinks,
    externalLinks,
    socialMetaTags: getSocialMetaTags(doc),
    securityHeaders: getSecurityHeaders(doc),
    performance: {
      totalSize,
      scriptCount: scripts.length,
      styleCount: styles.length,
      responseTime
    }
  };
};