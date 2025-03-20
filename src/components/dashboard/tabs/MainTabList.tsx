
import React from 'react';

interface MainTab {
  id: string;
  label: string;
  color: string;
}

interface MainTabListProps {
  mainTabs: MainTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const MainTabList: React.FC<MainTabListProps> = ({ 
  mainTabs,
  activeTab,
  onTabChange
}) => {
  // Helper function to determine if a tab is active, including its children
  const isTabActive = (tabId: string): boolean => {
    if (activeTab === tabId) return true;
    
    if (tabId === 'content' && ['hierarchy', 'wordcount', 'suggestions'].includes(activeTab)) {
      return true;
    }
    
    if (tabId === 'seo' && ['seo', 'structure', 'backlinks'].includes(activeTab)) {
      return true;
    }
    
    if (tabId === 'performance' && ['performance', 'metrics'].includes(activeTab)) {
      return true;
    }
    
    if (tabId === 'analytics' && activeTab === 'analytics') {
      return true;
    }
    
    return false;
  };

  return (
    <div className="flex rounded-lg bg-white shadow-sm mb-4 overflow-hidden">
      {mainTabs.map(tab => (
        <div 
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-3 px-4 text-center cursor-pointer transition-all border-b-2 ${
            isTabActive(tab.id)
              ? `border-b-2 ${tab.color} font-medium`
              : 'border-transparent hover:bg-gray-50'
          }`}
          data-main-tab={tab.id}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default MainTabList;
