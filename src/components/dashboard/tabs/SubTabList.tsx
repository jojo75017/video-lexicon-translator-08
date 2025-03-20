
import React from 'react';
import { Tab } from './types';

interface SubTabListProps {
  subTabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SubTabList: React.FC<SubTabListProps> = ({ 
  subTabs,
  activeTab,
  onTabChange
}) => {
  if (subTabs.length === 0) return null;
  
  return (
    <div className="flex overflow-x-auto mb-4 bg-white p-2 rounded-lg shadow-sm">
      {subTabs.map(tab => (
        <div 
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-1 px-4 py-2 mx-1 rounded-md text-sm cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === tab.id 
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'hover:bg-gray-100'
          }`}
          data-sub-tab={tab.id}
        >
          {tab.icon && <span className="opacity-70">{tab.icon}</span>}
          <span>{tab.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SubTabList;
