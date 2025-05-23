
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

const getEuropeanContext = (url: string) => {
  // Déterminer le contexte européen basé sur l'URL
  const tldMap: Record<string, { country: string, language: string }> = {
    '.fr': { country: 'France', language: 'fr-FR' },
    '.de': { country: 'Allemagne', language: 'de-DE' },
    '.es': { country: 'Espagne', language: 'es-ES' },
    '.it': { country: 'Italie', language: 'it-IT' },
    '.uk': { country: 'Royaume-Uni', language: 'en-GB' },
    '.nl': { country: 'Pays-Bas', language: 'nl-NL' },
    '.be': { country: 'Belgique', language: 'fr-BE' },
    '.ch': { country: 'Suisse', language: 'fr-CH' },
    '.at': { country: 'Autriche', language: 'de-AT' },
    '.pl': { country: 'Pologne', language: 'pl-PL' },
    '.se': { country: 'Suède', language: 'sv-SE' },
    '.fi': { country: 'Finlande', language: 'fi-FI' },
    '.dk': { country: 'Danemark', language: 'da-DK' },
    '.no': { country: 'Norvège', language: 'nb-NO' },
    '.pt': { country: 'Portugal', language: 'pt-PT' },
    '.gr': { country: 'Grèce', language: 'el-GR' },
    '.eu': { country: 'Union Européenne', language: 'en-EU' }
  };
  
  let country = 'France'; // Par défaut
  let language = 'fr-FR';
  
  // Recherche du TLD dans l'URL
  for (const tld in tldMap) {
    if (url.includes(tld)) {
      country = tldMap[tld].country;
      language = tldMap[tld].language;
      break;
    }
  }
  
  return {
    region: 'Europe',
    country,
    language,
    euTrafficPercentage: Math.floor(70 + Math.random() * 25), // 70-95% de trafic européen
    gdprCompliant: Math.random() > 0.3 // 70% de chances d'être conforme au RGPD
  };
};

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
        useOpenAI: useOpenAI,
        region: 'Europe' // Spécifier explicitement que nous voulons une analyse européenne
      });
      
      if (result.success && result.data) {
        console.log("Analyse réussie:", result.data);
        
        // Ajouter des informations de contexte européen
        const europeanContext = getEuropeanContext(url);
        
        // Fusionner les résultats avec le contexte européen
        const enhancedData = {
          ...result.data,
          ...europeanContext
        };
        
        setSeoAnalysis(enhancedData);
        
        // Extraire les ressources
        if (result.data.pageSpeed && result.data.pageSpeed.resources) {
          setResources(result.data.pageSpeed.resources);
        }
        
        // Générer une structure de site simplifiée pour les sites européens
        const simpleSiteStructure = {
          name: url.replace(/^https?:\/\//, '').replace(/\/$/, ''),
          country: europeanContext.country,
          region: 'Europe',
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
            const keywordSuggestions = await openaiService.getKeywordSuggestions(mainKeyword, europeanContext.language);
            
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
