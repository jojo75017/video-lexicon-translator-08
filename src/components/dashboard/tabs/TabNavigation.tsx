
import React from 'react';
import { useLocation } from 'react-router-dom';
import MainTabList from './MainTabList';
import SubTabList from './SubTabList';
import { useTabNavigation } from '@/hooks/useTabNavigation';

const TabNavigation = () => {
  const { activeTab, mainTabs, subTabs, handleTabChange } = useTabNavigation();
  const location = useLocation();

  React.useEffect(() => {
    // Afficher la section correspondant à l'URL au chargement
    const path = location.pathname.replace('/', '') || 'hierarchy';
    console.log('TabNavigation mounted, activating path:', path);
    setTimeout(() => {
      handleTabChange(path);
    }, 500);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
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
