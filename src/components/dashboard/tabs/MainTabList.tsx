
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
  return (
    <div className="grid grid-cols-4 gap-2 p-1 bg-gray-50 mb-4 rounded-lg">
      {mainTabs.map(tab => (
        <div 
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`rounded-md py-2 px-4 text-center cursor-pointer transition-all ${
            activeTab === tab.id 
              ? tab.color
              : 'hover:bg-gray-100'
          }`}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default MainTabList;
