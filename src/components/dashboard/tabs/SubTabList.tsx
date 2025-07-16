
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface SubTabListProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SubTabList: React.FC<SubTabListProps> = ({ tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId: string, path?: string) => {
    console.log('SubTabList click:', tabId, 'path:', path);
    
    // Ne rien faire si on clique sur l'onglet déjà actif
    if (tabId === activeTab) {
      return;
    }
    
    // Mettre à jour l'onglet actif
    onTabChange(tabId);
    
    // Navigation vers le chemin correspondant si disponible
    if (path) {
      console.log('SubTabList navigating to:', path);
      navigate(path);
      
      toast.info(`Navigation vers ${tabId}`, {
        description: "Chargement de la page...",
        duration: 1500
      });
      return;
    }
    
    // Mapper les ID d'onglets aux chemins
    const tabPaths: Record<string, string> = {
      'hierarchy': '/',
      'wordcount': '/wordcount',
      'suggestions': '/suggestions',
      'seo': '/seo',
      'structure': '/structure',
      'backlinks': '/backlinks',
      'performance': '/performance',
      'metrics': '/metrics',
      'analytics': '/analytics',
      'quora': '/quora',
      'signature': '/signature',
      'pinterest': '/pinterest',
      'internal-links': '/internal-linking',
      'keyword-meta': '/keyword-meta',
      'keyword-generator': '/keyword-generator',
      'outils-seo': '/outils-seo',
    };
    
    const tabPath = tabPaths[tabId] || `/${tabId.toLowerCase()}`;
    console.log('SubTabList navigating to path:', tabPath);
    navigate(tabPath);
    
    toast.info(`Navigation vers ${tabId}`, {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  // Si aucun onglet n'est disponible, ne rien afficher
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id, tab.link)}
          data-tab-id={tab.id}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition-all
            flex items-center gap-2 relative
            ${activeTab === tab.id ? 
              'bg-primary/10 text-primary' : 
              'hover:bg-gray-100 text-gray-600'}
          `}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
          {tab.isNew && (
            <Badge variant="outline" className="ml-1 h-4 text-[10px] bg-blue-50 text-blue-700 border-blue-200">
              Nouveau
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
};

export default SubTabList;
