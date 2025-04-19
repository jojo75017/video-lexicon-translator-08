
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-4">
        <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="hierarchy">Hiérarchie</TabsTrigger>
            <TabsTrigger value="wordcount">Nombre de mots</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="backlinks">Backlinks</TabsTrigger>
            <TabsTrigger value="metrics">Métriques</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default TabNavigation;
