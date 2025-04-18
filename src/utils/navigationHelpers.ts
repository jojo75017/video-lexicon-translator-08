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

// Fonction améliorée pour activer une section/onglet
export const activateSection = (sectionId: string): void => {
  console.log(`Activation de la section: ${sectionId}`);
  
  if (!sectionId) {
    console.error("ID de section non spécifié");
    return;
  }
  
  // Fonction pour afficher un élément
  const displayElement = (element: HTMLElement) => {
    console.log(`Affichage de l'élément:`, element.id || element.getAttribute('data-section') || element.getAttribute('data-tab-content'));
    element.style.display = 'block';
  };
  
  // Attendre que le DOM soit prêt
  setTimeout(() => {
    try {
      // Trouver tous les éléments qui peuvent être des sections
      const allSections = document.querySelectorAll('[data-section], [data-tab-content], [id^="hierarchy"], [id^="wordcount"], [id^="suggestions"], [id^="seo"], [id^="structure"], [id^="backlinks"], [id^="performance"], [id^="metrics"], [id^="analytics"], [id^="signature"], [id^="quora"], [id^="local-business"], [id^="translation"], [id^="pinterest"]');
      
      console.log(`Nombre total d'éléments trouvés: ${allSections.length}`);
      console.log("Éléments trouvés:", Array.from(allSections).map(el => el.id || el.getAttribute('data-section') || el.getAttribute('data-tab-content')));
      
      // D'abord, masquer toutes les sections
      allSections.forEach(el => {
        // Vérifier si c'est une section valide
        (el as HTMLElement).style.display = 'none';
      });
      
      // Stratégie 1: Chercher par id direct
      const sectionById = document.getElementById(sectionId);
      if (sectionById) {
        console.log(`Section "${sectionId}" trouvée par id direct`);
        displayElement(sectionById);
        return;
      }
      
      // Stratégie 2: Chercher par data-section
      const sectionByData = document.querySelector(`[data-section="${sectionId}"]`);
      if (sectionByData) {
        console.log(`Section "${sectionId}" trouvée par data-section`);
        displayElement(sectionByData as HTMLElement);
        return;
      }
      
      // Stratégie 3: Chercher par data-tab-content
      const sectionByTab = document.querySelector(`[data-tab-content="${sectionId}"]`);
      if (sectionByTab) {
        console.log(`Section "${sectionId}" trouvée par data-tab-content`);
        displayElement(sectionByTab as HTMLElement);
        return;
      }
      
      // Stratégie 4: Pour les onglets de catégorie principale, afficher leur sous-onglet par défaut
      const mainCategory = getMainTabCategory(sectionId);
      if (mainCategory === sectionId) {
        console.log(`Recherche d'un sous-onglet pour la catégorie principale ${sectionId}`);
        
        const defaultSubTabs: Record<string, string> = {
          'content': 'hierarchy',
          'seo': 'seo',
          'performance': 'performance',
          'analytics': 'analytics',
          'tools': 'signature'
        };
        
        const defaultTab = defaultSubTabs[mainCategory];
        if (defaultTab) {
          console.log(`Tentative d'afficher le sous-onglet par défaut: ${defaultTab}`);
          
          // Tenter d'afficher le sous-onglet par défaut
          const defaultSection = document.getElementById(defaultTab) || 
                                 document.querySelector(`[data-section="${defaultTab}"]`) || 
                                 document.querySelector(`[data-tab-content="${defaultTab}"]`);
          
          if (defaultSection) {
            console.log(`Affichage du sous-onglet par défaut: ${defaultTab}`);
            displayElement(defaultSection as HTMLElement);
            return;
          }
        }
      }
      
      // Tentative d'affichage par classe CSS
      const sectionsByClass = document.querySelectorAll(`.${sectionId}-section`);
      if (sectionsByClass.length > 0) {
        console.log(`Section "${sectionId}" trouvée par classe CSS`);
        displayElement(sectionsByClass[0] as HTMLElement);
        return;
      }
      
      // Si aucune section n'a été trouvée, rechercher par contenu similaire
      console.log("Recherche de sections par contenu similaire");
      const possibleSections = document.querySelectorAll(`[id*="${sectionId}"], [data-section*="${sectionId}"], [data-tab-content*="${sectionId}"]`);
      if (possibleSections.length > 0) {
        console.log(`Section trouvée par correspondance partielle: ${possibleSections[0].id || possibleSections[0].getAttribute('data-section')}`);
        displayElement(possibleSections[0] as HTMLElement);
        return;
      }
      
      // Si aucune section n'a été trouvée, c'est probablement un bug de l'application
      // Affichons alors un message d'erreur et essayons de montrer une section de secours
      console.error(`Aucune section trouvée pour l'id: ${sectionId}`);
      console.log("Page actuelle:", window.location.pathname);
      console.log("Elements présents dans le DOM:", 
        Array.from(document.querySelectorAll('[id], [data-section], [data-tab-content]'))
          .map(el => ({
            id: el.id,
            'data-section': el.getAttribute('data-section'),
            'data-tab-content': el.getAttribute('data-tab-content'),
            display: (el as HTMLElement).style.display
          }))
      );
      
      // En dernier recours, chercher une section qui correspond au chemin actuel
      const currentPath = window.location.pathname;
      const pathToTabMap: Record<string, string> = {
        '/': 'hierarchy',
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
      
      const currentTabId = pathToTabMap[currentPath];
      if (currentTabId) {
        console.log(`Tentative d'afficher la section correspondant au chemin actuel: ${currentTabId}`);
        
        const currentSection = document.getElementById(currentTabId) || 
                              document.querySelector(`[data-section="${currentTabId}"]`) || 
                              document.querySelector(`[data-tab-content="${currentTabId}"]`);
        
        if (currentSection) {
          console.log(`Affichage de la section correspondant au chemin actuel: ${currentTabId}`);
          displayElement(currentSection as HTMLElement);
          return;
        }
      }
      
      // Afficher la première section valide disponible si tout a échoué
      const anySections = document.querySelectorAll('[data-section], [data-tab-content], [id]');
      for (let i = 0; i < anySections.length; i++) {
        const section = anySections[i] as HTMLElement;
        if (section && section.tagName !== 'SCRIPT' && section.tagName !== 'STYLE' && section.id !== 'root') {
          console.log(`Affichage de la première section disponible: ${section.id || section.getAttribute('data-section')}`);
          section.style.display = 'block';
          return;
        }
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'activation de la section:', error);
    }
  }, 100);
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
