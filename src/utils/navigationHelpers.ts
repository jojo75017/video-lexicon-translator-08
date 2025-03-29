
// Fonction pour vérifier si un URL est valide
export const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

// Fonction pour extraire le nom de domaine d'une URL
export const getDomainFromUrl = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (e) {
    return urlString;
  }
};

// Fonction pour obtenir la catégorie principale d'un onglet
export const getMainTabCategory = (tabId: string): string => {
  if (['hierarchy', 'wordcount', 'suggestions'].includes(tabId)) {
    return 'content';
  } else if (['seo', 'structure', 'backlinks'].includes(tabId)) {
    return 'seo';
  } else if (['performance', 'metrics'].includes(tabId)) {
    return 'performance';
  } else if (tabId === 'analytics') {
    return 'analytics';
  } else if (['signature', 'quora', 'local-business'].includes(tabId)) {
    return 'tools';
  }
  
  // Retourner l'onglet lui-même s'il s'agit d'une catégorie principale
  return tabId;
};

// Fonction pour activer une section/onglet
export const activateSection = (sectionId: string): void => {
  console.log(`Activation de la section: ${sectionId}`);
  
  // Masquer toutes les sections
  document.querySelectorAll('[data-section]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Afficher la section demandée
  const section = document.querySelector(`[data-section="${sectionId}"]`);
  if (section) {
    console.log(`Section ${sectionId} trouvée, affichage en cours`);
    (section as HTMLElement).style.display = 'block';
  } else {
    console.warn(`La section ${sectionId} n'existe pas dans le DOM.`);
    
    // Afficher la première section disponible comme fallback
    const firstSection = document.querySelector('[data-section]');
    if (firstSection) {
      console.log('Affichage de la première section disponible comme fallback');
      (firstSection as HTMLElement).style.display = 'block';
    }
  }
};

// Fonction pour naviguer vers une section
export const navigateToSection = (sectionId: string): void => {
  console.log(`Navigation vers la section: ${sectionId}`);
  window.location.hash = sectionId;
  activateSection(sectionId);
};

// Mappage des chemins d'URL vers les ID d'onglets pour la navigation
export const getTabIdFromPath = (path: string): string => {
  const pathToTabMap: Record<string, string> = {
    '/': 'hierarchy',
    '/index': 'hierarchy',
    '/hierarchy': 'hierarchy',
    '/wordcount': 'wordcount',
    '/suggestions': 'suggestions',
    '/seo': 'seo',
    '/structure': 'structure',
    '/backlinks': 'backlinks',
    '/performance': 'performance',
    '/metrics': 'metrics',
    '/analytics': 'analytics',
    '/quora': 'quora',
    '/signature': 'signature',
    '/local-business': 'local-business'
  };
  
  return pathToTabMap[path] || 'hierarchy';
};
