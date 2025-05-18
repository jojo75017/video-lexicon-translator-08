
import React from 'react';
import { Button } from "@/components/ui/button";
import { LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export const RankingButton = () => {
  const navigate = useNavigate();
  
  const handleNavigateToRankings = () => {
    // Ajout de logs pour déboguer
    console.log("Bouton de suivi des positions cliqué");
    // Navigation explicite avec une URL absolue
    navigate('/tracking');
    toast.success('Navigation vers le suivi des positions');
  };

  return (
    <Button
      variant="purple"
      className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-purple-600"
      onClick={handleNavigateToRankings}
    >
      <LineChart className="h-6 w-6 text-white" />
      <span className="text-xs">Suivre les classements</span>
    </Button>
  );
};
