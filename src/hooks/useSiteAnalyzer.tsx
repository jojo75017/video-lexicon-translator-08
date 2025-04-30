
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
    // Ensure proxy is enabled by default
    FirecrawlService.enableProxy();
    if (!OpenAIService.isProxyEnabled()) {
      OpenAIService.enableProxy();
    }
    setProxyEnabled(true);
    
    // Load OpenAI API key from localStorage
    const apiKey = localStorage.getItem('openaiKey');
    setOpenaiApiKey(apiKey);
    
    console.log("Initial useSiteAnalyzer hook state:", {
      proxyEnabled: FirecrawlService.isProxyEnabled(),
      openAIKeyExists: !!apiKey
    });
  }, []);

  // Function to activate CORS proxy
  const handleActivateProxy = useCallback(() => {
    // Activate proxy in FirecrawlService
    FirecrawlService.enableProxy();
    OpenAIService.enableProxy();
    
    setProxyEnabled(true);
    setShowCorsWarning(false);
    
    toast.success("Proxy CORS activé", {
      description: "Les requêtes utiliseront désormais un proxy pour contourner les restrictions CORS",
    });
    
    console.log("Proxy activated:", {
      firecrawlProxy: FirecrawlService.isProxyEnabled(),
      openaiProxy: OpenAIService.isProxyEnabled()
    });
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
      
      // Use FirecrawlService for analysis with proxy ALWAYS enabled
      const result = await FirecrawlService.crawlWebsite(formattedUrl, true);
      console.log("Analysis result:", result);
      
      if (result.success && result.data) {
        setSeoAnalysis(result.data);
        toast.success("Analysis completed successfully", {
          description: `${result.data.title || formattedUrl}`
        });
        
        // If OpenAI key exists, try to enhance the analysis
        if (currentApiKey && result.data.textContent) {
          try {
            console.log("Enhancing analysis with OpenAI...");
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
            }
          } catch (aiError) {
            console.error("Error enhancing analysis with OpenAI:", aiError);
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
          setError("CORS error detected. Please check the URL or try with a different proxy.");
          toast.error("CORS error detected", {
            description: "Please check the URL or try with a different proxy",
          });
        } else {
          setError(result.error || "Unknown analysis error");
          toast.error("Analysis error", {
            description: result.error || "An error occurred during analysis",
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
        setError("Connection error - Try another proxy or URL.");
      } else {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
      
      toast.error("Analysis failed", {
        description: "Unable to analyze the website. Please try another proxy or URL.",
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
