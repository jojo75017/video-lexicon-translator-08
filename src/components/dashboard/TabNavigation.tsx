
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { navigateToSection } from '@/utils/navigationHelpers';
import { toast } from "sonner";

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState("wordcount");
  const groupedTabs = getGroupedTabs();
  
  // Filter tabs to only include those without external links
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // When active tab changes, ensure the tab content is visible
  useEffect(() => {
    if (activeTab) {
      console.log(`Active tab changed to: ${activeTab}`);
      const tabElement = document.getElementById(activeTab);
      if (tabElement) {
        console.log(`Found tab element with id: ${activeTab}`);
        tabElement.style.display = 'block';
        
        // Show toast for better user feedback
        toast.success(`Onglet ${activeTab} activé`, {
          description: "Le contenu est maintenant visible",
          duration: 1500
        });
      } else {
        console.log(`Tab element with id ${activeTab} not found, using navigateToSection`);
        navigateToSection(activeTab);
      }
    }
  }, [activeTab]);

  return (
    <TooltipProvider>
      <Tabs 
        defaultValue="wordcount" 
        value={activeTab} 
        onValueChange={(value) => {
          console.log(`Tab selected: ${value}`);
          setActiveTab(value);
        }} 
        className="w-full"
      >
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
        
        {/* Tab content section */}
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
          <TabsContent value="wordcount">
            <WordCountTabContent />
          </TabsContent>
          
          <TabsContent value="hierarchy">
            <HierarchyTabContent />
          </TabsContent>
          
          <TabsContent value="seo">
            <SeoTabContent />
          </TabsContent>
          
          <TabsContent value="structure">
            <StructureTabContent />
          </TabsContent>
          
          <TabsContent value="backlinks">
            <BacklinksTabContent />
          </TabsContent>
          
          <TabsContent value="metrics">
            <MetricsTabContent />
          </TabsContent>
          
          {/* Generate TabsContent components for all remaining tabs */}
          {contentTabs
            .filter(tab => !['hierarchy', 'wordcount', 'seo', 'structure', 'backlinks', 'metrics'].includes(tab.id))
            .map(tab => (
              <TabsContent key={tab.id} value={tab.id}>
                <DefaultTabContent id={tab.id} label={tab.label} />
              </TabsContent>
            ))
          }
        </div>
      </Tabs>
    </TooltipProvider>
  );
};

export default TabNavigation;
