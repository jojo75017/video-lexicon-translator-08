
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Globe, Loader2, Search } from 'lucide-react';

interface CrawlFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
  progress?: number;
}

export const CrawlForm: React.FC<CrawlFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  progress = 0 
}) => {
  const [url, setUrl] = useState('');
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalProgress, setInternalProgress] = useState(0);

  // Utiliser l'état local si aucun état n'est fourni par le parent
  const loading = isLoading || internalLoading;
  const currentProgress = progress || internalProgress;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) return;
    
    // Si l'URL ne commence pas par http:// ou https://, ajouter https://
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    
    // Si une fonction onSubmit est fournie, l'utiliser
    if (onSubmit) {
      onSubmit(formattedUrl);
      return;
    }
    
    // Sinon, utiliser le comportement par défaut (pour rétrocompatibilité)
    setInternalLoading(true);
    setInternalProgress(10);
    
    // Simuler une progression
    const interval = setInterval(() => {
      setInternalProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simuler un délai d'analyse
    setTimeout(() => {
      clearInterval(interval);
      setInternalProgress(100);
      setInternalLoading(false);
      
      // Réinitialiser après quelques secondes
      setTimeout(() => {
        setInternalProgress(0);
      }, 2000);
    }, 3000);
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
