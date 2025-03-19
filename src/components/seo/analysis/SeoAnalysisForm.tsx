
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Globe, Shield, Rocket, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <Card className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
        <h3 className="font-semibold text-gray-800">Analyser un site web</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Entrez l'URL du site à analyser (ex: https://exemple.com)"
              className="pl-10 flex-1 h-11 border-gray-300 focus:border-blue-500"
              disabled={isLoading}
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !url}
              className="h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-colors disabled:bg-blue-300 shadow"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Analyser
                </>
              )}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 border-gray-300 hover:bg-gray-50"
                    onClick={() => window.open('https://developers.google.com/search/docs/fundamentals/seo-starter-guide', '_blank')}
                  >
                    <ExternalLink className="h-5 w-5 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Guide SEO Google</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </form>
      
      {!url && !isLoading && (
        <div className="mt-3 text-gray-700 bg-blue-50 p-4 rounded-md border border-blue-100 flex items-start">
          <Shield className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Commencez votre analyse SEO</p>
            <p className="text-sm text-blue-700">
              Entrez l'URL complète d'un site web (avec https://) pour obtenir une analyse SEO détaillée, 
              des recommandations d'optimisation et des statistiques de performance.
            </p>
          </div>
        </div>
      )}
      
      {showCorsWarning && (
        <div className="mt-3 text-amber-700 bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Problème d'accès CORS détecté</p>
            <p className="text-sm mb-2">
              Pour analyser des sites externes, vous devez activer le proxy CORS. 
              Cela permet d'accéder en toute sécurité aux données du site.
            </p>
            <Button
              onClick={handleActivateProxy}
              variant="outline"
              size="sm"
              className="text-amber-700 border-amber-300 bg-amber-100 hover:bg-amber-200"
            >
              <Shield className="mr-1.5 h-4 w-4" />
              Activer le proxy
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-3 text-red-700 bg-red-50 p-4 rounded-md border border-red-200 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Erreur d'analyse</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SeoAnalysisForm;
