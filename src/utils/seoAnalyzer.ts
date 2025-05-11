
import { SeoAnalysis, MetaTagsAnalysis, BacklinkInfo, SocialMetrics } from '@/types/seo';
import { analyzeImages } from './seo/imageAnalyzer';
import { analyzeSearchConsoleData } from './seo/searchConsoleAnalyzer';

/**
 * Analyze meta tags in the HTML content
 * @param htmlContent - The HTML content to analyze
 */
export const analyzeMetaTags = (htmlContent: string): MetaTagsAnalysis => {
  if (!htmlContent) {
    return {
      hasTitleTag: false,
      hasDescriptionTag: false,
      hasCanonicalTag: false,
      hasRobotsTag: false,
      hasOpenGraphTags: false,
      titleLength: 0,
      descriptionLength: 0,
      canonicalUrl: null,
      robotsContent: null
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Title analysis
  const titleTag = doc.querySelector('title');
  const hasTitleTag = !!titleTag;
  const titleContent = titleTag?.textContent || '';
  const titleLength = titleContent.length;
  
  // Meta description analysis
  const metaDescription = doc.querySelector('meta[name="description"]');
  const hasDescriptionTag = !!metaDescription;
  const descriptionContent = metaDescription?.getAttribute('content') || '';
  const descriptionLength = descriptionContent.length;
  
  // Canonical URL analysis
  const canonicalLink = doc.querySelector('link[rel="canonical"]');
  const hasCanonicalTag = !!canonicalLink;
  const canonicalUrl = canonicalLink?.getAttribute('href') || null;
  
  // Robots tag analysis
  const robotsTag = doc.querySelector('meta[name="robots"]');
  const hasRobotsTag = !!robotsTag;
  const robotsContent = robotsTag?.getAttribute('content') || null;
  
  // Open Graph tags
  const ogTitleTag = doc.querySelector('meta[property="og:title"]');
  const ogDescriptionTag = doc.querySelector('meta[property="og:description"]');
  const ogImageTag = doc.querySelector('meta[property="og:image"]');
  const hasOpenGraphTags = !!ogTitleTag || !!ogDescriptionTag || !!ogImageTag;

  // Twitter cards
  const twitterCardTag = doc.querySelector('meta[name="twitter:card"]');
  const twitterTitleTag = doc.querySelector('meta[name="twitter:title"]');
  const twitterDescriptionTag = doc.querySelector('meta[name="twitter:description"]');
  const twitterImageTag = doc.querySelector('meta[name="twitter:image"]');
  const hasTwitterTags = !!twitterCardTag || !!twitterTitleTag || !!twitterDescriptionTag || !!twitterImageTag;
  
  return {
    hasTitleTag,
    hasDescriptionTag,
    hasCanonicalTag,
    hasRobotsTag,
    hasOpenGraphTags,
    hasTwitterTags,
    titleLength,
    descriptionLength,
    canonicalUrl,
    robotsContent
  };
};

/**
 * Main function to analyze SEO for a webpage
 * @param htmlContent - The HTML content to analyze
 * @param url - URL of the webpage
 */
export const analyzeSeo = (htmlContent: string, url: string): SeoAnalysis => {
  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Basic extractions
  const title = doc.querySelector('title')?.textContent || '';
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
  
  // Heading counts
  const h1Elements = doc.querySelectorAll('h1');
  const h2Elements = doc.querySelectorAll('h2');
  const h3Elements = doc.querySelectorAll('h3');
  
  const h1Count = h1Elements.length;
  const h2Count = h2Elements.length;
  const h3Count = h3Elements.length;
  
  // Link analysis
  const allLinks = Array.from(doc.querySelectorAll('a[href]'));
  const internalLinks = allLinks.filter(link => {
    const href = link.getAttribute('href') || '';
    return href.startsWith('/') || 
           href.includes(window.location.hostname) || 
           !href.includes('://');
  }).length;
  
  const externalLinks = allLinks.filter(link => {
    const href = link.getAttribute('href') || '';
    return href.includes('://') && !href.includes(window.location.hostname);
  }).length;
  
  // Image analysis
  const images = doc.querySelectorAll('img');
  const imgCount = images.length;
  
  // Images without alt text
  const imgWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt')).length;
  
  // Word count (rough estimation)
  const bodyText = doc.body.textContent || '';
  const words = bodyText.trim().split(/\s+/);
  const wordCount = words.length;
  
  // Meta tags analysis
  const metaTagsAnalysis = analyzeMetaTags(htmlContent);
  
  // Extract top keywords based on frequency
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    const normalizedWord = word.toLowerCase().replace(/[^\w\s]/g, '');
    if (normalizedWord.length > 3) { // Skip short words
      wordFrequency[normalizedWord] = (wordFrequency[normalizedWord] || 0) + 1;
    }
  });
  
  // Sort by frequency and take top 20
  const topKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([keyword, count]) => ({ 
      keyword, 
      count, 
      density: Number((count / words.length * 100).toFixed(2)) 
    }));
  
  // Mock backlink data (in a real app, this would come from an API)
  const backlinks: BacklinkInfo[] = [
    { domain: 'example.com', url: 'https://example.com/page1', anchor: 'SEO Tips', doFollow: true },
    { domain: 'test.org', url: 'https://test.org/resources', anchor: 'Web Tools', doFollow: false }
  ];
  
  // Mock data for social metrics (would come from social APIs)
  const socialMetrics: SocialMetrics = {
    facebook: { likes: 245, shares: 123, comments: 45 },
    twitter: { tweets: 78, retweets: 34, likes: 156 },
    linkedin: { shares: 56, engagements: 89 },
    pinterest: { pins: 23 }
  };
  
  // Mock data for social tags
  const socialTags = {
    ogTitle: doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || null,
    ogDescription: doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || null,
    ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || null,
    twitterCard: doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || null,
    twitterTitle: doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || null,
    twitterDescription: doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || null,
    twitterImage: doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || null
  };
  
  // Image details analysis
  const imagesDetails = analyzeImages(htmlContent);
  
  // Performance data (mock)
  const performance = {
    loadTime: 2100, // ms
    firstContentfulPaint: 900, // ms
    domLoadTime: 1200, // ms
    resourceCount: 45,
    score: 82 // out of 100
  };
  
  // Mobile analysis (mock)
  const mobileAnalysis = {
    score: 78,
    isMobileFriendly: true,
    issues: ["Touch elements too close together"]
  };
  
  // Technical suggestions based on analysis
  const technicalSuggestions = [];
  
  if (h1Count !== 1) {
    technicalSuggestions.push(
      h1Count === 0 ? "Add an H1 heading to your page" : "Use only one H1 heading per page"
    );
  }
  
  if (imgWithoutAlt > 0) {
    technicalSuggestions.push(`Add alt attributes to ${imgWithoutAlt} images`);
  }
  
  if (!metaTagsAnalysis.hasDescriptionTag) {
    technicalSuggestions.push("Add a meta description tag");
  }
  
  if (title.length < 10 || title.length > 60) {
    technicalSuggestions.push("Optimize your title tag length (aim for 50-60 characters)");
  }
  
  if (metaDescription.length < 70 || metaDescription.length > 160) {
    technicalSuggestions.push("Optimize your meta description length (aim for 120-155 characters)");
  }
  
  if (!metaTagsAnalysis.hasOpenGraphTags) {
    technicalSuggestions.push("Add Open Graph meta tags for better social sharing");
  }
  
  // Readability score (mock)
  const readabilityScore = Math.floor(Math.random() * 30) + 70; // Mock score between 70-100
  
  // Mock search console data
  const searchConsoleData = analyzeSearchConsoleData(url);
  
  // Top backlink domains
  const topBacklinkDomains = ['example.com', 'test.org', 'referrer.net'];
  
  // Mock keyword suggestions
  const keywordSuggestions = [
    { keyword: 'seo optimization tools', volume: 1200, difficulty: 65 },
    { keyword: 'best seo practices', volume: 2300, difficulty: 72 },
    { keyword: 'website analysis tools', volume: 890, difficulty: 58 },
    { keyword: 'improve website seo', volume: 1500, difficulty: 62 }
  ];
  
  // Mock broken links
  const brokenLinks = [
    { url: '/404-page', anchor: 'Broken Link 1', statusCode: 404 },
    { url: 'https://external-broken.com/page', anchor: 'External Broken Link', statusCode: 500 }
  ];
  
  return {
    url,
    title,
    description: metaDescription,
    keywords: metaKeywords,
    h1Count,
    h2Count,
    h3Count,
    internalLinks,
    externalLinks,
    imgCount,
    imgWithoutAlt,
    wordCount,
    metaTagsAnalysis,
    topKeywords,
    backlinks,
    doFollowBacklinks: 1,
    noFollowBacklinks: 1,
    socialMetrics,
    socialTags,
    imagesDetails,
    performance,
    mobileAnalysis,
    technicalSuggestions,
    readabilityScore,
    searchConsoleData,
    topBacklinkDomains,
    keywordSuggestions,
    brokenLinks
  };
};
