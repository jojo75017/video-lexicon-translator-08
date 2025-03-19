
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
      // Utiliser un proxy CORS plus fiable
      const corsProxy = 'https://corsproxy.io/?';
      console.log("FETCHING WITH CORS PROXY:", corsProxy + encodeURIComponent(url));
      
      const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`, {
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
          setError("Erreur 403: Accès refusé. Essayez avec une URL différente.");
          toast.warning("Erreur d'accès au site. Essayez une URL différente.");
        } else if (error.code === 'ERR_NETWORK') {
          console.log("NETWORK ERROR");
          setError("Erreur de connexion au proxy CORS. Essayez plus tard.");
          toast.error("Erreur de connexion au proxy CORS");
          
          // Générer des données de démo en cas d'erreur réseau
          setSeoAnalysis(createDemoAnalysis(url));
        } else {
          console.log("OTHER AXIOS ERROR:", error.message);
          setError(`Erreur réseau : ${error.message}`);
          toast.error(`Erreur réseau : ${error.message}`);
          
          // Générer des données de démo en cas d'erreur
          setSeoAnalysis(createDemoAnalysis(url));
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue s'est produite";
        console.log("GENERAL ERROR:", errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
        
        // Générer des données de démo en cas d'erreur
        setSeoAnalysis(createDemoAnalysis(url));
      }
      
      // Générer une structure de site de démonstration
      if (!siteStructure) {
        setSiteStructure({
          name: "Site Web (Démo)",
          children: [
            {
              name: "Page d'accueil",
              path: url,
              children: [
                { name: "À propos", path: url + "/about", children: [] },
                { name: "Services", path: url + "/services", children: [] },
                { name: "Contact", path: url + "/contact", children: [] },
                { name: "Blog", path: url + "/blog", children: [] }
              ]
            }
          ]
        });
      }
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
      console.log("ANALYSIS PROCESS COMPLETE");
    }
  }, [url]);

  // Fonction pour créer des données d'analyse SEO de démonstration
  const createDemoAnalysis = (siteUrl: string): SeoAnalysis => {
    return {
      title: "Exemple de titre - Démonstration",
      description: "Ceci est une analyse de démonstration générée car le site n'a pas pu être analysé.",
      h1Count: 1,
      h2Count: 3,
      h3Count: 5,
      headings: [
        { level: "h1", text: "Titre principal" },
        { level: "h2", text: "Premier sous-titre" },
        { level: "h2", text: "Deuxième sous-titre" }
      ],
      paragraphs: 12,
      headingStructure: {
        h1Count: 1,
        h2Count: 3,
        h3Count: 5,
        headings: [
          { level: "h1", text: "Titre principal" },
          { level: "h2", text: "Premier sous-titre" }
        ],
        paragraphs: 12
      },
      imgCount: 8,
      imgWithoutAlt: 2,
      imagesDetails: [
        { src: "https://via.placeholder.com/800x400", alt: "Image de bannière", hasAlt: true, size: "800x400" },
        { src: "https://via.placeholder.com/400x300", alt: "", hasAlt: false, size: "400x300" }
      ],
      metaTagsCount: 7,
      metaTagsAnalysis: {
        hasTitleTag: true,
        hasDescriptionTag: true,
        hasOpenGraphTags: false,
        hasTwitterTags: false,
        hasCanonicalTag: true,
        hasRobotsTag: true,
        hasViewportTag: true,
        hasHreflangTags: false,
        hasStructuredData: false
      },
      canonicalUrl: siteUrl,
      robotsMeta: "index, follow",
      brokenLinks: [],
      keywords: ["exemple", "démonstration", "seo", "analyse"],
      googlePosition: null,
      authorityScore: 35,
      organicTraffic: 1500,
      backlinks: 120,
      backlinkDetails: [
        { domain: "exemple1.com", url: "https://exemple1.com/page", text: "Texte d'ancrage", authority: 45, dofollow: true },
        { domain: "exemple2.com", url: "https://exemple2.com/page", text: "Autre texte", authority: 30, dofollow: false }
      ],
      topBacklinkDomains: ["exemple1.com", "exemple2.com"],
      doFollowBacklinks: 85,
      noFollowBacklinks: 35,
      wordCount: 2500,
      textToHtmlRatio: 0.45,
      internalLinks: 25,
      externalLinks: 8,
      analytics: {
        visitors: 1200,
        pageviews: 3500,
        bounceRate: 42,
        avgTimeOnPage: 145,
        trafficSources: {}
      },
      searchConsole: {
        clicks: 850,
        impressions: 12000,
        ctr: 7.08,
        position: 18.5,
        keywords: [],
        topQueries: [],
        topPages: [],
        devices: { mobile: 65, desktop: 30, tablet: 5 },
        countries: []
      },
      socialMetrics: {
        facebook: { shares: 120, comments: 45, likes: 230 },
        twitter: { tweets: 85, retweets: 35, likes: 150 },
        linkedin: { shares: 55, comments: 20 },
        pinterest: { pins: 25 }
      },
      performance: {
        loadTime: 2500,
        resourceCount: 45,
        scriptCount: 12,
        styleCount: 8,
        resourceSize: 1250000,
        resourceBreakdown: {
          js: 750000,
          css: 120000,
          images: 350000,
          fonts: 80000,
          other: 25000
        }
      },
      securityHeaders: {
        https: true,
        hsts: false,
        xFrameOptions: true,
        contentSecurityPolicy: false,
        xContentTypeOptions: true,
        referrerPolicy: true,
        permissions: false
      },
      semanticStructure: {
        header: true,
        footer: true,
        nav: true,
        main: true,
        article: false,
        section: true,
        aside: false,
        score: 75
      },
      linkAnalysis: {
        internal: 25,
        external: 8,
        broken: 0,
        redirects: 3,
        links: [
          { url: siteUrl + "/page1", text: "Page 1", isExternal: false, isNofollow: false },
          { url: "https://example.com", text: "Exemple externe", isExternal: true, isNofollow: true }
        ]
      },
      readabilityScore: 68,
      topKeywords: [
        { keyword: "exemple", count: 25, density: 1.2, position: 15 },
        { keyword: "démonstration", count: 18, density: 0.8, position: 22 },
        { keyword: "analyse", count: 15, density: 0.7, position: 18 }
      ],
      technologies: ["WordPress", "jQuery", "Bootstrap", "Google Analytics"],
      mobileAnalysis: {
        isMobileFriendly: true,
        viewport: true,
        textSize: 90,
        tapTargets: 85,
        flashUsage: false,
        score: 85
      },
      mobilePerformance: {
        viewportMeta: true,
        responsiveImages: true,
        touchTargetSize: 90,
        fontScale: 85,
        score: 85
      },
      socialTags: {
        ogTitle: null,
        ogDescription: null,
        ogImage: null,
        twitterCard: null,
        twitterTitle: null,
        twitterDescription: null,
        twitterImage: null
      },
      contentQuality: 78,
      schemaMarkup: false,
      accessibility: {
        contrast: { issues: 2, score: 85 },
        aria: { issues: 5, present: ["label", "role"] },
        labels: 12,
        score: 75
      },
      indexability: {
        isIndexable: true,
        blockedByRobotsTxt: false,
        hasNoindexTag: false,
        hasCanonicalIssues: false,
        issues: []
      },
      keywordSuggestions: [
        { keyword: "exemple analyse seo", searchVolume: 1200, competition: 0.65, relevance: 95, difficulty: 45, volume: 1200, cpc: 1.25 },
        { keyword: "outil seo démo", searchVolume: 850, competition: 0.45, relevance: 85, difficulty: 35, volume: 850, cpc: 0.95 }
      ],
      technicalSuggestions: [
        "Ajoutez des balises Open Graph pour améliorer le partage social",
        "Optimisez les images sans attribut alt",
        "Ajoutez des données structurées Schema.org",
        "Améliorez la sécurité avec Content-Security-Policy"
      ]
    };
  };

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
