
import { FormatFunction } from './types';

// Format of conversion of milliseconds to readable format
export const formatTime: FormatFunction = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

// Format size in KB or MB
export const formatSize: FormatFunction = (bytes: number): string => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Determine the class of color based on speed
export const getSpeedColorClass = (ms: number, type: 'text' | 'bg' = 'text'): string => {
  const prefix = type === 'text' ? 'text' : 'bg';
  if (ms < 1000) return `${prefix}-green-600`;
  if (ms < 2500) return `${prefix}-yellow-600`;
  return `${prefix}-red-600`;
};

// Get CLS color class
export const getClsColorClass = (value: number, type: 'text' | 'bg' = 'text'): string => {
  const prefix = type === 'text' ? 'text' : 'bg';
  if (value < 0.1) return `${prefix}-green-600`;
  if (value < 0.25) return `${prefix}-yellow-600`;
  return `${prefix}-red-600`;
};

// Calculate score if not provided
export const calculateSpeedScore = (data: { 
  performanceScore?: number; 
  score?: number; 
  loadTime?: number 
}): number => {
  return data.performanceScore || 
    data.score || 
    Math.max(0, Math.min(100, 100 - ((data.loadTime || 3000) / 100)));
};

// Pie chart colors
export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
