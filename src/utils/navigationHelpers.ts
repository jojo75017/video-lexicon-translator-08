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
  } else if (['signature', 'quora', 'local-business', 'translation', 'pinterest'].includes(tabId)) {
    return 'tools';
  }
  
  // Retourner l'onglet lui-même s'il s'agit d'une catégorie principale
  return tabId;
};

// Fonction pour activer une section/onglet - version robuste
export const activateSection = (sectionId: string): void => {
  console.log(`Activation de la section: ${sectionId}`);
  
  // Attendre que le DOM soit prêt
  setTimeout(() => {
    try {
      // Masquer toutes les sections d'abord
      document.querySelectorAll('[data-section]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      document.querySelectorAll('[id]').forEach(el => {
        if(['hierarchy', 'wordcount', 'suggestions', 'seo', 'structure', 'backlinks', 
           'performance', 'metrics', 'analytics', 'quora', 'signature', 'local-business', 
           'translation', 'pinterest'].includes(el.id)) {
          (el as HTMLElement).style.display = 'none';
        }
      });
      
      // D'abord chercher par data-section
      const sectionByData = document.querySelector(`[data-section="${sectionId}"]`);
      if (sectionByData) {
        console.log(`Section ${sectionId} trouvée par data-section, affichage en cours`);
        (sectionByData as HTMLElement).style.display = 'block';
        return;
      }
      
      // Ensuite chercher par id
      const sectionById = document.getElementById(sectionId);
      if (sectionById) {
        console.log(`Section ${sectionId} trouvée par id, affichage en cours`);
        sectionById.style.display = 'block';
        return;
      }
      
      // Puis chercher par data-tab-content
      const sectionByTab = document.querySelector(`[data-tab-content="${sectionId}"]`);
      if (sectionByTab) {
        console.log(`Section ${sectionId} trouvée par data-tab-content, affichage en cours`);
        (sectionByTab as HTMLElement).style.display = 'block';
        return;
      }
      
      // Si c'est l'onglet principal "content", afficher hierarchy par défaut
      if (sectionId === 'content') {
        const hierarchySection = document.querySelector('[data-section="hierarchy"]') || document.getElementById('hierarchy');
        if (hierarchySection) {
          console.log('Affichage de hierarchy pour l\'onglet content');
          (hierarchySection as HTMLElement).style.display = 'block';
          return;
        }
      }
      
      // Vérification de section pour les onglets principaux
      if (['seo', 'performance', 'analytics', 'tools'].includes(sectionId)) {
        const mainSection = document.querySelector(`[data-section="${sectionId}"]`) || document.getElementById(sectionId);
        if (mainSection) {
          console.log(`Affichage de la section principale ${sectionId}`);
          (mainSection as HTMLElement).style.display = 'block';
          return;
        }
      }
      
      // Pour la page d'accueil, toujours montrer hierarchy
      if (sectionId === 'hierarchy' || window.location.pathname === '/') {
        const hierarchySections = document.querySelectorAll('[data-section="hierarchy"], #hierarchy');
        if (hierarchySections.length > 0) {
          console.log('Affichage forcé de la section hierarchy (page d\'accueil)');
          hierarchySections.forEach(section => {
            (section as HTMLElement).style.display = 'block';
          });
          return;
        }
      }
      
      // Afficher la première section disponible comme fallback
      console.warn(`La section ${sectionId} n'existe pas dans le DOM.`);
      const firstSection = document.querySelector('[data-section]');
      if (firstSection) {
        console.log('Affichage de la première section disponible comme fallback');
        (firstSection as HTMLElement).style.display = 'block';
      } else {
        console.error('Aucune section trouvée dans le DOM');
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation de la section:', error);
    }
  }, 300);
};

// Fonction pour naviguer vers une section
export const navigateToSection = (sectionId: string): void => {
  console.log(`Navigation vers la section: ${sectionId}`);
  window.location.hash = sectionId;
  activateSection(sectionId);
};

// Mappage des chemins d'URL vers les ID d'onglets pour la navigation
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
    '/local-business': 'local-business',
    '/translation': 'translation',
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
