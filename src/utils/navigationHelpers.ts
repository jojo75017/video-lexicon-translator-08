
// Fonction pour activer une section spécifique en fonction du routage
export const activateSection = (sectionId: string): void => {
  console.log(`Activation de la section: ${sectionId}`);
  
  if (!sectionId) {
    console.error("ID de section non spécifié");
    return;
  }
  
  // Attendre que le DOM soit prêt
  setTimeout(() => {
    try {
      // Trouver l'élément de contenu associé à l'onglet
      const tabContent = document.getElementById(sectionId) || 
                        document.querySelector(`[data-section="${sectionId}"]`) ||
                        document.querySelector(`[data-tab-content="${sectionId}"]`);
      
      if (tabContent) {
        console.log(`Section trouvée: ${sectionId}`);
        // Afficher la section
        (tabContent as HTMLElement).style.display = 'block';
      } else {
        console.warn(`Section non trouvée: ${sectionId}`);
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'activation de la section:', error);
    }
  }, 100);
};

// Fonction pour obtenir l'ID d'onglet à partir d'un chemin d'URL
export const getTabIdFromPath = (path: string): string => {
  // Nettoyer le chemin des paramètres ou du hash
  const cleanPath = path.split('?')[0].split('#')[0];
  
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
    '/pinterest': 'pinterest'
  };
  
  return pathToTabMap[cleanPath] || 'hierarchy';
};

// Fonction pour formater une URL avant l'analyse
export const formatUrl = (url: string): string => {
  // Ajouter le protocole si nécessaire
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};

// Fonction pour extraire un nom de domaine lisible
export const getReadableDomain = (url: string): string => {
  try {
    const urlObj = new URL(formatUrl(url));
    // Supprimer le www si présent
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};
