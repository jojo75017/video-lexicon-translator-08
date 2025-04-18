
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
    // If the tab has a link, open in new tab
    if (tabLink) {
      window.open(tabLink, '_blank');
      return;
    }
    
    // Otherwise navigate internally
    onTabChange(tabId);
    
    // Utiliser la fonction activateSection avec un délai pour s'assurer
    // que le DOM a eu le temps de se mettre à jour
    setTimeout(() => {
      activateSection(tabId);
    }, 300);
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
