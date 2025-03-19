
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // Première étape : activer l'onglet si nécessaire
  if (tabId) {
    const tabElement = document.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
    if (tabElement) {
      console.log(`Tab element found: ${tabId}`);
      tabElement.click();
      // Attendre que l'onglet soit activé
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      console.log(`Tab element not found: ${tabId}`);
      scrollToSection(sectionId);
    }
  } else {
    scrollToSection(sectionId);
  }
};

export const scrollToSection = (sectionId: string): void => {
  // Chercher l'élément par ID
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement) {
    console.log(`Section element found: ${sectionId}`);
    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Ajouter un effet de surbrillance temporaire
    sectionElement.classList.add('bg-blue-50');
    setTimeout(() => {
      sectionElement.classList.remove('bg-blue-50');
    }, 2000);
  } else {
    console.log(`Section element not found: ${sectionId}`);
    toast.info("Section non trouvée", {
      description: "Veuillez d'abord analyser un site web pour accéder à cette fonctionnalité",
    });
    
    // Rediriger vers le formulaire d'analyse comme solution de secours
    const analysisForm = document.querySelector('form') as HTMLElement;
    if (analysisForm) {
      analysisForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};
