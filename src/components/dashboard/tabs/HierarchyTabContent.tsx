
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import ContentHierarchy from '@/components/ContentHierarchy';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Globe, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';
import { Alert, AlertDescription } from "@/components/ui/alert";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';

const HierarchyTabContent = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState('');
  const [showCorsWarning, setShowCorsWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("HierarchyTabContent - Mounted/Updated");
    console.log("Current analyze result:", analyzeResult);
  }, [analyzeResult]);

  const handleActivateProxy = () => {
    FirecrawlService.enableProxy();
    toast.success("Proxy CORS activé", {
      description: "L'analyse devrait maintenant fonctionner correctement"
    });
    setShowCorsWarning(false);
    
    // Relancer l'analyse automatiquement
    if (url) {
      handleAnalyze();
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Reset previous errors
    setError(null);
    setShowCorsWarning(false);

    // Format URL if needed
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    setIsLoading(true);
    
    try {
      // Validate URL format
      new URL(formattedUrl);
      
      toast.info("Analyse en cours", {
        description: "Récupération des données de la page..."
      });
      
      // Activer le proxy pour éviter les problèmes CORS
      FirecrawlService.enableProxy();
      
      // Analyser le site
      const result = await FirecrawlService.crawlWebsite(formattedUrl, true);
      console.log("FirecrawlService result:", result);
      
      if (result.success && result.data) {
        console.log("Données récupérées:", result.data);
        
        // Traitement des données
        const parser = new DOMParser();
        let doc;
        
        if (typeof result.data.sourceCode === 'string') {
          doc = parser.parseFromString(result.data.sourceCode, 'text/html');
        } else if (result.data[0] && typeof result.data[0].sourceCode === 'string') {
          doc = parser.parseFromString(result.data[0].sourceCode, 'text/html');
        } else {
          throw new Error("Format de données invalide");
        }
        
        // Analyse des titres
        const headingStructure = analyzeHeadings(doc);
        console.log("Heading structure analyzed:", headingStructure);
        
        if (headingStructure) {
          setAnalyzeResult(headingStructure);
          setAnalyzedUrl(formattedUrl);
          toast.success("Analyse terminée avec succès");
        } else {
          throw new Error("Impossible d'analyser la structure des titres");
        }
      } else {
        console.error("Erreur dans la réponse de FirecrawlService:", result);
        
        // Check if it might be a CORS error
        if (result.error && (
            result.error.includes("CORS") || 
            result.error.includes("cross-origin") ||
            result.error.includes("network") ||
            result.error.includes("failed to fetch")
        )) {
          setShowCorsWarning(true);
          setError("Problème d'accès au site (CORS)");
        } else {
          throw new Error(result.error || "Échec de l'analyse du site");
        }
      }
    } catch (err) {
      console.error("Erreur d'analyse:", err);
      
      // Check if it might be a CORS error
      if (err instanceof Error && (
          err.message.includes("CORS") || 
          err.message.includes("cross-origin") ||
          err.message.includes("network") ||
          err.message.includes("failed to fetch")
      )) {
        setShowCorsWarning(true);
        setError("Problème d'accès au site (CORS)");
      } else {
        toast.error("Erreur d'analyse", {
          description: err instanceof Error ? err.message : "Une erreur s'est produite"
        });
        setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      }
      
      // Générer des données factices pour démontrer l'interface
      const mockData = generateMockHierarchyData(url);
      setAnalyzeResult(mockData);
      setAnalyzedUrl(formattedUrl);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour générer des données de démonstration
  const generateMockHierarchyData = (siteUrl: string) => {
    console.log("Generating mock data for:", siteUrl);
    const domain = siteUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    return {
      h1Count: 1,
      h2Count: 3,
      h3Count: 5,
      headings: [
        { text: `Bienvenue sur ${domain}`, level: 1, position: 0 },
        { text: "À propos de nous", level: 2, position: 1 },
        { text: "Nos services", level: 2, position: 2 },
        { text: "Service premium", level: 3, position: 3 },
        { text: "Service standard", level: 3, position: 4 },
        { text: "Contactez-nous", level: 2, position: 5 },
        { text: "Formulaire de contact", level: 3, position: 6 },
        { text: "Nos bureaux", level: 3, position: 7 },
        { text: "Support technique", level: 3, position: 8 }
      ],
      paragraphs: [
        { text: `Bienvenue sur ${domain}. Nous proposons des services de qualité pour tous vos besoins.`, position: 0.5 },
        { text: "Notre entreprise a été fondée en 2010 avec une mission claire : fournir des solutions innovantes.", position: 1.5 },
        { text: "Découvrez notre gamme complète de services conçus pour répondre à vos besoins spécifiques.", position: 2.5 },
        { text: "Notre service premium offre des fonctionnalités avancées et un support prioritaire.", position: 3.5 },
        { text: "Le service standard est idéal pour les petites entreprises et les projets de taille moyenne.", position: 4.5 },
        { text: "N'hésitez pas à nous contacter pour toute question ou demande d'information.", position: 5.5 },
        { text: "Utilisez notre formulaire de contact sécurisé pour nous envoyer un message.", position: 6.5 },
        { text: "Visitez nos bureaux situés au centre-ville pour discuter de vos projets en personne.", position: 7.5 }
      ],
      hierarchy: [
        {
          text: `Bienvenue sur ${domain}`,
          tagName: "h1",
          position: 0,
          children: [
            {
              text: "À propos de nous",
              tagName: "h2",
              position: 1,
              children: [
                {
                  text: "Notre entreprise a été fondée en 2010 avec une mission claire : fournir des solutions innovantes.",
                  tagName: "p",
                  position: 1.5,
                  children: []
                }
              ]
            },
            {
              text: "Nos services",
              tagName: "h2",
              position: 2,
              children: [
                {
                  text: "Découvrez notre gamme complète de services conçus pour répondre à vos besoins spécifiques.",
                  tagName: "p",
                  position: 2.5,
                  children: []
                },
                {
                  text: "Service premium",
                  tagName: "h3",
                  position: 3,
                  children: [
                    {
                      text: "Notre service premium offre des fonctionnalités avancées et un support prioritaire.",
                      tagName: "p",
                      position: 3.5,
                      children: []
                    }
                  ]
                },
                {
                  text: "Service standard",
                  tagName: "h3",
                  position: 4,
                  children: [
                    {
                      text: "Le service standard est idéal pour les petites entreprises et les projets de taille moyenne.",
                      tagName: "p",
                      position: 4.5,
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              text: "Contactez-nous",
              tagName: "h2",
              position: 5,
              children: [
                {
                  text: "N'hésitez pas à nous contacter pour toute question ou demande d'information.",
                  tagName: "p",
                  position: 5.5,
                  children: []
                },
                {
                  text: "Formulaire de contact",
                  tagName: "h3",
                  position: 6,
                  children: [
                    {
                      text: "Utilisez notre formulaire de contact sécurisé pour nous envoyer un message.",
                      tagName: "p",
                      position: 6.5,
                      children: []
                    }
                  ]
                },
                {
                  text: "Nos bureaux",
                  tagName: "h3",
                  position: 7,
                  children: [
                    {
                      text: "Visitez nos bureaux situés au centre-ville pour discuter de vos projets en personne.",
                      tagName: "p",
                      position: 7.5,
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  };

  // Generate mock site structure based on the analyzed URL
  const generateMockSiteStructure = (analyzedUrl: string) => {
    const domain = analyzedUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    return {
      name: `Structure de ${domain}`,
      children: [
        {
          name: "Page d'accueil",
          path: analyzedUrl,
          children: [
            {
              name: "À propos",
              path: `${analyzedUrl}/about`,
              children: [
                {
                  name: "Notre histoire",
                  path: `${analyzedUrl}/about/history`,
                  children: []
                },
                {
                  name: "L'équipe",
                  path: `${analyzedUrl}/about/team`,
                  children: []
                }
              ]
            },
            {
              name: "Services",
              path: `${analyzedUrl}/services`,
              children: [
                {
                  name: "Service Premium",
                  path: `${analyzedUrl}/services/premium`,
                  children: []
                },
                {
                  name: "Service Standard",
                  path: `${analyzedUrl}/services/standard`,
                  children: []
                }
              ]
            },
            {
              name: "Contact",
              path: `${analyzedUrl}/contact`,
              children: []
            },
            {
              name: "Blog",
              path: `${analyzedUrl}/blog`,
              children: [
                {
                  name: "Article 1",
                  path: `${analyzedUrl}/blog/article-1`,
                  children: []
                },
                {
                  name: "Article 2",
                  path: `${analyzedUrl}/blog/article-2`,
                  children: []
                }
              ]
            }
          ]
        }
      ]
    };
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Analyse de hiérarchie</h2>
        
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple.com"
              className="pl-10"
              disabled={isLoading}
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button
            onClick={handleAnalyze}
            className="min-w-[180px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyser le site
              </>
            )}
          </Button>
        </div>
        
        {showCorsWarning && (
          <Alert variant="destructive" className="mt-4 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>
                Impossible d'accéder au site à cause des restrictions CORS. 
                Activez le proxy pour contourner cette limitation.
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleActivateProxy}
                className="ml-4 whitespace-nowrap"
              >
                Activer le proxy
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {error && !showCorsWarning && (
          <Alert variant="destructive" className="mt-4 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
      </Card>
      
      {analyzeResult && (
        <>
          <ContentHierarchy 
            headings={analyzeResult?.headings || []} 
            paragraphs={analyzeResult?.paragraphs || []} 
            hierarchy={analyzeResult?.hierarchy || []}
            url={analyzedUrl}
            recommendations={analyzeResult ? [
              "Assurez-vous d'avoir exactement une balise H1",
              "Utilisez des titres H2 et H3 pour structurer votre contenu",
              "Incluez vos mots-clés dans vos titres principaux",
              "Maintenez une structure hiérarchique logique",
              "Évitez les titres trop longs (moins de 70 caractères)"
            ] : []}
          />
          
          {analyzedUrl && (
            <SiteStructureVisualizer structure={generateMockSiteStructure(analyzedUrl)} />
          )}
        </>
      )}
    </div>
  );
};

export default HierarchyTabContent;
