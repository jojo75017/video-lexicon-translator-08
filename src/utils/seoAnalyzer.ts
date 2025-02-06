
import { SeoAnalysis } from '@/types/seo';
import { analyzeKeywords, generateKeywordSuggestions } from './seo/keywordAnalyzer';
import { analyzePerformance } from './seo/performanceAnalyzer';
import { analyzeLinkStructure } from './seo/linkAnalyzer';
import { analyzeMobilePerformance } from './seo/mobileAnalyzer';
import { analyzeMetaTags } from './seo/metaAnalyzer';
import { analyzeSemanticStructure, analyzeReadability } from './seo/semanticAnalyzer';
import { analyzeTechnologies } from './seo/technologiesAnalyzer';
import { analyzeAnalytics } from './seo/analyticsAnalyzer';
import { analyzeSocialMetrics } from './seo/socialAnalyzer';
import { analyzeContent } from './seo/contentAnalyzer';
import { analyzeSearchConsole } from './seo/searchConsoleAnalyzer';
import { analyzeAccessibility } from './seo/accessibilityAnalyzer';
import { analyzeSchema } from './seo/schemaAnalyzer';
import { analyzeSecurityHeaders } from './seo/securityAnalyzer';
import { analyzeIndexability } from './seo/indexabilityAnalyzer';

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
  const content = analyzeContent(doc, textContent);
  const analytics = analyzeAnalytics();
  const socialMetrics = analyzeSocialMetrics();
  const searchConsole = analyzeSearchConsole(url);
  const accessibility = analyzeAccessibility(doc);
  const schemaMarkup = analyzeSchema(doc);
  const securityHeaders = analyzeSecurityHeaders(url);
  const indexability = analyzeIndexability(doc);

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
    wordCount: content.wordCount,
    textToHtmlRatio: content.textToHtmlRatio,
    internalLinks: linkAnalysis.internal,
    externalLinks: linkAnalysis.external,
    analytics,
    searchConsole,
    socialMetrics,
    performance: performanceMetrics,
    securityHeaders,
    semanticStructure,
    linkAnalysis: {
      ...linkAnalysis,
      broken: 0,
      redirects: 0
    },
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
    contentQuality: content.contentQuality,
    schemaMarkup,
    accessibility,
    indexability,
  };
};

