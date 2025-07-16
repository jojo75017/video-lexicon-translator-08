
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CrawlInputProps {
  url: string;
  isLoading: boolean;
  progress: number;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CrawlInput = ({ url, isLoading, progress, onUrlChange, onSubmit }: CrawlInputProps) => {
  // Debug info
  useEffect(() => {
    console.log("CrawlInput props:", { url, isLoading, progress, onSubmit: !!onSubmit });
  }, [url, isLoading, progress, onSubmit]);

  // Gérer la soumission du formulaire
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Empêcher la soumission par défaut du formulaire
    
    // Nettoyer l'URL (supprimer les espaces)
    const cleanUrl = url ? url.trim() : '';
    
    // Vérifier si l'URL est vide
    if (!cleanUrl) {
      toast.error("Veuillez saisir une URL");
      return;
    }
    
    // Si l'URL est valide, appeler la fonction onSubmit du parent
    console.log("CrawlInput soumet l'URL:", cleanUrl);
    onSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div>
        <label htmlFor="url" className="block text-sm font-medium mb-1">
          URL du site
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="url"
            value={url}
            onChange={onUrlChange}
            className="flex-1"
            placeholder="exemple.com"
            required
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="sm:w-auto w-full bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
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
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 text-center">
            Analyse en cours... {progress}%
          </p>
        </div>
      )}
    </form>
  );
};
