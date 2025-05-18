
// Utilitaires pour les graphiques de performance

export const formatTime = (timeMs: number): string => {
  if (timeMs < 1000) {
    return `${Math.round(timeMs)}ms`;
  }
  return `${(timeMs / 1000).toFixed(2)}s`;
};

export const formatSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes}B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
};

// Couleurs pour les différents types de ressources dans les charts
export const CHART_COLORS = {
  js: '#4f46e5', // indigo
  css: '#0ea5e9', // sky
  images: '#10b981', // emerald
  fonts: '#eab308', // yellow
  other: '#f97316', // orange
  default: '#6b7280', // gray
};
