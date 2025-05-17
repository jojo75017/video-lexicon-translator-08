
import { ReactNode } from 'react';

export interface PerformanceData {
  score: number;
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
  resourceCount?: number;
  imageCount?: number;
  resourceBreakdown?: {
    js: number;
    css: number;
    images: number;
    fonts: number;
    other: number;
  };
  mobilePerformance?: any;
  desktopPerformance?: any;
}

export interface MetricItemProps {
  label: string;
  value: number;
  maxValue: number;
  formatFunc: (value: number) => string;
  getColorClass: (value: number, maxValue: number) => string;
}

export interface ChartProps {
  activeDevice: 'mobile' | 'desktop';
  data: Array<{
    name: string;
    value: number;
  }>;
}

export interface ResourcesChartProps {
  activeDevice: 'mobile' | 'desktop';
  resourcesData: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
}

export interface PerformanceMetricsSectionProps {
  deviceData: PerformanceData;
  activeDevice: 'mobile' | 'desktop';
}
