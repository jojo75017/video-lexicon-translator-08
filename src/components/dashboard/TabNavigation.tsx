
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
    
    // Mapping des onglets aux routes - navigation interne au dashboard
    const tabActions: Record<string, () => void> = {
      'hierarchy': () => {/* Affichage du contenu hiérarchie dans le dashboard */},
      'wordcount': () => {/* Affichage du contenu audit dans le dashboard */},
      'seo': () => {/* Affichage du contenu SEO dans le dashboard */},
      'structure': () => {/* Affichage du contenu structure dans le dashboard */},
      'performance': () => {/* Affichage du contenu performance dans le dashboard */},
      'analytics': () => {/* Affichage du contenu analytics dans le dashboard */},
      'suggestions': () => {/* Affichage du contenu suggestions dans le dashboard */},
      'backlinks': () => {/* Affichage du contenu backlinks dans le dashboard */},
      'metrics': () => {/* Affichage du contenu métriques dans le dashboard */},
      'quora': () => navigate('/quora'),
      'signature': () => navigate('/signature'),
      'pinterest': () => navigate('/pinterest'),
      'keyword-meta': () => navigate('/keyword-meta'),
      'internal-links': () => navigate('/internal-linking'),
      'keyword-generator': () => navigate('/keyword-generator'),
      'keyword-analysis': () => navigate('/keyword-analysis')
    };
    
    // Exécuter l'action correspondante
    if (tabActions[value]) {
      tabActions[value]();
      
      // Notification pour les navigations externes
      if (['quora', 'signature', 'pinterest', 'keyword-meta', 'internal-links', 'keyword-generator', 'keyword-analysis'].includes(value)) {
        toast.info(`Navigation vers ${value}`, {
          description: "Chargement de la page...",
          duration: 1500
        });
      }
    }
  };

  return (
    <div className="mb-6" role="navigation" aria-label="Navigation du tableau de bord">
      <div className="relative">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-md border border-indigo-200 overflow-hidden p-1">
          <Tabs defaultValue={currentTab} value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="w-full justify-start bg-white/70 backdrop-blur-sm p-1 overflow-x-auto flex-nowrap rounded-md">
              <TabsTrigger value="hierarchy" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100">
                Hiérarchie
              </TabsTrigger>
              <TabsTrigger value="wordcount" className="data-[state=active]:bg-green-600 data-[state=active]:text-white hover:bg-gray-100">
                Audit contenu
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100">
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="seo" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-gray-100">
                SEO
              </TabsTrigger>
              <TabsTrigger value="structure" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-gray-100">
                Structure
              </TabsTrigger>
              <TabsTrigger value="backlinks" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white hover:bg-gray-100">
                Backlinks
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-gray-100">
                Performance
              </TabsTrigger>
              <TabsTrigger value="metrics" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white hover:bg-gray-100">
                Métriques
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white hover:bg-gray-100">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="internal-links" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white hover:bg-gray-100">
                Liens Internes
              </TabsTrigger>
              <TabsTrigger value="keyword-meta" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white hover:bg-gray-100">
                Titles & Meta
              </TabsTrigger>
              <TabsTrigger value="keyword-generator" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white hover:bg-gray-100">
                Générateur
              </TabsTrigger>
              <TabsTrigger value="quora" className="data-[state=active]:bg-red-600 data-[state=active]:text-white hover:bg-gray-100">
                Quora
              </TabsTrigger>
              <TabsTrigger value="signature" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-gray-100">
                Signature
              </TabsTrigger>
              <TabsTrigger value="pinterest" className="data-[state=active]:bg-red-600 data-[state=active]:text-white hover:bg-gray-100">
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
