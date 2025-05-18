
/**
 * Tronque un texte à une longueur maximale tout en préservant les mots entiers
 * @param text Le texte à tronquer
 * @param maxLength La longueur maximale souhaitée
 * @returns Le texte tronqué
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  // Trouver le dernier espace avant la longueur maximale
  const lastSpace = text.substring(0, maxLength).lastIndexOf(' ');
  if (lastSpace === -1) {
    return text.substring(0, maxLength) + '...';
  }

  return text.substring(0, lastSpace) + '...';
};

/**
 * Retourne la longueur exacte d'une chaîne de caractères
 * @param text Le texte dont on veut connaître la longueur
 * @returns La longueur du texte
 */
export const getExactLength = (text: string): number => {
  return text ? text.length : 0;
};
