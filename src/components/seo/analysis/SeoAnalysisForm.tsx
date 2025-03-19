
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Loader2, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface SeoAnalysisFormProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
}

const SeoAnalysisForm = ({
  url,
  setUrl,
  isLoading,
  showCorsWarning,
  analyzeSite,
  error,
  handleActivateProxy
}: SeoAnalysisFormProps) => {
  
  // Debug props
  useEffect(() => {
    console.log("SeoAnalysisForm props:", { 
      url, 
      isLoading, 
      showCorsWarning, 
      analyzeSite: !!analyzeSite, 
      error, 
      handleActivateProxy: !!handleActivateProxy 
    });
  }, [url, isLoading, showCorsWarning, analyzeSite, error, handleActivateProxy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("SeoAnalysisForm submit");
    analyzeSite();
  };

  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Analyze button clicked manually");
    analyzeSite();
  };

  const handleProxyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Proxy button clicked manually");
    handleActivateProxy();
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2 flex items-center">
          <Search className="mr-2 h-5 w-5 text-indigo-600" />
          Analyser un site web
        </h2>
        <p className="text-gray-600">
          Entrez l'URL d'un site web pour obtenir une analyse SEO complète
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="url"
            placeholder="https://exemple.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          type="button"
          onClick={handleAnalyzeClick}
          disabled={isLoading || !url}
          className="whitespace-nowrap"
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

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showCorsWarning && (
        <div className="mt-4 bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Erreur d'accès CORS détectée
          </h3>
          <p className="text-yellow-700 mb-3">
            Les restrictions de sécurité du navigateur empêchent l'accès au site. 
            Activez notre proxy CORS pour contourner cette limitation et continuer l'analyse.
          </p>
          <Button 
            variant="outline" 
            onClick={handleProxyClick}
            type="button"
            className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
          >
            <Shield className="mr-2 h-4 w-4" />
            Activer le proxy CORS
          </Button>
        </div>
      )}
      
      {isLoading && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-500" />
          <span className="text-blue-700">Analyse en cours, veuillez patienter...</span>
        </div>
      )}
    </form>
  );
};

export default SeoAnalysisForm;
