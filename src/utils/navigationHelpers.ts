
import { toast } from "sonner";

export const navigateToSection = (sectionId: string, tabId?: string): void => {
  console.log(`Navigating to section: ${sectionId}, tab: ${tabId}`);
  
  // Première étape : Activer l'onglet si nécessaire
  if (tabId) {
    const tabElement = document.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
    if (tabElement) {
      console.log(`Tab element found: ${tabId}`);
      tabElement.click();
      // Attendre que l'onglet soit activé
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
  
  // Chercher l'élément par ID
  const sectionElement = document.getElementById(sectionId);
  
  if (sectionElement) {
    console.log(`Section element found: ${sectionId}`);
    
    // Faire défiler jusqu'à la section avec un comportement fluide
    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Effet de surbrillance plus visible et plus durable
    sectionElement.classList.add('transition-all');
    sectionElement.classList.add('duration-1000');
    
    // Appliquer un effet plus visible
    sectionElement.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
    sectionElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
    
    // Retirer l'effet après un délai plus long
    setTimeout(() => {
      sectionElement.style.backgroundColor = '';
      sectionElement.style.boxShadow = 'none';
      sectionElement.classList.remove('transition-all');
      sectionElement.classList.remove('duration-1000');
    }, 3000);
  } else {
    console.log(`Section element not found: ${sectionId}`);
    
    // Essayer de trouver un élément avec un attribut data-section
    const dataAttributeSection = document.querySelector(`[data-section="${sectionId}"]`);
    if (dataAttributeSection) {
      console.log(`Found section by data attribute: ${sectionId}`);
      dataAttributeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Effet de surbrillance plus visible et plus durable
      dataAttributeSection.classList.add('transition-all');
      dataAttributeSection.classList.add('duration-1000');
      
      // Appliquer un effet plus visible
      (dataAttributeSection as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      (dataAttributeSection as HTMLElement).style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      
      // Retirer l'effet après un délai plus long
      setTimeout(() => {
        (dataAttributeSection as HTMLElement).style.backgroundColor = '';
        (dataAttributeSection as HTMLElement).style.boxShadow = 'none';
        dataAttributeSection.classList.remove('transition-all');
        dataAttributeSection.classList.remove('duration-1000');
      }, 3000);
      return;
    }
    
    // Essayer de trouver un élément avec le nom de classe
    const classSection = document.querySelector(`.section-${sectionId}`);
    if (classSection) {
      console.log(`Found section by class: ${sectionId}`);
      classSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Effet de surbrillance plus visible et plus durable
      (classSection as HTMLElement).classList.add('transition-all');
      (classSection as HTMLElement).classList.add('duration-1000');
      
      // Appliquer un effet plus visible
      (classSection as HTMLElement).style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
      (classSection as HTMLElement).style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      
      // Retirer l'effet après un délai plus long
      setTimeout(() => {
        (classSection as HTMLElement).style.backgroundColor = '';
        (classSection as HTMLElement).style.boxShadow = 'none';
        (classSection as HTMLElement).classList.remove('transition-all');
        (classSection as HTMLElement).classList.remove('duration-1000');
      }, 3000);
      return;
    }
    
    // Si aucune section spécifique n'est trouvée, informer l'utilisateur
    toast.info("Section non trouvée", {
      description: "Veuillez d'abord analyser un site web pour accéder à cette section",
    });
  }
};
