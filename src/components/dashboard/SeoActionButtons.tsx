
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
    toast.success("Navigation vers l'analyse des liens internes", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleKeywordMetaClick = () => {
    console.log("Clicking keyword-meta button");
    navigate('/keyword-meta');
    toast.success("Navigation vers les title & meta", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleKeywordGeneratorClick = () => {
    console.log("Clicking keyword generator button");
    navigate('/keyword-generator');
    toast.success("Navigation vers le générateur de mots-clés", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleSeoClick = () => {
    console.log("Clicking SEO button");
    navigate('/seo');
    toast.success("Navigation vers l'analyse SEO", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handlePerformanceClick = () => {
    console.log("Clicking performance button");
    navigate('/performance');
    toast.success("Navigation vers l'analyse de performance", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  const handleTrackingClick = () => {
    console.log("Clicking tracking button");
    navigate('/tracking');
    toast.success("Navigation vers le suivi des positions", {
      description: "Chargement de la page...",
      duration: 1500
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 animate-fade-in">
      <Button 
        className="w-full h-[100px] flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        onClick={handleKeywordMetaClick}
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
          border: "none"
        }}
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative z-10 flex flex-col items-center">
          <FileText className="h-8 w-8 text-white mb-2 drop-shadow-md" />
          <span className="text-base font-medium text-white drop-shadow-md">Title & Meta</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
      </Button>
      
      <Button 
        className="w-full h-[100px] flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        onClick={handleKeywordGeneratorClick}
        style={{
          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          border: "none"
        }}
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Search className="h-8 w-8 text-white mb-2 drop-shadow-md" />
          <span className="text-base font-medium text-white drop-shadow-md">Générateur de mots-clés</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
      </Button>
      
      <Button 
        className="w-full h-[100px] flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        onClick={handleInternalLinkClick}
        style={{
          background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
          border: "none"
        }}
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Network className="h-8 w-8 text-white mb-2 drop-shadow-md" />
          <span className="text-base font-medium text-white drop-shadow-md">Liens internes</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
      </Button>

      <Button 
        className="w-full h-[100px] flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        onClick={handleSeoClick}
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          border: "none"
        }}
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative z-10 flex flex-col items-center">
          <BarChart className="h-8 w-8 text-white mb-2 drop-shadow-md" />
          <span className="text-base font-medium text-white drop-shadow-md">Analyse SEO</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
      </Button>

      <Button 
        className="w-full h-[100px] flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        onClick={handlePerformanceClick}
        style={{
          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
          border: "none"
        }}
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Gauge className="h-8 w-8 text-white mb-2 drop-shadow-md" />
          <span className="text-base font-medium text-white drop-shadow-md">Performance</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
      </Button>
      
      <Button 
        className="w-full h-[100px] flex flex-col items-center justify-center relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
        onClick={handleTrackingClick}
        style={{
          background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
          border: "none"
        }}
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
        <div className="relative z-10 flex flex-col items-center">
          <BarChart className="h-8 w-8 text-white mb-2 drop-shadow-md" />
          <span className="text-base font-medium text-white drop-shadow-md">Suivi des positions</span>
        </div>
        <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-white/10 blur-xl"></div>
      </Button>
    </div>
  );
};

export default SeoActionButtons;
