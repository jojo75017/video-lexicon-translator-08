
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import TabNavigation from '@/components/dashboard/TabNavigation';
import TabContentsRenderer from '@/components/dashboard/tabs/TabContentsRenderer';
import { useTabNavigation } from '@/hooks/useTabNavigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const DashboardPage = () => {
  const { activeTab, contentTabs, handleTabChange } = useTabNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard SEO</h1>
        </div>
      </header>
      
      <div className="container mx-auto p-6">
        <DashboardHeader />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabNavigation />
          <TabContentsRenderer 
            contentTabs={contentTabs}
            activeTab={activeTab}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
