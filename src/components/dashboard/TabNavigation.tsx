
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const TabNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mapping des routes aux onglets
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
  
  // Obtention de l'onglet actif basé sur l'URL
  const currentTab = routeToTabMap[location.pathname] || 'hierarchy';
  
  console.log('TabNavigation current path:', location.pathname);
  console.log('TabNavigation mapped tab:', currentTab);
  
  // Gestion du changement d'onglet
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    
    // Mapping des onglets aux routes
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
    
    // Navigation vers la route correspondante
    if (tabToRouteMap[value]) {
      navigate(tabToRouteMap[value]);
      
      // Notification visuelle du changement d'onglet
      toast.info(`Navigation vers ${value}`, {
        description: "Chargement de la page...",
        duration: 1500
      });
    }
  };

  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale</h2>
      <div className="relative">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start bg-white p-1">
              <TabsTrigger value="hierarchy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Hiérarchie
              </TabsTrigger>
              <TabsTrigger value="wordcount" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Mots-clés
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                SEO
              </TabsTrigger>
              <TabsTrigger value="structure" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Structure
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Performance
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="outils-seo" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">
                Outils SEO
              </TabsTrigger>
              <TabsTrigger value="signature" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Signature
              </TabsTrigger>
              <TabsTrigger value="pinterest" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
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
