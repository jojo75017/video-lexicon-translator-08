
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Link2, BarChart, FileText, Gauge, Network } from "lucide-react";
import { Button } from "@/components/ui/button";

const SeoActionButtons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Link to="/seo">
        <Button variant="outline" className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2">
          <Search className="h-5 w-5 text-indigo-600" />
          <span className="text-sm">Analyse SEO</span>
        </Button>
      </Link>
      
      <Link to="/internal-linking">
        <Button variant="outline" className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2">
          <Network className="h-5 w-5 text-blue-600" />
          <span className="text-sm">Liens internes</span>
        </Button>
      </Link>
      
      <Link to="/keywords">
        <Button variant="outline" className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          <span className="text-sm">Mots-clés</span>
        </Button>
      </Link>
      
      <Link to="/performance">
        <Button variant="outline" className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2">
          <Gauge className="h-5 w-5 text-amber-600" />
          <span className="text-sm">Performance</span>
        </Button>
      </Link>
      
      <Link to="/tracking">
        <Button variant="outline" className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2">
          <BarChart className="h-5 w-5 text-purple-600" />
          <span className="text-sm">Suivi des positions</span>
        </Button>
      </Link>
    </div>
  );
};

export default SeoActionButtons;
