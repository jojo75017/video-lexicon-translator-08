
import React, { useState, useEffect } from 'react';
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
  MetricsTabContent,
  AdvancedTabContent,
  IntegrationsTabContent,
  AnalyticsTabContent
} from './tabs/StandardTabContents';
import PerformanceTabContent from './tabs/PerformanceTabContent';
import { activateSection } from '@/utils/navigationHelpers';

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const groupedTabs = getGroupedTabs();
  
  // Filter tabs to only include those without external links
  const contentTabs = tabs.filter(tab => !tab.link);
  
  // Initialize from URL hash if present
  useEffect(() => {
    // Hide all tab content initially
    document.querySelectorAll('[data-tab-content]').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Check for hash in URL
    const hash = window.location.hash.replace('#', '');
    if (hash && tabs.some(tab => tab.id === hash)) {
      console.log(`Found hash in URL: ${hash}, activating this tab`);
      setActiveTab(hash);
      setTimeout(() => activateSection(hash), 100);
    } else {
      // Default to first tab if no hash
      const defaultTab = tabs[0].id;
      console.log(`No hash in URL, defaulting to first tab: ${defaultTab}`);
      setActiveTab(defaultTab);
      setTimeout(() => activateSection(defaultTab), 100);
    }
    
    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash && tabs.some(tab => tab.id === newHash)) {
        console.log(`Hash changed to ${newHash}, updating active tab`);
        setActiveTab(newHash);
        activateSection(newHash);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  // Handle tab selection
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    setActiveTab(value);
    activateSection(value);
  };

  return (
    <TooltipProvider>
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
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
        
        {/* Tab Content Container - Always visible */}
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
          {/* Static Tab Contents */}
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
          
          <TabsContent value="advanced">
            <AdvancedTabContent />
          </TabsContent>
          
          <TabsContent value="integrations">
            <IntegrationsTabContent />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsTabContent />
          </TabsContent>
          
          <TabsContent value="performance">
            <PerformanceTabContent />
          </TabsContent>
          
          {/* Generate TabsContent for remaining tabs */}
          {contentTabs
            .filter(tab => !['hierarchy', 'wordcount', 'seo', 'structure', 'backlinks', 'metrics', 'advanced', 'integrations', 'analytics', 'performance'].includes(tab.id))
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
