
import { Performance } from '@/types/seo';

export const analyzePerformance = (doc: Document, startTime: number): Performance => {
  const performanceEntries = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const loadTime = performanceEntries ? performanceEntries.loadEventEnd - performanceEntries.startTime : 0;
  const firstContentfulPaint = performanceEntries ? performanceEntries.domContentLoadedEventEnd - performanceEntries.startTime : 0;
  const domLoadTime = performanceEntries ? performanceEntries.domComplete - performanceEntries.startTime : 0;

  // Calculer la taille des ressources
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

  // Mesure du Speed Index (approximation)
  const speedIndex = window.performance.now() - startTime;
  
  // Temps jusqu'à l'interactivité (approximation)
  const timeToInteractive = performanceEntries ? performanceEntries.domInteractive - performanceEntries.startTime : 0;

  return {
    totalSize,
    scriptCount: doc.getElementsByTagName('script').length,
    styleCount: doc.getElementsByTagName('link').length + doc.getElementsByTagName('style').length,
    responseTime: window.performance.now() - startTime,
    impressions: 0,
    clickThroughRate: 0,
    loadTime,
    firstContentfulPaint,
    domLoadTime,
    speedIndex,
    largestContentfulPaint: firstContentfulPaint * 1.2, // Approximation
    timeToInteractive,
    resourceBreakdown: resourceSizes
  };
};
