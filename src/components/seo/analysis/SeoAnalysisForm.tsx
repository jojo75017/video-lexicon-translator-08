
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Loader2, Shield, Globe } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { OpenAIService } from '@/utils/seo/openaiService';

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
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(false);
  
  // Vérifier si le proxy est déjà activé au chargement
  useEffect(() => {
    setProxyEnabled(OpenAIService.isProxyEnabled());
    
    // Debug props
    console.log("SeoAnalysisForm props:", { 
      url, 
      isLoading, 
      showCorsWarning, 
      analyzeSite: !!analyzeSite, 
      error, 
      handleActivateProxy: !!handleActivateProxy,
      proxyEnabled: OpenAIService.isProxyEnabled()
    });
  }, [url, isLoading, showCorsWarning, analyzeSite, error, handleActivateProxy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("SeoAnalysisForm submit");
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }
    analyzeSite();
  };

  const handleAnalyzeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Analyze button clicked manually");
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }
    analyzeSite();
  };

  const handleProxyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Proxy button clicked manually");
    
    // Activer le proxy dans le service OpenAI
    OpenAIService.enableProxy();
    setProxyEnabled(true);
    
    // Appeler la fonction fournie par le parent
    if (handleActivateProxy) {
      handleActivateProxy();
    }
    
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes"
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!url) {
        toast.error("Veuillez entrer une URL valide");
        return;
      }
      analyzeSite();
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
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

      {/* Bouton pour activer le proxy CORS (toujours visible) */}
      <div className="mb-4 p-3 border border-amber-200 bg-amber-50 rounded-md flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-500" />
          <div>
            <p className="font-medium text-amber-800">Proxy CORS</p>
            <p className="text-sm text-amber-700">
              {proxyEnabled 
                ? "Le proxy CORS est activé. Vous pouvez analyser des sites externes." 
                : "Activez le proxy CORS pour analyser des sites externes."}
            </p>
          </div>
        </div>
        <Button 
          type="button" 
          onClick={handleProxyClick}
          variant={proxyEnabled ? "outline" : "default"}
          size="sm"
          className={proxyEnabled 
            ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100" 
            : "bg-amber-600 hover:bg-amber-700 text-white"}
        >
          <Shield className="mr-2 h-4 w-4" />
          {proxyEnabled ? "Proxy activé ✓" : "Activer le proxy"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="url"
            placeholder="https://exemple.com"
            value={url}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            className="w-full pl-10"
          />
        </div>
        <Button 
          type="button"
          onClick={handleAnalyzeClick}
          disabled={isLoading || !url}
          className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 text-white"
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
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {(error.includes("CORS") || error.includes("connexion") || error.includes("Failed to fetch")) && (
              <Button 
                variant="outline" 
                onClick={handleProxyClick}
                type="button"
                size="sm"
                className="ml-2 bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
              >
                <Shield className="mr-2 h-4 w-4" />
                Activer le proxy
              </Button>
            )}
          </AlertDescription>
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
          <div className="flex flex-wrap gap-2">
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
        </div>
      )}
      
      {error && error.includes("Failed to fetch") && !showCorsWarning && (
        <div className="mt-4 bg-red-50 p-4 rounded-md border border-red-200 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800 mb-2 flex items-center">
              Erreur de connexion
            </h3>
            <p className="text-red-700 mb-3">
              Impossible de se connecter au site demandé. Vérifiez que l'URL est correcte et que le site est accessible.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={handleProxyClick}
                type="button"
                className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
              >
                <Shield className="mr-2 h-4 w-4" />
                Essayer avec le proxy CORS
              </Button>
            </div>
          </div>
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
