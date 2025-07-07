
export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  speedIndex: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalSize: number;
  score: number;
  resourceCount: number;
  resourceBreakdown: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}
