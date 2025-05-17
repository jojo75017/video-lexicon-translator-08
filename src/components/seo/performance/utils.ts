
export const formatTime = (ms: number): string => {
  if (ms >= 1000) {
    return `${(ms / 1000).toFixed(1)} s`;
  }
  return `${ms.toFixed(0)} ms`;
};

export const formatSize = (bytes: number): string => {
  if (bytes >= 1048576) {
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${bytes.toFixed(0)} B`;
};

export const getSpeedColorClass = (value: number, max: number): string => {
  const ratio = value / max;
  if (ratio <= 0.6) return "bg-green-500";
  if (ratio <= 0.8) return "bg-yellow-500";
  return "bg-red-500";
};

export const getClsColorClass = (value: number, max: number): string => {
  const ratio = value / max;
  if (ratio <= 0.5) return "bg-green-500";
  if (ratio <= 0.8) return "bg-yellow-500";
  return "bg-red-500";
};

export const getScoreColorClass = (score: number): string => {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-600";
  return "text-red-500";
};
