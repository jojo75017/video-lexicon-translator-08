
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LineChart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RankingTracker from "@/components/seo/RankingTracker";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const RankingButton = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isTracking, setIsTracking] = useState(false);
  
  const handleStartTracking = () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL à suivre");
      return;
    }
    
    setIsTracking(true);
    toast.success(`Suivi des positions démarré pour ${url}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-center hover:bg-purple-50"
        >
          <LineChart className="h-6 w-6 text-purple-600" />
          <span className="text-xs">Suivre les classements</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Suivi des classements SEO</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Entrez l'URL de votre site"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleStartTracking} disabled={isTracking}>
            {isTracking ? "Suivi en cours..." : "Démarrer le suivi"}
          </Button>
        </div>
        {isTracking ? (
          <RankingTracker url={url} />
        ) : (
          <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600">
              Entrez une URL et démarrez le suivi pour voir l'évolution de vos positions.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
