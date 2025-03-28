
// Fonctions d'aide pour gérer la navigation entre sections et leur activation

export const activateSection = (sectionId: string) => {
  console.log(`Activation de la section: ${sectionId}`);
  
  // Masquer tous les conteneurs possibles pour garantir un état propre
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  document.querySelectorAll('[data-section]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Pour les composants TabsContent dans le cadre de Shadcn UI
  document.querySelectorAll('[role="tabpanel"]').forEach(el => {
    // Vérifier si ce panneau correspond à la section que nous voulons activer
    const elValue = el.getAttribute('value');
    const dataValue = el.getAttribute('data-value');
    
    // Si c'est le panneau que nous voulons afficher, ne pas le masquer
    if (elValue === sectionId || dataValue === sectionId) {
      console.log(`Activation du panneau pour ${sectionId}`);
      (el as HTMLElement).style.display = 'block';
      el.setAttribute('data-state', 'active');
      return;
    }
    
    // Sinon, le masquer
    (el as HTMLElement).style.display = 'none';
    el.setAttribute('data-state', 'inactive');
  });
  
  // Activation spécifique pour les onglets du composant ResultTabs
  setTimeout(() => {
    if (['info', 'source', 'structure', 'performance', 'accessibility'].includes(sectionId)) {
      // Trouver et activer le déclencheur d'onglet (TabsTrigger) correspondant
      const triggerSelector = `[role="tab"][value="${sectionId}"]`;
      const trigger = document.querySelector(triggerSelector);
      
      if (trigger) {
        // Marquer tous les autres onglets comme inactifs
        document.querySelectorAll('[role="tab"]').forEach(tab => {
          tab.setAttribute('data-state', 'inactive');
          tab.setAttribute('aria-selected', 'false');
        });
        
        // Marquer cet onglet comme actif
        trigger.setAttribute('data-state', 'active');
        trigger.setAttribute('aria-selected', 'true');
        console.log(`Onglet ${sectionId} activé avec succès`);
        
        // Activer son contenu
        const panelSelector = `[role="tabpanel"][value="${sectionId}"]`;
        const panel = document.querySelector(panelSelector);
        
        if (panel) {
          document.querySelectorAll('[role="tabpanel"]').forEach(p => {
            p.setAttribute('data-state', 'inactive');
            (p as HTMLElement).style.display = 'none';
          });
          
          panel.setAttribute('data-state', 'active');
          (panel as HTMLElement).style.display = 'block';
          console.log(`Panneau ${sectionId} activé avec succès`);
        }
      }
    }
    
    // Activer explicitement la section et le contenu de l'onglet
    document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(el => {
      (el as HTMLElement).style.display = 'block';
    });
    
    document.querySelectorAll(`[data-tab-content="${sectionId}"]`).forEach(el => {
      (el as HTMLElement).style.display = 'block';
    });
  }, 10);
};

// Fonction pour naviguer vers une section avec mise à jour de l'URL
export const navigateToSection = (sectionId: string) => {
  console.log(`Navigation vers la section: ${sectionId}`);
  
  // Mettre à jour le hash de l'URL sans créer d'entrée dans l'historique
  window.location.hash = sectionId;
  
  // Activer la section après un court délai pour s'assurer que le DOM est prêt
  setTimeout(() => {
    activateSection(sectionId);
  }, 50);
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
  } else if (['info', 'source'].includes(tabId)) {
    return 'results';
  }
  
  // Retourner l'onglet lui-même s'il s'agit d'une catégorie principale
  return tabId;
};

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
