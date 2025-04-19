
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Simple mapping of routes to tab IDs
  const routeToTabMap = {
    '/': 'hierarchy',
    '/hierarchy': 'hierarchy',
    '/wordcount': 'wordcount',
    '/seo': 'seo',
    '/structure': 'structure',
    '/performance': 'performance',
    '/analytics': 'analytics',
    '/quora': 'quora',
    '/signature': 'signature',
    '/pinterest': 'pinterest'
  };
  
  // Get current active tab based on URL
  const currentTab = routeToTabMap[location.pathname] || 'hierarchy';
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    
    // Mapping of tabs to routes
    const tabToRouteMap: Record<string, string> = {
      'hierarchy': '/',
      'wordcount': '/wordcount',
      'seo': '/seo',
      'structure': '/structure',
      'performance': '/performance',
      'analytics': '/analytics',
      'quora': '/quora',
      'signature': '/signature',
      'pinterest': '/pinterest'
    };
    
    // Navigate to the corresponding route
    if (tabToRouteMap[value]) {
      navigate(tabToRouteMap[value]);
    }
  };
  
  // Show section based on active tab
  useEffect(() => {
    const showSection = (sectionId: string) => {
      // Hide all sections first
      document.querySelectorAll('[data-section]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Show the active section
      const activeSection = document.querySelector(`[data-section="${sectionId}"]`);
      if (activeSection) {
        (activeSection as HTMLElement).style.display = 'block';
      }
    };
    
    // Show the current section
    showSection(currentTab);
  }, [currentTab]);
  
  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale et sous-navigation</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="hierarchy">Hiérarchie</TabsTrigger>
            <TabsTrigger value="wordcount">Nombre de mots</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="signature">Signature</TabsTrigger>
            <TabsTrigger value="pinterest">Pinterest</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TabNavigation;
