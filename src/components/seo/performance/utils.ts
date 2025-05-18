
/**
 * Formate les octets en une chaîne lisible (KB, MB, etc.)
 * 
 * @param bytes Le nombre d'octets à formater
 * @returns Une chaîne de caractères formatée avec l'unité appropriée
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obtient la couleur appropriée en fonction du niveau de performance
 * 
 * @param value Valeur de la métrique
 * @param invert Si true, les valeurs plus basses sont meilleures
 * @returns La classe de couleur CSS
 */
export const getLevelColor = (value: number, invert = false): string => {
  // Pour certaines métriques, les valeurs plus basses sont meilleures (comme le temps de chargement)
  const normalizedValue = invert ? 100 - value : value;
  
  if (normalizedValue >= 90) return 'bg-green-500';
  if (normalizedValue >= 70) return 'bg-green-400';
  if (normalizedValue >= 50) return 'bg-yellow-400';
  if (normalizedValue >= 30) return 'bg-orange-400';
  return 'bg-red-500';
};

/**
 * Obtient la couleur du texte appropriée en fonction du niveau de performance
 */
export const getLevelTextColor = (value: number, invert = false): string => {
  const normalizedValue = invert ? 100 - value : value;
  
  if (normalizedValue >= 90) return 'text-green-700';
  if (normalizedValue >= 70) return 'text-green-600';
  if (normalizedValue >= 50) return 'text-yellow-700';
  if (normalizedValue >= 30) return 'text-orange-700';
  return 'text-red-700';
};

/**
 * Obtient le libellé approprié en fonction du niveau de performance
 */
export const getLevelLabel = (value: number, invert = false): string => {
  const normalizedValue = invert ? 100 - value : value;
  
  if (normalizedValue >= 90) return 'Excellent';
  if (normalizedValue >= 70) return 'Bon';
  if (normalizedValue >= 50) return 'Moyen';
  if (normalizedValue >= 30) return 'À améliorer';
  return 'Critique';
};
