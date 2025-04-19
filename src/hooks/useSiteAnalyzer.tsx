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
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(true); // Proxy enabled by default

  // Activer le proxy CORS par défaut
  useEffect(() => {
    FirecrawlService.enableProxy();
    setProxyEnabled(true);
  }, []);

  // Fonction pour activer le proxy CORS
  const handleActivateProxy = () => {
    setProxyEnabled(true);
    FirecrawlService.enableProxy();
    toast.success("Proxy CORS activé", {
      description: "Les requêtes utiliseront désormais un proxy pour contourner les restrictions CORS",
    });
  };

  // Fonction pour générer des données de démonstration en cas d'échec d'analyse
  const generateDemoData = useCallback(() => {
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/);
    const domain = domainMatch ? domainMatch[1] : url;
    
    return {
      title: `Site Web - ${domain}`,
      url: url,
      meta: [
        { name: "description", content: `Description démo pour ${domain}` },
        { name: "keywords", content: `${domain}, seo, analyse, démonstration` }
      ],
      headings: [
        { level: 1, text: "Titre principal de démonstration" },
        { level: 2, text: "À propos de nous" },
        { level: 2, text: "Nos services" },
        { level: 3, text: "Service premium" }
      ],
      links: [
        { href: `https://${domain}/about`, text: "À propos", isInternal: true },
        { href: `https://${domain}/services`, text: "Services", isInternal: true },
        { href: "https://facebook.com", text: "Facebook", isInternal: false },
        { href: "https://twitter.com", text: "Twitter", isInternal: false }
      ],
      images: [
        { src: "https://via.placeholder.com/600x400", alt: "Image d'exemple principale", width: 600, height: 400 },
        { src: "https://via.placeholder.com/300x200", alt: "", width: 300, height: 200 }
      ],
      sourceCode: `<!DOCTYPE html>
<html>
<head>
  <title>Site Web - ${domain}</title>
  <meta name="description" content="Description démo pour ${domain}">
  <meta name="keywords" content="${domain}, seo, analyse, démonstration">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <h1>Titre principal de démonstration</h1>
    <nav>
      <ul>
        <li><a href="/about">À propos</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section>
      <h2>À propos de nous</h2>
      <p>Ceci est un exemple de contenu généré pour montrer la structure d'une page web typique.</p>
      <img src="https://via.placeholder.com/600x400" alt="Image d'exemple principale" width="600" height="400">
    </section>
    
    <section>
      <h2>Nos services</h2>
      <p>Découvrez nos services professionnels qui peuvent aider votre entreprise.</p>
      
      <div class="service">
        <h3>Service premium</h3>
        <p>Notre service haut de gamme avec toutes les fonctionnalités dont vous avez besoin.</p>
        <img src="https://via.placeholder.com/300x200" width="300" height="200">
      </div>
    </section>
  </main>
  
  <footer>
    <p>Copyright © 2023 ${domain}</p>
    <div class="social-links">
      <a href="https://facebook.com">Facebook</a>
      <a href="https://twitter.com">Twitter</a>
    </div>
  </footer>
</body>
</html>`,
      recommendations: [
        "Ajoutez une balise meta description",
        "Optimisez vos balises H1 et H2",
        "Ajoutez des attributs alt à toutes vos images"
      ]
    };
  }, [url]);

  // Fonction pour obtenir des données d'analyse de liens externes
  const getExternalLinkAnalysis = useCallback(() => {
    return {
      externalLinks: Math.floor(Math.random() * 8) + 5,
      internalLinks: Math.floor(Math.random() * 15) + 10,
      noFollowLinks: Math.floor(Math.random() * 3) + 1,
      brokenLinks: Math.floor(Math.random() * 2),
      mostLinkedDomains: [
        { domain: "facebook.com", count: Math.floor(Math.random() * 2) + 1 },
        { domain: "twitter.com", count: Math.floor(Math.random() * 2) + 1 },
        { domain: "linkedin.com", count: Math.floor(Math.random() * 2) + 1 }
      ]
    };
  }, []);

  // Fonction pour obtenir des données de performance
  const getPerformanceData = useCallback(() => {
    // Générer des valeurs aléatoires mais réalistes pour la démo
    const loadTime = Math.floor(Math.random() * 2000) + 1000; // 1-3s
    const firstContentfulPaint = Math.floor(loadTime * 0.4); // 40% du temps de chargement
    const domLoadTime = Math.floor(loadTime * 0.7); // 70% du temps de chargement
    const speedIndex = Math.floor(loadTime * 0.8);
    const largestContentfulPaint = Math.floor(loadTime * 0.9);
    const timeToInteractive = Math.floor(loadTime * 1.2);
    
    // Générer des tailles de ressources réalistes
    const totalSize = Math.floor(Math.random() * 1500000) + 500000; // 500KB - 2MB
    const imagesSize = Math.floor(totalSize * (Math.random() * 0.3 + 0.4)); // 40-70% du total
    const scriptsSize = Math.floor(totalSize * (Math.random() * 0.2 + 0.2)); // 20-40% du total
    const stylesSize = Math.floor(totalSize * (Math.random() * 0.1 + 0.05)); // 5-15% du total
    const fontsSize = Math.floor(totalSize * (Math.random() * 0.05 + 0.02)); // 2-7% du total
    const otherSize = totalSize - imagesSize - scriptsSize - stylesSize - fontsSize;
    
    return {
      score: Math.floor(90 - (loadTime / 100)), // Score sur 100
      loadTime,
      firstContentfulPaint,
      domLoadTime,
      speedIndex,
      largestContentfulPaint,
      timeToInteractive,
      resourceCount: Math.floor(Math.random() * 30) + 20,
      resourceSize: totalSize / 1024 / 1024, // En MB
      scriptCount: Math.floor(Math.random() * 10) + 5,
      styleCount: Math.floor(Math.random() * 5) + 2,
      imageCount: Math.floor(Math.random() * 15) + 5,
      cacheLifetime: 3600,
      totalSize,
      responseTime: Math.floor(Math.random() * 150) + 100,
      impressions: Math.floor(Math.random() * 5000) + 1000,
      clickThroughRate: (Math.random() * 0.05 + 0.05).toFixed(2),
      resourceBreakdown: {
        images: imagesSize,
        scripts: scriptsSize,
        styles: stylesSize,
        fonts: fontsSize,
        other: otherSize
      }
    };
  }, []);

  // Fonction principale d'analyse du site
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
    
    // Message d'information pour l'utilisateur
    toast.info("Analyse en cours", {
      description: "Patientez pendant l'analyse...",
      duration: 5000,
    });
    
    try {
      console.log("Analyse du site:", url);
      
      // S'assurer que le proxy est activé avant l'analyse
      FirecrawlService.enableProxy();
      setProxyEnabled(true);
      
      // Utiliser le service FirecrawlService pour obtenir les données
      const result = await FirecrawlService.crawlWebsite(url, true);
      
      if (!result.success) {
        throw new Error(result.error || "Erreur inconnue lors de l'analyse");
      }
      
      console.log("Résultat de l'analyse:", result);
      
      // S'assurer que les données sont valides
      if (!result.data) {
        throw new Error("Pas de données reçues lors de l'analyse");
      }
      
      // Analyser le résultat et créer des objets d'analyse
      const crawlData = result.data;
      
      // Analyser les titres avec une structure hiérarchique complète
      let headingStructure = null;
      let headings = [];
      
      // Création d'un document temporaire pour analyser le code HTML
      const parser = new DOMParser();
      const sourceCode = crawlData.sourceCode || "<html><body></body></html>";
      const doc = parser.parseFromString(sourceCode, "text/html");
      
      // Analyse avancée des titres
      headingStructure = analyzeHeadings(doc);
      console.log("Analyse de la structure des titres:", headingStructure);
      
      // Format attendu pour les headings
      if (crawlData.headings) {
        headings = crawlData.headings.map(h => ({
          level: typeof h.level === 'string' ? parseInt(h.level.replace(/h/i,'')) : h.level,
          text: h.text,
          position: h.position || 0
        }));
      }
      
      // Générer les données de performance
      const performanceData = getPerformanceData();
      
      // Analyse SEO de base
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
        performance: performanceData,
        mobileAnalysis: {
          score: Math.floor(Math.random() * 20) + 60, // Score entre 60 et 80
          viewportMeta: !!doc.querySelector('meta[name="viewport"]'),
          responsiveImages: Math.random() > 0.3, // 70% de chance d'être true
          touchTargetSize: Math.random() > 0.4, // 60% de chance d'être true
          fontScale: Math.random() > 0.2, // 80% de chance d'être true
        },
        searchConsole: {
          clicks: [150, 160, 170, 155, 180, 190, 200],
          impressions: [1500, 1600, 1700, 1550, 1800, 1900, 2000],
        },
        contentQuality: {
          readingTime: (crawlData.textContent?.split(/\s+/).length || 0) / 200, // ~200 mots par minute
          complexity: Math.floor(Math.random() * 30) + 50
        },
        wordCount: crawlData.textContent ? crawlData.textContent.split(/\s+/).length : 0,
        readabilityScore: Math.floor(Math.random() * 30) + 50,
        topKeywords: [
          { keyword: "Exemple", count: 24, density: 2.1, position: 1 },
          { keyword: "Test", count: 18, density: 1.6, position: 2 },
          { keyword: "Démo", count: 15, density: 1.3, position: 3 }
        ],
        keywordSuggestions: [
          { keyword: "optimisation SEO", volume: 8500, difficulty: 67 },
          { keyword: "outils analyse site web", volume: 4200, difficulty: 45 },
          { keyword: "structure contenu SEO", volume: 2800, difficulty: 38 },
          { keyword: "hiérarchie titres", volume: 1200, difficulty: 25 },
          { keyword: "optimisation balises meta", volume: 3600, difficulty: 43 }
        ],
        technicalSuggestions: [
          "Assurez-vous d'avoir exactement une balise H1",
          "Utilisez des titres H2 et H3 pour structurer votre contenu",
          "Ajoutez des attributs alt à toutes vos images",
          "Optimisez la longueur de vos titres et méta-descriptions"
        ]
      };

      // Mise à jour des états avec les données analysées
      setSeoAnalysis(seoData);
      setResources(getExternalLinkAnalysis());
      setSiteStructure({...crawlData, sourceCode: sourceCode});
      
      console.log("ANALYSE TERMINÉE");
      
      // Notification de succès
      toast.success("Analyse terminée", {
        description: "Consultez les résultats ci-dessous",
      });
      
      // Navigation vers la section des résultats
      navigateToSection('info');
      
    } catch (err) {
      console.error("Erreur lors de l'analyse du site:", err);
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      
      // Vérifier s'il s'agit d'une erreur CORS
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
      
      // Même en cas d'erreur, fournir des données de démonstration pour tester l'interface
      const demoData = generateDemoData();
      setSiteStructure({...demoData, sourceCode: demoData.sourceCode || ""});
      
      // Génération de données SEO synthétiques avec structure hiérarchique
      const parser = new DOMParser();
      const doc = parser.parseFromString(demoData.sourceCode || "", "text/html");
      const headingStructure = analyzeHeadings(doc);
      
      // Générer des données de performance
      const performanceData = getPerformanceData();
      
      const syntheticSeoData = {
        title: demoData.title || url,
        description: `Description exemple pour ${url}`,
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
          level: typeof h.level === 'number' ? h.level : parseInt(h.level as string),
          text: h.text,
          position: 0
        })),
        paragraphs: headingStructure?.paragraphs || [],
        headingStructure: headingStructure,
        hierarchy: headingStructure?.hierarchy || [],
        imgCount: demoData.images ? demoData.images.length : 0,
        imgWithoutAlt: demoData.images ? demoData.images.filter(img => !img.alt).length : 0,
        performance: performanceData,
        mobileAnalysis: {
          score: Math.floor(Math.random() * 20) + 60, // Score entre 60 et 80
          viewportMeta: true,
          responsiveImages: true,
          touchTargetSize: true,
          fontScale: true
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
          { keyword: "Exemple", count: 24, density: 2.1, position: 1 },
          { keyword: "Test", count: 18, density: 1.6, position: 2 },
          { keyword: "Démo", count: 15, density: 1.3, position: 3 }
        ],
        keywordSuggestions: [
          { keyword: "analyse site démo", volume: 5500, difficulty: 47 },
          { keyword: "structure site exemple", volume: 3200, difficulty: 35 },
          { keyword: "test seo site web", volume: 1800, difficulty: 28 },
          { keyword: "optimisation contenu exemple", volume: 1200, difficulty: 25 },
          { keyword: "performance site web factice", volume: 2600, difficulty: 33 }
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
      console.log("PROCESSUS D'ANALYSE TERMINÉ");
    }
  }, [url, generateDemoData, getExternalLinkAnalysis, getPerformanceData, proxyEnabled]);

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
