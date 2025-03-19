
import { Performance } from '@/types/seo';

export const analyzePerformance = (doc: Document, startTime: number): Performance => {
  const performanceEntries = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const loadTime = performanceEntries ? performanceEntries.loadEventEnd - performanceEntries.startTime : 0;
  const firstContentfulPaint = performanceEntries ? performanceEntries.domContentLoadedEventEnd - performanceEntries.startTime : 0;
  const domLoadTime = performanceEntries ? performanceEntries.domComplete - performanceEntries.startTime : 0;

  // Analyse détaillée des ressources
  const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const resourceSizes = {
    images: 0,
    scripts: 0,
    styles: 0,
    fonts: 0,
    other: 0
  };

  resources.forEach(resource => {
    const size = resource.transferSize || 0;
    if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      resourceSizes.images += size;
    } else if (resource.name.match(/\.js$/i)) {
      resourceSizes.scripts += size;
    } else if (resource.name.match(/\.css$/i)) {
      resourceSizes.styles += size;
    } else if (resource.name.match(/\.(woff|woff2|ttf|eot)$/i)) {
      resourceSizes.fonts += size;
    } else {
      resourceSizes.other += size;
    }
  });

  const totalSize = Object.values(resourceSizes).reduce((a, b) => a + b, 0);
  const speedIndex = window.performance.now() - startTime;
  const timeToInteractive = performanceEntries ? performanceEntries.domInteractive - performanceEntries.startTime : 0;
  const largestContentfulPaint = firstContentfulPaint * 1.2;
  const resourceCount = resources.length;
  const scriptCount = doc.getElementsByTagName('script').length;
  const cssCount = doc.getElementsByTagName('link').length + doc.getElementsByTagName('style').length;
  const imageCount = doc.getElementsByTagName('img').length;

  // Calcul du score de performance
  let score = 100;
  if (loadTime > 3000) score -= 20;
  if (firstContentfulPaint > 1000) score -= 15;
  if (domLoadTime > 2000) score -= 15;
  if (totalSize > 5000000) score -= 20; // Pénalité si plus de 5MB
  if (resources.length > 50) score -= 10; // Pénalité si trop de ressources

  return {
    loadTime,
    firstContentfulPaint,
    largestContentfulPaint,
    speedIndex,
    timeToInteractive,
    domLoadTime,
    resourceCount,
    scriptCount,
    cssCount,
    imageCount,
    cacheLifetime: 3600, // 1 heure par défaut
    score: Math.max(0, score),
    resourceBreakdown: resourceSizes,
    totalSize,
    styleCount: cssCount,
    responseTime: window.performance.now() - startTime,
    impressions: 0,
    clickThroughRate: 0
  };
};
