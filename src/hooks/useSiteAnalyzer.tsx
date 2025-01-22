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
}

const analyzeSEO = async (doc: Document, baseUrl: string): Promise<SeoAnalysis> => {
  const title = doc.title;
  const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const h1Count = doc.getElementsByTagName('h1').length;
  const images = doc.getElementsByTagName('img');
  const imgCount = images.length;
  const imgWithoutAlt = Array.from(images).filter(img => !img.alt).length;
  const metaTagsCount = doc.getElementsByTagName('meta').length;
  const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null;

  // Vérification des liens morts
  const links = Array.from(doc.getElementsByTagName('a'));
  let brokenLinks = 0;
  
  for (const link of links) {
    if (link.href) {
      try {
        const fullUrl = new URL(link.href, baseUrl).href;
        await axios.head(fullUrl);
      } catch {
        brokenLinks++;
      }
    }
  }

  return {
    title,
    description,
    h1Count,
    imgCount,
    imgWithoutAlt,
    metaTagsCount,
    canonicalUrl,
    robotsMeta,
    brokenLinks
  };
};

export const useSiteAnalyzer = (): UseSiteAnalyzerReturn => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCorsWarning, setShowCorsWarning] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysis | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [siteStructure, setSiteStructure] = useState<{ name: string; children: SiteNode[] } | null>(null);

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
        timeout: 10000,
      });
      
      console.log("Réponse du proxy reçue, statut:", response.status);
      console.log("Type de contenu reçu:", response.headers['content-type']);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.data, 'text/html');
      console.log("Document HTML parsé avec succès");

      toast.info("Analyse du site en cours...");
      console.log("Début de l'analyse SEO...");

      const seoResults = await analyzeSEO(doc, url);
      console.log("Résultats de l'analyse SEO:", seoResults);
      setSeoAnalysis(seoResults);

      console.log("Début de l'analyse des ressources...");
      const resourcesResults = await analyzeResources(doc, url);
      console.log("Ressources trouvées:", resourcesResults.length);
      setResources(resourcesResults);

      console.log("Début de l'analyse des liens...");
      const links = Array.from(doc.querySelectorAll('a')).map(link => ({
        url: link.href,
        text: link.textContent?.trim() || ''
      }));
      console.log("Nombre de liens trouvés:", links.length);

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
        console.log("Type d'erreur Axios détecté");
        console.log("Code d'erreur:", error.code);
        console.log("Message d'erreur:", error.message);
        console.log("Statut de la réponse:", error.response?.status);
        console.log("Headers de la réponse:", error.response?.headers);
        
        if (error.response?.status === 403) {
          setShowCorsWarning(true);
        } else if (error.code === 'ERR_NETWORK') {
          toast.error("Erreur de connexion au proxy CORS");
        } else if (error.code === 'ECONNABORTED') {
          toast.error("Le délai d'attente a été dépassé. Veuillez réessayer.");
        } else {
          toast.error(`Erreur réseau : ${error.message}`);
        }
      } else {
        console.error("Erreur non-Axios:", error);
        toast.error("Une erreur inattendue s'est produite lors de l'analyse du site.");
      }
    } finally {
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
    analyzeSite
  };
};
