
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { OpenAIService } from '@/utils/seo/openaiService';
import { ProxyService } from '@/utils/seo/proxyService';

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
}

export const useSiteAnalyzer = (): SiteAnalyzerResult => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCorsWarning, setShowCorsWarning] = useState<boolean>(false);
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [resources, setResources] = useState<any>(null);
  const [siteStructure, setSiteStructure] = useState<any>(null);
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(true); // Always set to true by default
  const [openaiApiKey, setOpenaiApiKey] = useState<string | null>(null);

  // Check proxy status and load API key on mount
  useEffect(() => {
    // Ensure all proxies are enabled by default
    FirecrawlService.enableProxy();
    OpenAIService.enableProxy();
    ProxyService.enableProxy();
    setProxyEnabled(true);
    
    // Load OpenAI API key from localStorage
    const apiKey = localStorage.getItem('openaiKey');
    setOpenaiApiKey(apiKey);
    
    console.log("Initial useSiteAnalyzer hook state:", {
      proxyEnabled: true,
      openAIKeyExists: !!apiKey
    });
  }, []);

  // Function to activate CORS proxy
  const handleActivateProxy = useCallback(() => {
    // Activate proxy in all services
    FirecrawlService.enableProxy();
    OpenAIService.enableProxy();
    ProxyService.enableProxy();
    
    setProxyEnabled(true);
    setShowCorsWarning(false);
    
    toast.success("Proxy CORS activé", {
      description: "Les requêtes utiliseront désormais un proxy pour contourner les restrictions CORS",
    });
    
    console.log("All proxies activated");
  }, []);

  // Analyze the site
  const analyzeSite = useCallback(async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Check if URL contains protocol
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
      setUrl(formattedUrl);
    }

    try {
      // Validate URL format
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
    setSeoAnalysis(null); // Reset previous results

    console.log(`Analyzing site: ${formattedUrl}`);
    
    // Force enable proxy before analysis
    FirecrawlService.enableProxy();
    OpenAIService.enableProxy();
    ProxyService.enableProxy();
    setProxyEnabled(true);
    
    // Check for OpenAI API key
    const currentApiKey = localStorage.getItem('openaiKey');
    if (currentApiKey) {
      console.log("OpenAI key found, OpenAI analysis enabled");
      setOpenaiApiKey(currentApiKey);
      // Set key for OpenAI service
      OpenAIService.setApiKey(currentApiKey);
    } else {
      console.log("No OpenAI key found, AI analysis features will be limited");
    }

    try {
      console.log("Starting analysis with FirecrawlService...");
      toast.info(`Analyse de ${formattedUrl}`, {
        description: "Tentative d'extraction du contenu via proxies..."
      });
      
      // Use FirecrawlService for analysis with proxy ALWAYS enabled
      const result = await FirecrawlService.crawlWebsite(formattedUrl, true);
      console.log("Analysis result:", result);
      
      if (result.success && result.data) {
        setSeoAnalysis(result.data);
        toast.success("Analyse terminée avec succès", {
          description: `${result.data.title || formattedUrl}`
        });
        
        // If OpenAI key exists, try to enhance the analysis
        if (currentApiKey && result.data.textContent) {
          try {
            console.log("Enhancing analysis with OpenAI...");
            toast.info("Amélioration avec IA...", {
              description: "Analyse du contenu avec OpenAI en cours..."
            });
            
            const openAIService = new OpenAIService(currentApiKey);
            const enhancedAnalysis = await openAIService.analyzeSeoContent(
              formattedUrl,
              result.data.textContent.substring(0, 4000)
            );
            
            if (enhancedAnalysis) {
              console.log("OpenAI enhancement successful", enhancedAnalysis);
              setSeoAnalysis(prev => ({
                ...prev,
                openAIAnalysis: enhancedAnalysis
              }));
              
              toast.success("Analyse IA complétée", {
                description: "Les données d'analyse ont été enrichies avec OpenAI"
              });
            }
          } catch (aiError) {
            console.error("Error enhancing analysis with OpenAI:", aiError);
            toast.error("Erreur d'analyse IA", {
              description: "L'amélioration avec OpenAI a échoué mais l'analyse de base est disponible"
            });
            // Non-blocking error, continue with basic analysis
          }
        }
      } else {
        if (result.error && (
            result.error.includes('CORS') || 
            result.error.includes('Failed to fetch') ||
            result.error.includes('network') ||
            result.error.includes('connexion')
        )) {
          setShowCorsWarning(true);
          setError("Erreur CORS détectée. Vérifiez l'URL ou essayez avec un autre proxy.");
          toast.error("Erreur CORS détectée", {
            description: "Vérifiez l'URL ou essayez avec un autre proxy",
          });
        } else {
          setError(result.error || "Erreur d'analyse inconnue");
          toast.error("Erreur d'analyse", {
            description: result.error || "Une erreur est survenue pendant l'analyse",
          });
        }
      }
    } catch (error) {
      console.error('Error analyzing site:', error);
      
      // Specific detection of CORS or connection errors
      if (error instanceof Error && (
          error.message.includes('CORS') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('network') ||
          error.message.includes('connexion')
      )) {
        setShowCorsWarning(true);
        setError("Erreur de connexion - Essayez un autre proxy ou URL.");
      } else {
        setError(error instanceof Error ? error.message : "Une erreur est survenue");
      }
      
      toast.error("Analyse échouée", {
        description: "Impossible d'analyser le site web. Veuillez essayer un autre proxy ou URL.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  return {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    analyzeSite,
    error,
    handleActivateProxy,
    proxyEnabled
  };
};

export default useSiteAnalyzer;
