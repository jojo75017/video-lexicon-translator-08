import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch, FileText, LineChart, Search, ZapIcon } from 'lucide-react';
import { toast } from 'sonner';

// Custom hook to force visibility 
const useVisibilityKeeper = () => {
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Function to force visibility of all SeoActionButtons elements
    const forceVisibility = () => {
      const elements = document.querySelectorAll('.seo-action-button, .seo-action-container, .seo-tools-button');
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = "block";
          el.style.visibility = "visible";
          el.style.opacity = "1";
          el.style.position = "relative";
          el.style.zIndex = "9999";
        }
      });
    };

    // Initial enforcement
    forceVisibility();
    
    // Continuous enforcement
    intervalRef.current = window.setInterval(forceVisibility, 300);
    
    // Mutation observer for DOM changes
    const observer = new MutationObserver(() => {
      forceVisibility();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      observer.disconnect();
    };
  }, []);
};

const SeoActionButtons = () => {
  // Use the visibility keeper hook
  useVisibilityKeeper();
  
  const handleButtonClick = (section: string) => {
    toast.success(`Navigation vers ${section}`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 seo-action-container always-visible" 
      style={{position: "relative", zIndex: 50, display: "block", visibility: "visible", opacity: 1}}>
      {/* Grand bouton pour les outils SEO en haut - Version super stable */}
      <div className="block w-full seo-tools-button always-visible" 
        style={{display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 9999}}>
        <Link to="/outils-seo" className="block w-full always-visible" 
          onClick={() => handleButtonClick('Outils SEO')}
          style={{display: 'block', visibility: 'visible', opacity: 1}}>
          <div 
            className="rounded-xl p-1 shadow-xl border-4 border-white seo-tools-card always-visible"
            style={{
              background: 'linear-gradient(to right, #9333ea, #d946ef, #f97316)', 
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.7)',
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              position: 'relative',
              zIndex: 9999
            }}
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
                <Button className="mt-4 bg-white text-purple-700 font-bold px-8 py-3 shadow-lg border-2 border-purple-300 text-lg"
                  style={{display: 'flex', visibility: 'visible', opacity: 1}}>
                  ACCÉDER MAINTENANT
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Boutons d'actions SEO avec styles ultra-stables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="block seo-action-button always-visible" 
          style={{display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 100}}>
          <Link to="/seo" className="block" onClick={() => handleButtonClick('Analyse de site')}
            style={{display: 'block', visibility: 'visible', opacity: 1}}>
            <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
              bg-blue-600 hover:bg-blue-700 
              text-white border-4 border-blue-300 text-lg shadow-lg action-button" 
              style={{display: 'flex', visibility: 'visible', opacity: 1, zIndex: 100}}>
              <Search className="h-6 w-6 text-white" />
              <span>Analyser un site web</span>
            </Button>
          </Link>
        </div>
        
        <div className="block seo-action-button always-visible" 
          style={{display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 100}}>
          <Link to="/performance" className="block" onClick={() => handleButtonClick('Performance')}
            style={{display: 'block', visibility: 'visible', opacity: 1}}>
            <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
              bg-orange-600 hover:bg-orange-700 
              text-white border-4 border-orange-300 text-lg shadow-lg action-button" 
              style={{display: 'flex', visibility: 'visible', opacity: 1, zIndex: 100}}>
              <LineChart className="h-6 w-6 text-white" />
              <span>Analyser les performances</span>
            </Button>
          </Link>
        </div>
        
        <div className="block seo-action-button always-visible" 
          style={{display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 100}}>
          <Link to="/analytics" className="block" 
            style={{display: 'block', visibility: 'visible', opacity: 1}}>
            <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
              bg-green-600 hover:bg-green-700 
              text-white border-4 border-green-300 text-lg shadow-lg action-button" 
              style={{display: 'flex', visibility: 'visible', opacity: 1, zIndex: 100}}>
              <FileSearch className="h-6 w-6 text-white" />
              <span>Afficher les rapports</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Bouton pour les outils IA avec style ultra-stable */}
      <div className="block w-full mt-2 seo-action-button always-visible" 
        style={{display: 'block', visibility: 'visible', opacity: 1, position: 'relative', zIndex: 9999}}>
        <Link to="/outils-seo" className="block w-full always-visible" onClick={() => handleButtonClick('Outils IA')}
          style={{display: 'block', visibility: 'visible', opacity: 1}}>
          <div 
            className="rounded-xl p-1 shadow-xl border-4 border-indigo-300 always-visible"
            style={{
              background: 'linear-gradient(to right, #4f46e5, #7e22ce, #c026d3)',
              boxShadow: '0 0 15px rgba(79, 70, 229, 0.7)',
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              position: 'relative',
              zIndex: 9999
            }}
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
