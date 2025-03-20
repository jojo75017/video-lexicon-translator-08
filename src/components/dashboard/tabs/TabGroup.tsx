
import React from 'react';
import TabTriggerItem from './TabTriggerItem';
import { TabItemType } from './types';

interface TabGroupProps {
  groupTabs: TabItemType[];
}

const TabGroup: React.FC<TabGroupProps> = ({ groupTabs }) => {
  return (
    <div className="flex-1 flex flex-col items-center min-w-fit px-1">
      <div className="flex flex-wrap gap-2 justify-center py-1">
        {groupTabs.map((tab) => (
          <TabTriggerItem
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            color={tab.color}
            isNew={tab.isNew}
            link={tab.link}
            highlighted={tab.highlighted}
          />
        ))}
      </div>
    </div>
  );
};

export default TabGroup;
