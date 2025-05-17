
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
    '/keyword-meta': 'keyword-meta',
    '/internal-linking': 'internal-links',
    '/keyword-generator': 'keyword-generator',
    // Routes localisées (français)
    '/hierarchie': 'hierarchy',
    '/nombre-mots': 'wordcount',
    '/liens-internes': 'internal-links',
    '/metriques': 'metrics',
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
      'hierarchy': '/',
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
      'keyword-meta': '/keyword-meta',
      'internal-links': '/internal-linking',
      'keyword-generator': '/keyword-generator',
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

  // Colors for tab states
  const tabColors: Record<string, string> = {
    'hierarchy': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700',
    'wordcount': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700',
    'seo': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-700',
    'structure': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700',
    'performance': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700',
    'analytics': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-700',
    'internal-links': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700',
    'outils-seo': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-sky-700',
    'signature': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-fuchsia-700',
    'pinterest': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700',
    'keyword-meta': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-700',
    'keyword-generator': 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700',
  };

  // Get color class for a tab
  const getTabColorClass = (tabValue: string) => {
    return tabColors[tabValue] || 'data-[state=active]:bg-blue-600';
  };

  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <h2 className="sr-only">Navigation principale</h2>
      <div className="relative">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md border border-indigo-200 overflow-hidden p-1">
          <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start bg-white/70 backdrop-blur-sm p-1 overflow-x-auto flex-nowrap rounded-md">
              <TabsTrigger value="hierarchy" className={`${getTabColorClass('hierarchy')} data-[state=active]:text-white hover:bg-gray-100`}>
                Hiérarchie
              </TabsTrigger>
              <TabsTrigger value="wordcount" className={`${getTabColorClass('wordcount')} data-[state=active]:text-white hover:bg-gray-100`}>
                Mots-clés
              </TabsTrigger>
              <TabsTrigger value="seo" className={`${getTabColorClass('seo')} data-[state=active]:text-white hover:bg-gray-100`}>
                SEO
              </TabsTrigger>
              <TabsTrigger value="structure" className={`${getTabColorClass('structure')} data-[state=active]:text-white hover:bg-gray-100`}>
                Structure
              </TabsTrigger>
              <TabsTrigger value="performance" className={`${getTabColorClass('performance')} data-[state=active]:text-white hover:bg-gray-100`}>
                Performance
              </TabsTrigger>
              <TabsTrigger value="analytics" className={`${getTabColorClass('analytics')} data-[state=active]:text-white hover:bg-gray-100`}>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="internal-links" className={`${getTabColorClass('internal-links')} data-[state=active]:text-white hover:bg-gray-100`}>
                Liens Internes
              </TabsTrigger>
              <TabsTrigger value="outils-seo" className={`${getTabColorClass('outils-seo')} data-[state=active]:text-white hover:bg-gray-100 font-medium`}>
                Outils SEO
              </TabsTrigger>
              <TabsTrigger value="signature" className={`${getTabColorClass('signature')} data-[state=active]:text-white hover:bg-gray-100`}>
                Signature
              </TabsTrigger>
              <TabsTrigger value="pinterest" className={`${getTabColorClass('pinterest')} data-[state=active]:text-white hover:bg-gray-100`}>
                Pinterest
              </TabsTrigger>
              <TabsTrigger value="keyword-meta" className={`${getTabColorClass('keyword-meta')} data-[state=active]:text-white hover:bg-gray-100`}>
                Titles & Meta
              </TabsTrigger>
              <TabsTrigger value="keyword-generator" className={`${getTabColorClass('keyword-generator')} data-[state=active]:text-white hover:bg-gray-100`}>
                Générateur de mots-clés
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
