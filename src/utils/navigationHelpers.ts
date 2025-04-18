
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
  
  // Vérifier si l'onglet est une catégorie principale et le convertir si nécessaire
  const mainCategory = getMainTabCategory(sectionId);
  const isMainCategory = mainCategory === sectionId;
  
  // Délai plus court pour permettre au DOM de se mettre à jour, mais pas trop long
  setTimeout(() => {
    try {
      // Masquer toutes les sections d'abord pour éviter les conflits d'affichage
      const allSections = document.querySelectorAll('[data-section], [data-tab-content], #hierarchy, #wordcount, #suggestions, #seo, #structure, #backlinks, #performance, #metrics, #analytics, #quora, #signature, #local-business, #translation, #pinterest');
      
      console.log(`Nombre total de sections trouvées: ${allSections.length}`);
      
      if (allSections.length === 0) {
        console.warn("Aucune section n'a été trouvée dans le DOM. Vérifiez que les sections sont correctement définies.");
        return;
      }
      
      allSections.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Stratégie 1: Chercher par data-section
      const sectionByData = document.querySelector(`[data-section="${sectionId}"]`);
      if (sectionByData) {
        console.log(`Section "${sectionId}" trouvée par data-section, affichage en cours`);
        (sectionByData as HTMLElement).style.display = 'block';
        return;
      }
      
      // Stratégie 2: Chercher par id
      const sectionById = document.getElementById(sectionId);
      if (sectionById) {
        console.log(`Section "${sectionId}" trouvée par id, affichage en cours`);
        sectionById.style.display = 'block';
        return;
      }
      
      // Stratégie 3: Chercher par data-tab-content
      const sectionByTab = document.querySelector(`[data-tab-content="${sectionId}"]`);
      if (sectionByTab) {
        console.log(`Section "${sectionId}" trouvée par data-tab-content, affichage en cours`);
        (sectionByTab as HTMLElement).style.display = 'block';
        return;
      }
      
      // Pour l'onglet principal "content", afficher hierarchy par défaut
      if (sectionId === 'content' || mainCategory === 'content') {
        const hierarchySection = document.querySelector('[data-section="hierarchy"]') || document.getElementById('hierarchy');
        if (hierarchySection) {
          console.log('Affichage de hierarchy pour l\'onglet content');
          (hierarchySection as HTMLElement).style.display = 'block';
          return;
        }
      }
      
      // Traitement spécial pour les onglets principaux
      const mainTabs = ['content', 'seo', 'performance', 'analytics', 'tools'];
      if (mainTabs.includes(sectionId)) {
        // Pour chaque onglet principal, essayer d'afficher la section correspondante
        const tabsMap: Record<string, string[]> = {
          'content': ['hierarchy', 'wordcount', 'suggestions'],
          'seo': ['seo', 'structure', 'backlinks'],
          'performance': ['performance', 'metrics'],
          'analytics': ['analytics'],
          'tools': ['signature', 'quora', 'local-business', 'translation']
        };
        
        const defaultSections = tabsMap[sectionId] || [];
        if (defaultSections.length > 0) {
          const firstSectionId = defaultSections[0];
          const firstSection = document.querySelector(`[data-section="${firstSectionId}"]`) || document.getElementById(firstSectionId);
          
          if (firstSection) {
            console.log(`Affichage de la section par défaut ${firstSectionId} pour l'onglet principal ${sectionId}`);
            (firstSection as HTMLElement).style.display = 'block';
            return;
          }
        }
      }
      
      // Si on arrive ici, essayer de trouver une section visible et l'afficher
      console.warn(`La section "${sectionId}" n'a pas été trouvée dans le DOM. Tentative de fallback.`);
      
      // Fallback: Afficher la première section de la page
      const firstAvailableSection = document.querySelector('[data-section], [data-tab-content]');
      if (firstAvailableSection) {
        console.log('Affichage de la première section disponible comme fallback');
        (firstAvailableSection as HTMLElement).style.display = 'block';
      } else {
        // Si toujours rien, loguer une erreur claire
        console.error('Erreur critique: Aucune section trouvée dans le DOM pour l\'affichage');
      }
    } catch (error) {
      console.error('Erreur lors de l\'activation de la section:', error);
    }
  }, 100); // Délai réduit pour être plus réactif
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
