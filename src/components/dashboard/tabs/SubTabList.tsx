
import React from 'react';
import TabTriggerItem from './TabTriggerItem';

interface SubTabListProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

const SubTabList: React.FC<SubTabListProps> = ({ tabs, activeTab, onTabChange }) => {
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
        />
      ))}
    </div>
  );
};

export default SubTabList;
