
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
    console.log(`SubTabList: Clic sur l'onglet ${tabId}`);
    onTabChange(tabId);
    
    // Activer immédiatement la section
    console.log(`SubTabList: Activation de la section ${tabId}`);
    activateSection(tabId);
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
