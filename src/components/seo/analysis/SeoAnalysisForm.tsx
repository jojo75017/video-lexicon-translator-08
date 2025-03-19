
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Globe } from "lucide-react";

interface SeoAnalysisFormProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
}

const SeoAnalysisForm: React.FC<SeoAnalysisFormProps> = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  analyzeSite,
  error,
  handleActivateProxy
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeSite();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-800 mb-4">Analyser un site web</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Entrez l'URL du site à analyser (ex: https://exemple.com)"
              className="pl-10 flex-1"
              disabled={isLoading}
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !url}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Analyse en cours...' : 'Analyser'}
          </Button>
        </div>
      </form>
      
      {!url && !isLoading && (
        <div className="mt-3 text-gray-700 bg-white p-3 rounded-md border border-gray-200">
          <p className="text-sm">Veuillez entrer l'URL d'un site web pour commencer l'analyse.</p>
        </div>
      )}
      
      {showCorsWarning && (
        <div className="mt-3 text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-200 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          <div>
            <p className="text-sm font-medium">Problème d'accès CORS détecté</p>
            <p className="text-sm">
              Pour analyser des sites externes, vous devez activer le proxy CORS.
              <Button
                onClick={handleActivateProxy}
                variant="link"
                className="text-blue-600 p-0 h-auto font-medium"
              >
                Activer le proxy
              </Button>
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-3 text-red-700 bg-red-50 p-3 rounded-md border border-red-200 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SeoAnalysisForm;
