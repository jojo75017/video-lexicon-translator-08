
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
  } else if (['quora', 'signature', 'local-business'].includes(tabId)) {
    return tabId;
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
    (section as HTMLElement).style.display = 'block';
  }
};

// Fonction pour naviguer vers une section
export const navigateToSection = (sectionId: string): void => {
  console.log(`Navigation vers la section: ${sectionId}`);
  window.location.hash = sectionId;
  activateSection(sectionId);
};
