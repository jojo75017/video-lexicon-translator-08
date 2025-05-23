
export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  domLoadTime?: number;
  speedIndex?: number;
  timeToInteractive?: number;
  score: number;
  resourceCount?: number;
  totalSize?: number;
  resourceBreakdown?: {
    js?: number;
    css?: number;
    images?: number;
    fonts?: number;
    other?: number;
    scripts?: number;
    styles?: number;
  };
}

export interface MobileAnalysis {
  score: number;
  issues: string[];
  recommendations: string[];
  hasViewport: boolean;
  touchTargets: boolean;
  textReadable: boolean;
  contentSizing: boolean;
}
