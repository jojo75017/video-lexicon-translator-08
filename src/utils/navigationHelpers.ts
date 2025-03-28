
// Fonctions d'aide pour gérer la navigation entre sections et leur activation

export const activateSection = (sectionId: string) => {
  console.log(`Activation de la section: ${sectionId}`);
  
  // D'abord, masquer TOUS les conteneurs possibles pour garantir un état propre
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  document.querySelectorAll('[data-section]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Pour les composants TabsContent, nous devons définir directement la propriété CSS display
  // MAIS nous ne devrions pas désactiver les actifs
  document.querySelectorAll('[role="tabpanel"]').forEach(el => {
    // Vérifier si ce panneau est pour la section actuellement activée
    const elValue = el.getAttribute('value');
    const dataValue = el.getAttribute('data-value');
    
    // Ignorer si c'est le panneau que nous voulons afficher
    if (elValue === sectionId || dataValue === sectionId) {
      console.log(`Garder le panneau visible: ${sectionId}`);
      (el as HTMLElement).style.display = 'block';
      (el as HTMLElement).setAttribute('data-state', 'active');
      return;
    }
    
    // Sinon le masquer
    (el as HTMLElement).style.display = 'none';
    (el as HTMLElement).setAttribute('data-state', 'inactive');
  });
  
  // Activer explicitement l'onglet cible
  setTimeout(() => {
    if (['info', 'source', 'structure', 'performance', 'accessibility'].includes(sectionId)) {
      // S'assurer que le TabsTrigger pour cette section est marqué comme actif
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
        console.log(`Onglet ${sectionId} défini comme actif`);
        
        // Marquer tous les panneaux comme inactifs
        document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
          panel.setAttribute('data-state', 'inactive');
          (panel as HTMLElement).style.display = 'none';
        });
        
        // Trouver et activer le contenu de l'onglet correspondant
        const panelSelector = `[role="tabpanel"][value="${sectionId}"]`;
        const panel = document.querySelector(panelSelector);
        
        if (panel) {
          panel.setAttribute('data-state', 'active');
          (panel as HTMLElement).style.display = 'block';
          console.log(`Panneau ${sectionId} défini comme actif`);
        } else {
          console.warn(`Panneau non trouvé pour: ${sectionId}`);
        }
      } else {
        console.warn(`Déclencheur non trouvé pour: ${sectionId}`);
      }
    }
  }, 10);
};

// Fonction pour naviguer vers une section - met à jour le hash de l'URL et active la section
export const navigateToSection = (sectionId: string) => {
  // Mettre à jour le hash pour déclencher les écouteurs (mais ne pas créer d'entrée dans l'historique)
  window.location.hash = sectionId;
  
  // Activer explicitement la section avec un délai
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
