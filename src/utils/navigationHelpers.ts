
// Helper functions for managing section navigation and activation

export const activateSection = (sectionId: string) => {
  console.log(`Activating section: ${sectionId}`);
  
  // Hide all sections first
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Show the selected section
  const element = document.getElementById(sectionId);
  if (element) {
    element.style.display = 'block';
    console.log(`Section ${sectionId} activated and displayed`);
  } else {
    console.log(`Section with ID ${sectionId} not found in DOM`);
  }
  
  // Also check for elements with data-section attribute
  const sectionElement = document.querySelector(`[data-section="${sectionId}"]`);
  if (sectionElement) {
    (sectionElement as HTMLElement).style.display = 'block';
    console.log(`Section with data-section=${sectionId} also activated`);
  } else {
    console.log(`No element with data-section=${sectionId} found`);
  }
  
  // Make sure results-display is visible when showing seo section
  if (sectionId === 'seo') {
    const resultsDisplay = document.querySelector('.results-display');
    if (resultsDisplay) {
      (resultsDisplay as HTMLElement).style.display = 'block';
      console.log('Results display for SEO is now visible');
    }
  }
};

// Add the missing navigateToSection function
export const navigateToSection = (sectionId: string) => {
  // First, set the hash to trigger any listeners
  window.location.hash = sectionId;
  
  // Then explicitly activate the section
  activateSection(sectionId);
};

// Function to get main tab category for any tab
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
  
  // Default to the tab itself if it's a main category
  return tabId;
};
