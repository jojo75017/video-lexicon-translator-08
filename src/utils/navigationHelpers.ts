
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
  // Chercher l'élément par ID
  const sectionElement = document.getElementById(sectionId);
  
  if (sectionElement) {
    console.log(`Section element found: ${sectionId}`);
    
    // Empêcher le comportement de navigation/défilement par défaut de la page
    if (typeof window !== 'undefined' && window.event) {
      const event = window.event as Event;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
    
    // Faire défiler jusqu'à la section avec un comportement fluide
    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Ajouter un effet de surbrillance temporaire
    sectionElement.classList.add('bg-blue-50');
    setTimeout(() => {
      sectionElement.classList.remove('bg-blue-50');
    }, 2000);
  } else {
    console.log(`Section element not found: ${sectionId}`);
    
    // Essayer de trouver un élément avec un attribut data-section
    const dataAttributeSection = document.querySelector(`[data-section="${sectionId}"]`);
    if (dataAttributeSection) {
      console.log(`Found section by data attribute: ${sectionId}`);
      if (typeof window !== 'undefined' && window.event) {
        const event = window.event as Event;
        if (event.preventDefault) {
          event.preventDefault();
        }
      }
      dataAttributeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Ajouter un effet de surbrillance temporaire
      dataAttributeSection.classList.add('bg-blue-50');
      setTimeout(() => {
        dataAttributeSection.classList.remove('bg-blue-50');
      }, 2000);
      return;
    }
    
    // Essayer de trouver un élément avec le nom de classe
    const classSection = document.querySelector(`.section-${sectionId}`);
    if (classSection) {
      console.log(`Found section by class: ${sectionId}`);
      if (typeof window !== 'undefined' && window.event) {
        const event = window.event as Event;
        if (event.preventDefault) {
          event.preventDefault();
        }
      }
      classSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Ajouter un effet de surbrillance temporaire
      (classSection as HTMLElement).classList.add('bg-blue-50');
      setTimeout(() => {
        (classSection as HTMLElement).classList.remove('bg-blue-50');
      }, 2000);
      return;
    }
    
    // Si aucune section spécifique n'est trouvée, informer l'utilisateur
    toast.info("Section non trouvée", {
      description: "Veuillez d'abord analyser un site web pour accéder à cette section",
    });
  }
};
