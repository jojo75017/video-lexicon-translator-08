
import React from 'react';
import { ScrollText, BarChart, Search, ExternalLink, CheckCircle, PenTool, FileSearch, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';

const PageHeader = () => {
  const navigate = useNavigate();

  const handleTabClick = (id: string) => {
    console.log(`Header tab clicked: ${id}`);
    
    // Simple mapping of tab IDs to routes
    const tabToRouteMap: Record<string, string> = {
      'hierarchy': '/',
      'wordcount': '/wordcount',
      'seo': '/seo',
      'structure': '/structure',
      'performance': '/performance',
      'analytics': '/analytics',
      'pinterest': '/pinterest'
    };
    
    // Navigate to the corresponding route
    if (tabToRouteMap[id]) {
      navigate(tabToRouteMap[id]);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-700 to-blue-600 rounded-xl p-8 shadow-lg mb-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 opacity-20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 opacity-20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-purple-500 opacity-10 rounded-full filter blur-3xl"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-md">
              Tableau de bord SEO
            </h1>
            <p className="text-lg text-blue-50 max-w-xl mb-6 leading-relaxed">
              Optimisez votre visibilité en ligne avec nos outils d'analyse et d'optimisation professionnels
            </p>
            
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white">
                <Search className="mr-2 h-4 w-4" /> 
                Analyser mon site
              </Button>
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white">
                <ExternalLink className="mr-2 h-4 w-4" /> 
                Voir le guide SEO
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 bg-white/15 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-xl">
            <div className="text-white font-semibold text-center mb-2">Statistiques du mois</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 p-3 rounded-lg shadow-inner border border-white/10">
                <div className="flex items-center justify-center gap-2 text-white mb-1">
                  <BarChart className="h-4 w-4" />
                  <span className="text-sm">Trafic organique</span>
                </div>
                <div className="text-center text-white font-bold text-xl">+12.5%</div>
              </div>
              <div className="bg-white/15 p-3 rounded-lg shadow-inner border border-white/10">
                <div className="flex items-center justify-center gap-2 text-white mb-1">
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Mots-clés</span>
                </div>
                <div className="text-center text-white font-bold text-xl">+8</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mt-8 bg-white/15 backdrop-blur-sm rounded-lg p-1 border border-white/20 shadow-lg">
          <Tabs defaultValue="hierarchy" className="w-full">
            <TabsList className="w-full bg-transparent flex gap-1 justify-center">
              <TabsTrigger 
                value="hierarchy" 
                className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white hover:bg-white/20 hover:text-white flex gap-2 items-center"
                onClick={() => handleTabClick('hierarchy')}
              >
                <PenTool className="h-4 w-4" />
                <span>Hiérarchie</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="wordcount" 
                className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white hover:bg-white/20 hover:text-white flex gap-2 items-center"
                onClick={() => handleTabClick('wordcount')}
              >
                <ScrollText className="h-4 w-4" />
                <span>Mots-clés</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="seo" 
                className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white hover:bg-white/20 hover:text-white flex gap-2 items-center"
                onClick={() => handleTabClick('seo')}
              >
                <Search className="h-4 w-4" />
                <span>Analyse SEO</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="structure" 
                className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white hover:bg-white/20 hover:text-white flex gap-2 items-center"
                onClick={() => handleTabClick('structure')}
              >
                <FileSearch className="h-4 w-4" />
                <span>Structure</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white hover:bg-white/20 hover:text-white flex gap-2 items-center"
                onClick={() => handleTabClick('performance')}
              >
                <BarChart className="h-4 w-4" />
                <span>Performance</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white hover:bg-white/20 hover:text-white flex gap-2 items-center"
                onClick={() => handleTabClick('analytics')}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="pinterest" 
                className="data-[state=active]:bg-white/20 text-white data-[state=active]:text-white hover:bg-white/20 hover:text-white flex gap-2 items-center"
                onClick={() => handleTabClick('pinterest')}
              >
                <Image className="h-4 w-4" />
                <span>Pinterest</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
