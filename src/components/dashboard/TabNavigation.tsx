
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ZapIcon } from "lucide-react";

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
  
  // Force les éléments à rester visibles
  useEffect(() => {
    const toolsButton = document.querySelector('.outils-seo-button');
    
    if (toolsButton) {
      const forceVisibility = () => {
        if (toolsButton) {
          (toolsButton as HTMLElement).style.display = 'flex';
          (toolsButton as HTMLElement).style.visibility = 'visible';
          (toolsButton as HTMLElement).style.opacity = '1';
          (toolsButton as HTMLElement).style.zIndex = '9999';
          (toolsButton as HTMLElement).style.position = 'relative';
          (toolsButton as HTMLElement).classList.add('ultra-visible');
        }
      };
      
      // Appliquer immédiatement et périodiquement
      forceVisibility();
      const interval = setInterval(forceVisibility, 500);
      
      // Observer les changements d'attributs
      const observer = new MutationObserver(forceVisibility);
      observer.observe(toolsButton, { attributes: true, childList: false, subtree: false });
      
      return () => {
        clearInterval(interval);
        observer.disconnect();
      };
    }
  }, []);
  
  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale</h2>
      <div className="relative">
        {/* Super gros bouton d'outils SEO au-dessus des tabs - stabilisé et fixé */}
        <div className="fixed top-4 right-4 z-[9999] md:absolute md:top-0 md:right-4 md:-top-16" style={{display: 'block', visibility: 'visible', opacity: 1}}>
          <div 
            onClick={() => handleTabChange('outils-seo')}
            className="outils-seo-button cursor-pointer bg-red-600 px-5 py-2 rounded-full text-white font-bold shadow-lg flex items-center gap-2 border-4 border-white ultra-visible"
            style={{
              background: 'linear-gradient(to right, #9333ea, #d946ef, #f97316)',
              boxShadow: '0 0 15px rgba(147, 51, 234, 0.6), 0 0 30px rgba(147, 51, 234, 0.3)',
              zIndex: 9999,
              position: 'relative',
              display: 'flex',
              visibility: 'visible',
              opacity: 1
            }}
          >
            <ZapIcon className="h-5 w-5" />
            OUTILS SEO
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start bg-white p-1">
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
                className="outils-seo-button bg-red-600 text-white font-bold shadow-lg border-2 border-white text-base px-4 py-1.5 ultra-visible"
                style={{
                  background: 'linear-gradient(to right, #9333ea, #d946ef, #f97316)',
                  boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                  zIndex: 9999,
                  position: 'relative'
                }}
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
