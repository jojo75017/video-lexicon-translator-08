
import { toast } from "sonner";

interface MetaTag {
  name: string;
  content: string;
}

interface OpenGraphTags {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

interface TwitterTags {
  card?: string;
  title?: string;
  description?: string;
  image?: string;
  site?: string;
}

export interface MetaAnalysis {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTags: OpenGraphTags;
  twitterTags: TwitterTags;
  robots: string;
  otherTags: MetaTag[];
  hasOgTags: boolean;
  hasTwitterTags: boolean;
}

// Crée un modèle d'analyse méta par défaut
const createDefaultMetaAnalysis = (): MetaAnalysis => {
  return {
    title: "Titre de la page non trouvé",
    description: "Description non trouvée",
    keywords: [],
    canonical: "",
    ogTags: {},
    twitterTags: {},
    robots: "",
    otherTags: [],
    hasOgTags: false,
    hasTwitterTags: false
  };
};

export const analyzeMetaTags = (document: Document): MetaAnalysis => {
  console.log("ANALYZING META TAGS");
  
  if (!document) {
    console.warn("Document is null in analyzeMetaTags");
    return createDefaultMetaAnalysis();
  }
  
  try {
    const metaAnalysis: MetaAnalysis = createDefaultMetaAnalysis();
    
    // Extraction du titre
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.textContent) {
      metaAnalysis.title = titleElement.textContent.trim();
      console.log("META: Found title:", metaAnalysis.title);
    }
    
    // Extraction des balises meta
    const metaTags = document.querySelectorAll('meta');
    console.log("META: Found", metaTags.length, "meta tags");
    
    metaTags.forEach((tag) => {
      const name = tag.getAttribute('name') || tag.getAttribute('property');
      const content = tag.getAttribute('content');
      
      if (name && content) {
        // Meta description
        if (name.toLowerCase() === 'description') {
          metaAnalysis.description = content;
          console.log("META: Found description:", content.substring(0, 50) + "...");
        }
        // Meta keywords
        else if (name.toLowerCase() === 'keywords') {
          metaAnalysis.keywords = content.split(',').map(k => k.trim());
          console.log("META: Found keywords:", metaAnalysis.keywords.join(', '));
        }
        // Meta robots
        else if (name.toLowerCase() === 'robots') {
          metaAnalysis.robots = content;
          console.log("META: Found robots:", content);
        }
        // Open Graph tags
        else if (name.startsWith('og:')) {
          metaAnalysis.hasOgTags = true;
          const ogProperty = name.substring(3);
          // Using type assertion to safely set property
          (metaAnalysis.ogTags as any)[ogProperty] = content;
          console.log("META: Found OG tag:", name, "=", content.substring(0, 30) + "...");
        }
        // Twitter tags
        else if (name.startsWith('twitter:')) {
          metaAnalysis.hasTwitterTags = true;
          const twitterProperty = name.substring(8);
          // Using type assertion to safely set property
          (metaAnalysis.twitterTags as any)[twitterProperty] = content;
          console.log("META: Found Twitter tag:", name, "=", content.substring(0, 30) + "...");
        }
        // Other meta tags
        else {
          metaAnalysis.otherTags.push({ name, content });
          console.log("META: Found other tag:", name, "=", content.substring(0, 30) + "...");
        }
      }
    });
    
    // Extraction de l'URL canonique
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      const href = canonicalTag.getAttribute('href');
      if (href) {
        metaAnalysis.canonical = href;
        console.log("META: Found canonical:", href);
      }
    }
    
    console.log("META ANALYSIS COMPLETE:", {
      title: metaAnalysis.title,
      description: metaAnalysis.description?.substring(0, 50) + "...",
      keywordsCount: metaAnalysis.keywords.length,
      hasOgTags: metaAnalysis.hasOgTags,
      hasTwitterTags: metaAnalysis.hasTwitterTags
    });
    
    return metaAnalysis;
  } catch (error) {
    console.error("ERROR in analyzeMetaTags:", error);
    toast.error("Erreur lors de l'analyse des balises méta", {
      description: "Une erreur est survenue pendant l'analyse des métadonnées"
    });
    return createDefaultMetaAnalysis();
  }
};
