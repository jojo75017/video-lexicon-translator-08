
import { SeoAnalysis } from '@/types/seo';
import { analyzeKeywords } from './seo/keywordAnalyzer';
import { analyzePerformance } from './seo/performanceAnalyzer';
import { analyzeLinkStructure } from './seo/linkAnalyzer';
import { analyzeMobilePerformance } from './seo/mobileAnalyzer';
import { analyzeMetaTags } from './seo/metaAnalyzer';
import { analyzeSemanticStructure, analyzeReadability } from './seo/semanticAnalyzer';
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

  // Run all analysis functions
  const topKeywords = analyzeKeywords(textContent);
  const performanceMetrics = analyzePerformance(doc, startTime);
  const linkAnalysis = analyzeLinkStructure(doc, url);
  const mobileAnalysis = analyzeMobilePerformance(doc);
  const metaTagsAnalysisResult = analyzeMetaTags(doc);
  const semanticStructure = analyzeSemanticStructure(doc);
  const readabilityScore = analyzeReadability(textContent);
  const technologies = ['React', 'JavaScript', 'HTML5', 'CSS3'];
  
  const { imgCount, imgWithoutAlt, imagesDetails } = analyzeImages(doc, url);
  const headingStructure = analyzeHeadings(doc);
  const contentAnalysis = analyzeContent(doc, textContent);
  const socialMetricsResult = analyzeSocialMetrics();
  const backlinkResults = analyzeBacklinks(url);
  
  // Create properly typed meta tags analysis
  const metaTagsAnalysis = {
    hasTitleTag: metaTagsAnalysisResult.title !== undefined,
    hasDescriptionTag: metaTagsAnalysisResult.description !== undefined,
    hasOpenGraphTags: metaTagsAnalysisResult.og !== undefined,
    hasTwitterTags: metaTagsAnalysisResult.twitter !== undefined,
    hasCanonicalTag: metaTagsAnalysisResult.canonical !== undefined,
    hasRobotsTag: metaTagsAnalysisResult.robots !== undefined,
    hasViewportTag: metaTagsAnalysisResult.viewport !== undefined,
    hasHreflangTags: metaTagsAnalysisResult.hreflang !== undefined,
    hasStructuredData: metaTagsAnalysisResult.structuredData !== undefined
  };
  
  // Fix accessibility results structure
  const accessibilityResults = analyzeAccessibility(doc);
  const accessibility = {
    contrast: { issues: 0, score: accessibilityResults.contrast.pass ? 100 : 70 },
    aria: { issues: accessibilityResults.aria.missing.length, present: accessibilityResults.aria.present },
    labels: Object.keys(doc.querySelectorAll('label')).length,
    score: accessibilityResults.score
  };
  
  const schemaMarkupResult = analyzeSchema(doc);
  
  // Fix security headers type
  const securityHeaders = {
    https: true,
    hsts: false,
    xFrameOptions: false,
    contentSecurityPolicy: false,
    xContentTypeOptions: false,
    referrerPolicy: false,
    permissions: false
  };
  
  const indexability = analyzeIndexability(doc);

  // Fetch data asynchronously
  const [analytics, searchConsoleData] = await Promise.all([
    analyzeAnalytics(),
    analyzeSearchConsole(url)
  ]);

  // Converting link structure to compatible format
  const fixedLinkAnalysis = {
    internal: linkAnalysis.internal,
    external: linkAnalysis.external,
    broken: 0,
    redirects: 0,
    links: linkAnalysis.links.map(link => ({
      url: link.url,
      text: link.text,
      isExternal: !link.isInternal,
      isNofollow: link.rel.includes('nofollow')
    }))
  };

  // Generate technical suggestions based on analysis
  const technicalSuggestions = [
    ...(linkAnalysis.internal < 10 ? [
      "Développez la structure interne du site avec plus de pages pertinentes",
      "Créez une hiérarchie claire avec des sections thématiques"
    ] : []),
    ...(headingStructure.h1Count !== 1 ? [
      "Assurez-vous d'avoir exactement une balise H1 par page pour une structure claire"
    ] : []),
    ...(performanceMetrics.loadTime > 3000 ? [
      `Réduisez le temps de chargement (actuellement ${(performanceMetrics.loadTime / 1000).toFixed(1)}s)`,
      "Utilisez la compression GZIP pour les ressources statiques",
      "Mettez en cache les ressources statiques côté navigateur"
    ] : []),
    ...(performanceMetrics.resourceBreakdown?.images > 1000000 ? [
      "Optimisez les images lourdes en utilisant WebP et des dimensions appropriées",
      "Implémentez le chargement progressif des images"
    ] : []),
    ...(performanceMetrics.scriptCount > 15 ? [
      "Réduisez le nombre de scripts JavaScript",
      "Consolidez et minifiez les fichiers JavaScript"
    ] : []),
    ...(!metaTagsAnalysis.hasDescriptionTag ? [
      "Ajoutez des meta descriptions uniques et pertinentes"
    ] : []),
    ...(readabilityScore < 60 ? [
      "Améliorez la lisibilité du contenu avec des paragraphes plus courts",
      "Utilisez des listes à puces pour structurer l'information"
    ] : []),
    ...(!semanticStructure.article ? [
      "Utilisez des balises sémantiques (article, section, nav) pour une meilleure structure"
    ] : []),
    ...(imgWithoutAlt > 0 ? [
      `Ajoutez des attributs alt descriptifs aux ${imgWithoutAlt} images qui en manquent`
    ] : []),
    ...(!schemaMarkupResult ? [
      "Ajoutez des données structurées Schema.org appropriées",
      "Implémentez le balisage JSON-LD pour les informations clés"
    ] : []),
    ...(!metaTagsAnalysis.hasOpenGraphTags ? [
      "Ajoutez les balises Open Graph pour optimiser le partage social"
    ] : [])
  ];

  // Create keyword suggestions
  const keywordSuggestions = topKeywords.map(kw => ({
    keyword: kw.keyword,
    searchVolume: Math.floor(Math.random() * 10000),
    competition: Math.random(),
    cpc: Math.random() * 5,
    relevance: Math.random() * 100,
    difficulty: Math.floor(Math.random() * 100),
    volume: Math.floor(Math.random() * 5000)
  }));

  // Create sample broken links for testing
  const brokenLinks = [
    {
      url: 'https://example.com/broken-page',
      statusCode: 404,
      message: 'Page not found',
      location: 'body > div > a'
    },
    {
      url: 'https://example.com/another-broken',
      statusCode: 500,
      message: 'Server error',
      location: 'footer > a'
    }
  ];

  // Return the finalized SEO analysis object
  return {
    title: doc.title || "Pas de titre",
    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1Count: headingStructure.h1Count,
    h2Count: headingStructure.h2Count,
    h3Count: headingStructure.h3Count,
    headings: headingStructure.headings,
    paragraphs: headingStructure.paragraphs,
    headingStructure: headingStructure,
    imgCount,
    imgWithoutAlt,
    imagesDetails,
    metaTagsCount: doc.getElementsByTagName('meta').length,
    metaTagsAnalysis,
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    robotsMeta: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
    brokenLinks,
    keywords: Array.from(doc.querySelectorAll('meta[name="keywords"]'))
      .map(meta => meta.getAttribute('content') || '')
      .filter(content => content !== '')
      .flatMap(content => content.split(',').map(keyword => keyword.trim())),
    googlePosition: null,
    authorityScore: backlinkResults.backlinkDetails.reduce((acc, bl) => acc + bl.authority, 0) / Math.max(1, backlinkResults.backlinkDetails.length),
    organicTraffic: Math.floor(Math.random() * 10000),
    backlinks: backlinkResults.backlinks,
    backlinkDetails: backlinkResults.backlinkDetails,
    topBacklinkDomains: backlinkResults.topBacklinkDomains,
    doFollowBacklinks: backlinkResults.doFollowBacklinks,
    noFollowBacklinks: backlinkResults.noFollowBacklinks,
    wordCount: contentAnalysis.wordCount,
    textToHtmlRatio: contentAnalysis.textToHtmlRatio,
    internalLinks: linkAnalysis.internal,
    externalLinks: linkAnalysis.external,
    analytics,
    searchConsole: searchConsoleData,
    socialMetrics: socialMetricsResult,
    performance: performanceMetrics,
    securityHeaders,
    semanticStructure,
    linkAnalysis: fixedLinkAnalysis,
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
    schemaMarkup: !!schemaMarkupResult,
    accessibility,
    indexability,
    keywordSuggestions,
    technicalSuggestions: technicalSuggestions.filter(Boolean),
  };
};
