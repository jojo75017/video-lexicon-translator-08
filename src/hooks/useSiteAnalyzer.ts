
import { useState } from 'react';
import SiteAnalysisService, { AnalysisResult } from '@/utils/siteAnalysisUtils';
import { toast } from 'sonner';
import { OpenAIService } from '@/utils/seo/openaiService';

export interface SiteAnalyzerResult {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: any;
  resources: any;
  siteStructure: any;
  analyzeSite: () => void;
  error: string | null;
  handleActivateProxy: () => void;
  proxyEnabled: boolean;
}

export const useSiteAnalyzer = (): SiteAnalyzerResult => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCorsWarning, setShowCorsWarning] = useState<boolean>(false);
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [resources, setResources] = useState<any>(null);
  const [siteStructure, setSiteStructure] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(true);
  
  const analyzeSite = async () => {
    // Réinitialiser l'état
    setError(null);
    setShowCorsWarning(false);
    setIsLoading(true);
    
    try {
      console.log(`Analyse du site: ${url}`);
      
      // Vérifier si une clé OpenAI est configurée
      const openaiKey = localStorage.getItem('openaiKey');
      const useOpenAI = !!openaiKey;
      
      if (useOpenAI) {
        console.log("Clé OpenAI trouvée, analyse avec OpenAI activée");
      } else {
        console.log("Aucune clé OpenAI trouvée, analyse standard uniquement");
      }
      
      // Analyser le site
      const result: AnalysisResult = await SiteAnalysisService.analyzeSite(url, {
        useOpenAI: useOpenAI
      });
      
      if (result.success && result.data) {
        console.log("Analyse réussie:", result.data);
        setSeoAnalysis(result.data);
        
        // Extraire les ressources
        if (result.data.pageSpeed && result.data.pageSpeed.resources) {
          setResources(result.data.pageSpeed.resources);
        }
        
        // Générer une structure de site simplifiée
        const simpleSiteStructure = {
          name: url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
          children: [
            {
              name: "Page d'accueil",
              url: url,
              children: []
            }
          ]
        };
        
        // Créer des enfants basés sur les liens internes
        if (result.data.links && Array.isArray(result.data.links)) {
          const internalLinks = result.data.links
            .filter((link: any) => !link.isExternal && link.href && !link.href.startsWith('#'))
            .slice(0, 5);
            
          if (internalLinks.length > 0) {
            simpleSiteStructure.children[0].children = internalLinks.map((link: any) => ({
              name: link.text || link.href,
              url: link.href.startsWith('/') ? `${url}${link.href}` : link.href,
              children: []
            }));
          }
        }
        
        setSiteStructure(simpleSiteStructure);
        
        // Si OpenAI est configuré, générer des suggestions de mots-clés supplémentaires
        if (useOpenAI && !result.data.keywordSuggestions?.length && result.data.keywords?.length) {
          try {
            const openaiService = new OpenAIService(openaiKey);
            const mainKeyword = Array.isArray(result.data.keywords) && result.data.keywords.length > 0 
              ? result.data.keywords[0] 
              : result.data.title.split(' ')[0];
              
            console.log("Génération de suggestions pour le mot-clé:", mainKeyword);
            const keywordSuggestions = await openaiService.getKeywordSuggestions(mainKeyword);
            
            // Mettre à jour l'analyse avec les suggestions
            setSeoAnalysis(prev => ({
              ...prev,
              keywordSuggestions
            }));
            
            console.log("Suggestions de mots-clés générées avec OpenAI:", keywordSuggestions);
          } catch (e) {
            console.error("Erreur lors de la génération des suggestions de mots-clés:", e);
          }
        }
      } else {
        console.error("Échec de l'analyse:", result.error);
        setError(result.error || "Une erreur est survenue lors de l'analyse");
        
        // Détecter les erreurs CORS et afficher un avertissement
        if (result.error && result.error.includes('CORS')) {
          setShowCorsWarning(true);
        }
      }
    } catch (e) {
      console.error("Erreur lors de l'analyse:", e);
      setError(e instanceof Error ? e.message : "Une erreur inconnue est survenue");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActivateProxy = () => {
    SiteAnalysisService.enableProxy();
    setProxyEnabled(true);
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes"
    });
  };
  
  return {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    resources,
    siteStructure,
    analyzeSite,
    error,
    handleActivateProxy,
    proxyEnabled
  };
};
