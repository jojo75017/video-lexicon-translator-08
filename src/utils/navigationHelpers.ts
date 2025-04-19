
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
      // Sélecteurs pour trouver les sections
      const sectionSelectors = [
        // Sélecteur par ID direct
        `#${sectionId}`,
        // Sélecteurs par attributs data-
        `[data-section="${sectionId}"]`,
        `[data-tab-content="${sectionId}"]`,
        // Sélecteurs par classe
        `.${sectionId}-section`,
        // Sélecteurs avec ID comme classe
        `[class*="${sectionId}"]`,
        // Sélecteurs par contenu
        `[id*="${sectionId}"]`,
        `[data-section*="${sectionId}"]`,
        `[data-tab-content*="${sectionId}"]`
      ].join(', ');
      
      // Trouver tous les éléments qui peuvent être des sections
      const allSections = document.querySelectorAll('[data-section], [data-tab-content], [id^="hierarchy"], [id^="wordcount"], [id^="suggestions"], [id^="seo"], [id^="structure"], [id^="backlinks"], [id^="performance"], [id^="metrics"], [id^="analytics"], [id^="signature"], [id^="quora"], [id^="local-business"], [id^="translation"], [id^="pinterest"]');
      
      console.log(`Nombre total d'éléments trouvés: ${allSections.length}`);
      console.log("Éléments trouvés:", Array.from(allSections).map(el => el.id || el.getAttribute('data-section') || el.getAttribute('data-tab-content')));
      
      // D'abord, masquer toutes les sections
      allSections.forEach(el => {
        // Vérifier si c'est une section valide
        (el as HTMLElement).style.display = 'none';
      });
      
      // Tenter de trouver la section demandée avec tous les sélecteurs possibles
      const possibleSections = document.querySelectorAll(sectionSelectors);
      if (possibleSections.length > 0) {
        console.log(`Section "${sectionId}" trouvée avec sélecteur combiné`);
        displayElement(possibleSections[0] as HTMLElement);
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
          const defaultSectionSelectors = [
            `#${defaultTab}`,
            `[data-section="${defaultTab}"]`,
            `[data-tab-content="${defaultTab}"]`,
            `.${defaultTab}-section`
          ].join(', ');
          
          const defaultSection = document.querySelector(defaultSectionSelectors);
          if (defaultSection) {
            console.log(`Affichage du sous-onglet par défaut: ${defaultTab}`);
            displayElement(defaultSection as HTMLElement);
            return;
          }
        }
      }
      
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
        
        const currentSectionSelectors = [
          `#${currentTabId}`,
          `[data-section="${currentTabId}"]`,
          `[data-tab-content="${currentTabId}"]`,
          `.${currentTabId}-section`
        ].join(', ');
        
        const currentSection = document.querySelector(currentSectionSelectors);
        if (currentSection) {
          console.log(`Affichage de la section correspondant au chemin actuel: ${currentTabId}`);
          displayElement(currentSection as HTMLElement);
          return;
        }
      }
      
      // Ultima fallback - essayer de charger la page index.html du root
      if (document.getElementById('seo') || document.querySelector('[data-section="seo"]')) {
        console.log("Fallback: Affichage de la section SEO");
        const seoSection = document.getElementById('seo') || document.querySelector('[data-section="seo"]');
        if (seoSection) {
          displayElement(seoSection as HTMLElement);
          return;
        }
      }
      
      // Si tout échoue, essayer d'afficher un contenu visible sur la page
      console.log("Aucune section trouvée, affichage de secours");
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const contentDivs = mainContent.querySelectorAll('div');
        for (let i = 0; i < contentDivs.length; i++) {
          const div = contentDivs[i] as HTMLElement;
          if (div.offsetHeight > 100 && div.children.length > 0) {
            div.style.display = 'block';
            console.log("Affichage de secours activé");
            return;
          }
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
