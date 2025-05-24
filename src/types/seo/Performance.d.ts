
export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  domLoadTime: number;
  speedIndex: number;
  timeToInteractive: number;
  score: number;
  resourceCount: number;
  totalSize: number;
  resourceBreakdown: {
    js?: number;
    css?: number;
    images?: number;
    fonts?: number;
    other?: number;
    scripts?: number;
    styles?: number;
  };
  cls?: number;
  fid?: number;
  recommendations?: string[];
}

export interface MobileAnalysis {
  isMobileFriendly: boolean;
  mobileScore: number;
  issues: string[];
  recommendations: string[];
}

export interface ResourceBreakdown {
  js?: number;
  css?: number;
  images?: number;
  fonts?: number;
  other?: number;
  scripts?: number;
  styles?: number;
}
