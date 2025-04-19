
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SubTabListProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SubTabList: React.FC<SubTabListProps> = ({ tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId: string) => {
    console.log('SubTabList click:', tabId);
    onTabChange(tabId);
    navigate(`/${tabId}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-all
            flex items-center gap-2
            ${activeTab === tab.id ? 
              'bg-primary/10 text-primary' : 
              'hover:bg-gray-100 text-gray-600'}
          `}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SubTabList;
