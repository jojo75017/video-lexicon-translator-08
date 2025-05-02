
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
    '/suggestions': 'suggestions',
    '/backlinks': 'backlinks',
    '/metrics': 'metrics',
    '/quora': 'quora',
    '/signature': 'signature',
    '/pinterest': 'pinterest',
    '/outils-seo': 'outils-seo',
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
      'metrics': '/metrics',
      'outils-seo': '/outils-seo',
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
  
  // Effect to enforce synchronization between URL and active tab
  useEffect(() => {
    const mappedTab = routeToTabMap[location.pathname];
    console.log('Current path:', location.pathname, 'Mapped tab:', mappedTab);
    
    // Force tab update if needed (URL changed externally)
    if (mappedTab && mappedTab !== currentTab) {
      console.log('Forcing tab update to match URL');
      handleTabChange(mappedTab);
    }
  }, [location.pathname]);
  
  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale</h2>
      <div className="relative">
        {/* Super gros bouton d'outils SEO au-dessus des tabs */}
        <div className="absolute -top-16 right-4 z-10">
          <div 
            onClick={() => handleTabChange('outils-seo')}
            className="cursor-pointer bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 px-5 py-2 rounded-full text-white font-bold shadow-lg flex items-center gap-2 animate-pulse hover:scale-105 transition-all"
          >
            OUTILS SEO
          </div>
        </div>
        
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
                value="outils-seo"
                className="bg-gradient-to-r from-violet-600 via-pink-500 to-red-600 text-white font-bold animate-pulse shadow-lg border border-purple-300 text-base px-4 py-1.5"
              >
                OUTILS SEO
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
    </div>
  );
};

export default TabNavigation;
