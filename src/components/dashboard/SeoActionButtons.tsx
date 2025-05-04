
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch, LineChart, Search, ZapIcon } from 'lucide-react';
import { toast } from 'sonner';

const SeoActionButtons = () => {
  const handleButtonClick = (section: string) => {
    toast.success(`Navigation vers ${section}`);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="block w-full mb-4">
        <Link to="/outils-seo" className="block w-full" onClick={() => handleButtonClick('Outils SEO')}>
          <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-md border border-indigo-300">
            <div className="flex items-center justify-center gap-3 mb-3">
              <ZapIcon className="h-8 w-8" />
              <h2 className="text-xl font-bold">Outils SEO</h2>
            </div>
            <p className="text-center text-white/90 mb-4">
              Accédez aux outils SEO avancés et générateurs de contenu IA
            </p>
            <div className="flex justify-center">
              <Button className="bg-white text-indigo-700 hover:bg-gray-100 font-medium">
                ACCÉDER
              </Button>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/seo" className="block" onClick={() => handleButtonClick('Analyse de site')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-start bg-white hover:bg-gray-50 border border-blue-200">
            <Search className="h-4 w-4 text-blue-600" />
            <span>Analyser un site web</span>
          </Button>
        </Link>
        
        <Link to="/performance" className="block" onClick={() => handleButtonClick('Performance')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-start bg-white hover:bg-gray-50 border border-orange-200">
            <LineChart className="h-4 w-4 text-orange-600" />
            <span>Analyser les performances</span>
          </Button>
        </Link>
        
        <Link to="/analytics" className="block">
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-start bg-white hover:bg-gray-50 border border-green-200">
            <FileSearch className="h-4 w-4 text-green-600" />
            <span>Afficher les rapports</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SeoActionButtons;
