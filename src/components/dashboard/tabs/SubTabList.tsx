
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TabTriggerItem from './TabTriggerItem';
import { activateSection } from '@/utils/navigationHelpers';

interface SubTabListProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SubTabList: React.FC<SubTabListProps> = ({ tabs, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId: string, tabLink?: string) => {
    // Si le tab a un lien, ouvrir dans un nouvel onglet
    if (tabLink) {
      window.open(tabLink, '_blank');
      return;
    }
    
    // Sinon, naviguer en interne
    onTabChange(tabId);
    
    // Délai plus long pour s'assurer que le DOM est prêt
    setTimeout(() => {
      console.log(`SubTabList: Activation de la section ${tabId} après changement d'onglet`);
      activateSection(tabId);
      
      // Force display of the section
      const section = document.querySelector(`[data-section="${tabId}"]`) || document.getElementById(tabId);
      if (section) {
        console.log(`SubTabList: Affichage forcé de la section ${tabId}`);
        (section as HTMLElement).style.display = 'block';
      }
    }, 500);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {tabs.map((tab) => (
        <TabTriggerItem
          key={tab.id}
          id={tab.id}
          icon={tab.icon}
          label={tab.label}
          color={tab.color}
          isNew={tab.isNew}
          link={tab.link}
          highlighted={activeTab === tab.id}
          onClick={() => handleTabClick(tab.id, tab.link)}
        />
      ))}
    </div>
  );
};

export default SubTabList;
