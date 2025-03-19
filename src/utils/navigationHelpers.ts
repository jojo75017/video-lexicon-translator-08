
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // First step: Activate the tab if needed
  if (tabId) {
    const tabElement = document.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
    if (tabElement) {
      console.log(`Tab element found: ${tabId}`);
      tabElement.click();
      // Wait for the tab to be activated
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 200);
    } else {
      console.log(`Tab element not found: ${tabId}`);
      scrollToSection(sectionId);
    }
  } else {
    scrollToSection(sectionId);
  }
};

export const scrollToSection = (sectionId: string): void => {
  // Look for element by ID
  const sectionElement = document.getElementById(sectionId);
  
  if (sectionElement) {
    console.log(`Section element found: ${sectionId}`);
    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Add temporary highlight effect
    sectionElement.classList.add('bg-blue-50');
    setTimeout(() => {
      sectionElement.classList.remove('bg-blue-50');
    }, 2000);
  } else {
    console.log(`Section element not found: ${sectionId}`);
    
    // Try to find an element with a data-section attribute
    const dataAttributeSection = document.querySelector(`[data-section="${sectionId}"]`);
    if (dataAttributeSection) {
      console.log(`Found section by data attribute: ${sectionId}`);
      dataAttributeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    
    // Try to find an element with the class name
    const classSection = document.querySelector(`.section-${sectionId}`);
    if (classSection) {
      console.log(`Found section by class: ${sectionId}`);
      classSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    
    // If no specific section is found, inform the user
    toast.info("Section non trouvée", {
      description: "Veuillez d'abord analyser un site web pour accéder à cette section",
    });
    
    // Fallback: Scroll to analysis form as an alternative
    const analysisForm = document.querySelector('form') as HTMLElement;
    if (analysisForm) {
      analysisForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
