
import { toast } from "sonner";

// Interface pour les résultats d'analyse
export interface AnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
}

// Interface pour les options d'analyse
export interface AnalysisOptions {
  useProxy?: boolean;
  timeout?: number;
  depth?: number;
}

// Utilitaire principal d'analyse de site
export const SiteAnalysisService = {
  // Proxy CORS activé ou non
  _proxyEnabled: false,
  
  // URL du proxy CORS
  _proxyUrl: "https://cors-anywhere.herokuapp.com/",
  
  // Activer le proxy CORS
  enableProxy: () => {
    SiteAnalysisService._proxyEnabled = true;
    console.log("Proxy CORS activé");
    return true;
  },
  
  // Désactiver le proxy CORS
  disableProxy: () => {
    SiteAnalysisService._proxyEnabled = false;
    console.log("Proxy CORS désactivé");
    return true;
  },
  
  // Vérifier si le proxy est activé
  isProxyEnabled: () => {
    return SiteAnalysisService._proxyEnabled;
  },
  
  // Formater une URL avec le proxy si nécessaire
  formatUrl: (url: string): string => {
    // Vérifier si l'URL a un protocole
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Ajouter le proxy si activé
    if (SiteAnalysisService._proxyEnabled) {
      return SiteAnalysisService._proxyUrl + url;
    }
    
    return url;
  },
  
  // Analyser un site web
  analyzeSite: async (url: string, options: AnalysisOptions = {}): Promise<AnalysisResult> => {
    console.log(`Analyse du site: ${url} (Proxy: ${SiteAnalysisService._proxyEnabled})`);
    
    try {
      // Validation de l'URL
      if (!url) {
        toast.error("URL requise");
        return { success: false, error: "URL requise" };
      }
      
      // Formatage de l'URL
      const formattedUrl = SiteAnalysisService.formatUrl(url);
      console.log(`URL formatée: ${formattedUrl}`);
      
      // Analyser le site (avec gestion des erreurs CORS)
      const response = await fetch(formattedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: options.timeout ? AbortSignal.timeout(options.timeout) : undefined
      });
      
      if (!response.ok) {
        const errorMessage = `Erreur HTTP: ${response.status} ${response.statusText}`;
        console.error(errorMessage);
        
        if (response.status === 403) {
          toast.error("Accès refusé (403)", {
            description: "L'accès au site est restreint. Essayez d'activer le proxy CORS."
          });
          return { success: false, error: "Accès refusé (403)" };
        }
        
        toast.error("Erreur de requête", {
          description: errorMessage
        });
        return { success: false, error: errorMessage };
      }
      
      // Récupérer le HTML
      const html = await response.text();
      
      // Analyser le HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Récupérer les données de base
      const title = doc.title || "";
      const metaTags = Array.from(doc.querySelectorAll('meta')).map(meta => {
        return {
          name: meta.getAttribute('name') || meta.getAttribute('property') || "",
          content: meta.getAttribute('content') || ""
        };
      });
      
      // Récupérer les titres (h1, h2, h3...)
      const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => {
        return {
          level: heading.tagName.toLowerCase(),
          text: heading.textContent || ""
        };
      });
      
      // Récupérer les liens
      const links = Array.from(doc.querySelectorAll('a')).map(link => {
        return {
          href: link.getAttribute('href') || "",
          text: link.textContent || "",
          isExternal: link.getAttribute('href')?.startsWith('http') || false
        };
      });
      
      // Récupérer les images
      const images = Array.from(doc.querySelectorAll('img')).map(img => {
        return {
          src: img.getAttribute('src') || "",
          alt: img.getAttribute('alt') || "",
          hasAlt: !!img.getAttribute('alt')
        };
      });
      
      // Récupérer le texte
      const bodyText = doc.body.textContent || "";
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
      
      // Créer l'objet de résultats
      const analysisData = {
        url,
        title,
        meta: metaTags,
        headings,
        links,
        images,
        wordCount,
        sourceCode: html,
        timestamp: new Date().toISOString()
      };
      
      console.log("Analyse terminée avec succès");
      toast.success("Analyse terminée", {
        description: `${title} - ${wordCount} mots, ${headings.length} titres`
      });
      
      return { 
        success: true, 
        data: analysisData
      };
      
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      
      // Détection des erreurs CORS
      if (error instanceof TypeError && error.message.includes('CORS')) {
        toast.error("Erreur CORS", {
          description: "Activez le proxy pour analyser ce site externe"
        });
        return { 
          success: false, 
          error: "Erreur CORS - Activez le proxy pour analyser ce site" 
        };
      }
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        if (!SiteAnalysisService._proxyEnabled) {
          toast.error("Erreur de connexion", {
            description: "Activez le proxy pour analyser ce site externe"
          });
          return { 
            success: false, 
            error: "Erreur de connexion - Activez le proxy pour analyser ce site" 
          };
        } else {
          toast.error("Erreur de connexion", {
            description: "Impossible de se connecter au site. Vérifiez l'URL."
          });
          return { 
            success: false, 
            error: "Impossible de se connecter au site"
          };
        }
      }
      
      toast.error("Erreur d'analyse", {
        description: error instanceof Error ? error.message : "Erreur inconnue"
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue lors de l'analyse" 
      };
    }
  }
};

export default SiteAnalysisService;
