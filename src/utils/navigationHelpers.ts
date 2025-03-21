
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // First select the tab if provided
  if (tabId) {
    // Update URL hash to activate the tab
    window.location.hash = tabId;
    console.log(`Updated hash to #${tabId}`);
  } else if (sectionId) {
    // If no tab specified, use section as tab
    window.location.hash = sectionId;
    console.log(`Updated hash to #${sectionId}`);
  }
};

// No longer needed - removed for simplicity
export const activateSection = (sectionId: string): void => {
  console.log(`activateSection is deprecated - use navigation via hash: #${sectionId}`);
};

// Scroll to section with highlight effect
export const scrollToSection = (sectionId: string): void => {
  const sectionElement = document.getElementById(sectionId);
  
  if (sectionElement) {
    // First make sure correct tab is selected
    window.location.hash = sectionId;
    
    // Then scroll to the element
    setTimeout(() => {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Apply highlight effect
      sectionElement.classList.add('transition-all', 'duration-500');
      sectionElement.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      
      // Remove effect after delay
      setTimeout(() => {
        sectionElement.style.backgroundColor = '';
        sectionElement.classList.remove('transition-all', 'duration-500');
      }, 1500);
      
      toast.success(`Section ${sectionId} affichée`, {
        description: "La section est maintenant visible",
        duration: 2000
      });
    }, 100);
  } else {
    console.error(`Section "${sectionId}" not found`);
    toast.error(`Section non trouvée: ${sectionId}`, {
      description: "La section demandée n'existe pas",
      duration: 2000
    });
  }
};
