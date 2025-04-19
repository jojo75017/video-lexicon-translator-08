
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
    handleTabChange(path);
  }, [location.pathname]); // Dépendance au chemin pour réagir aux changements d'URL

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
