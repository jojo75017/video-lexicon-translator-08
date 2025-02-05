
import { SeoAnalysis } from '@/types/seo';
import { getSearchAnalytics } from './googleSearchConsole';
import { analyzePerformance } from './seo/performanceAnalyzer';
import { analyzeKeywords, generateKeywordSuggestions } from './seo/keywordAnalyzer';
import { analyzeLinkStructure } from './seo/linkAnalyzer';
import { analyzeMobilePerformance } from './seo/mobileAnalyzer';
import { analyzeMetaTags } from './seo/metaAnalyzer';
import { analyzeSemanticStructure, analyzeReadability } from './seo/semanticAnalyzer';
import { analyzeTechnologies } from './seo/technologiesAnalyzer';

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const startTime = window.performance.now();
  const textContent = doc.body.textContent?.toLowerCase() || '';

  const topKeywords = analyzeKeywords(textContent);
  const performanceMetrics = analyzePerformance(doc, startTime);
  const linkAnalysis = analyzeLinkStructure(doc, url);
  const mobilePerformance = analyzeMobilePerformance(doc);
  const metaTagsAnalysis = analyzeMetaTags(doc);
  const semanticStructure = analyzeSemanticStructure(doc);
  const readabilityScore = analyzeReadability(textContent);
  const technologies = analyzeTechnologies();
  const keywordSuggestions = generateKeywordSuggestions(topKeywords);

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
    brokenLinks: [],
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
    internalLinks: linkAnalysis.internal,
    externalLinks: linkAnalysis.external,
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
    performance: performanceMetrics,
    securityHeaders: {
      https: url.startsWith('https'),
      hsts: false,
      xFrameOptions: false,
      contentSecurityPolicy: false,
    },
    semanticStructure,
    linkAnalysis,
    readabilityScore,
    topKeywords,
    technologies,
    mobilePerformance,
    metaTagsAnalysis,
    keywordSuggestions,
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
