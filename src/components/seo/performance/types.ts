
import { ReactNode } from 'react';

export interface ResourceBreakdown {
  images?: number;
  scripts?: number;
  styles?: number;
  fonts?: number;
  other?: number;
}

export interface PerformanceData {
  loadTime: number;
  firstContentfulPaint: number;
  domLoadTime: number;
  speedIndex?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
  score?: number;
  resourceBreakdown?: ResourceBreakdown;
  performanceScore?: number;
  totalBlockingTime?: number;
  cumulativeLayoutShift?: number;
  resourceCount?: number;
  scriptCount?: number;
  styleCount?: number;
  imageCount?: number;
  totalSize?: number;
  responseTime?: number;
  mobilePerformance?: PerformanceData;
  desktopPerformance?: PerformanceData;
}

export interface LoadingSpeedAnalysisProps {
  performance: PerformanceData;
}

export interface MetricItemProps {
  label: string;
  value: number;
  maxValue: number;
  formatFunc: (value: number) => string;
  getColorClass: (value: number, type: 'text' | 'bg') => string;
  tooltip?: string;
}

export interface ChartProps {
  activeDevice: 'mobile' | 'desktop';
  data: {
    name: string;
    value: number;
  }[];
}

export interface ResourcesChartProps {
  activeDevice: 'mobile' | 'desktop';
  resourcesData: {
    name: string;
    value: number;
  }[];
}

export interface RecommendationsProps {
  activeDevice: 'mobile' | 'desktop';
  deviceData: PerformanceData;
}

export interface PerformanceMetricsSectionProps {
  deviceData: PerformanceData;
  activeDevice: 'mobile' | 'desktop';
}

export type FormatFunction = (value: number) => string;
