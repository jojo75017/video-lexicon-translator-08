
export interface Performance {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  domLoadTime: number;
  speedIndex?: number;
  timeToInteractive?: number;
  score?: number;
  resourceCount: number;
  scriptCount?: number;
  imageCount?: number;
  totalSize?: number;
  resourceBreakdown?: {
    js?: number;
    css?: number;
    images?: number;
    fonts?: number;
    other?: number;
  };
  clickThroughRate?: number;
  impressions: number;
}
