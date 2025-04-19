
import React from 'react';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import MainTabList from './tabs/MainTabList';
import SubTabList from './tabs/SubTabList';

const TabNavigation = () => {
  const { 
    activeTab, 
    mainTabs, 
    subTabs, 
    handleTabChange 
  } = useTabNavigation();
  
  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale et sous-navigation</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3">
          <MainTabList 
            mainTabs={mainTabs} 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
        </div>
        
        <div className="border-t border-gray-100 p-3">
          <SubTabList 
            tabs={subTabs} 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
