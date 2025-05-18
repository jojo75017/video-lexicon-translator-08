
import React from 'react';
import { Button } from "@/components/ui/button";
import { LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export const RankingButton = () => {
  const navigate = useNavigate();
  
  const handleNavigateToRankings = () => {
    // Navigation directe vers la page de suivi
    console.log("Navigation vers la page de suivi des positions");
    navigate('/tracking');
    toast.success('Navigation vers le suivi des positions');
  };

  return (
    <Button
      variant="outline"
      className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-purple-50"
      onClick={handleNavigateToRankings}
    >
      <LineChart className="h-6 w-6 text-purple-600" />
      <span className="text-xs">Suivre les classements</span>
    </Button>
  );
};
