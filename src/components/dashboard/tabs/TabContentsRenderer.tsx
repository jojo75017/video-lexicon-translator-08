
import React from 'react';
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
  
  console.log(`TabContentsRenderer: Rendering content for active tab: ${activeTab}`);
  
  return (
    <div className="tab-content-container">
      {/* Specialized tab contents */}
      <TabsContent value="hierarchy" id="hierarchy">
        <HierarchyTabContent />
      </TabsContent>
      
      <TabsContent value="wordcount" id="wordcount">
        <WordCountTabContent />
      </TabsContent>
      
      <TabsContent value="suggestions" id="suggestions">
        <SuggestionsTabContent />
      </TabsContent>
      
      <TabsContent value="seo" id="seo">
        <SeoTabContent />
      </TabsContent>
      
      <TabsContent value="structure" id="structure">
        <StructureTabContent />
      </TabsContent>
      
      <TabsContent value="backlinks" id="backlinks">
        <BacklinksTabContent />
      </TabsContent>
      
      <TabsContent value="metrics" id="metrics">
        <MetricsTabContent />
      </TabsContent>
      
      <TabsContent value="advanced" id="advanced">
        <AdvancedTabContent />
      </TabsContent>
      
      <TabsContent value="integrations" id="integrations">
        <IntegrationsTabContent />
      </TabsContent>
      
      <TabsContent value="analytics" id="analytics">
        <AnalyticsTabContent />
      </TabsContent>
      
      <TabsContent value="performance" id="performance">
        <PerformanceTabContent />
      </TabsContent>
      
      {/* Generate TabsContent for remaining tabs */}
      {contentTabs
        .filter(tab => !specializedTabs.includes(tab.id))
        .map(tab => (
          <TabsContent key={tab.id} value={tab.id} id={tab.id}>
            <DefaultTabContent id={tab.id} label={tab.label} />
          </TabsContent>
        ))
      }
    </div>
  );
};

export default TabContentsRenderer;
