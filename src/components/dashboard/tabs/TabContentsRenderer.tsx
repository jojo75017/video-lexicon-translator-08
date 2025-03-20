
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
}

const TabContentsRenderer: React.FC<TabContentsRendererProps> = ({ contentTabs }) => {
  // List of tab IDs that have specialized components
  const specializedTabs = [
    'hierarchy', 'wordcount', 'seo', 'structure', 'backlinks', 
    'metrics', 'advanced', 'integrations', 'analytics', 
    'performance', 'suggestions'
  ];
  
  return (
    <>
      {/* Specialized tab contents */}
      <TabsContent value="wordcount" id="wordcount" data-tab-content>
        <WordCountTabContent />
      </TabsContent>
      
      <TabsContent value="hierarchy" id="hierarchy" data-tab-content>
        <HierarchyTabContent />
      </TabsContent>
      
      <TabsContent value="suggestions" id="suggestions" data-tab-content>
        <SuggestionsTabContent />
      </TabsContent>
      
      <TabsContent value="seo" id="seo" data-tab-content>
        <SeoTabContent />
      </TabsContent>
      
      <TabsContent value="structure" id="structure" data-tab-content>
        <StructureTabContent />
      </TabsContent>
      
      <TabsContent value="backlinks" id="backlinks" data-tab-content>
        <BacklinksTabContent />
      </TabsContent>
      
      <TabsContent value="metrics" id="metrics" data-tab-content>
        <MetricsTabContent />
      </TabsContent>
      
      <TabsContent value="advanced" id="advanced" data-tab-content>
        <AdvancedTabContent />
      </TabsContent>
      
      <TabsContent value="integrations" id="integrations" data-tab-content>
        <IntegrationsTabContent />
      </TabsContent>
      
      <TabsContent value="analytics" id="analytics" data-tab-content>
        <AnalyticsTabContent />
      </TabsContent>
      
      <TabsContent value="performance" id="performance" data-tab-content>
        <PerformanceTabContent />
      </TabsContent>
      
      {/* Generate TabsContent for remaining tabs */}
      {contentTabs
        .filter(tab => !specializedTabs.includes(tab.id))
        .map(tab => (
          <TabsContent key={tab.id} value={tab.id} id={tab.id} data-tab-content>
            <DefaultTabContent id={tab.id} label={tab.label} />
          </TabsContent>
        ))
      }
    </>
  );
};

export default TabContentsRenderer;
