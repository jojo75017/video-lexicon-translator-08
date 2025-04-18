
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

  // Activer l'onglet courant
  useEffect(() => {
    if (activeTab) {
      console.log('Tentative d\'activation de section:', activeTab);
      setTimeout(() => {
        activateSection(activeTab);
        console.log('TabNavigation activation retardée de section:', activeTab);
      }, 300); // Délai pour s'assurer que le DOM est prêt
    }
  }, [activeTab]);

  // Gérer les changements d'URL pour la navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        console.log(`Hash détecté dans l'URL: ${hash}, activation de la section`);
        activateSection(hash);
      }, 300);
    }
  }, [location]);

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
