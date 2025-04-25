
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { OpenAIService } from '@/utils/seo/openaiService';

export interface SiteAnalyzerResult {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: any;
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
  proxyEnabled: boolean;
  apiKey: string;
  saveApiKey: (key: string) => void;
  validateApiKey: (key: string) => Promise<boolean>;
}

export const useSiteAnalyzer = (): SiteAnalyzerResult => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCorsWarning, setShowCorsWarning] = useState<boolean>(false);
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [resources, setResources] = useState<any>(null);
  const [siteStructure, setSiteStructure] = useState<any>(null);
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(FirecrawlService.isProxyEnabled());
  const [apiKey, setApiKey] = useState<string>('');

  // Vérifier l'état du proxy et charger la clé API au chargement
  useEffect(() => {
    // Récupérer la clé API stockée
    const storedApiKey = localStorage.getItem('openaiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      console.log("API key loaded from localStorage:", storedApiKey ? "API key found" : "No API key");
    }

    // S'assurer que le proxy est activé par défaut
    if (!FirecrawlService.isProxyEnabled()) {
      FirecrawlService.enableProxy();
    }
    setProxyEnabled(FirecrawlService.isProxyEnabled());
    
    // Log status
    console.log("useSiteAnalyzer - État initial:", {
      proxyEnabled: FirecrawlService.isProxyEnabled(),
      apiKey: storedApiKey ? "API key found" : "No API key"
    });
  }, []);

  // Fonction pour sauvegarder la clé API
  const saveApiKey = useCallback((key: string) => {
    if (!key) return;
    
    console.log("Saving API key to localStorage");
    localStorage.setItem('openaiKey', key);
    setApiKey(key);
    
    toast.success("Clé API sauvegardée", {
      description: "Votre clé API a été sauvegardée localement",
    });
    
    console.log("API key saved to localStorage");
  }, []);

  // Valider la clé API
  const validateApiKey = useCallback(async (key: string) => {
    if (!key) {
      return false;
    }

    try {
      console.log("Validating API key: ", key.substring(0, 5) + "...");
      const openaiService = new OpenAIService(key);
      
      // Enable proxy for API validation
      OpenAIService.enableProxy();
      
      const isValid = await openaiService.validateApiKey();
      
      if (isValid) {
        console.log("API key validation successful");
        saveApiKey(key);
        return true;
      } else {
        console.log("API key validation failed");
        toast.error("Clé API OpenAI invalide", {
          description: "Veuillez vérifier votre clé et réessayer"
        });
        return false;
      }
    } catch (err) {
      console.error("Erreur lors de la validation de la clé API:", err);
      toast.error("Erreur de validation", {
        description: "Impossible de valider la clé API. Vérifiez votre connexion internet."
      });
      return false;
    }
  }, [saveApiKey]);

  // Fonction pour activer le proxy CORS
  const handleActivateProxy = useCallback(() => {
    // Activer proxy dans FirecrawlService
    FirecrawlService.enableProxy();
    OpenAIService.enableProxy();
    
    setProxyEnabled(true);
    setShowCorsWarning(false);
    
    toast.success("Proxy CORS activé", {
      description: "Les requêtes utiliseront désormais un proxy pour contourner les restrictions CORS",
    });
    
    console.log("Proxy activé:", {
      firecrawlProxy: FirecrawlService.isProxyEnabled(),
      openaiProxy: OpenAIService.isProxyEnabled()
    });
  }, []);

  // Analyse le site
  const analyzeSite = useCallback(async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Vérifier si l'URL contient un protocole
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
      setUrl(formattedUrl);
    }

    try {
      // Valider le format de l'URL
      new URL(formattedUrl);
    } catch (error) {
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowCorsWarning(false);

    console.log(`Analyse du site: ${formattedUrl}`);
    
    const currentApiKey = apiKey || localStorage.getItem('openaiKey');
    if (currentApiKey) {
      console.log("Clé OpenAI trouvée, analyse avec OpenAI activée");
    }

    try {
      // Vérifier si le site est externe (pas localhost)
      const isExternalSite = !formattedUrl.includes('localhost') && !formattedUrl.includes('127.0.0.1');
      
      // S'assurer que le proxy est activé pour les sites externes
      if (isExternalSite && !proxyEnabled) {
        console.log("Site externe détecté, activation automatique du proxy");
        handleActivateProxy(); // Activer le proxy
      }
      
      // Utiliser FirecrawlService pour l'analyse avec le proxy activé
      const result = await FirecrawlService.crawlWebsite(formattedUrl, true);
      
      if (result.success && result.data) {
        setSeoAnalysis(result.data);
        toast.success("Analyse terminée avec succès", {
          description: `${result.data.title || formattedUrl}`
        });
      } else {
        if (result.error && (
            result.error.includes('CORS') || 
            result.error.includes('Failed to fetch') ||
            result.error.includes('network') ||
            result.error.includes('connexion')
        )) {
          setShowCorsWarning(true);
          setError("Erreur CORS détectée. Veuillez vérifier l'URL ou réessayer.");
          toast.error("Erreur CORS détectée", {
            description: "Veuillez vérifier l'URL ou réessayer",
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
      
      // Détection spécifique des erreurs CORS ou de connexion
      if (error instanceof Error && (
          error.message.includes('CORS') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('network') ||
          error.message.includes('connexion')
      )) {
        setShowCorsWarning(true);
        setError("Erreur de connexion - Veuillez vérifier l'URL ou réessayer.");
      } else {
        setError(error instanceof Error ? error.message : "Une erreur s'est produite");
      }
      
      toast.error("Échec de l'analyse", {
        description: "Impossible d'analyser le site web. Veuillez vérifier l'URL.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [url, proxyEnabled, handleActivateProxy, apiKey]);

  return {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    analyzeSite,
    error,
    handleActivateProxy,
    proxyEnabled,
    apiKey,
    saveApiKey,
    validateApiKey
  };
};

export default useSiteAnalyzer;
