
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Loader2, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';

const AnalyseSiteForm = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCorsWarning, setShowCorsWarning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivateProxy = () => {
    FirecrawlService.enableProxy();
    setShowCorsWarning(false);
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes"
    });
  };

  const analyzeSite = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Vérifier si l'URL contient un protocole
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    try {
      // Valider le format de l'URL
      new URL(formattedUrl);
    } catch {
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowCorsWarning(false);

    try {
      console.log('Analyse du site en cours:', formattedUrl);
      const result = await FirecrawlService.crawlWebsite(formattedUrl);
      
      if (result.success) {
        toast.success("Analyse terminée", {
          description: "Consultez les résultats dans l'onglet SEO",
        });
        
        // Rediriger vers la page SEO avec les résultats
        window.location.href = `/seo?url=${encodeURIComponent(formattedUrl)}`;
      } else {
        if (result.error && (result.error.includes('CORS') || result.error.includes('Failed to fetch'))) {
          setShowCorsWarning(true);
          toast.warning("Erreur CORS détectée", {
            description: "Activez le proxy pour analyser ce site",
          });
        } else {
          setError(result.error || "Erreur d'analyse inconnue");
          toast.error("Erreur d'analyse", {
            description: result.error || "Une erreur s'est produite lors de l'analyse",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse du site:', error);
      setError(error instanceof Error ? error.message : "Une erreur s'est produite");
      toast.error("Erreur lors de l'analyse", {
        description: "Impossible d'analyser le site web",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeSite();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
            onKeyPress={(e) => e.key === 'Enter' && analyzeSite()}
            className="w-full"
          />
        </div>
        <Button 
          type="submit"
          disabled={isLoading || !url}
          className="whitespace-nowrap bg-indigo-600 hover:bg-indigo-700"
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
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={handleActivateProxy}
              type="button"
              className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
            >
              <Shield className="mr-2 h-4 w-4" />
              Activer le proxy CORS
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank')}
              type="button"
              className="text-blue-700 hover:bg-blue-50"
            >
              Activer service CORS externe
            </Button>
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

export default AnalyseSiteForm;
