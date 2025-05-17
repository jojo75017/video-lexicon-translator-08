
export const formatTime = (ms: number): string => {
  if (ms < 1000) {
    return `${ms.toFixed(0)}ms`;
  } else {
    return `${(ms / 1000).toFixed(2)}s`;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getSpeedColorClass = (value: number, maxValue: number): string => {
  const percentage = (value / maxValue) * 100;
  
  if (percentage < 40) return 'bg-green-500';
  if (percentage < 70) return 'bg-amber-500';
  if (percentage < 90) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getClsColorClass = (value: number, maxValue: number): string => {
  if (value < 0.1) return 'bg-green-500';
  if (value < 0.25) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const calculateSpeedScore = (loadTime: number): number => {
  // Example speed score calculation
  // Less time = better score (100 is max)
  if (loadTime <= 1000) return 100;
  if (loadTime >= 8000) return 0;
  
  // Scale between 1000ms and 8000ms
  return Math.round(100 - ((loadTime - 1000) / 7000) * 100);
};

export const getLevelLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Bon';
  if (score >= 50) return 'Moyen';
  if (score >= 25) return 'À améliorer';
  return 'Critique';
};

export const getLevelColor = (score: number): string => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 75) return 'bg-green-400';
  if (score >= 50) return 'bg-amber-400';
  if (score >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

export const getLevelTextColor = (score: number): string => {
  if (score >= 90) return 'text-green-700';
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  if (score >= 25) return 'text-orange-700';
  return 'text-red-700';
};
