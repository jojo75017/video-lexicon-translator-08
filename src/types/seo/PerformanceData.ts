
export interface PerformanceData {
  score: number;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  resourceCount: number;
  totalSize: number;
  speedIndex?: number;
  domLoadTime?: number;
  resourceBreakdown?: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}

export interface Performance {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  speedIndex: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalSize: number;
  resourceBreakdown: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}

export interface MobileAnalysis {
  score: number;
  isMobileFriendly: boolean;
  mobileScore: number;
  issues: string[];
}
