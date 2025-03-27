
// Helper functions for managing section navigation and activation

export const activateSection = (sectionId: string) => {
  console.log(`Activation de la section: ${sectionId}`);
  
  // Masquer TOUTES les sections d'abord (solution plus radicale)
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  document.querySelectorAll('[data-section]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Masquer toutes les TabsContent d'abord
  document.querySelectorAll('[role="tabpanel"]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Afficher la section sélectionnée par ID - augmenter le délai
  setTimeout(() => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.style.display = 'block';
      console.log(`Section ${sectionId} activée et affichée`);
    } else {
      console.log(`Section avec ID ${sectionId} non trouvée dans le DOM`);
    }
    
    // Vérifier également les éléments avec l'attribut data-section
    const sectionElements = document.querySelectorAll(`[data-section="${sectionId}"]`);
    if (sectionElements.length > 0) {
      sectionElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      console.log(`Sections avec data-section=${sectionId} également activées`);
    } else {
      console.log(`Aucun élément avec data-section=${sectionId} trouvé`);
    }
    
    // Vérifier les éléments avec l'attribut data-tab-content
    const tabContentElements = document.querySelectorAll(`[data-tab-content="${sectionId}"]`);
    if (tabContentElements.length > 0) {
      tabContentElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      console.log(`Éléments avec data-tab-content=${sectionId} affichés`);
    }
    
    // Activer également le TabsContent correspondant
    const tabPanel = document.querySelector(`[role="tabpanel"][value="${sectionId}"]`);
    if (tabPanel) {
      (tabPanel as HTMLElement).style.display = 'block';
      console.log(`Panneau d'onglet ${sectionId} activé`);
    }
  }, 100);
};

// Fonction pour naviguer vers une section
export const navigateToSection = (sectionId: string) => {
  // Mettre à jour le hash pour déclencher les écouteurs
  window.location.hash = sectionId;
  
  // Puis activer explicitement la section
  setTimeout(() => {
    activateSection(sectionId);
  }, 300); // Délai augmenté pour garantir que le DOM est prêt
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
  }
  
  // Par défaut, retourner l'onglet lui-même s'il s'agit d'une catégorie principale
  return tabId;
};
