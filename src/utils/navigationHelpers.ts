
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // First activate tab if needed
  if (tabId) {
    // Find and click the tab
    const tabElement = document.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
    if (tabElement) {
      console.log(`Tab element found with data-value: ${tabId}`);
      tabElement.click();
      
      // Allow some time for the tab content to render
      setTimeout(() => {
        showSection(sectionId);
      }, 100);
    } else {
      console.log(`Tab element not found with data-value: ${tabId}`);
      showSection(sectionId);
    }
  } else {
    showSection(sectionId);
  }
};

export const showSection = (sectionId: string): void => {
  console.log(`Showing section: ${sectionId}`);
  
  // Hide all tab content sections first
  const allSections = document.querySelectorAll('[data-tab-content]');
  allSections.forEach((section) => {
    (section as HTMLElement).style.display = 'none';
  });
  
  // Deactivate all tabs first
  const allTabs = document.querySelectorAll('[data-tab-id]');
  allTabs.forEach((tab) => {
    tab.setAttribute('data-state', 'inactive');
  });
  
  // Activate the tab for this section
  const tabTrigger = document.querySelector(`[data-tab-id="${sectionId}"]`) as HTMLElement;
  if (tabTrigger) {
    console.log(`Activating tab for: ${sectionId}`);
    tabTrigger.setAttribute('data-state', 'active');
  }
  
  // Find the section to show (try all possible selectors)
  const sectionElement = document.getElementById(sectionId) || 
                         document.querySelector(`[data-section="${sectionId}"]`) ||
                         document.querySelector(`[data-tab-content="${sectionId}"]`);
  
  if (sectionElement) {
    console.log(`Section found for: ${sectionId}, making it visible`);
    (sectionElement as HTMLElement).style.display = 'block';
    
    toast.success(`Section ${sectionId} affichée`, {
      description: "La section est maintenant visible",
      duration: 2000
    });
    return;
  }
  
  // If no section is found
  console.log(`No section found for: ${sectionId}`);
  toast.error(`Section non trouvée: ${sectionId}`, {
    description: "La section demandée n'existe pas",
    duration: 2000
  });
};

// Additional scroll function
export const scrollToSection = (sectionId: string): void => {
  // First make sure section is visible
  showSection(sectionId);
  
  // Then scroll to it
  const sectionElement = document.getElementById(sectionId) || 
                       document.querySelector(`[data-section="${sectionId}"]`) || 
                       document.querySelector(`[data-tab-content="${sectionId}"]`);
  
  if (sectionElement) {
    // Scroll to section with smooth behavior
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
