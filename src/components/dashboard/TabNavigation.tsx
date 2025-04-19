
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
    '/metrics': 'metrics',
    // Additional mappings for any other routes
    '/hierarchie': 'hierarchy',
    '/nombre-mots': 'wordcount',
    '/metriques': 'metrics'
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
  
  // Show section based on active tab
  useEffect(() => {
    const showSection = (sectionId: string) => {
      console.log('Nombre total d\'éléments trouvés:', document.querySelectorAll('[data-section]').length);
      console.log('Éléments trouvés:', Array.from(document.querySelectorAll('[data-section]')));
      
      // Hide all sections first
      document.querySelectorAll('[data-section]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Show the active section
      const activeSection = document.querySelector(`[data-section="${sectionId}"]`);
      if (activeSection) {
        (activeSection as HTMLElement).style.display = 'block';
        console.log(`Section ${sectionId} affichée`);
      } else {
        console.log(`Aucune section trouvée pour ${sectionId}, affichage de secours`);
      }
    };
    
    // Try showing the current section with helpful debug logs
    try {
      console.log('Tentative d\'afficher la section correspondant au chemin actuel:', currentTab);
      console.log('Sections disponibles:', Array.from(document.querySelectorAll('[data-section]')).map(el => el.getAttribute('data-section')));
      showSection(currentTab);
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la section:', error);
    }
  }, [currentTab]);
  
  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale et sous-navigation</h2>
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
              Nombre de mots
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
              value="suggestions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Suggestions
            </TabsTrigger>
            <TabsTrigger 
              value="backlinks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Backlinks
            </TabsTrigger>
            <TabsTrigger 
              value="metrics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500 data-[state=active]:to-primary-600 data-[state=active]:text-white"
            >
              Métriques
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TabNavigation;
