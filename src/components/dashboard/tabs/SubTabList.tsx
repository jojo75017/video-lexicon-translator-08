
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SubTabListProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SubTabList: React.FC<SubTabListProps> = ({ tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId: string, path?: string) => {
    console.log('SubTabList click:', tabId);
    
    // Update the active tab
    onTabChange(tabId);
    
    // Navigation to the corresponding path if available
    if (path) {
      console.log('SubTabList navigating to:', path);
      navigate(path);
    } else {
      // Fallback to the tab ID route
      const tabPath = `/${tabId}`;
      console.log('SubTabList navigating to fallback path:', tabPath);
      navigate(tabPath);
    }
  };

  // If no tabs are available, don't display anything
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id, tab.link)}
          data-tab-id={tab.id}
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
