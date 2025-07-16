
export interface PerformanceData {
  score: number;
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  speedIndex: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalSize: number;
  resourceCount: number;
  resourceBreakdown: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}

export interface Performance {
  mobile: PerformanceData;
  desktop: PerformanceData;
}

export interface MobileAnalysis {
  score: number;
  issues: string[];
  recommendations: string[];
}
