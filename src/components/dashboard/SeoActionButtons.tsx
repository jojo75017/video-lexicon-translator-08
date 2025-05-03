
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch, FileText, LineChart, Search, ZapIcon } from 'lucide-react';
import { toast } from 'sonner';

const SeoActionButtons = () => {
  const handleButtonClick = (section: string) => {
    toast.success(`Navigation vers ${section}`);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Grand bouton pour les outils SEO en haut - style très visible et stable */}
      <Link to="/outils-seo" className="block w-full always-visible important-button" onClick={() => handleButtonClick('Outils SEO')}>
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 stable-gradient">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
            <div className="relative z-10 flex flex-col items-center">
              <ZapIcon className="h-16 w-16 text-white mb-3" />
              <h2 className="text-2xl md:text-3xl font-black text-white text-center high-contrast">
                BOÎTE À OUTILS SEO
              </h2>
              <p className="text-white/90 mt-2 text-center">
                Cliquez ici pour accéder aux outils SEO avancés
              </p>
              <Button className="mt-4 bg-white/30 hover:bg-white/50 text-white font-bold px-8 py-3 shadow-lg border border-white/20 text-lg important-button">
                ACCÉDER MAINTENANT
              </Button>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Boutons d'actions SEO - avec couleurs vives et stables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/seo" className="block always-visible" onClick={() => handleButtonClick('Analyse de site')}>
          <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
            bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
            text-white border-blue-400 text-lg shadow-md hover:shadow-xl transition-all stable-gradient important-button">
            <Search className="h-6 w-6 text-white" />
            <span>Analyser un site web</span>
          </Button>
        </Link>
        
        <Link to="/performance" className="block always-visible" onClick={() => handleButtonClick('Performance')}>
          <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
            bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 
            text-white border-orange-400 text-lg shadow-md hover:shadow-xl transition-all stable-gradient important-button">
            <LineChart className="h-6 w-6 text-white" />
            <span>Analyser les performances</span>
          </Button>
        </Link>
        
        <Link to="/analytics" className="block always-visible lg:block">
          <Button variant="outline" className="w-full h-16 flex gap-2 items-center justify-start 
            bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
            text-white border-green-400 text-lg shadow-md hover:shadow-xl transition-all stable-gradient important-button">
            <FileSearch className="h-6 w-6 text-white" />
            <span>Afficher les rapports</span>
          </Button>
        </Link>
      </div>

      {/* Nouveau bouton pour les outils IA - très visible et stable */}
      <Link to="/outils-seo" className="block w-full mt-2 always-visible important-button" onClick={() => handleButtonClick('Outils IA')}>
        <div className="bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 rounded-xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 stable-gradient">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 flex flex-col items-center">
            <div className="relative z-10 flex flex-col items-center">
              <FileText className="h-12 w-12 text-white mb-2" />
              <h2 className="text-xl md:text-2xl font-black text-white text-center high-contrast">
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
  );
};

export default SeoActionButtons;
