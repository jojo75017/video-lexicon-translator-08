
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Comprehensive mapping of routes to tab IDs
  const routeToTabMap: Record<string, string> = {
    '/': 'hierarchy',
    '': 'hierarchy',
    '/hierarchy': 'hierarchy',
    '/wordcount': 'wordcount',
    '/seo': 'seo',
    '/structure': 'structure',
    '/performance': 'performance',
    '/analytics': 'analytics',
    '/quora': 'quora',
    '/signature': 'signature',
    '/pinterest': 'pinterest',
    '/suggestions': 'suggestions',
    '/backlinks': 'backlinks',
    '/metrics': 'metrics'
  };
  
  // Get current active tab based on URL
  const currentTab = routeToTabMap[location.pathname] || 'hierarchy';
  
  console.log('TabNavigation current path:', location.pathname);
  console.log('TabNavigation mapped tab:', currentTab);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    
    // Mapping of tabs to routes
    const tabToRouteMap: Record<string, string> = {
      'hierarchy': '/hierarchy',
      'wordcount': '/wordcount',
      'seo': '/seo',
      'structure': '/structure',
      'performance': '/performance',
      'analytics': '/analytics',
      'quora': '/quora',
      'signature': '/signature',
      'pinterest': '/pinterest',
      'suggestions': '/suggestions',
      'backlinks': '/backlinks',
      'metrics': '/metrics'
    };
    
    // Navigate to the corresponding route
    if (tabToRouteMap[value]) {
      console.log(`Navigating to: ${tabToRouteMap[value]}`);
      navigate(tabToRouteMap[value]);
      
      // Visual notification of tab change
      toast.info(`Navigation vers ${value}`, {
        description: "Chargement de la page...",
        duration: 1500
      });
    }
  };
  
  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start bg-gradient-to-r from-primary-50 to-success-50 p-1">
            <TabsTrigger 
              value="hierarchy"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Hiérarchie
            </TabsTrigger>
            <TabsTrigger 
              value="wordcount"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Mots-clés
            </TabsTrigger>
            <TabsTrigger 
              value="seo"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              SEO
            </TabsTrigger>
            <TabsTrigger 
              value="structure"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Structure
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="signature"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Signature
            </TabsTrigger>
            <TabsTrigger 
              value="pinterest"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Pinterest
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TabNavigation;
