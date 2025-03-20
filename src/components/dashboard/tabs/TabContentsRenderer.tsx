
import React, { useEffect } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import WordCountTabContent from './WordCountTabContent';
import HierarchyTabContent from './HierarchyTabContent';
import DefaultTabContent from './DefaultTabContent';
import { 
  SeoTabContent, 
  StructureTabContent, 
  BacklinksTabContent, 
  MetricsTabContent,
  AdvancedTabContent,
  IntegrationsTabContent
} from './StandardTabContents';
import PerformanceTabContent from './PerformanceTabContent';
import SuggestionsTabContent from './SuggestionsTabContent';
import AnalyticsTabContent from './AnalyticsTabContent';
import { Tab } from './types';
import { activateSection } from '@/utils/navigationHelpers';

interface TabContentsRendererProps {
  contentTabs: Tab[];
  activeTab: string;
}

const TabContentsRenderer: React.FC<TabContentsRendererProps> = ({ 
  contentTabs,
  activeTab
}) => {
  // List of tab IDs that have specialized components
  const specializedTabs = [
    'hierarchy', 'wordcount', 'seo', 'structure', 'backlinks', 
    'metrics', 'advanced', 'integrations', 'analytics', 
    'performance', 'suggestions'
  ];
  
  // Ensure the active tab content is visible
  useEffect(() => {
    if (activeTab) {
      console.log(`TabContentsRenderer: Ensuring tab content visibility for ${activeTab}`);
      
      // First hide all tab contents
      document.querySelectorAll('[data-tab-content]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Then show the active one
      const activeElement = document.getElementById(activeTab) || 
                            document.querySelector(`[data-section="${activeTab}"]`) ||
                            document.querySelector(`[data-tab-content="${activeTab}"]`);
      
      if (activeElement) {
        console.log(`Found element for ${activeTab}, making visible`);
        (activeElement as HTMLElement).style.display = 'block';
      } else {
        console.error(`Element for ${activeTab} not found`);
      }
    }
  }, [activeTab]);
  
  return (
    <div className="tab-content-container">
      {/* Specialized tab contents */}
      <TabsContent value="hierarchy" id="hierarchy" data-tab-content="hierarchy">
        <HierarchyTabContent />
      </TabsContent>
      
      <TabsContent value="wordcount" id="wordcount" data-tab-content="wordcount">
        <WordCountTabContent />
      </TabsContent>
      
      <TabsContent value="suggestions" id="suggestions" data-tab-content="suggestions">
        <SuggestionsTabContent />
      </TabsContent>
      
      <TabsContent value="seo" id="seo" data-tab-content="seo">
        <SeoTabContent />
      </TabsContent>
      
      <TabsContent value="structure" id="structure" data-tab-content="structure">
        <StructureTabContent />
      </TabsContent>
      
      <TabsContent value="backlinks" id="backlinks" data-tab-content="backlinks">
        <BacklinksTabContent />
      </TabsContent>
      
      <TabsContent value="metrics" id="metrics" data-tab-content="metrics">
        <MetricsTabContent />
      </TabsContent>
      
      <TabsContent value="advanced" id="advanced" data-tab-content="advanced">
        <AdvancedTabContent />
      </TabsContent>
      
      <TabsContent value="integrations" id="integrations" data-tab-content="integrations">
        <IntegrationsTabContent />
      </TabsContent>
      
      <TabsContent value="analytics" id="analytics" data-tab-content="analytics">
        <AnalyticsTabContent />
      </TabsContent>
      
      <TabsContent value="performance" id="performance" data-tab-content="performance">
        <PerformanceTabContent />
      </TabsContent>
      
      {/* Generate TabsContent for remaining tabs */}
      {contentTabs
        .filter(tab => !specializedTabs.includes(tab.id))
        .map(tab => (
          <TabsContent key={tab.id} value={tab.id} id={tab.id} data-tab-content={tab.id}>
            <DefaultTabContent id={tab.id} label={tab.label} />
          </TabsContent>
        ))
      }
    </div>
  );
};

export default TabContentsRenderer;
