
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
    <div className="flex flex-wrap gap-2 mb-4 pl-2">
      {subTabs.map(tab => (
        <div 
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer ${
            activeTab === tab.id 
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </div>
      ))}
    </div>
  );
};

export default SubTabList;
