
import React, { useEffect } from 'react';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import MainTabList from './tabs/MainTabList';
import SubTabList from './tabs/SubTabList';
import { activateSection } from '@/utils/navigationHelpers';
import { useLocation } from 'react-router-dom';

const TabNavigation = () => {
  const { 
    activeTab, 
    mainTabs, 
    subTabs, 
    handleTabChange 
  } = useTabNavigation();
  
  const location = useLocation();

  // Activer l'onglet courant avec un délai plus important
  useEffect(() => {
    if (activeTab) {
      console.log('Tentative d\'activation de section:', activeTab);
      setTimeout(() => {
        activateSection(activeTab);
        console.log('TabNavigation activation retardée de section:', activeTab);
        
        // Force display of the section
        const section = document.querySelector(`[data-section="${activeTab}"]`) || document.getElementById(activeTab);
        if (section) {
          console.log(`TabNavigation: Affichage forcé de la section ${activeTab}`);
          (section as HTMLElement).style.display = 'block';
        }
      }, 1500); // Délai augmenté pour s'assurer que le DOM est prêt
    }
  }, [activeTab]);

  // Gérer les changements d'URL pour la navigation avec un délai plus important
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        console.log(`Hash détecté dans l'URL: ${hash}, activation de la section`);
        activateSection(hash);
        
        // Force display of the section
        const section = document.querySelector(`[data-section="${hash}"]`) || document.getElementById(hash);
        if (section) {
          console.log(`TabNavigation: Affichage forcé de la section ${hash} depuis URL hash`);
          (section as HTMLElement).style.display = 'block';
        }
      }, 1500); // Délai augmenté également ici
    } else {
      // Si pas de hash, activer l'onglet basé sur le chemin
      setTimeout(() => {
        console.log(`Pas de hash, activation de l'onglet basé sur le chemin:`, activeTab);
        activateSection(activeTab);
        
        // Force display of the section
        const section = document.querySelector(`[data-section="${activeTab}"]`) || document.getElementById(activeTab);
        if (section) {
          console.log(`TabNavigation: Affichage forcé de la section ${activeTab} depuis le chemin`);
          (section as HTMLElement).style.display = 'block';
        }
      }, 1500);
    }
  }, [location, activeTab]);

  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale et sous-navigation</h2>
      <MainTabList 
        mainTabs={mainTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      <SubTabList 
        tabs={subTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
    </div>
  );
};

export default TabNavigation;
