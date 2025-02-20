
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
import { analyzeImages } from './seo/imageAnalyzer';
import { analyzeHeadings } from './seo/headingAnalyzer';
import { analyzeBacklinks } from './seo/backlinkAnalyzer';

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  const startTime = window.performance.now();
  const textContent = doc.body.textContent?.toLowerCase() || '';

  const topKeywords = analyzeKeywords(textContent);
  const performanceMetrics = analyzePerformance(doc, startTime);
  const linkAnalysis = analyzeLinkStructure(doc, url);
  const mobileAnalysis = analyzeMobilePerformance(doc);
  const metaTagsAnalysis = analyzeMetaTags(doc);
  const semanticStructure = analyzeSemanticStructure(doc);
  const readabilityScore = analyzeReadability(textContent);
  const technologies = analyzeTechnologies();
  const keywordSuggestions = generateKeywordSuggestions(topKeywords);

  const { imgCount, imgWithoutAlt, imagesDetails } = analyzeImages(doc, url);
  const { h1Count, h2Count, h3Count, headings } = analyzeHeadings(doc);
  const { backlinks, backlinkDetails, topBacklinkDomains, doFollowBacklinks, noFollowBacklinks } = analyzeBacklinks();
  const contentAnalysis = analyzeContent(doc, textContent);
  const socialMetrics = analyzeSocialMetrics();
  const accessibility = analyzeAccessibility(doc);
  const schemaMarkup = analyzeSchema(doc);
  const securityHeaders = analyzeSecurityHeaders(url);
  const indexability = analyzeIndexability(doc);

  // Attendre les résultats des appels API asynchrones
  const [analytics, searchConsoleData] = await Promise.all([
    analyzeAnalytics(),
    analyzeSearchConsole(url)
  ]);

  return {
    title: doc.title || "Pas de titre",
    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1Count,
    h2Count,
    h3Count,
    headings,
    paragraphs: Array.from(doc.getElementsByTagName('p')).map((p, index) => ({
      text: p.textContent || '',
      position: index
    })),
    imgCount,
    imgWithoutAlt,
    imagesDetails,
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
    backlinks,
    backlinkDetails,
    topBacklinkDomains,
    doFollowBacklinks,
    noFollowBacklinks,
    wordCount: contentAnalysis.wordCount,
    textToHtmlRatio: contentAnalysis.textToHtmlRatio,
    internalLinks: linkAnalysis.internal,
    externalLinks: linkAnalysis.external,
    analytics,
    searchConsole: searchConsoleData,
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
    mobileAnalysis,
    mobilePerformance: {
      viewportMeta: mobileAnalysis.viewportMeta,
      responsiveImages: mobileAnalysis.responsiveImages,
      touchTargetSize: mobileAnalysis.touchTargetSize,
      fontScale: mobileAnalysis.fontScale,
      score: mobileAnalysis.score,
    },
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
    contentQuality: contentAnalysis.contentQuality,
    schemaMarkup,
    accessibility,
    indexability,
    technicalSuggestions: [
      "Optimisez les images pour le web",
      "Améliorez la vitesse de chargement",
      "Ajoutez des balises meta description manquantes",
      "Optimisez le contenu pour les mots-clés principaux",
      "Corrigez les liens cassés",
    ],
  };
};
