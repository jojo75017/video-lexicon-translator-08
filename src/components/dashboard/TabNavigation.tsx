
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
import { navigateToSection, showSection } from '@/utils/navigationHelpers';
import { toast } from "sonner";

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const groupedTabs = getGroupedTabs();
  
  // Filter tabs to only include those without external links
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // Initialize component by hiding all content except the active one
  useEffect(() => {
    // Hide all tab content on first render
    const tabElements = document.querySelectorAll('[data-tab-content]');
    tabElements.forEach((element) => {
      const el = element as HTMLElement;
      el.style.display = 'none';
    });
    
    // Check URL hash to see if a specific tab should be active
    const hashTab = window.location.hash.replace('#', '');
    if (hashTab && document.getElementById(hashTab)) {
      setActiveTab(hashTab);
      showSection(hashTab);
    }
    
    console.log('TabNavigation initialized - all tab content hidden');
  }, []);
  
  // Handle tab value change
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    setActiveTab(value);
    
    // Hide all tab content first
    const tabElements = document.querySelectorAll('[data-tab-content]');
    tabElements.forEach((element) => {
      const el = element as HTMLElement;
      el.style.display = 'none';
    });
    
    // Find and show the relevant tab content
    const selectedContent = document.getElementById(value) || 
                            document.querySelector(`[data-section="${value}"]`) ||
                            document.querySelector(`[data-tab-content="${value}"]`);
    
    if (selectedContent) {
      console.log(`Found content element for tab: ${value}`);
      (selectedContent as HTMLElement).style.display = 'block';
      
      toast.success(`Onglet ${value} activé`, {
        description: "Contenu affiché",
        duration: 1500
      });
    } else {
      console.log(`No content element found for tab: ${value}`);
      toast.error(`Contenu introuvable pour ${value}`, {
        description: "L'onglet existe mais le contenu n'a pas été trouvé",
        duration: 2000
      });
    }
  };

  return (
    <TooltipProvider>
      <Tabs 
        value={activeTab || undefined} 
        onValueChange={handleTabChange} 
        className="w-full"
        defaultValue=""
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
          {/* Define TabsContent for each tab to handle active state */}
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
