
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileSearch, FileText, LineChart, Search } from 'lucide-react';

const SeoActionButtons = () => {
  return (
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
      <Link to="/outils-seo" className="hidden sm:block">
        <Button variant="outline" className="w-full flex gap-2 items-center justify-start h-12">
          <FileText className="h-5 w-5 text-orange-500" />
          <span>Boîte à outils SEO</span>
        </Button>
      </Link>
      <Link to="/analytics" className="hidden lg:block">
        <Button variant="outline" className="w-full flex gap-2 items-center justify-start h-12">
          <FileSearch className="h-5 w-5 text-primary" />
          <span>Afficher les rapports</span>
        </Button>
      </Link>
    </div>
  );
};

export default SeoActionButtons;
