
import React, { useEffect } from 'react';
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
  
  // Log active tab for debugging
  useEffect(() => {
    console.log(`TabNavigation: Active tab is ${activeTab}`);
    
    // Ensure the active tab content is visible
    setTimeout(() => {
      // First hide all sections
      document.querySelectorAll('[data-tab-content]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      document.querySelectorAll('[data-section]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Then activate the correct section
      activateSection(activeTab);
      
      // Also ensure main tab category is active
      const mainCategory = getMainTabCategory(activeTab);
      if (mainCategory !== activeTab) {
        console.log(`Ensuring main category ${mainCategory} is also active`);
      }
      
      // Display a toast message for better UX
      toast.success(`Tab ${activeTab} activé`, {
        description: "Contenu mis à jour",
        position: "bottom-right",
        duration: 2000
      });
    }, 100);
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
            <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
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
