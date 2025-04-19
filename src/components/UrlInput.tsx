
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Globe, Search, AlertTriangle, ExternalLink, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import SiteAnalysisService from '@/utils/siteAnalysisUtils';
import { FirecrawlService } from '@/utils/FirecrawlService';

interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  showCorsWarning?: boolean;
  handleActivateProxy?: () => void;
}

const UrlInput = ({ 
  url, 
  setUrl, 
  onAnalyze, 
  isLoading, 
  showCorsWarning = false, 
  handleActivateProxy 
}: UrlInputProps) => {
  const [proxyEnabled, setProxyEnabled] = useState(false);

  // Vérifier si le proxy est déjà activé au chargement
  useEffect(() => {
    setProxyEnabled(FirecrawlService.isProxyEnabled());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Veuillez entrer une URL");
      return;
    }
    
    try {
      // Vérifie si l'URL est valide
      new URL(url.startsWith('http') ? url : `https://${url}`);
      console.log("URL is valid, triggering analysis:", url);
      
      // Notification de démarrage
      toast.success("Analyse démarrée", {
        description: "Patientez pendant l'analyse..."
      });
      
      // Appel explicite de la fonction onAnalyze
      onAnalyze();
    } catch (error) {
      console.error("Invalid URL:", url, error);
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)"
      });
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleProxyDemoClick = () => {
    console.log("Opening CORS demo page");
    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
    toast.info("Redirection vers le service de démo CORS", {
      description: "Activez le service de démo, puis revenez ici pour continuer votre analyse"
    });
  };

  const handleActivateProxyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Activating proxy");
    
    // Activation du proxy dans FirecrawlService
    FirecrawlService.enableProxy();
    setProxyEnabled(true);
    
    // Activation dans SiteAnalysisService si disponible
    if (SiteAnalysisService && typeof SiteAnalysisService.enableProxy === 'function') {
      SiteAnalysisService.enableProxy();
    }
    
    // Appel du handler fourni par le parent si disponible
    if (handleActivateProxy) {
      handleActivateProxy();
    }
    
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Analyse SEO</h2>
        <p className="text-gray-600">Entrez l'URL d'un site web pour commencer l'analyse SEO complète</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="url" className="text-lg font-medium">URL du site</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="url"
              placeholder="https://exemple.com"
              value={url}
              onChange={handleUrlChange}
              disabled={isLoading}
              className="pl-10"
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button 
            type="submit"
            disabled={isLoading || !url}
            className="min-w-[140px] relative bg-blue-600 hover:bg-blue-700"
            variant="default"
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
      
      {/* Bouton pour activer le proxy CORS (toujours visible) */}
      <div className="flex justify-between items-center mt-4 bg-amber-50 p-3 rounded-md border border-amber-100">
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-3 text-amber-600" />
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
          onClick={handleActivateProxyClick}
          size="sm"
          variant={proxyEnabled ? "outline" : "default"}
          className={proxyEnabled 
            ? "border-green-200 text-green-800 hover:bg-green-100" 
            : "bg-amber-600 hover:bg-amber-700 text-white"}
          type="button"
        >
          {proxyEnabled ? "Proxy Activé ✓" : "Activer le Proxy"}
        </Button>
      </div>
      
      {showCorsWarning && (
        <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md border border-amber-100 flex items-start">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Erreur CORS détectée</p>
            <p className="mb-2">Pour analyser des sites externes, vous devez activer le proxy CORS.</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleActivateProxyClick}
                size="sm"
                variant="outline"
                className="border-amber-200 text-amber-800 hover:bg-amber-100"
                type="button"
              >
                Activer le proxy
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleProxyDemoClick();
                }}
                size="sm"
                variant="outline"
                className="border-blue-200 text-blue-800 hover:bg-blue-100"
                type="button"
              >
                <ExternalLink className="mr-1.5 h-3 w-3" />
                Activer démo CORS
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {isLoading && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100 animate-pulse flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-500" />
          Analyse en cours, veuillez patienter...
        </div>
      )}
      
      {!isLoading && !url && (
        <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-sm text-amber-700">
          Entrez l'URL d'un site web pour commencer l'analyse SEO et voir les résultats détaillés
        </div>
      )}
      
      {!isLoading && url && (
        <div className="bg-green-50 p-3 rounded-md border border-green-100 text-sm text-green-700">
          Une fois l'analyse lancée, utilisez les onglets en haut pour explorer les différentes analyses SEO
        </div>
      )}
    </form>
  );
};

export default UrlInput;
