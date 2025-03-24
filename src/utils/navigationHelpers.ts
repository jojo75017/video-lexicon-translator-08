
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
  }
  
  // Also check for elements with data-section attribute
  const sectionElement = document.querySelector(`[data-section="${sectionId}"]`);
  if (sectionElement) {
    (sectionElement as HTMLElement).style.display = 'block';
    console.log(`Section with data-section=${sectionId} also activated`);
  }
};

// Add the missing navigateToSection function
export const navigateToSection = (sectionId: string) => {
  // First, set the hash to trigger any listeners
  window.location.hash = sectionId;
  
  // Then explicitly activate the section
  activateSection(sectionId);
};
