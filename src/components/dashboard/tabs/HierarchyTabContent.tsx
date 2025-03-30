
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import ContentHierarchy from '@/components/ContentHierarchy';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Globe } from 'lucide-react';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';

const HierarchyTabContent = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState('');

  useEffect(() => {
    console.log("HierarchyTabContent - Mounted/Updated");
    console.log("Current analyze result:", analyzeResult);
  }, [analyzeResult]);

  const handleAnalyze = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

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
        throw new Error(result.error || "Échec de l'analyse du site");
      }
    } catch (err) {
      console.error("Erreur d'analyse:", err);
      toast.error("Erreur d'analyse", {
        description: err instanceof Error ? err.message : "Une erreur s'est produite"
      });
      
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
    return {
      h1Count: 1,
      h2Count: 3,
      h3Count: 5,
      headings: [
        { text: "Page d'accueil", level: 1, position: 0 },
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
        { text: "Bienvenue sur notre site web. Nous proposons des services de qualité pour tous vos besoins.", position: 0.5 },
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
          text: "Page d'accueil",
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

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Analyse de hiérarchie</h2>
        
        <div className="flex gap-3 mb-6">
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
      </Card>
      
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
    </div>
  );
};

export default HierarchyTabContent;
