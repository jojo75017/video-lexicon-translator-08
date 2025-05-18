
/**
 * Génère des données simulées pour les SERP (Search Engine Results Page)
 * 
 * @param keyword Le mot-clé à analyser
 * @returns Les résultats de recherche simulés
 */
export const generateSerpData = (keyword: string) => {
  // Cette fonction génère des données SERP simulées pour le mot-clé fourni
  const domainNames = [
    'wikipedia.org',
    'amazon.fr',
    'fnac.com',
    'lemonde.fr',
    'boulanger.com',
    'darty.com',
    'leparisien.fr',
    'lepoint.fr',
    'cdiscount.com',
    'lefigaro.fr'
  ];
  
  return Array(10).fill(0).map((_, index) => {
    const domain = domainNames[index % domainNames.length];
    return {
      position: index + 1,
      title: `${keyword} - Tout savoir sur ${keyword} | ${domain}`,
      url: `https://www.${domain}/article/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
      description: `Découvrez tout sur ${keyword}. Les meilleures informations, guides et conseils pour ${keyword} sur ${domain}.`
    };
  });
};

/**
 * Analyse un mot-clé et génère des métadonnées associées
 * 
 * @param keyword Le mot-clé à analyser
 */
export const analyzeKeyword = (keyword: string) => {
  // Fonction simulée d'analyse de mot-clé
  const wordCount = keyword.split(/\s+/).length;
  
  // Génère des données en fonction du nombre de mots dans le mot-clé
  return {
    difficulty: Math.min(Math.floor(Math.random() * 30) + wordCount * 15, 100),
    searchVolume: Math.floor(Math.random() * 10000) * (3 - Math.min(wordCount, 2)), // Plus de volume pour les mots-clés courts
    cpc: (Math.random() * 2 + 0.5).toFixed(2),
    competition: Math.random().toFixed(2),
    trends: Array(12).fill(0).map(() => Math.floor(Math.random() * 100)),
    intent: wordCount > 2 ? 'informational' : Math.random() > 0.5 ? 'transactional' : 'navigational'
  };
};
