
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ZapIcon } from "lucide-react";

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Keep forcing the SEO button to be visible
  useEffect(() => {
    const forceSeoButtonVisibility = () => {
      const seoButtons = document.querySelectorAll('.seo-button');
      seoButtons.forEach(button => {
        if (button instanceof HTMLElement) {
          button.style.display = "flex";
          button.style.visibility = "visible";
          button.style.opacity = "1";
          button.style.position = "relative";
          button.style.zIndex = "9999";
        }
      });
    };
    
    // Run immediately and set interval
    forceSeoButtonVisibility();
    const intervalId = setInterval(forceSeoButtonVisibility, 300);
    
    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(() => {
      forceSeoButtonVisibility();
    });
    
    if (tabsContainerRef.current) {
      observer.observe(tabsContainerRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }
    
    return () => {
      clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord" 
      style={{position: 'relative', zIndex: 40}} ref={tabsContainerRef}>
      <h2 className="sr-only">Navigation principale</h2>
      <div className="relative">
        {/* Super gros bouton d'outils SEO au-dessus des tabs - Stabilisé */}
        <div style={{
          position: 'absolute', 
          top: '-20px', 
          right: '20px', 
          zIndex: 9999, 
          display: 'block', 
          visibility: 'visible', 
          opacity: 1
        }} className="always-visible">
          <div 
            onClick={() => handleTabChange('outils-seo')}
            className="cursor-pointer px-5 py-3 rounded-full text-white font-bold shadow-lg flex items-center gap-2 border-4 border-white seo-button always-visible"
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
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden" style={{border: '2px solid #d1d5db'}}>
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
                className="bg-red-600 text-white font-bold shadow-lg border-2 border-white text-base px-4 py-1.5 seo-button always-visible"
                style={{
                  background: 'linear-gradient(to right, #9333ea, #d946ef, #f97316)',
                  boxShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                  zIndex: 9999,
                  position: 'relative',
                  display: 'flex',
                  visibility: 'visible',
                  opacity: 1
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
