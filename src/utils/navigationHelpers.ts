
// Helper functions for managing section navigation and activation

export const activateSection = (sectionId: string) => {
  console.log(`Activation de la section: ${sectionId}`);
  
  // Hide ALL sections first
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  document.querySelectorAll('[data-section]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Hide all TabsContent first
  document.querySelectorAll('[role="tabpanel"]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Show the selected section by ID with a delay
  setTimeout(() => {
    // Show all elements that match the sectionId
    const elementById = document.getElementById(sectionId);
    if (elementById) {
      elementById.style.display = 'block';
      console.log(`Section ID ${sectionId} activated and displayed`);
    }
    
    // Show all elements with the matching data-section attribute
    const sectionElements = document.querySelectorAll(`[data-section="${sectionId}"]`);
    if (sectionElements.length > 0) {
      sectionElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      console.log(`Sections with data-section=${sectionId} activated (${sectionElements.length} found)`);
    }
    
    // Show all elements with the matching data-tab-content attribute
    const tabContentElements = document.querySelectorAll(`[data-tab-content="${sectionId}"]`);
    if (tabContentElements.length > 0) {
      tabContentElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      console.log(`Elements with data-tab-content=${sectionId} displayed (${tabContentElements.length} found)`);
    }
    
    // Show the tab panel with the matching value attribute
    const tabPanel = document.querySelector(`[role="tabpanel"][value="${sectionId}"]`);
    if (tabPanel) {
      (tabPanel as HTMLElement).style.display = 'block';
      console.log(`Tab panel ${sectionId} activated`);
    }
  }, 300); // Increased delay to ensure DOM is ready
};

// Function to navigate to a section
export const navigateToSection = (sectionId: string) => {
  // Update hash to trigger listeners
  window.location.hash = sectionId;
  
  // Explicitly activate the section after a delay
  setTimeout(() => {
    activateSection(sectionId);
  }, 500); // Increased delay to ensure hash is updated
};

// Function to get the main tab category of a tab
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
  
  // Return the tab itself if it's a main category
  return tabId;
};
