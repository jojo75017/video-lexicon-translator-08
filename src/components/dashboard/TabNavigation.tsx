
import React, { useEffect, useRef } from 'react';
import { Tabs } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import MainTabList from './tabs/MainTabList';
import SubTabList from './tabs/SubTabList';
import TabContentsRenderer from './tabs/TabContentsRenderer';
import { useTabNavigation } from './tabs/useTabNavigation';
import { activateSection, getMainTabCategory } from '@/utils/navigationHelpers';
import { toast } from "sonner";

const TabNavigation = () => {
  const { 
    activeTab, 
    mainTabs, 
    contentTabs, 
    subTabs, 
    handleTabChange 
  } = useTabNavigation();
  
  const initialRenderRef = useRef(true);
  
  // Log active tab for debugging and ensure active tab content is visible
  useEffect(() => {
    console.log(`TabNavigation: Active tab changed to ${activeTab}`);
    
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      console.log("Initial render, skipping toast notification");
      // Still activate the section on initial render
      setTimeout(() => activateSection(activeTab), 600);
      return;
    }
    
    // Ensure the active tab content is visible with increased timeout
    setTimeout(() => {
      // Activate the section with the active ID
      activateSection(activeTab);
      
      // Show toast notification to confirm activation
      toast.success(`Onglet ${activeTab} activé`, {
        description: "Contenu mis à jour",
        position: "bottom-right",
        duration: 2000
      });
    }, 800); // Increased delay to ensure DOM is updated
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
            defaultValue="hierarchy"
          >
            {/* Main Tab Navigation */}
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
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4 relative min-h-[400px]">
              <TabContentsRenderer 
                contentTabs={contentTabs} 
                activeTab={activeTab}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default TabNavigation;
