
/**
 * Activates a section by ID by making it visible and hiding others
 */
export const activateSection = (sectionId: string): void => {
  console.log(`Activating section: ${sectionId}`);
  
  // First hide all sections with data-tab-content attribute
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });
  
  // Then show the requested section
  const section = document.querySelector(`[data-tab-content="${sectionId}"]`);
  if (section) {
    (section as HTMLElement).style.display = 'block';
    console.log(`Section ${sectionId} activated and displayed`);
  } else {
    console.warn(`Section with ID ${sectionId} not found`);
  }
  
  // Also activate any section with matching data-section attribute
  const sectionByAttr = document.querySelector(`[data-section="${sectionId}"]`);
  if (sectionByAttr) {
    (sectionByAttr as HTMLElement).style.display = 'block';
    console.log(`Section with data-section=${sectionId} also activated`);
  }
};
