
import React from 'react';
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";

// Import refactored components
import TabGroupHeader from './tabs/TabGroupHeader';
import TabGroup from './tabs/TabGroup';
import { tabs, getGroupedTabs, groupLabels } from './tabs/TabData';
import WordCountTabContent from './tabs/WordCountTabContent';
import HierarchyTabContent from './tabs/HierarchyTabContent';
import DefaultTabContent from './tabs/DefaultTabContent';
import { 
  SeoTabContent, 
  StructureTabContent, 
  BacklinksTabContent, 
  MetricsTabContent 
} from './tabs/StandardTabContents';

const TabNavigation = () => {
  const groupedTabs = getGroupedTabs();

  return (
    <TooltipProvider>
      <Tabs defaultValue="wordcount" className="w-full">
        <div className="w-full flex flex-col overflow-hidden justify-between bg-white shadow-md rounded-lg p-3 mb-6 border border-gray-100">
          <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-500 mb-2 px-2">
            {Object.entries(groupLabels).map(([key, label]) => (
              <TabGroupHeader key={key} label={label} />
            ))}
          </div>
          
          <TabsList className="flex overflow-x-auto justify-between bg-gray-50 rounded-md p-2">
            {Object.entries(groupedTabs).map(([groupName, groupTabs]) => (
              <TabGroup key={groupName} groupTabs={groupTabs} />
            ))}
          </TabsList>
        </div>
        
        {/* Tab content sections */}
        <HierarchyTabContent />
        <WordCountTabContent />
        <SeoTabContent />
        <StructureTabContent />
        <BacklinksTabContent />
        <MetricsTabContent />
        
        {/* Add default content for other tabs */}
        {tabs.filter(tab => !['seo', 'structure', 'hierarchy', 'backlinks', 'metrics', 'wordcount'].includes(tab.id) && !tab.link).map(tab => (
          <DefaultTabContent key={tab.id} id={tab.id} label={tab.label} />
        ))}
      </Tabs>
    </TooltipProvider>
  );
};

export default TabNavigation;
