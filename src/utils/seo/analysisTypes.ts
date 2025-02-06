
import { SeoAnalysis } from '@/types/seo';

export interface BaseAnalysis {
  startTime: number;
  doc: Document;
  url: string;
  textContent: string;
}

export interface AnalyticsStats {
  pageViews: number;
  uniqueVisitors: number;
  baseVisits: number;
}

export const generateBaseStats = (): AnalyticsStats => {
  const baseVisits = Math.floor(Math.random() * 50) + 10;
  const daysInMonth = 30;
  const monthlyVisits = baseVisits * daysInMonth;
  const uniqueVisitors = Math.floor(monthlyVisits * 0.7);
  
  return {
    pageViews: monthlyVisits,
    uniqueVisitors,
    baseVisits
  };
};
