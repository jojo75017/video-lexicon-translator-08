
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Globe, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { FirecrawlService } from '@/utils/FirecrawlService';

interface CrawlFormProps {
  onSubmit?: (url: string) => void;
  isLoading?: boolean;
  progress?: number;
  onProgressUpdate?: (progress: number) => void;
}

export const CrawlForm: React.FC<CrawlFormProps> = ({ 
  onSubmit = async (url: string) => {
    try {
      toast.info("Analyse en cours", {
        description: `Analyse de ${url} en cours...`
      });
      
      const result = await FirecrawlService.crawlWebsite(url);
      
      if (result.success) {
        toast.success("Analyse terminée", {
          description: "Les données ont été récupérées avec succès"
        });
      } else {
        toast.error("Erreur d'analyse", {
          description: result.error || "Impossible d'analyser le site"
        });
      }
    } catch (error) {
      toast.error("Erreur", {
        description: "Une erreur s'est produite lors de l'analyse"
      });
    }
  }, 
  isLoading = false, 
  progress = 0,
  onProgressUpdate
}) => {
  const [url, setUrl] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);

  const loading = isLoading || internalLoading;
  const currentProgress = progress || internalProgress;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;
    
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    
    // Si nous utilisons la progression interne, simuler une progression
    if (!isLoading && !onProgressUpdate) {
      setInternalLoading(true);
      
      // Simuler une progression
      const interval = setInterval(() => {
        setInternalProgress(prev => {
          const newProgress = Math.min(prev + 10, 95);
          return newProgress;
        });
      }, 300);
      
      try {
        await onSubmit(formattedUrl);
        // Compléter la progression
        clearInterval(interval);
        setInternalProgress(100);
        
        // Réinitialiser après un délai
        setTimeout(() => {
          setInternalLoading(false);
          setInternalProgress(0);
        }, 1000);
      } catch (error) {
        clearInterval(interval);
        setInternalLoading(false);
        setInternalProgress(0);
      }
    } else {
      // Utiliser le comportement fourni par le parent
      await onSubmit(formattedUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Entrez l'URL du site à analyser"
            className="pl-10"
            disabled={loading}
            required
          />
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button 
          type="submit" 
          disabled={loading || !url}
          className="min-w-[200px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Analyser le site
            </>
          )}
        </Button>
      </div>
      
      {loading && (
        <div className="space-y-2">
          <Progress value={currentProgress} />
          <p className="text-sm text-center text-gray-500">
            {currentProgress < 100 
              ? `Analyse en cours... ${currentProgress}%` 
              : "Finalisation de l'analyse..."}
          </p>
        </div>
      )}
    </form>
  );
};
