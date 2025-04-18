
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getMainTabCategory } from '@/utils/navigationHelpers';

interface MainTab {
  id: string;
  label: string;
  color: string;
  path?: string;
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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Helper function to determine if a tab is active
  const isTabActive = (tabId: string): boolean => {
    const currentPath = location.pathname;
    
    // Check current path against tab path
    const tabPaths: Record<string, string[]> = {
      'content': ['/hierarchy', '/wordcount', '/suggestions'],
      'seo': ['/seo', '/structure', '/backlinks'],
      'performance': ['/performance', '/metrics'],
      'analytics': ['/analytics'],
      'tools': ['/signature', '/quora', '/local-business', '/translation', '/pinterest'],
    };
    
    if (tabPaths[tabId] && tabPaths[tabId].includes(currentPath)) {
      return true;
    }
    
    // Fallback to id-based check
    if (activeTab === tabId) return true;
    
    // Check for subtabs
    const currentTabCategory = getMainTabCategory(activeTab);
    return currentTabCategory === tabId;
  };

  // Get the correct path for a main tab
  const getMainTabPath = (tabId: string): string => {
    const pathMap: Record<string, string> = {
      'content': '/hierarchy',
      'seo': '/seo',
      'performance': '/performance',
      'analytics': '/analytics',
      'tools': '/signature'
    };
    
    return pathMap[tabId] || '/';
  };

  // Handle tab click with proper navigation
  const handleTabClick = (tabId: string, path: string) => {
    onTabChange(tabId);
    navigate(path);
  };

  return (
    <div className="flex rounded-lg bg-white shadow-sm mb-4 overflow-hidden">
      {mainTabs.map(tab => (
        <button
          key={tab.id}
          className={`flex-1 py-3 px-4 text-center cursor-pointer transition-all border-b-2 ${
            isTabActive(tab.id)
              ? `border-b-2 ${tab.color} font-medium`
              : 'border-transparent hover:bg-gray-50'
          }`}
          data-main-tab={tab.id}
          onClick={() => handleTabClick(tab.id, tab.path || getMainTabPath(tab.id))}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MainTabList;
