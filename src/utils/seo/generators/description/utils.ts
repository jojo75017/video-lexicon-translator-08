
/**
 * Calcule la longueur exacte d'un texte en tenant compte des caractères spéciaux
 * @param text Le texte dont on veut calculer la longueur
 * @returns La longueur exacte du texte
 */
export const getExactLength = (text: string): number => {
  if (!text) return 0;
  return text.length;
};

/**
 * Détecte le thème d'un site en fonction du mot-clé
 * @param keyword Le mot-clé à analyser
 * @returns Le thème détecté (travel, aquarium, others)
 */
export const detectWebsiteTheme = (keyword: string): 'travel' | 'aquarium' | 'other' => {
  const lowerKeyword = keyword.toLowerCase();
  
  // Liste de termes liés au voyage
  const travelTerms = [
    'voyage', 'voyageur', 'destination', 'tourisme', 'excursion', 'séjour',
    'vacances', 'circuit', 'visite', 'aventure', 'découverte', 'touriste',
    'itinéraire', 'guide', 'explorer', 'road trip', 'trek', 'randonnée',
    'hôtel', 'plage', 'montagne', 'backpacker', 'île', 'croisière',
    'vol', 'avion', 'train', 'bateau', 'bali', 'paris', 'rome', 'tokyo',
    'new york', 'londres', 'barcelone', 'thailand', 'thaïlande', 'japon'
  ];
  
  // Liste de termes liés à l'aquariophilie
  const aquariumTerms = [
    'aquari', 'aquarium', 'poisson', 'fish', 'tank', 'eau douce', 'freshwater',
    'eau de mer', 'saltwater', 'récifal', 'reef', 'corail', 'coral',
    'betta', 'guppy', 'discus', 'cichlidé', 'cichlid', 'tetra', 'scalaire',
    'plante', 'plant', 'algue', 'algae', 'filtre', 'filter', 'pompe', 'pump',
    'aquariosland'
  ];
  
  // Vérification du thème
  for (const term of travelTerms) {
    if (lowerKeyword.includes(term)) {
      return 'travel';
    }
  }
  
  for (const term of aquariumTerms) {
    if (lowerKeyword.includes(term)) {
      return 'aquarium';
    }
  }
  
  return 'other';
};

/**
 * Tronque un texte à une longueur maximale en essayant de ne pas couper les mots
 * @param text Le texte à tronquer
 * @param maxLength La longueur maximale souhaitée
 * @returns Le texte tronqué
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  
  // Trouver le dernier espace avant la limite
  const lastSpace = text.lastIndexOf(' ', maxLength - 3);
  if (lastSpace > 0) {
    return text.substring(0, lastSpace) + '...';
  }
  
  // Si aucun espace n'est trouvé, tronquer simplement
  return text.substring(0, maxLength - 3) + '...';
};
