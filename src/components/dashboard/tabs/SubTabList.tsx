
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
    
    // Mettre à jour l'onglet actif
    onTabChange(tabId);
    
    // Navigation directe vers le chemin correspondant si disponible
    if (path) {
      navigate(path);
    } else {
      // Fallback à la route de l'ID de l'onglet
      navigate(`/${tabId}`);
    }
  };

  // Si aucun onglet n'est disponible, ne rien afficher
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id, tab.path)}
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
