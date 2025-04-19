
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainTabList from './MainTabList';
import SubTabList from './SubTabList';
import { useTabNavigation } from '@/hooks/useTabNavigation';

const TabNavigation = () => {
  const { activeTab, mainTabs, subTabs, handleTabChange } = useTabNavigation();
  const location = useLocation();

  // Activation initiale basée sur le chemin de l'URL
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'hierarchy';
    console.log('TabNavigation initial path:', path);
    
    // To prevent unnecessary re-rendering, only update if needed
    if (path && path !== activeTab) {
      console.log(`Initial tab change needed: ${activeTab} -> ${path}`);
      handleTabChange(path);
    }
  }, []); // Run only on mount
  
  // Log tab state changes for debugging
  useEffect(() => {
    console.log('TabNavigation active tab:', activeTab);
    console.log('TabNavigation current path:', location.pathname);
    console.log('TabNavigation available subtabs:', subTabs.map(tab => tab.id).join(', '));
    
    const mainCategory = mainTabs.find(tab => 
      (tab.id === 'content' && ['hierarchy', 'wordcount', 'suggestions'].includes(activeTab)) ||
      (tab.id === 'seo' && ['seo', 'structure', 'backlinks'].includes(activeTab)) ||
      (tab.id === 'performance' && ['performance', 'metrics'].includes(activeTab)) ||
      (tab.id === 'analytics' && activeTab === 'analytics')
    );
    
    console.log('TabNavigation main category:', mainCategory?.id);
    
    // Check if we need to do tab-specific initialization
    if (activeTab === 'hierarchy') {
      console.log('Recherche d\'un sous-onglet pour la catégorie principale', mainCategory?.id);
    }
  }, [activeTab, location.pathname, subTabs, mainTabs]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <MainTabList 
        mainTabs={mainTabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
      />
      <div className="mt-4">
        <SubTabList 
          tabs={subTabs} 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
        />
      </div>
    </div>
  );
};

export default TabNavigation;
