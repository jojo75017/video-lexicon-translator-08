
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Link2, BarChart, FileText, Gauge, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SeoActionButtons = () => {
  const navigate = useNavigate();

  const handleInternalLinkClick = () => {
    console.log("Clicking internal-linking button");
    navigate('/internal-linking');
    toast.info("Navigation vers l'analyse des liens internes", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleKeywordClick = () => {
    console.log("Clicking keyword generator button");
    navigate('/keyword-generator');
    toast.info("Navigation vers le générateur de mots-clés", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <Link to="/seo">
        <Button variant="outline" className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2">
          <Search className="h-5 w-5 text-indigo-600" />
          <span className="text-sm">Analyse SEO</span>
        </Button>
      </Link>
      
      <Button 
        variant="outline" 
        className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2"
        onClick={handleInternalLinkClick}
      >
        <Network className="h-5 w-5 text-blue-600" />
        <span className="text-sm">Liens internes</span>
      </Button>
      
      <Button
        variant="outline"
        className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2"
        onClick={handleKeywordClick}
      >
        <FileText className="h-5 w-5 text-emerald-600" />
        <span className="text-sm">Mots-clés</span>
      </Button>
      
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
