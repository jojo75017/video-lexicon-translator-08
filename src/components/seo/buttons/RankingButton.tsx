
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChartLine } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RankingTracker from "@/components/seo/RankingTracker";

export const RankingButton = () => {
  const handleRankingClick = () => {
    return 'https://example.com';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-purple-50"
          onClick={handleRankingClick}
        >
          <ChartLine className="h-6 w-6 text-purple-600" />
          <span className="text-xs">Suivre les classements</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Suivi des classements SEO</DialogTitle>
        </DialogHeader>
        <RankingTracker url={handleRankingClick()} />
      </DialogContent>
    </Dialog>
  );
};
