
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Loader2, Shield, Globe, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Progress } from "@/components/ui/progress";

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
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(true);
  const [proxyTested, setProxyTested] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [proxyTestResults, setProxyTestResults] = useState<any[]>([]);
  
  // Vérifier si le proxy est déjà activé au chargement
  useEffect(() => {
    // Toujours activer le proxy au chargement
    FirecrawlService.enableProxy();
    setProxyEnabled(true);
    
    console.log("SeoAnalysisForm props:", { 
      url, 
      isLoading, 
      showCorsWarning, 
      analyzeSite: !!analyzeSite, 
      error, 
      handleActivateProxy: !!handleActivateProxy,
      proxyEnabled: true
    });
  }, [url, isLoading, showCorsWarning, analyzeSite, error, handleActivateProxy]);

  // Effect to update progress during loading
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15;
          return Math.min(prev + increment, 90);
        });
      }, 1000);
    } else {
      setProgress(100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }
    
    // S'assurer que l'URL est bien formatée avant l'analyse
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl); // Mettre à jour l'URL avec le protocole
    }
    
    // Activer le proxy avant l'analyse
    FirecrawlService.enableProxy();
    setProxyEnabled(true);
    
    toast.info("Lancement de l'analyse...", {
      description: "Préparation de l'analyse du site " + formattedUrl
    });
    
    console.log("Déclenchement de l'analyse pour:", formattedUrl);
    
    // Lancer l'analyse immédiatement
    analyzeSite();
  };

  const handleProxyClick = () => {
    // Appeler la fonction fournie par le parent pour activer le proxy
    FirecrawlService.enableProxy();
    setProxyEnabled(true);
    
    // Si le parent a fourni une fonction, l'appeler aussi
    if (handleActivateProxy) {
      handleActivateProxy();
    }
    
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes"
    });
    
    // Tester la connexion aux proxies
    testProxyConnection();
  };

  const testProxyConnection = async () => {    
    toast.loading("Test des proxies en cours...");
    setProxyTested(true);
    setProgress(0);
    
    try {
      // Démarre la progression
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 300);
      
      const results = await FirecrawlService.testProxyConnectivity();
      clearInterval(interval);
      setProgress(100);
      setProxyTestResults(results);
      
      const workingProxies = results.filter(r => r.working);
      if (workingProxies.length > 0) {
        toast.success(`${workingProxies.length} proxy(s) fonctionnels trouvés`, { 
          description: `Le meilleur proxy a une latence de ${workingProxies[0].latency}ms`
        });
      } else {
        toast.error("Aucun proxy ne fonctionne actuellement", {
          description: "Veuillez réessayer plus tard ou entrer une URL différente"
        });
      }
    } catch (error) {
      toast.error("Erreur lors du test des proxies", {
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      setProgress(100);
    }
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
        <div className="flex gap-2">
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
          
          <Button
            type="button"
            onClick={testProxyConnection}
            variant="outline"
            size="sm"
            className="border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Tester les proxies
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="url"
            placeholder="https://exemple.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-10"
          />
        </div>
        <Button 
          type="submit"
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

      {isLoading && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Analyse en cours...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <div className="flex gap-2">
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
              <Button 
                variant="outline" 
                onClick={testProxyConnection}
                type="button"
                size="sm"
                className="ml-2 bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tester les proxies
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {showCorsWarning && (
        <div className="mt-4 bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Erreur d'accès détectée
          </h3>
          <p className="text-yellow-700 mb-3">
            Les restrictions de sécurité du navigateur empêchent l'accès au site. 
            Vérifiez que l'URL est correcte et que le site est accessible. 
            Vous pouvez essayer d'utiliser un autre proxy.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={handleProxyClick}
              type="button"
              className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
            >
              <Shield className="mr-2 h-4 w-4" />
              Réactiver le proxy CORS
            </Button>
            <Button 
              variant="outline" 
              onClick={testProxyConnection}
              type="button"
              className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Tester les proxies
            </Button>
          </div>
        </div>
      )}
      
      {proxyTestResults.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100">
          <h4 className="font-medium text-gray-700 mb-2">Résultats des tests de proxies</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {proxyTestResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-md flex justify-between ${
                  result.working ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                }`}
              >
                <span className={`text-xs font-mono ${result.working ? 'text-green-700' : 'text-red-700'}`}>
                  {result.proxy.substring(0, 30)}...
                </span>
                <span className={`text-xs ${result.working ? 'text-green-700' : 'text-red-700'}`}>
                  {result.working ? `${result.latency}ms` : 'Échec'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && !showCorsWarning && proxyTested && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100 flex items-center">
          <p className="text-blue-700">
            Test des proxies terminé. Vous pouvez maintenant tenter d'analyser votre site.
          </p>
        </div>
      )}
    </form>
  );
};

export default SeoAnalysisForm;
