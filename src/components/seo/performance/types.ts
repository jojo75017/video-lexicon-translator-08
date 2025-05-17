
export interface PerformanceData {
  score?: number;
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  timeToInteractive?: number;
  totalBlockingTime?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  totalSize?: number;
  scriptCount?: number;
  styleCount?: number;
  responseTime?: number;
  resourceBreakdown?: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
}

export interface PerformanceMetricsSectionProps {
  deviceData: PerformanceData;
  activeDevice: 'mobile' | 'desktop';
}

export interface PerformanceHighlightsProps {
  deviceData: PerformanceData;
  activeDevice: 'mobile' | 'desktop';
}

export interface MetricItemProps {
  label: string;
  value: number;
  maxValue: number;
  formatFunc: (value: number) => string;
  getColorClass: (value: number, maxValue: number) => string;
}
