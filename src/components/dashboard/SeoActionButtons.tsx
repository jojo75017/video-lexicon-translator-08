
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch, FileText, LineChart, Search, ZapIcon } from 'lucide-react';
import { toast } from 'sonner';

const SeoActionButtons = () => {
  const handleButtonClick = (section: string) => {
    toast.success(`Navigation vers ${section}`);
  };

  const mainButtonRef = useRef<HTMLDivElement>(null);
  const iaToolsRef = useRef<HTMLDivElement>(null);

  // Assurez-vous que les éléments restent visibles
  useEffect(() => {
    const mainButton = mainButtonRef.current;
    const iaTools = iaToolsRef.current;
    
    if (mainButton) {
      // Force l'élément à rester visible
      const forceVisibility = () => {
        if (mainButton) {
          mainButton.style.display = 'block';
          mainButton.style.visibility = 'visible';
          mainButton.style.opacity = '1';
          mainButton.style.position = 'relative';
          mainButton.style.zIndex = '9999';
        }
        if (iaTools) {
          iaTools.style.display = 'block';
          iaTools.style.visibility = 'visible';
          iaTools.style.opacity = '1';
          iaTools.style.position = 'relative';
          iaTools.style.zIndex = '9999';
        }
      };

      // Appliquer immédiatement
      forceVisibility();
      
      // Réappliquer périodiquement pour s'assurer qu'ils restent visibles
      const interval = setInterval(forceVisibility, 1000);
      
      // Observer les changements d'attributs
      const observer = new MutationObserver(forceVisibility);
      if (mainButton) {
        observer.observe(mainButton, { attributes: true });
      }
      if (iaTools) {
        observer.observe(iaTools, { attributes: true });
      }
      
      return () => {
        clearInterval(interval);
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Grand bouton pour les outils SEO en haut - avec référence et style forcé */}
      <div ref={mainButtonRef} className="block w-full" style={{display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 9999}}>
        <Link to="/outils-seo" className="block w-full" onClick={() => handleButtonClick('Outils SEO')}>
          <div 
            className="bg-red-600 rounded-xl p-1 shadow-xl border-4 border-white"
            style={{background: 'linear-gradient(to right, #9333ea, #d946ef, #f97316)'}}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
              <div className="relative z-10 flex flex-col items-center">
                <ZapIcon className="h-16 w-16 text-white mb-3" />
                <h2 className="text-2xl md:text-3xl font-black text-white text-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                  BOÎTE À OUTILS SEO
                </h2>
                <p className="text-white/90 mt-2 text-center">
                  Cliquez ici pour accéder aux outils SEO avancés
                </p>
                <Button className="mt-4 bg-white text-purple-700 font-bold px-8 py-3 shadow-lg border-2 border-purple-300 text-lg">
                  ACCÉDER MAINTENANT
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Boutons d'actions SEO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/seo" className="block" onClick={() => handleButtonClick('Analyse de site')}>
          <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
            bg-blue-600 hover:bg-blue-700 
            text-white border-2 border-blue-300 text-lg shadow-md">
            <Search className="h-6 w-6 text-white" />
            <span>Analyser un site web</span>
          </Button>
        </Link>
        
        <Link to="/performance" className="block" onClick={() => handleButtonClick('Performance')}>
          <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
            bg-orange-600 hover:bg-orange-700 
            text-white border-2 border-orange-300 text-lg shadow-md">
            <LineChart className="h-6 w-6 text-white" />
            <span>Analyser les performances</span>
          </Button>
        </Link>
        
        <Link to="/analytics" className="block">
          <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
            bg-green-600 hover:bg-green-700 
            text-white border-2 border-green-300 text-lg shadow-md">
            <FileSearch className="h-6 w-6 text-white" />
            <span>Afficher les rapports</span>
          </Button>
        </Link>
      </div>

      {/* Bouton pour les outils IA avec référence et style forcé */}
      <div ref={iaToolsRef} className="block w-full mt-2" style={{display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 9999}}>
        <Link to="/outils-seo" className="block w-full" onClick={() => handleButtonClick('Outils IA')}>
          <div 
            className="rounded-xl p-1 shadow-xl border-4 border-indigo-300"
            style={{background: 'linear-gradient(to right, #4f46e5, #7e22ce, #c026d3)'}}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex flex-col items-center">
              <div className="relative z-10 flex flex-col items-center">
                <FileText className="h-12 w-12 text-white mb-2" />
                <h2 className="text-xl md:text-2xl font-black text-white text-center" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                  OUTILS IA AVANCÉS
                </h2>
                <p className="text-white/90 mt-1 text-center">
                  Générateurs de contenu IA, analyses automatiques et plus...
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SeoActionButtons;
