
import React from 'react';
import { ScrollText, BarChart, Search } from 'lucide-react';

const PageHeader = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-lg p-8 shadow-lg mb-8 relative overflow-hidden">
      {/* Blobs décoratifs en arrière-plan */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 opacity-20 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-left mb-4 md:mb-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-md flex items-center">
              <ScrollText className="mr-3 h-8 w-8" />
              Tableau de bord SEO
            </h1>
            <p className="text-lg text-blue-50 max-w-xl">
              Optimisez votre visibilité en ligne avec nos outils d'analyse et d'optimisation professionnels
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2">
              <BarChart className="h-5 w-5 text-white" />
              <span className="text-white font-medium">Analytics</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2">
              <Search className="h-5 w-5 text-white" />
              <span className="text-white font-medium">SEO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
