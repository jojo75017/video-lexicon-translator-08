
export interface PerformanceData {
  totalSize?: number;
  scriptCount?: number;
  styleCount?: number;
  responseTime?: number;
  timeToInteractive?: number;
  impressions?: number;
  clickThroughRate?: number;
  coreWebVitals?: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  resourceBreakdown?: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
  serverResponseTime?: number;
  loadTime?: number;
  firstContentfulPaint?: number;
  domLoadTime?: number;
}

export interface MobileAnalysis {
  usabilityScore: number;
  isMobileFriendly: boolean;
  viewport: boolean;
  fontSizesAdequate: boolean;
  tapTargetsSized: boolean;
  contentWidthFits: boolean;
  issuesDetected?: string[];
}
