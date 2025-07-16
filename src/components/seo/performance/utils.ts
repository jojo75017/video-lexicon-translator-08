
export const formatTime = (time: number): string => {
  if (time < 1000) {
    return `${Math.round(time)}ms`;
  }
  return `${(time / 1000).toFixed(1)}s`;
};

export const formatSize = (size: number): string => {
  if (size < 1024) {
    return `${size}B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

export const formatBytes = (bytes: number): string => {
  return formatSize(bytes);
};

export const getSpeedColorClass = (score: number): string => {
  if (score >= 90) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

export const getClsColorClass = (cls: number): string => {
  if (cls <= 0.1) return 'text-green-600';
  if (cls <= 0.25) return 'text-yellow-600';
  return 'text-red-600';
};

export const getLevelColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getLevelLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 50) return 'Bon';
  return 'À améliorer';
};

export const getLevelTextColor = (score: number): string => {
  if (score >= 90) return 'text-green-700';
  if (score >= 50) return 'text-yellow-700';
  return 'text-red-700';
};

export const CHART_COLORS = {
  js: '#f59e0b',
  css: '#3b82f6',
  images: '#10b981',
  fonts: '#8b5cf6',
  other: '#6b7280',
  scripts: '#f59e0b',
  styles: '#3b82f6'
};
