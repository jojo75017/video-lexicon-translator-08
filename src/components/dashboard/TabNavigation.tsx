
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
    '/dashboard': 'hierarchy',
    '/hierarchy': 'hierarchy',
    '/wordcount': 'wordcount',
    '/suggestions': 'suggestions',
    '/seo': 'seo',
    '/structure': 'structure',
    '/performance': 'performance',
    '/metrics': 'metrics',
    '/analytics': 'analytics',
    '/backlinks': 'backlinks',
    '/quora': 'quora',
    '/signature': 'signature',
    '/pinterest': 'pinterest',
    '/keyword-meta': 'keyword-meta',
    '/internal-linking': 'internal-links',
    '/keyword-generator': 'keyword-generator',
    '/keyword-analysis': 'keyword-analysis'
  };
  
  // Obtention de l'onglet actif basé sur l'URL
  const currentTab = routeToTabMap[location.pathname] || 'hierarchy';
  
  // Gestion du changement d'onglet
  const handleTabChange = (value: string) => {
    console.log(`Tab changed to: ${value}`);
    
    // Mapping des onglets aux routes
    const tabToRouteMap: Record<string, string> = {
      'hierarchy': '/dashboard',
      'wordcount': '/wordcount',
      'suggestions': '/suggestions',
      'seo': '/seo',
      'structure': '/structure',
      'performance': '/performance',
      'metrics': '/metrics',
      'analytics': '/analytics',
      'backlinks': '/seo',
      'quora': '/quora',
      'signature': '/signature',
      'pinterest': '/pinterest',
      'keyword-meta': '/keyword-meta',
      'internal-links': '/internal-linking',
      'keyword-generator': '/keyword-generator',
      'keyword-analysis': '/keyword-analysis'
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
      <div className="relative">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md border border-indigo-200 overflow-hidden p-1">
          <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start bg-white/70 backdrop-blur-sm p-1 overflow-x-auto flex-nowrap rounded-md">
              <TabsTrigger value="hierarchy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Hiérarchie
              </TabsTrigger>
              <TabsTrigger value="wordcount" className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Audit contenu
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                SEO
              </TabsTrigger>
              <TabsTrigger value="structure" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Structure
              </TabsTrigger>
              <TabsTrigger value="backlinks" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Backlinks
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Performance
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Métriques
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="internal-links" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Liens Internes
              </TabsTrigger>
              <TabsTrigger value="keyword-meta" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Titles & Meta
              </TabsTrigger>
              <TabsTrigger value="keyword-generator" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Générateur KW
              </TabsTrigger>
              <TabsTrigger value="keyword-analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Analyse KW
              </TabsTrigger>
              <TabsTrigger value="quora" className="data-[state=active]:bg-red-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Quora
              </TabsTrigger>
              <TabsTrigger value="signature" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
                Signature
              </TabsTrigger>
              <TabsTrigger value="pinterest" className="data-[state=active]:bg-red-600 data-[state=active]:text-white hover:bg-gray-100 whitespace-nowrap">
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
