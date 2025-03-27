
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
  
  console.log(`TabContentsRenderer: Rendering content for active tab: ${activeTab}`);
  
  // Make sure content is visible when activeTab changes
  useEffect(() => {
    // Short delay to ensure DOM is updated
    setTimeout(() => {
      // First clear all displays
      document.querySelectorAll('[data-tab-content]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Then activate the specific tab
      activateSection(activeTab);
      
      // Force display of the active tab content
      const activeElement = document.getElementById(activeTab);
      if (activeElement) {
        activeElement.style.display = 'block';
        console.log(`Forced display of tab content with ID: ${activeTab}`);
      }
      
      // Also force display of data-section
      const sectionElements = document.querySelectorAll(`[data-section="${activeTab}"]`);
      sectionElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
        console.log(`Forced display of section with data-section: ${activeTab}`);
      });
      
      // Also check for data-tab-content
      const tabContentElements = document.querySelectorAll(`[data-tab-content="${activeTab}"]`);
      tabContentElements.forEach(el => {
        (el as HTMLElement).style.display = 'block';
        console.log(`Forced display of element with data-tab-content: ${activeTab}`);
      });
    }, 50);
  }, [activeTab]);
  
  return (
    <div className="tab-content-container">
      {/* Specialized tab contents */}
      <TabsContent value="hierarchy" id="hierarchy" data-tab-content="hierarchy" className={activeTab === 'hierarchy' ? 'block' : 'hidden'}>
        <HierarchyTabContent />
      </TabsContent>
      
      <TabsContent value="wordcount" id="wordcount" data-tab-content="wordcount" className={activeTab === 'wordcount' ? 'block' : 'hidden'}>
        <WordCountTabContent />
      </TabsContent>
      
      <TabsContent value="suggestions" id="suggestions" data-tab-content="suggestions" className={activeTab === 'suggestions' ? 'block' : 'hidden'}>
        <SuggestionsTabContent />
      </TabsContent>
      
      <TabsContent value="seo" id="seo" data-tab-content="seo" className={activeTab === 'seo' ? 'block' : 'hidden'}>
        <SeoTabContent />
      </TabsContent>
      
      <TabsContent value="structure" id="structure" data-tab-content="structure" className={activeTab === 'structure' ? 'block' : 'hidden'}>
        <StructureTabContent />
      </TabsContent>
      
      <TabsContent value="backlinks" id="backlinks" data-tab-content="backlinks" className={activeTab === 'backlinks' ? 'block' : 'hidden'}>
        <BacklinksTabContent />
      </TabsContent>
      
      <TabsContent value="metrics" id="metrics" data-tab-content="metrics" className={activeTab === 'metrics' ? 'block' : 'hidden'}>
        <MetricsTabContent />
      </TabsContent>
      
      <TabsContent value="advanced" id="advanced" data-tab-content="advanced" className={activeTab === 'advanced' ? 'block' : 'hidden'}>
        <AdvancedTabContent />
      </TabsContent>
      
      <TabsContent value="integrations" id="integrations" data-tab-content="integrations" className={activeTab === 'integrations' ? 'block' : 'hidden'}>
        <IntegrationsTabContent />
      </TabsContent>
      
      <TabsContent value="performance" id="performance" data-tab-content="performance" className={activeTab === 'performance' ? 'block' : 'hidden'}>
        <PerformanceTabContent />
      </TabsContent>
      
      <TabsContent value="analytics" id="analytics" data-tab-content="analytics" className={activeTab === 'analytics' ? 'block' : 'hidden'}>
        <AnalyticsTabContent />
      </TabsContent>
      
      {/* For any other tab that doesn't have a specialized component */}
      {contentTabs
        .filter(tab => !specializedTabs.includes(tab.id))
        .map(tab => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            id={tab.id} 
            data-tab-content={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            <DefaultTabContent id={tab.id} label={tab.label} />
          </TabsContent>
        ))}
    </div>
  );
};

export default TabContentsRenderer;
