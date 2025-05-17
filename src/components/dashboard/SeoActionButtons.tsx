
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Network, FileText, Gauge, BarChart } from "lucide-react";
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

  const handleKeywordMetaClick = () => {
    console.log("Clicking keyword-meta button");
    navigate('/keyword-meta');
    toast.info("Navigation vers les title & meta", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleKeywordGeneratorClick = () => {
    console.log("Clicking keyword generator button");
    navigate('/keyword-generator');
    toast.info("Navigation vers le générateur de mots-clés", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleSeoClick = () => {
    console.log("Clicking SEO button");
    navigate('/seo');
    toast.info("Navigation vers l'analyse SEO", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handlePerformanceClick = () => {
    console.log("Clicking performance button");
    navigate('/performance');
    toast.info("Navigation vers l'analyse de performance", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleTrackingClick = () => {
    console.log("Clicking tracking button");
    navigate('/tracking');
    toast.info("Navigation vers le suivi des positions", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 animate-fade-in">
      <Button 
        className="w-full h-[80px] flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all gap-2 transform hover:scale-[1.02] hover:translate-y-[-2px]"
        onClick={handleKeywordMetaClick}
      >
        <FileText className="h-6 w-6 text-white mb-1" />
        <span className="text-sm">Title & Meta</span>
      </Button>
      
      <Button 
        className="w-full h-[80px] flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all gap-2 transform hover:scale-[1.02] hover:translate-y-[-2px]"
        onClick={handleKeywordGeneratorClick}
      >
        <Search className="h-6 w-6 text-white mb-1" />
        <span className="text-sm">Générateur de mots-clés</span>
      </Button>
      
      <Button 
        className="w-full h-[80px] flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all gap-2 transform hover:scale-[1.02] hover:translate-y-[-2px]"
        onClick={handleInternalLinkClick}
      >
        <Network className="h-6 w-6 text-white mb-1" />
        <span className="text-sm">Liens internes</span>
      </Button>

      <Button 
        className="w-full h-[80px] flex flex-col items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all gap-2 transform hover:scale-[1.02] hover:translate-y-[-2px]"
        onClick={handleSeoClick}
      >
        <BarChart className="h-6 w-6 text-white mb-1" />
        <span className="text-sm">Analyse SEO</span>
      </Button>

      <Button 
        className="w-full h-[80px] flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all gap-2 transform hover:scale-[1.02] hover:translate-y-[-2px]"
        onClick={handlePerformanceClick}
      >
        <Gauge className="h-6 w-6 text-white mb-1" />
        <span className="text-sm">Performance</span>
      </Button>
      
      <Button 
        className="w-full h-[80px] flex flex-col items-center justify-center bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-md hover:shadow-lg transition-all gap-2 transform hover:scale-[1.02] hover:translate-y-[-2px]"
        onClick={handleTrackingClick}
      >
        <BarChart className="h-6 w-6 text-white mb-1" />
        <span className="text-sm">Suivi des positions</span>
      </Button>
    </div>
  );
};

export default SeoActionButtons;
