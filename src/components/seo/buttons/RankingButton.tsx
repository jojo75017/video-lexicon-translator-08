
import React from 'react';
import { Button } from "@/components/ui/button";
import { LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export const RankingButton = () => {
  const navigate = useNavigate();
  
  const handleNavigateToRankings = () => {
    // Ajout de logs de débogage supplémentaires
    console.log("Bouton de suivi des positions cliqué");
    try {
      // Navigation vers la page de tracking avec chemin absolu
      console.log("Navigation vers /tracking");
      navigate('/tracking');
      toast.success('Navigation vers le suivi des positions');
    } catch (error) {
      console.error("Erreur lors de la navigation:", error);
      toast.error('Erreur de navigation');
    }
  };

  return (
    <Button
      variant="purple"
      className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-purple-600"
      onClick={handleNavigateToRankings}
      type="button"
    >
      <LineChart className="h-6 w-6 text-white" />
      <span className="text-xs">Suivre les classements</span>
    </Button>
  );
};
