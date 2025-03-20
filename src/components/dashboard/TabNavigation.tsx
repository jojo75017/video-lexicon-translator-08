
import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import MainTabList from './tabs/MainTabList';
import SubTabList from './tabs/SubTabList';
import TabContentsRenderer from './tabs/TabContentsRenderer';
import { useTabNavigation } from './tabs/useTabNavigation';
import { activateSection } from '@/utils/navigationHelpers';

const TabNavigation = () => {
  const { 
    activeTab, 
    mainTabs, 
    contentTabs, 
    subTabs, 
    handleTabChange 
  } = useTabNavigation();
  
  // Force-activate the section on every render to ensure visibility
  useEffect(() => {
    if (activeTab) {
      setTimeout(() => activateSection(activeTab), 150);
    }
  }, [activeTab]);
  
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
            {/* Main Tab Navigation - Now styled more like SEMrush/UberSuggest */}
            <MainTabList 
              mainTabs={mainTabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            {/* Subtabs based on active main tab */}
            <SubTabList 
              subTabs={subTabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            {/* Tab Contents */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <TabContentsRenderer contentTabs={contentTabs} />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TabNavigation;
