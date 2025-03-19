
import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from "sonner";
import { analyzeResources, Resource } from '@/utils/resourceAnalyzer';
import { analyzeSeo } from '@/utils/seoAnalyzer';
import { SeoAnalysis } from '@/types/seo';

interface SiteNode {
  name: string;
  path: string;
  children: SiteNode[];
}

interface UseSiteAnalyzerReturn {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  showCorsWarning: boolean;
  seoAnalysis: SeoAnalysis | null;
  setSeoAnalysis: (analysis: SeoAnalysis) => void;
  resources: Resource[];
  siteStructure: { name: string; children: SiteNode[] } | null;
  analyzeSite: () => Promise<void>;
  error: string | null;
}

export const useSiteAnalyzer = (): UseSiteAnalyzerReturn => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCorsWarning, setShowCorsWarning] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysis | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [siteStructure, setSiteStructure] = useState<{ name: string; children: SiteNode[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeSite = useCallback(async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Format d'URL invalide");
      return;
    }

    setIsLoading(true);
    setShowCorsWarning(false);
    setSiteStructure(null);
    setSeoAnalysis(null);
    setResources([]);
    setError(null);
    
    console.log("STARTING SITE ANALYSIS FOR URL:", url);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
      console.log("ANALYSIS TIMEOUT");
    }, 15000); // Réduit à 15 secondes

    try {
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      console.log("FETCHING WITH CORS PROXY:", corsProxy + url);
      
      const response = await axios.get(`${corsProxy}${url}`, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest',
        },
        signal: controller.signal,
        timeout: 15000, // Timeout explicite
      });
      
      if (!response.data) {
        console.error("EMPTY RESPONSE");
        throw new Error("La réponse est vide");
      }
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      
      if (!doc.documentElement) {
        console.error("COULD NOT PARSE HTML");
        throw new Error("Impossible de parser le document HTML");
      }
      
      console.log("HTML PARSED SUCCESSFULLY, document title:", doc.title);
      
      // Analyse SEO
      console.log("STARTING SEO ANALYSIS");
      const seoResults = await analyzeSeo(doc, url);
      console.log("SEO ANALYSIS COMPLETED:", seoResults ? "Success" : "Failed");
      setSeoAnalysis(seoResults);

      // Analyse des ressources en parallèle
      console.log("STARTING RESOURCES ANALYSIS");
      const resourcesResults = await analyzeResources(doc, url);
      console.log("RESOURCES ANALYSIS COMPLETED, found:", resourcesResults.length);
      setResources(resourcesResults);

      // Structure du site améliorée
      console.log("BUILDING SITE STRUCTURE");
      const uniqueUrls = new Set<string>();
      const links = Array.from(doc.querySelectorAll('a'))
        .map(link => ({
          url: link.href,
          text: link.textContent?.trim() || link.getAttribute('title') || link.getAttribute('aria-label') || ''
        }))
        .filter(link => {
          if (!link.url || !link.url.startsWith('http') || uniqueUrls.has(link.url)) {
            return false;
          }
          uniqueUrls.add(link.url);
          return true;
        });

      console.log("LINKS FOUND:", links.length);
      
      const structure = {
        name: "Site Web",
        children: [
          {
            name: "Page d'accueil",
            path: url,
            children: links.map(link => ({
              name: link.text || (new URL(link.url)).pathname,
              path: link.url,
              children: []
            }))
          }
        ]
      };

      setSiteStructure(structure);
      setError(null);
      console.log("ANALYSIS COMPLETE");
      toast.success("Analyse terminée avec succès !");

    } catch (error) {
      console.error('ANALYSIS ERROR:', error);
      
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_CANCELED') {
          setError("L'analyse a été interrompue car elle prenait trop de temps");
          toast.error("Analyse interrompue - délai dépassé");
        } else if (error.response?.status === 403) {
          console.log("CORS ERROR: 403 Forbidden");
          setShowCorsWarning(true);
          setError("Erreur 403: Accès refusé. Activez le proxy CORS pour continuer.");
          toast.warning("Activation du proxy CORS requise");
        } else if (error.code === 'ERR_NETWORK') {
          console.log("NETWORK ERROR");
          setError("Erreur de connexion au proxy CORS");
          toast.error("Erreur de connexion au proxy CORS");
        } else {
          console.log("OTHER AXIOS ERROR:", error.message);
          setError(`Erreur réseau : ${error.message}`);
          toast.error(`Erreur réseau : ${error.message}`);
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite";
        console.log("GENERAL ERROR:", errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
      console.log("ANALYSIS PROCESS COMPLETE");
    }
  }, [url]);

  return {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    setSeoAnalysis,
    resources,
    siteStructure,
    analyzeSite,
    error
  };
};
