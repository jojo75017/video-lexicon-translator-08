
import { Performance } from '@/types/seo';

export const analyzePerformance = (doc: Document, startTime: number): Performance => {
  const performanceEntries = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const loadTime = performanceEntries ? performanceEntries.loadEventEnd - performanceEntries.startTime : 0;
  const firstContentfulPaint = performanceEntries ? performanceEntries.domContentLoadedEventEnd - performanceEntries.startTime : 0;
  const domLoadTime = performanceEntries ? performanceEntries.domComplete - performanceEntries.startTime : 0;

  return {
    totalSize: 0,
    scriptCount: doc.getElementsByTagName('script').length,
    styleCount: doc.getElementsByTagName('link').length + doc.getElementsByTagName('style').length,
    responseTime: performance.now() - startTime,
    impressions: 0,
    clickThroughRate: 0,
    loadTime,
    firstContentfulPaint,
    domLoadTime
  };
};
