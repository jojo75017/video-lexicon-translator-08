
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Globe } from "lucide-react";

interface IndexabilityFormProps {
  url: string;
  isAnalyzing: boolean;
  corsError: boolean;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onOpenCorsDemo: () => void;
}

export const IndexabilityForm: React.FC<IndexabilityFormProps> = ({
  url,
  isAnalyzing,
  corsError,
  onUrlChange,
  onSubmit,
  onCancel,
  onOpenCorsDemo
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Alert className="mb-4 bg-pink-50 border-pink-200 text-pink-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Vérifiez si votre site est correctement indexable par les moteurs de recherche.
        </AlertDescription>
      </Alert>
      
      {corsError && (
        <Alert className="mb-4 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertTitle className="text-amber-800">Activation CORS requise</AlertTitle>
          <AlertDescription className="text-amber-700">
            <p className="mb-2">
              Pour analyser des sites externes, vous devez activer temporairement le proxy CORS.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 mb-2"
              onClick={onOpenCorsDemo}
            >
              <Globe className="mr-2 h-4 w-4" />
              Activer CORS Demo
            </Button>
            <p className="text-xs">
              Sur la page qui s'ouvrira, cliquez sur "Request temporary access to the demo server", 
              puis revenez et essayez à nouveau.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL du site
          </label>
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={onUrlChange}
            className="w-full"
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="mr-2"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isAnalyzing}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
          </Button>
        </div>
      </div>
    </form>
  );
};
