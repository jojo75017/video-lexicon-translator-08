
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
  
  // Activate the correct tab if not already active
  const tabTrigger = document.querySelector(`[data-value="${sectionId}"]`) as HTMLElement;
  if (tabTrigger && tabTrigger.getAttribute('data-state') !== 'active') {
    console.log(`Activating tab for: ${sectionId}`);
    tabTrigger.click();
  }
  
  // Handle special case for hierarchy tab
  if (sectionId === 'hierarchy') {
    const hierarchyElement = document.getElementById('hierarchy') || 
                            document.querySelector('[data-section="hierarchy"]') ||
                            document.querySelector('[data-tab-content="hierarchy"]');
    
    if (hierarchyElement) {
      console.log('Hierarchy section found, making it visible');
      (hierarchyElement as HTMLElement).style.display = 'block';
      
      toast.success(`Section hiérarchie affichée`, {
        description: "La section est maintenant visible",
        duration: 2000
      });
      
      // Also ensure the tab is active
      const hierarchyTab = document.querySelector('[data-value="hierarchy"]') as HTMLElement;
      if (hierarchyTab) {
        hierarchyTab.click();
      }
      
      return;
    }
  }
  
  // First try to find by ID (most specific)
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement) {
    console.log(`Section found by ID: ${sectionId}`);
    sectionElement.style.display = 'block';
    
    toast.success(`Section ${sectionId} affichée`, {
      description: "La section est maintenant visible",
      duration: 2000
    });
    return;
  }
  
  // Try to find by data-section attribute
  const dataSection = document.querySelector(`[data-section="${sectionId}"]`);
  if (dataSection) {
    console.log(`Section found by data-section: ${sectionId}`);
    (dataSection as HTMLElement).style.display = 'block';
    
    toast.success(`Section ${sectionId} affichée`, {
      description: "La section est maintenant visible",
      duration: 2000
    });
    return;
  }
  
  // Try to find by data-tab-content attribute
  const tabContent = document.querySelector(`[data-tab-content="${sectionId}"]`);
  if (tabContent) {
    console.log(`Section found by data-tab-content: ${sectionId}`);
    (tabContent as HTMLElement).style.display = 'block';
    
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
