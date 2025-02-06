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
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // Réduit à 15 secondes

    try {
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      
      const response = await axios.get(`${corsProxy}${url}`, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest',
        },
        signal: controller.signal,
        timeout: 15000, // Timeout explicite
      });
      
      if (!response.data) {
        throw new Error("La réponse est vide");
      }
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      
      if (!doc.documentElement) {
        throw new Error("Impossible de parser le document HTML");
      }
      
      // Analyse SEO
      const seoResults = await analyzeSeo(doc, url);
      setSeoAnalysis(seoResults);

      // Analyse des ressources en parallèle
      const resourcesResults = await analyzeResources(doc, url);
      setResources(resourcesResults);

      // Structure du site améliorée
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
      toast.success("Analyse terminée avec succès !");

    } catch (error) {
      console.error('Erreur:', error);
      
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_CANCELED') {
          setError("L'analyse a été interrompue car elle prenait trop de temps");
          toast.error("Analyse interrompue - délai dépassé");
        } else if (error.response?.status === 403) {
          setShowCorsWarning(true);
          setError(null);
          toast.warning("Activation du proxy CORS requise");
        } else if (error.code === 'ERR_NETWORK') {
          setError("Erreur de connexion au proxy CORS");
          toast.error("Erreur de connexion au proxy CORS");
        } else {
          setError(`Erreur réseau : ${error.message}`);
          toast.error(`Erreur réseau : ${error.message}`);
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }, [url]);

  return {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    resources,
    siteStructure,
    analyzeSite,
    error
  };
};
