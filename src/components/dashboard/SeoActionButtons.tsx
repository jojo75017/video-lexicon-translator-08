
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      <Button 
        variant="outline" 
        className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2"
        onClick={handleKeywordMetaClick}
      >
        <FileText className="h-5 w-5 text-blue-600" />
        <span className="text-sm">Title & Meta</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2"
        onClick={handleKeywordGeneratorClick}
      >
        <Search className="h-5 w-5 text-green-600" />
        <span className="text-sm">Générateur de mots-clés</span>
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full h-[70px] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 gap-2"
        onClick={handleInternalLinkClick}
      >
        <Network className="h-5 w-5 text-purple-600" />
        <span className="text-sm">Liens internes</span>
      </Button>
    </div>
  );
};

export default SeoActionButtons;
