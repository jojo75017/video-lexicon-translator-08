
import { toast } from "sonner";
import { OpenAIService } from "./seo/openaiService";

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
  useOpenAI?: boolean;
}

// Utilitaire principal d'analyse de site
export const SiteAnalysisService = {
  // Proxy CORS activé ou non
  _proxyEnabled: false,
  
  // URL du proxy CORS
  _proxyUrl: "https://corsproxy.io/?",
  
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
      return SiteAnalysisService._proxyUrl + encodeURIComponent(url);
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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
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
      
      // Récupérer la description et les mots-clés
      const descriptionTag = metaTags.find(tag => tag.name === 'description' || tag.name === 'og:description');
      const keywordsTag = metaTags.find(tag => tag.name === 'keywords');
      
      const description = descriptionTag ? descriptionTag.content : "";
      const keywords = keywordsTag ? keywordsTag.content.split(',').map(k => k.trim()) : [];
      
      // Récupérer les titres (h1, h2, h3...)
      const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(heading => {
        return {
          level: heading.tagName.toLowerCase(),
          text: heading.textContent || ""
        };
      });
      
      // Récupérer les liens
      const links = Array.from(doc.querySelectorAll('a')).map(link => {
        const href = link.getAttribute('href') || "";
        return {
          href: href,
          text: link.textContent || "",
          isExternal: href.startsWith('http') || href.startsWith('https'),
          isNofollow: link.getAttribute('rel')?.includes('nofollow') || false
        };
      });
      
      // Récupérer les images
      const images = Array.from(doc.querySelectorAll('img')).map(img => {
        const src = img.getAttribute('src') || "";
        const alt = img.getAttribute('alt') || "";
        return {
          src: src,
          alt: alt,
          hasAlt: !!alt,
          width: img.getAttribute('width'),
          height: img.getAttribute('height'),
          hasLazyLoading: img.getAttribute('loading') === 'lazy'
        };
      });
      
      // Récupérer le texte
      const bodyText = doc.body?.textContent || "";
      const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
      
      // Calculer la densité des mots
      const wordFrequency: Record<string, number> = {};
      const words = bodyText.toLowerCase().split(/\s+/).filter(word => 
        word.length > 3 && !/^\d+$/.test(word) && !['dans', 'avec', 'pour', 'cette', 'votre', 'notre'].includes(word)
      );
      
      words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      });
      
      // Trier les mots par fréquence
      const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([word, count]) => ({
          word,
          count,
          density: Number((count / words.length * 100).toFixed(2))
        }));
      
      // Extraire les scripts et styles pour analyse de performance
      const scripts = Array.from(doc.querySelectorAll('script')).map(script => ({
        src: script.getAttribute('src') || '',
        async: script.hasAttribute('async'),
        defer: script.hasAttribute('defer'),
        type: script.getAttribute('type') || '',
        inlineSize: script.textContent?.length || 0
      }));
      
      const styles = Array.from(doc.querySelectorAll('link[rel="stylesheet"], style')).map(style => {
        if (style.tagName.toLowerCase() === 'link') {
          return {
            href: style.getAttribute('href') || '',
            inline: false,
            size: 0
          };
        } else {
          return {
            href: '',
            inline: true,
            size: style.textContent?.length || 0
          };
        }
      });
      
      // Vérification OpenAI pour analyse avancée
      let openAIAnalysis = null;
      const apiKey = localStorage.getItem('openaiKey');
      
      if (apiKey && options.useOpenAI !== false) {
        try {
          console.log("Clé OpenAI trouvée, tentative d'analyse avancée");
          const openaiService = new OpenAIService(apiKey);
          openAIAnalysis = await openaiService.analyzeSeoContent(url, bodyText.substring(0, 4000));
          console.log("Analyse OpenAI réussie:", openAIAnalysis);
        } catch (error) {
          console.error("Erreur lors de l'analyse OpenAI:", error);
          toast.error("Erreur d'analyse IA", {
            description: "L'analyse avancée avec OpenAI a échoué. Les résultats standards sont disponibles."
          });
        }
      }
      
      // Évaluer la qualité SEO
      const seoIssues = [];
      let seoScore = 100;
      
      // Vérifier le titre
      if (!title) {
        seoIssues.push({ type: 'error', message: 'Page sans titre' });
        seoScore -= 15;
      } else if (title.length < 10) {
        seoIssues.push({ type: 'warning', message: 'Titre trop court' });
        seoScore -= 5;
      } else if (title.length > 60) {
        seoIssues.push({ type: 'warning', message: 'Titre trop long' });
        seoScore -= 5;
      }
      
      // Vérifier la description
      if (!description) {
        seoIssues.push({ type: 'error', message: 'Description meta manquante' });
        seoScore -= 10;
      } else if (description.length < 50) {
        seoIssues.push({ type: 'warning', message: 'Description meta trop courte' });
        seoScore -= 5;
      } else if (description.length > 160) {
        seoIssues.push({ type: 'warning', message: 'Description meta trop longue' });
        seoScore -= 3;
      }
      
      // Vérifier les headings H1
      const h1s = headings.filter(h => h.level === 'h1');
      if (h1s.length === 0) {
        seoIssues.push({ type: 'error', message: 'H1 manquant' });
        seoScore -= 10;
      } else if (h1s.length > 1) {
        seoIssues.push({ type: 'warning', message: 'Plusieurs H1 détectés' });
        seoScore -= 5;
      }
      
      // Vérifier les images sans attribut alt
      const imagesWithoutAlt = images.filter(img => !img.hasAlt);
      if (imagesWithoutAlt.length > 0) {
        seoIssues.push({ 
          type: 'warning', 
          message: `${imagesWithoutAlt.length} image(s) sans attribut alt` 
        });
        seoScore -= Math.min(10, imagesWithoutAlt.length);
      }
      
      // Vérifier la longueur du contenu
      if (wordCount < 300) {
        seoIssues.push({ type: 'warning', message: 'Contenu trop court (moins de 300 mots)' });
        seoScore -= 8;
      }
      
      // Créer l'objet de résultats
      const analysisData = {
        url,
        title,
        description,
        meta: metaTags,
        headings,
        links,
        images,
        wordCount,
        keywords: keywords.length > 0 ? keywords : sortedWords.slice(0, 10).map(w => w.word),
        keywordSuggestions: [],
        pageSpeed: {
          resources: {
            scripts: scripts.length,
            styles: styles.length,
            images: images.length,
            totalResources: scripts.length + styles.length + images.length
          }
        },
        seo: {
          score: Math.max(0, seoScore),
          issues: seoIssues,
          mostFrequentWords: sortedWords
        },
        openAIAnalysis,
        sourceCode: html,
        timestamp: new Date().toISOString()
      };
      
      console.log("Analyse terminée avec succès");
      toast.success("Analyse terminée", {
        description: `${title} - ${wordCount} mots, ${headings.length} titres`
      });
      
      // Si une clé OpenAI est disponible, récupérer des suggestions de mots-clés
      if (apiKey && options.useOpenAI !== false) {
        try {
          const openaiService = new OpenAIService(apiKey);
          const mainKeyword = keywords.length > 0 ? keywords[0] : 
            (sortedWords.length > 0 ? sortedWords[0].word : title.split(' ')[0]);
          
          if (mainKeyword) {
            const keywordSuggestions = await openaiService.getKeywordSuggestions(mainKeyword);
            analysisData.keywordSuggestions = keywordSuggestions;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des suggestions de mots-clés:", error);
        }
      }
      
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
