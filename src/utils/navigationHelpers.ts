
// Helper functions for managing section navigation and activation

export const activateSection = (sectionId: string) => {
  console.log(`Activating section: ${sectionId}`);
  
  // Hide all sections first
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  document.querySelectorAll('[data-section]').forEach(el => {
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
  
  // Special case for main categories - activate their first sub-tab if needed
  if (sectionId === 'content') {
    const hierarchySection = document.getElementById('hierarchy') || document.querySelector('[data-section="hierarchy"]');
    if (hierarchySection) {
      (hierarchySection as HTMLElement).style.display = 'block';
      console.log('Content category activated - showing hierarchy tab');
    }
  } else if (sectionId === 'seo') {
    const seoSection = document.getElementById('seo') || document.querySelector('[data-section="seo"]');
    if (seoSection) {
      (seoSection as HTMLElement).style.display = 'block';
      console.log('SEO category activated - showing seo tab');
      
      // Make sure results-display is visible when showing seo section
      const resultsDisplay = document.querySelector('.results-display');
      if (resultsDisplay) {
        (resultsDisplay as HTMLElement).style.display = 'block';
        console.log('Results display for SEO is now visible');
      }
    }
  } else if (sectionId === 'performance') {
    const performanceSection = document.getElementById('performance') || document.querySelector('[data-section="performance"]');
    if (performanceSection) {
      (performanceSection as HTMLElement).style.display = 'block';
      console.log('Performance category activated - showing performance tab');
    }
  } else if (sectionId === 'analytics') {
    const analyticsSection = document.getElementById('analytics') || document.querySelector('[data-section="analytics"]');
    if (analyticsSection) {
      (analyticsSection as HTMLElement).style.display = 'block';
      console.log('Analytics category activated - showing analytics tab');
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
