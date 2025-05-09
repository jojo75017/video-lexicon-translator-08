
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

// Get performance improvement recommendation text
export const getPerformanceRecommendation = (metric: string, value: number): string => {
  switch(metric) {
    case 'loadTime':
      return value > 3000 
        ? "Réduisez le temps de chargement en optimisant les images et scripts, et en utilisant la mise en cache."
        : "Temps de chargement acceptable. Continuez à optimiser pour une meilleure expérience.";
    case 'firstContentfulPaint':
      return value > 2000 
        ? "Améliorez le FCP en utilisant un meilleur hébergement et en réduisant les requêtes bloquantes."
        : "Bon FCP. Envisagez d'utiliser un CDN pour l'améliorer davantage.";
    case 'largestContentfulPaint':
      return value > 2500 
        ? "Optimisez le LCP en améliorant la diffusion d'images et en réduisant les requêtes JavaScript."
        : "LCP performant. Continuez à surveiller pour maintenir cette vitesse.";
    case 'cumulativeLayoutShift':
      return value > 0.1 
        ? "Réduisez le CLS en spécifiant les dimensions des images et en évitant d'insérer du contenu dynamique."
        : "Excellent CLS. Votre site offre une expérience visuelle stable.";
    case 'totalBlockingTime':
      return value > 200 
        ? "Diminuez le TBT en optimisant votre JavaScript et en utilisant le chargement asynchrone."
        : "TBT performant. Votre site répond rapidement aux interactions utilisateur.";
    default:
      return "Analysez vos métriques de performance pour identifier des optimisations potentielles.";
  }
};

// Pie chart colors
export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Performance metrics tooltips
export const METRICS_TOOLTIPS = {
  loadTime: "Temps total de chargement de la page, du début de la navigation jusqu'à ce que la page soit complètement chargée.",
  firstContentfulPaint: "Temps jusqu'à ce que le premier contenu (texte, image, etc.) soit affiché à l'écran.",
  largestContentfulPaint: "Temps jusqu'à ce que le plus grand élément visible dans la fenêtre soit affiché.",
  totalBlockingTime: "Temps total pendant lequel le thread principal est bloqué et ne peut pas répondre aux interactions.",
  cumulativeLayoutShift: "Mesure de la stabilité visuelle. Un score bas indique moins de décalages inattendus de contenu.",
  domLoadTime: "Temps nécessaire pour analyser le document HTML et construire le DOM.",
  speedIndex: "Indicateur de la rapidité avec laquelle le contenu d'une page est affiché visuellement pendant le chargement."
};
