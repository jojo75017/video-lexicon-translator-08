
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, FileText, Zap, PieChart } from 'lucide-react';

interface MainTabProps {
  mainTabs: any[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const MainTabList: React.FC<MainTabProps> = ({ mainTabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();
  
  const getTabIcon = (id: string) => {
    switch (id) {
      case 'content': return <FileText className="w-4 h-4" />;
      case 'seo': return <BarChart2 className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'analytics': return <PieChart className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleTabClick = (tabId: string, path: string = '/') => {
    console.log('MainTabList click:', tabId, 'path:', path);
    
    // Mettre à jour l'onglet actif
    onTabChange(tabId);
    
    // Navigation directe - sans délai
    navigate(path);
  };

  return (
    <div className="flex flex-wrap space-x-2">
      {mainTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id, tab.path)}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-all
            ${activeTab === tab.id || 
              (tab.id === 'content' && ['hierarchy', 'wordcount', 'suggestions'].includes(activeTab)) ||
              (tab.id === 'seo' && ['seo', 'structure', 'backlinks'].includes(activeTab)) ||
              (tab.id === 'performance' && ['performance', 'metrics'].includes(activeTab)) ||
              (tab.id === 'analytics' && activeTab === 'analytics')
              ? 'bg-primary text-white shadow-sm' 
              : 'hover:bg-gray-100 text-gray-600'}
          `}
          data-tab-id={tab.id}
        >
          {getTabIcon(tab.id)}
          <span className="ml-2 font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MainTabList;
