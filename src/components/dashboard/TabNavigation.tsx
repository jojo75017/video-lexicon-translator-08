
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

// Import refactored components
import TabGroup from './tabs/TabGroup';
import { tabs } from './tabs/TabData';
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
import SuggestionsTabContent from './tabs/SuggestionsTabContent';
import { activateSection } from '@/utils/navigationHelpers';

const TabNavigation = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  
  // Group tabs by main categories
  const mainTabs = [
    {id: 'seo', label: 'SEO', color: 'bg-purple-100 text-purple-800'},
    {id: 'content', label: 'Contenu', color: 'bg-blue-100 text-blue-800'},
    {id: 'performance', label: 'Performance', color: 'bg-amber-100 text-amber-800'},
    {id: 'analytics', label: 'Analytics', color: 'bg-emerald-100 text-emerald-800'}
  ];
  
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
      const defaultTab = 'seo';
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

  // Get sub-tabs based on active main tab
  const getSubTabs = () => {
    if (activeTab === 'seo') {
      return tabs.filter(tab => ['seo', 'structure', 'backlinks'].includes(tab.id));
    } else if (activeTab === 'content') {
      return tabs.filter(tab => ['wordcount', 'hierarchy', 'suggestions'].includes(tab.id));
    } else if (activeTab === 'performance') {
      return tabs.filter(tab => ['performance', 'metrics'].includes(tab.id));
    } else if (activeTab === 'analytics') {
      return tabs.filter(tab => ['analytics'].includes(tab.id));
    }
    return [];
  };

  return (
    <TooltipProvider>
      <Card className="bg-white shadow-sm border border-gray-100 mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">Tableau de bord SEO</h2>
          
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            {/* Main Tab Navigation */}
            <TabsList className="grid grid-cols-4 gap-2 p-1 bg-gray-50 mb-4 rounded-lg">
              {mainTabs.map(tab => (
                <div 
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`rounded-md py-2 px-4 text-center cursor-pointer transition-all ${
                    activeTab === tab.id 
                      ? tab.color
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </div>
              ))}
            </TabsList>
            
            {/* Subtabs based on active main tab */}
            {getSubTabs().length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 pl-2">
                {getSubTabs().map(tab => (
                  <div 
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Tab Contents */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-0">
              <TabsContent value="wordcount">
                <WordCountTabContent />
              </TabsContent>
              
              <TabsContent value="hierarchy">
                <HierarchyTabContent />
              </TabsContent>
              
              <TabsContent value="suggestions">
                <SuggestionsTabContent />
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
                .filter(tab => !['hierarchy', 'wordcount', 'seo', 'structure', 'backlinks', 'metrics', 'advanced', 'integrations', 'analytics', 'performance', 'suggestions'].includes(tab.id))
                .map(tab => (
                  <TabsContent key={tab.id} value={tab.id}>
                    <DefaultTabContent id={tab.id} label={tab.label} />
                  </TabsContent>
                ))
              }
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TabNavigation;
