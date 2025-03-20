
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // First activate tab if needed
  if (tabId) {
    const tabElement = document.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
    if (tabElement) {
      console.log(`Tab element found: ${tabId}`);
      tabElement.click();
      // Wait for tab activation
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
  console.log(`Scrolling to section: ${sectionId}`);
  
  // Look for element by ID
  const sectionElement = document.getElementById(sectionId);
  
  if (sectionElement) {
    console.log(`Section element found: ${sectionId}`);
    
    // Ensure the element is visible
    sectionElement.style.display = 'block';
    
    // Scroll to section with smooth behavior
    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Apply more visible highlight effect
    sectionElement.classList.add('transition-all');
    sectionElement.classList.add('duration-1000');
    sectionElement.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
    sectionElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
    
    // Remove effect after longer delay
    setTimeout(() => {
      sectionElement.style.backgroundColor = '';
      sectionElement.style.boxShadow = 'none';
      sectionElement.classList.remove('transition-all');
      sectionElement.classList.remove('duration-1000');
    }, 3000);
  } else {
    console.log(`Section element not found: ${sectionId}`);
    
    // Try to find element with data-section attribute
    const dataAttributeSection = document.querySelector(`[data-section="${sectionId}"]`);
    if (dataAttributeSection) {
      console.log(`Found section by data attribute: ${sectionId}`);
      
      // Ensure the element is visible
      (dataAttributeSection as HTMLElement).style.display = 'block';
      
      dataAttributeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Apply highlight effect
      dataAttributeSection.classList.add('transition-all');
      dataAttributeSection.classList.add('duration-1000');
      (dataAttributeSection as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      (dataAttributeSection as HTMLElement).style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      
      // Remove effect after delay
      setTimeout(() => {
        (dataAttributeSection as HTMLElement).style.backgroundColor = '';
        (dataAttributeSection as HTMLElement).style.boxShadow = 'none';
        dataAttributeSection.classList.remove('transition-all');
        dataAttributeSection.classList.remove('duration-1000');
      }, 3000);
      return;
    }
    
    // Try to find element with class name
    const classSection = document.querySelector(`.section-${sectionId}`);
    if (classSection) {
      console.log(`Found section by class: ${sectionId}`);
      
      // Ensure the element is visible
      (classSection as HTMLElement).style.display = 'block';
      
      classSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Apply highlight effect
      (classSection as HTMLElement).classList.add('transition-all');
      (classSection as HTMLElement).classList.add('duration-1000');
      (classSection as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      (classSection as HTMLElement).style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      
      // Remove effect after delay
      setTimeout(() => {
        (classSection as HTMLElement).style.backgroundColor = '';
        (classSection as HTMLElement).style.boxShadow = 'none';
        (classSection as HTMLElement).classList.remove('transition-all');
        (classSection as HTMLElement).classList.remove('duration-1000');
      }, 3000);
      return;
    }
    
    // If no specific section is found, inform the user
    toast.info("Section non trouvée", {
      description: "Veuillez d'abord analyser un site web pour accéder à cette section",
    });
  }
};
