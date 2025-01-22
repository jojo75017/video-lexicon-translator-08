import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from "sonner";
import { analyzeResources, Resource } from '@/utils/resourceAnalyzer';

interface SeoAnalysis {
  title: string;
  description: string;
  h1Count: number;
  imgCount: number;
  imgWithoutAlt: number;
  metaTagsCount: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  brokenLinks: number;
}

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

  const analyzeSite = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("Format d'URL invalide. Assurez-vous d'inclure http:// ou https://");
      return;
    }

    setIsLoading(true);
    setShowCorsWarning(false);
    setSiteStructure(null);
    setSeoAnalysis(null);
    setResources([]);
    setError(null);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      console.log("Début de l'analyse pour l'URL:", url);
      const corsProxy = 'https://cors-anywhere.herokuapp.com/';
      toast.info("Connexion au proxy CORS en cours...");
      
      console.log("Tentative de connexion au proxy CORS...");
      const response = await axios.get(`${corsProxy}${url}`, {
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest',
        },
        signal: controller.signal,
      });
      
      if (!response.data) {
        throw new Error("La réponse est vide");
      }
      
      console.log("Réponse du proxy reçue, statut:", response.status);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      
      if (!doc.documentElement) {
        throw new Error("Impossible de parser le document HTML");
      }
      
      console.log("Document HTML parsé avec succès");

      toast.info("Analyse du site en cours...");
      
      // Analyse SEO
      const seoResults = {
        title: doc.title || "Pas de titre",
        description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        h1Count: doc.getElementsByTagName('h1').length,
        imgCount: doc.getElementsByTagName('img').length,
        imgWithoutAlt: Array.from(doc.getElementsByTagName('img')).filter(img => !img.alt).length,
        metaTagsCount: doc.getElementsByTagName('meta').length,
        canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
        robotsMeta: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
        brokenLinks: 0
      };
      
      console.log("Résultats de l'analyse SEO:", seoResults);
      setSeoAnalysis(seoResults);

      // Analyse des ressources
      const resourcesResults = await analyzeResources(doc, url);
      console.log("Ressources trouvées:", resourcesResults.length);
      setResources(resourcesResults);

      // Création de la structure du site
      const uniqueUrls = new Set<string>();
      const links = Array.from(doc.querySelectorAll('a'))
        .map(link => ({
          url: link.href,
          text: link.textContent?.trim() || ''
        }))
        .filter(link => {
          if (!link.url || !link.url.startsWith('http') || uniqueUrls.has(link.url)) {
            return false;
          }
          uniqueUrls.add(link.url);
          return true;
        });

      console.log("Nombre de liens uniques trouvés:", links.length);

      const structure = {
        name: "Site Web",
        children: [
          {
            name: "Page d'accueil",
            path: url,
            children: links.map(link => ({
              name: link.text || 'Lien sans titre',
              path: link.url,
              children: []
            }))
          }
        ]
      };

      setSiteStructure(structure);
      console.log("Structure du site générée avec succès");
      toast.success("Analyse terminée !");
    } catch (error) {
      console.error('Erreur complète:', error);
      
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_CANCELED') {
          setError("L'analyse a pris trop de temps et a été annulée");
          toast.error("L'analyse a pris trop de temps et a été annulée");
        } else if (error.response?.status === 403) {
          setShowCorsWarning(true);
          setError("Accès refusé - Activez le proxy CORS");
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
    error
  };
};