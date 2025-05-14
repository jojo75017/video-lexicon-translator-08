
// Types liés aux performances

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  resourceCount: number;
  score: number;
  speedIndex: number;
  totalBlockingTime: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  performanceScore: number;
}

export interface MobileAnalysis {
  score: number;
  isMobileFriendly: boolean;
  issues: string[];
}
