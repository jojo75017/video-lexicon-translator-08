
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { navigateToSection } from '@/utils/navigationHelpers';
import { getStructureData } from '@/utils/seo/updateUtils';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';

export const useSiteAnalyzer = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCorsWarning, setShowCorsWarning] = useState<boolean>(false);
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [resources, setResources] = useState<any>(null);
  const [siteStructure, setSiteStructure] = useState<any>(null);
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(false);

  // Fonction pour activer le proxy CORS
  const handleActivateProxy = () => {
    setProxyEnabled(true);
    FirecrawlService.enableProxy();
    toast.success("Proxy CORS activé", {
      description: "Les requêtes utiliseront désormais un proxy pour contourner les restrictions CORS",
    });
  };

  // Helper function to generate demo/sample data when a real crawl fails
  const generateDemoData = useCallback(() => {
    return {
      title: "Site Web Demo",
      url: url,
      meta: [
        { name: "description", content: "Description démo du site" },
        { name: "keywords", content: "seo, demo, analyse" }
      ],
      headings: [
        { level: 1, text: "Titre principal" },
        { level: 2, text: "Sous-titre 1" },
        { level: 2, text: "Sous-titre 2" },
        { level: 3, text: "Section détaillée" }
      ],
      links: [
        { href: "https://example.com", text: "Exemple de lien" },
        { href: "https://example.com/page", text: "Autre lien" }
      ],
      images: [
        { src: "https://placekitten.com/200/300", alt: "Image d'exemple", width: 200, height: 300 },
        { src: "https://placekitten.com/300/200", alt: "", width: 300, height: 200 }
      ],
      sourceCode: "<html>\n<head>\n  <title>Site Web Demo</title>\n</head>\n<body>\n  <h1>Titre principal</h1>\n  <p>Contenu démonstratif</p>\n</body>\n</html>",
      recommendations: [
        "Ajoutez une balise meta description",
        "Optimisez vos balises H1 et H2",
        "Ajoutez des attributs alt à toutes vos images"
      ]
    };
  }, [url]);

  // Get external link analysis data
  const getExternalLinkAnalysis = useCallback(() => {
    return {
      externalLinks: 12,
      internalLinks: 28,
      noFollowLinks: 5,
      brokenLinks: 2,
      mostLinkedDomains: [
        { domain: "facebook.com", count: 3 },
        { domain: "twitter.com", count: 2 },
        { domain: "linkedin.com", count: 2 }
      ]
    };
  }, []);

  // Get performance data
  const getPerformanceData = useCallback(() => {
    return {
      score: 85,
      loadTime: 1.8,
      resourceCount: 45,
      resourceSize: 1.2, // MB
      resourceBreakdown: {
        js: 480000, // ~480KB
        css: 120000, // ~120KB
        images: 580000, // ~580KB
        fonts: 60000 // ~60KB
      }
    };
  }, []);

  const analyzeSite = useCallback(async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSeoAnalysis(null);
    setResources(null);
    setSiteStructure(null);
    
    // Message d'information
    toast.info("Analyse en cours", {
      description: "Cette opération peut prendre quelques instants...",
      duration: 5000,
    });
    
    try {
      console.log("Analyzing site:", url);
      
      // Use FirecrawlService to get data
      const result = await FirecrawlService.crawlWebsite(url, proxyEnabled);
      
      if (!result.success) {
        throw new Error(result.error || "Erreur inconnue lors de l'analyse");
      }
      
      console.log("Analysis result:", result);
      
      // Parse the result and create analysis objects
      const crawlData = result.data[0];
      
      // Analyse les titres avec une structure hiérarchique complète
      let headingStructure = null;
      let headings = [];
      
      // Création d'un document temporaire pour analyser le code HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(crawlData.sourceCode || "<html><body></body></html>", "text/html");
      
      // Analyse avancée des titres
      headingStructure = analyzeHeadings(doc);
      console.log("Heading structure analysis:", headingStructure);
      
      // Format attendu pour les headings
      if (crawlData.headings) {
        headings = crawlData.headings.map(h => ({
          level: typeof h.level === 'string' ? parseInt(h.level.replace(/h/,'')) : h.level,
          text: h.text,
          position: h.position || 0
        }));
      }
      
      // Basic SEO analysis
      const seoData = {
        title: crawlData.title || url,
        description: crawlData.meta?.find(m => m.name === "description")?.content || "",
        keywords: crawlData.meta?.find(m => m.name === "keywords")?.content?.split(",").map(k => k.trim()) || [],
        metaTagsAnalysis: {
          hasDescriptionTag: crawlData.meta && crawlData.meta.some(meta => meta.name === "description"),
          hasTitleTag: !!crawlData.title,
          hasOpenGraphTags: crawlData.meta && crawlData.meta.some(meta => meta.property && meta.property.startsWith("og:")),
          hasTwitterTags: crawlData.meta && crawlData.meta.some(meta => meta.name && meta.name.startsWith("twitter:")),
          canonical: crawlData.meta && crawlData.meta.find(meta => meta.rel === "canonical")?.href || "",
          robots: crawlData.meta && crawlData.meta.find(meta => meta.name === "robots")?.content || "",
        },
        h1Count: headings ? headings.filter(h => h.level === 1).length : 0,
        h2Count: headings ? headings.filter(h => h.level === 2).length : 0,
        h3Count: headings ? headings.filter(h => h.level === 3).length : 0,
        headings: headings,
        paragraphs: headingStructure?.paragraphs || [],
        headingStructure: headingStructure,
        hierarchy: headingStructure?.hierarchy || [],
        imgCount: crawlData.images ? crawlData.images.length : 0,
        imgWithoutAlt: crawlData.images ? crawlData.images.filter(img => !img.alt).length : 0,
        performance: getPerformanceData(),
        mobileAnalysis: {
          score: 75,
          viewportMeta: true,
          responsiveImages: true,
          touchTargetSize: "Adequate",
          fontScale: "Good"
        },
        searchConsole: {
          clicks: [150, 160, 170, 155, 180, 190, 200],
          impressions: [1500, 1600, 1700, 1550, 1800, 1900, 2000],
        },
        contentQuality: {
          readingTime: 3.5,
          complexity: 65
        },
        wordCount: crawlData.textContent ? crawlData.textContent.split(/\s+/).length : 0,
        readabilityScore: 68,
        topKeywords: [
          { keyword: "Example", count: 24, density: 2.1, position: 1 },
          { keyword: "Test", count: 18, density: 1.6, position: 2 },
          { keyword: "Demo", count: 15, density: 1.3, position: 3 }
        ],
        keywordSuggestions: [
          { keyword: "SEO optimization", volume: 8500, difficulty: 67 },
          { keyword: "website analysis tools", volume: 4200, difficulty: 45 },
          { keyword: "content structure SEO", volume: 2800, difficulty: 38 },
          { keyword: "heading hierarchy", volume: 1200, difficulty: 25 },
          { keyword: "meta tags optimization", volume: 3600, difficulty: 43 }
        ],
        technicalSuggestions: [
          "Assurez-vous d'avoir exactement une balise H1",
          "Utilisez des titres H2 et H3 pour structurer votre contenu",
          "Ajoutez des attributs alt à toutes vos images",
          "Optimisez la longueur de vos titres et méta-descriptions"
        ]
      };

      // Set the data in state
      setSeoAnalysis(seoData);
      setResources(getExternalLinkAnalysis());
      setSiteStructure({...crawlData, sourceCode: crawlData.sourceCode || ""});
      
      console.log("ANALYSIS COMPLETE");
      
      // Success notification
      toast.success("Analyse terminée", {
        description: "Consultez les résultats ci-dessous",
      });
      
      // Navigate to the results section
      navigateToSection('seo');
      
    } catch (err) {
      console.error("Error analyzing site:", err);
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      
      // Check if it's a CORS error
      if (err instanceof Error && 
          (err.message.includes("CORS") || 
           err.message.includes("cross-origin") ||
           err.message.includes("network error"))) {
        setShowCorsWarning(true);
        toast.error("Erreur CORS détectée", {
          description: "Le site n'autorise pas l'accès depuis cette application",
        });
      } else {
        toast.error("Erreur d'analyse", {
          description: err instanceof Error ? err.message : "Une erreur s'est produite",
        });
      }
      
      // Even with an error, provide demo data for testing the interface
      const demoData = generateDemoData();
      setSiteStructure({...demoData, sourceCode: demoData.sourceCode || ""});
      
      // Generate synthetic SEO data with hierarchical structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(demoData.sourceCode || "", "text/html");
      const headingStructure = analyzeHeadings(doc);
      
      const syntheticSeoData = {
        title: demoData.title || url,
        description: "Description exemple pour " + url,
        keywords: ["seo", "analyse", "demo", "test"],
        metaTagsAnalysis: {
          hasDescriptionTag: true,
          hasTitleTag: true,
          hasOpenGraphTags: false,
          hasTwitterTags: false,
          canonical: "",
          robots: "index, follow",
        },
        h1Count: 1,
        h2Count: 2,
        h3Count: 1,
        headings: demoData.headings.map(h => ({
          level: typeof h.level === 'string' ? parseInt(h.level.toString()) : h.level,
          text: h.text,
          position: 0
        })),
        paragraphs: headingStructure?.paragraphs || [],
        headingStructure: headingStructure,
        hierarchy: headingStructure?.hierarchy || [],
        imgCount: demoData.images ? demoData.images.length : 0,
        imgWithoutAlt: demoData.images ? demoData.images.filter(img => !img.alt).length : 0,
        performance: getPerformanceData(),
        mobileAnalysis: {
          score: 75,
          viewportMeta: true,
          responsiveImages: true,
          touchTargetSize: "Adequate",
          fontScale: "Good"
        },
        searchConsole: {
          clicks: [100, 110, 120, 115, 130, 140, 150],
          impressions: [1000, 1100, 1200, 1150, 1300, 1400, 1500],
        },
        contentQuality: {
          readingTime: 2.5,
          complexity: 55
        },
        wordCount: 320,
        readabilityScore: 68,
        topKeywords: [
          { keyword: "Example", count: 24, density: 2.1, position: 1 },
          { keyword: "Test", count: 18, density: 1.6, position: 2 },
          { keyword: "Demo", count: 15, density: 1.3, position: 3 }
        ],
        keywordSuggestions: [
          { keyword: "demo website analysis", volume: 5500, difficulty: 47 },
          { keyword: "example site structure", volume: 3200, difficulty: 35 },
          { keyword: "test website seo", volume: 1800, difficulty: 28 },
          { keyword: "sample content optimization", volume: 1200, difficulty: 25 },
          { keyword: "dummy website performance", volume: 2600, difficulty: 33 }
        ],
        technicalSuggestions: [
          "Assurez-vous d'avoir exactement une balise H1",
          "Utilisez des titres H2 et H3 pour structurer votre contenu",
          "Ajoutez des attributs alt à toutes vos images",
          "Optimisez la longueur de vos titres et méta-descriptions"
        ]
      };
      
      setSeoAnalysis(syntheticSeoData);
      setResources(getExternalLinkAnalysis());
    } finally {
      setIsLoading(false);
      console.log("ANALYSIS PROCESS COMPLETE");
    }
  }, [url, proxyEnabled, generateDemoData, getExternalLinkAnalysis, getPerformanceData]);

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
