
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch, FileText, LineChart, Search, ZapIcon } from 'lucide-react';

const SeoActionButtons = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Gros bouton animé ultra-visible en haut */}
      <Link to="/outils-seo" className="block w-full">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-xl p-1 shadow-xl transform hover:scale-110 hover:shadow-2xl transition-all duration-300">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center">
            <div className="absolute inset-0 bg-grid-white/10 rounded-xl opacity-20"></div>
            <div className="relative z-10 flex flex-col items-center animate-pulse">
              <ZapIcon className="h-12 w-12 text-white mb-3 animate-bounce" />
              <h2 className="text-2xl md:text-3xl font-black text-white text-center">
                BOÎTE À OUTILS SEO
              </h2>
              <p className="text-white/90 mt-2 text-center">
                Cliquez ici pour accéder aux outils SEO avancés
              </p>
              <Button className="mt-4 bg-white/30 hover:bg-white/50 text-white font-bold px-6 py-2 shadow-lg border border-white/20">
                ACCÉDER MAINTENANT
              </Button>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Autres boutons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Link to="/seo">
          <Button variant="outline" className="w-full flex gap-2 items-center justify-start h-12">
            <Search className="h-5 w-5 text-primary" />
            <span>Analyser un site web</span>
          </Button>
        </Link>
        <Link to="/performance">
          <Button variant="outline" className="w-full flex gap-2 items-center justify-start h-12">
            <LineChart className="h-5 w-5 text-orange-500" />
            <span>Analyser les performances</span>
          </Button>
        </Link>
        <Link to="/analytics" className="hidden lg:block">
          <Button variant="outline" className="w-full flex gap-2 items-center justify-start h-12">
            <FileSearch className="h-5 w-5 text-primary" />
            <span>Afficher les rapports</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SeoActionButtons;
