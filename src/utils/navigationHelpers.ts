
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // First activate tab if needed
  if (tabId) {
    // Use the correct tab selector that matches ResultTabs.tsx
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
  
  // Hide all sections first
  const allSections = document.querySelectorAll('[data-section], [data-tab-content]');
  allSections.forEach((section) => {
    (section as HTMLElement).style.display = 'none';
  });
  
  // Special case for hierarchy tab
  if (sectionId === 'hierarchy') {
    const hierarchyElement = document.getElementById('hierarchy') || 
                             document.querySelector('[data-section="hierarchy"]') ||
                             document.querySelector('[data-tab-content="hierarchy"]');
    
    if (hierarchyElement) {
      console.log('Hierarchy section found, making it visible');
      (hierarchyElement as HTMLElement).style.display = 'block';
      
      // Ensure the hierarchy tab is active
      const hierarchyTab = document.querySelector('[data-value="hierarchy"]') as HTMLElement;
      if (hierarchyTab && hierarchyTab.getAttribute('data-state') !== 'active') {
        hierarchyTab.click();
      }
      
      toast.success(`Section hiérarchie affichée`, {
        description: "La section est maintenant visible",
        duration: 2000
      });
      return;
    }
  }
  
  // Look for element by ID first (most specific)
  const sectionElement = document.getElementById(sectionId);
  
  if (sectionElement) {
    console.log(`Section element found by ID: ${sectionId}`);
    
    // Ensure the element is visible
    sectionElement.style.display = 'block';
    
    // Update the tab state if needed
    const tabTrigger = document.querySelector(`[data-value="${sectionId}"]`);
    if (tabTrigger && tabTrigger.getAttribute('data-state') !== 'active') {
      (tabTrigger as HTMLElement).click();
    }
    
    // Notify user
    toast.success(`Section ${sectionId} affichée`, {
      description: "La section est maintenant visible",
      duration: 2000
    });
    return;
  }
  
  // Try to find element with data-section attribute
  const dataAttributeSection = document.querySelector(`[data-section="${sectionId}"]`);
  if (dataAttributeSection) {
    console.log(`Found section by data attribute: ${sectionId}`);
    
    // Ensure the element is visible
    (dataAttributeSection as HTMLElement).style.display = 'block';
    
    // Update the tab state if needed
    const tabTrigger = document.querySelector(`[data-value="${sectionId}"]`);
    if (tabTrigger && tabTrigger.getAttribute('data-state') !== 'active') {
      (tabTrigger as HTMLElement).click();
    }
    
    // Notify user
    toast.success(`Section ${sectionId} affichée`, {
      description: "La section est maintenant visible",
      duration: 2000
    });
    return;
  }
  
  // Try to find element with data-tab-content attribute
  const tabContentSection = document.querySelector(`[data-tab-content="${sectionId}"]`);
  if (tabContentSection) {
    console.log(`Found section by tab-content: ${sectionId}`);
    
    // Ensure the element is visible
    (tabContentSection as HTMLElement).style.display = 'block';
    
    // Update the tab state if needed
    const tabTrigger = document.querySelector(`[data-value="${sectionId}"]`);
    if (tabTrigger && tabTrigger.getAttribute('data-state') !== 'active') {
      (tabTrigger as HTMLElement).click();
    }
    
    // Notify user
    toast.success(`Section ${sectionId} affichée`, {
      description: "La section est maintenant visible",
      duration: 2000
    });
    return;
  }
  
  // If no specific section is found, inform the user
  console.log(`No section found for: ${sectionId}`);
  toast.info("Section non trouvée", {
    description: "Veuillez d'abord analyser un site web pour accéder à cette section",
  });
};

// Additional scroll function kept but simplified
export const scrollToSection = (sectionId: string): void => {
  console.log(`Scrolling to section: ${sectionId}`);
  
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
