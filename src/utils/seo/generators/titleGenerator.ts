
export const generateSeoTitle = (keyword: string): string => {
  if (!keyword.trim()) return '';
  
  const currentYear = new Date().getFullYear();
  const templates = [
    `${keyword} : Guide Complet ${currentYear}`,
    `Tout savoir sur ${keyword} - Guide Expert`,
    `${keyword} : Conseils et Astuces Pratiques`,
    `Guide ${keyword} : Stratégies Efficaces`,
    `${keyword} - Solutions et Recommandations`,
    `Maîtriser ${keyword} : Guide Professionnel`,
    `${keyword} : Méthodes Éprouvées et Conseils`,
    `Comment optimiser ${keyword} - Guide Détaillé`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate.length > 60 ? randomTemplate.substring(0, 57) + "..." : randomTemplate;
};

export const detectGeographicKeyword = (keyword: string): boolean => {
  const geoTerms = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'strasbourg', 'montpellier', 'bordeaux', 'lille', 'rennes', 'reims', 'le havre', 'saint-étienne', 'toulon', 'grenoble', 'dijon', 'angers', 'nîmes', 'villeurbanne', 'clermont-ferrand', 'aix-en-provence', 'brest', 'tours', 'amiens', 'limoges', 'annecy', 'perpignan', 'boulogne-billancourt', 'orléans', 'mulhouse', 'rouen', 'caen', 'nancy', 'saint-denis', 'argenteuil', 'montreuil', 'roubaix', 'tourcoing', 'avignon', 'créteil', 'poitiers', 'fort-de-france', 'courbevoie', 'versailles', 'colombes', 'aulnay-sous-bois', 'vitry-sur-seine', 'pau', 'la rochelle', 'rueil-malmaison', 'calais', 'neuilly-sur-seine', 'antony', 'troyes', 'la seyne-sur-mer', 'sarcelles', 'metz', 'béziers', 'boulognesur-mer', 'dunkerque', 'meaux', 'pessac', 'fréjus', 'cherbourg-octeville', 'chambéry', 'lorient', 'montluçon', 'cholet', 'saint-quentin', 'valence', 'bourges', 'calais', 'mâcon', 'saint-nazaire', 'colmar', 'ajaccio', 'drancy', 'issy-les-moulineaux', 'levallois-perret', 'quimper', 'valenciennes', 'cannes', 'bourg-en-bresse', 'blois', 'la roche-sur-yon', 'saint-maur-des-fossés', 'cergy', 'saint-brieuc', 'châlons-en-champagne', 'beauvais', 'meaux', 'évry', 'bayonne', 'charleville-mézières', 'vannes', 'laval', 'saint-priest', 'ivry-sur-seine', 'clichy', 'montauban', 'niort', 'châteauroux', 'sète', 'chalon-sur-saône', 'caluire-et-cuire', 'sartrouville', 'arles', 'saint-ouen', 'pontault-combault', 'saint-étienne', 'wattrelos', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille', 'rennes', 'reims', 'saint-étienne', 'toulon', 'grenoble', 'dijon', 'angers', 'nîmes', 'aix-en-provence', 'brest', 'tours', 'amiens', 'limoges', 'annecy', 'perpignan', 'orléans', 'mulhouse', 'rouen', 'caen', 'nancy', 'argenteuil', 'montreuil', 'avignon', 'poitiers', 'versailles', 'la rochelle', 'metz', 'béziers', 'dunkerque', 'meaux', 'chambéry', 'lorient', 'montluçon', 'cholet', 'valence', 'bourges', 'mâcon', 'colmar', 'quimper', 'valenciennes', 'cannes', 'bourg-en-bresse', 'blois', 'la roche-sur-yon', 'évry', 'bayonne', 'vannes', 'laval', 'niort', 'châteauroux', 'arles', 'montauban', 'france', 'français', 'francophone'];
  
  return geoTerms.some(term => keyword.toLowerCase().includes(term.toLowerCase()));
};
