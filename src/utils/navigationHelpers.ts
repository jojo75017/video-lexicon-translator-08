
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // Ensure all tabs are properly reset first
  resetAllTabs();
  
  // First select the tab if provided
  if (tabId) {
    const tabTrigger = document.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
    if (tabTrigger) {
      console.log(`Clicking tab with data-value: ${tabId}`);
      tabTrigger.click();
      setTimeout(() => activateSection(sectionId), 50);
    } else {
      console.log(`Tab with data-value "${tabId}" not found, directly activating section`);
      activateSection(sectionId);
    }
  } else {
    activateSection(sectionId);
  }
};

// Reset all tabs to inactive state
const resetAllTabs = () => {
  document.querySelectorAll('[data-tab-id]').forEach(tab => {
    tab.setAttribute('data-state', 'inactive');
  });
};

// Show specific section and hide others
export const activateSection = (sectionId: string): void => {
  console.log(`Activating section: ${sectionId}`);
  
  // First reset all content sections to hidden
  document.querySelectorAll('[data-tab-content]').forEach(section => {
    (section as HTMLElement).style.display = 'none';
  });
  
  // Find the target section (try multiple selector formats)
  const sectionElement = 
    document.getElementById(sectionId) || 
    document.querySelector(`[data-section="${sectionId}"]`) || 
    document.querySelector(`[data-tab-content="${sectionId}"]`);
  
  if (sectionElement) {
    console.log(`Section "${sectionId}" found, making visible`);
    (sectionElement as HTMLElement).style.display = 'block';
    
    // Also make sure the corresponding tab is activated
    const tabTrigger = document.querySelector(`[data-tab-id="${sectionId}"]`);
    if (tabTrigger) {
      console.log(`Setting tab for "${sectionId}" to active state`);
      tabTrigger.setAttribute('data-state', 'active');
    }
    
    toast.success(`Section ${sectionId} affichée`, {
      description: "La section est maintenant visible",
      duration: 2000
    });
  } else {
    console.error(`Section "${sectionId}" not found`);
    toast.error(`Section non trouvée: ${sectionId}`, {
      description: "La section demandée n'existe pas",
      duration: 2000
    });
  }
};

// Scroll to section with highlight effect
export const scrollToSection = (sectionId: string): void => {
  activateSection(sectionId);
  
  const sectionElement = 
    document.getElementById(sectionId) || 
    document.querySelector(`[data-section="${sectionId}"]`) || 
    document.querySelector(`[data-tab-content="${sectionId}"]`);
  
  if (sectionElement) {
    setTimeout(() => {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Apply highlight effect
      sectionElement.classList.add('transition-all');
      sectionElement.classList.add('duration-500');
      sectionElement.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      
      // Remove effect after delay
      setTimeout(() => {
        sectionElement.style.backgroundColor = '';
        sectionElement.classList.remove('transition-all');
        sectionElement.classList.remove('duration-500');
      }, 1500);
    }, 100);
  }
};
