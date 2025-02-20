
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const UrlInput = ({ url, setUrl, onAnalyze, isLoading }: UrlInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  const handleAnalyze = () => {
    if (!url) {
      toast.error("Veuillez entrer une URL");
      return;
    }
    
    try {
      new URL(url);
      toast.info("Début de l'analyse...", {
        description: "Cette opération peut prendre quelques instants"
      });
      onAnalyze();
    } catch {
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label htmlFor="url" className="text-lg font-medium">URL du site</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="url"
            placeholder="https://exemple.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            className="pl-10"
          />
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button 
          type="submit"
          disabled={isLoading}
          className="min-w-[120px] relative"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Analyser
            </>
          )}
        </Button>
      </div>
      {isLoading && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Analyse en cours, veuillez patienter...
        </div>
      )}
    </form>
  );
};

export default UrlInput;
