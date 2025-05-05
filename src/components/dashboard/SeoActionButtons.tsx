
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch, LineChart, Search, ZapIcon, FileSignature, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';

const SeoActionButtons = () => {
  const handleButtonClick = (section: string) => {
    toast.success(`Navigation vers ${section}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="block w-full mb-4">
        <Link to="/outils-seo" onClick={() => handleButtonClick('Outils SEO')}>
          <Button 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white shadow-md"
            size="lg"
          >
            <ZapIcon className="h-5 w-5 mr-2" />
            <span>Accéder aux outils SEO</span>
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/seo" onClick={() => handleButtonClick('Analyse de site')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-center">
            <Search className="h-4 w-4 text-blue-600" />
            <span>Analyser un site web</span>
          </Button>
        </Link>
        
        <Link to="/structure" onClick={() => handleButtonClick('Structure')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-center">
            <LineChart className="h-4 w-4 text-orange-600" />
            <span>Structure du site</span>
          </Button>
        </Link>
        
        <Link to="/analytics" onClick={() => handleButtonClick('Analytics')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-center">
            <FileSearch className="h-4 w-4 text-green-600" />
            <span>Afficher les rapports</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <Link to="/signature" onClick={() => handleButtonClick('Signature Email')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-center">
            <FileSignature className="h-4 w-4 text-blue-600" />
            <span>Signature Email</span>
          </Button>
        </Link>
        
        <Link to="/pinterest" onClick={() => handleButtonClick('Pinterest')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-center">
            <Image className="h-4 w-4 text-red-600" />
            <span>Images Pinterest</span>
          </Button>
        </Link>
        
        <Link to="/wordcount" onClick={() => handleButtonClick('Mots-clés')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-center">
            <FileText className="h-4 w-4 text-purple-600" />
            <span>Analyse des mots-clés</span>
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 mt-2">
        <Link to="/keyword-meta" onClick={() => handleButtonClick('Titles & Media')}>
          <Button variant="outline" className="w-full h-12 flex gap-2 items-center justify-center">
            <FileText className="h-4 w-4 text-indigo-600" />
            <span>Titles & Meta Descriptions</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SeoActionButtons;
