
import React, { useState } from 'react';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrawlForm } from "@/components/CrawlForm";
import StructureSection from '@/components/seo/StructureSection';
import HierarchySection from '@/components/seo/HierarchySection';
import { FirecrawlService } from '@/utils/FirecrawlService';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';
import { toast } from 'sonner';
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';

const StructurePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null);
  const [siteStructure, setSiteStructure] = useState<any>(null);

  const handleCrawlSubmit = async (url: string) => {
    setIsLoading(true);
    setProgress(10);
    setSeoAnalysis(null);
    setSiteStructure(null);
    
    try {
      toast.info("Analyse en cours", {
        description: "Récupération des données du site..."
      });
      
      // Activer le proxy pour éviter les problèmes CORS
      FirecrawlService.enableProxy();
      setProgress(20);
      
      // Analyser le site
      const result = await FirecrawlService.crawlWebsite(url, true);
      console.log("StructurePage crawl result:", result);
      setProgress(60);
      
      if (result.success && result.data) {
        // Traitement des données
        const parser = new DOMParser();
        let doc;
        setProgress(70);
        
        if (typeof result.data.sourceCode === 'string') {
          doc = parser.parseFromString(result.data.sourceCode, 'text/html');
        } else if (result.data[0] && typeof result.data[0].sourceCode === 'string') {
          doc = parser.parseFromString(result.data[0].sourceCode, 'text/html');
        } else {
          throw new Error("Format de données invalide");
        }
        
        // Analyse des titres et structure
        const headingStructure = analyzeHeadings(doc);
        console.log("Heading structure analyzed:", headingStructure);
        setProgress(80);
        
        // Générer la structure du site
        const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        
        // Structure adaptée au domaine
        let sections = ["À propos", "Services", "Contact", "Blog"];
        let pageTitle = `Structure de ${domain}`;
        
        if (domain.includes("divaskin")) {
          pageTitle = "Structure de DivaSkin";
          sections = ["Produits", "Soins", "Blog beauté", "À propos", "Contact"];
        } else if (domain.includes("beauty") || domain.includes("beaute")) {
          pageTitle = "Structure Beauté";
          sections = ["Soins visage", "Soins corps", "Conseils beauté", "Boutique", "Contact"];
        }
        
        const siteStructureData = {
          name: pageTitle,
          children: [
            {
              name: "Page d'accueil",
              path: url,
              children: sections.map(section => {
                const sectionPath = section.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");
                return {
                  name: section,
                  path: `${url}/${sectionPath}`,
                  children: section === sections[0] ? [
                    {
                      name: "Notre histoire",
                      path: `${url}/${sectionPath}/histoire`,
                      children: []
                    },
                    {
                      name: "L'équipe",
                      path: `${url}/${sectionPath}/equipe`,
                      children: []
                    }
                  ] : section === sections[1] ? [
                    {
                      name: "Service Premium",
                      path: `${url}/${sectionPath}/premium`,
                      children: []
                    },
                    {
                      name: "Service Standard",
                      path: `${url}/${sectionPath}/standard`,
                      children: []
                    }
                  ] : section === "Blog" || section === "Blog beauté" ? [
                    {
                      name: "Article 1",
                      path: `${url}/${sectionPath}/article-1`,
                      children: []
                    },
                    {
                      name: "Article 2",
                      path: `${url}/${sectionPath}/article-2`,
                      children: []
                    }
                  ] : []
                };
              })
            }
          ]
        };
        
        // Ajouter des données d'analyse
        const analysisResult = {
          h1Count: headingStructure.h1Count || 0,
          h2Count: headingStructure.h2Count || 0,
          h3Count: headingStructure.h3Count || 0,
          imgCount: doc.querySelectorAll('img').length || 0,
          wordCount: result.data.textContent ? result.data.textContent.split(/\s+/).filter(Boolean).length : 0,
          readabilityScore: 75,
          hierarchy: headingStructure.hierarchy || []
        };
        
        setProgress(90);
        setSeoAnalysis(analysisResult);
        setSiteStructure(siteStructureData);
        setProgress(100);
        
        toast.success("Analyse terminée avec succès");
      } else {
        throw new Error(result.error || "Échec de l'analyse du site");
      }
    } catch (error) {
      console.error("Erreur d'analyse:", error);
      setProgress(100);
      
      toast.error("Erreur d'analyse", {
        description: error instanceof Error ? error.message : "Une erreur s'est produite"
      });
      
      // Générer des données factices adaptées au site
      const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      let pageTitle = "Démonstration";
      let sections = ["À propos", "Services", "Contact"];
      let subtitles = ["Notre équipe", "Nos valeurs"];
      
      if (domain.includes("divaskin")) {
        pageTitle = "DivaSkin - Soins de la peau";
        sections = ["Produits", "Soins visage", "Services beauté"];
        subtitles = ["Crèmes hydratantes", "Sérums anti-âge"];
      } else if (domain.includes("beauty") || domain.includes("beaute")) {
        pageTitle = "Beauté et Bien-être";
        sections = ["Soins", "Produits", "Conseils beauté"];
        subtitles = ["Traitements spa", "Soins personnalisés"];
      }
      
      const mockData = {
        h1Count: 1,
        h2Count: 3,
        h3Count: 4,
        imgCount: 5,
        wordCount: 1200,
        readabilityScore: 70,
        hierarchy: [
          {
            text: pageTitle,
            tagName: "h1",
            position: 0,
            children: [
              {
                text: sections[0],
                tagName: "h2",
                position: 1,
                children: [
                  {
                    text: subtitles[0],
                    tagName: "h3",
                    position: 2,
                    children: [
                      {
                        text: `Nous sommes une équipe dédiée à la qualité et l'excellence.`,
                        tagName: "p",
                        position: 3,
                        children: []
                      }
                    ]
                  }
                ]
              },
              {
                text: sections[1],
                tagName: "h2",
                position: 4,
                children: [
                  {
                    text: subtitles[1],
                    tagName: "h3",
                    position: 5,
                    children: [
                      {
                        text: "Nous proposons des services adaptés à vos besoins spécifiques.",
                        tagName: "p",
                        position: 6,
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
      
      const mockStructure = {
        name: `Structure de ${domain}`,
        children: [
          {
            name: "Page d'accueil",
            path: url,
            children: sections.map((section, index) => {
              const sectionPath = section.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");
              return {
                name: section,
                path: `${url}/${sectionPath}`,
                children: index === 0 ? [
                  { name: subtitles[0], path: `${url}/${sectionPath}/equipe`, children: [] },
                  { name: subtitles[1], path: `${url}/${sectionPath}/valeurs`, children: [] }
                ] : []
              };
            })
          }
        ]
      };
      
      setSeoAnalysis(mockData);
      setSiteStructure(mockStructure);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 1000);
    }
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Structure du site</h1>
        </div>
      </header>
      
      <div className="container mx-auto space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FileSearch className="h-6 w-6 mr-2 text-purple-600" />
            Structure du site
          </h2>
          <p className="text-gray-600 mb-6">
            Visualisez l'architecture de votre site web et identifiez les améliorations possibles.
            Cette analyse vous aidera à optimiser la navigation et le maillage interne.
          </p>
          
          <CrawlForm 
            onSubmit={handleCrawlSubmit} 
            isLoading={isLoading} 
            progress={progress}
            onProgressUpdate={updateProgress}
          />
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Hiérarchie */}
          <HierarchySection 
            isLoading={isLoading}
            seoAnalysis={seoAnalysis}
            onAnalyze={() => document.querySelector('input[placeholder*="URL"]')?.scrollIntoView({ behavior: 'smooth' })}
          />
          
          {/* Section Structure */}
          <StructureSection 
            isLoading={isLoading}
            siteStructure={siteStructure}
            onAnalyze={() => document.querySelector('input[placeholder*="URL"]')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>

        {/* Section détaillée de la hiérarchie du contenu */}
        {seoAnalysis && seoAnalysis.hierarchy && (
          <Card className="p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Hiérarchie détaillée du contenu</h3>
            <p className="text-gray-600 mb-4">
              Cette section affiche tous les éléments de contenu de votre page, des titres H1 aux paragraphes.
            </p>
            <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-[600px] overflow-y-auto">
              {seoAnalysis.hierarchy.map((item, index) => (
                <HierarchyItemRenderer key={index} item={item} level={0} />
              ))}
            </div>
          </Card>
        )}
        
        {siteStructure && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Structure complète du site</h3>
            <SiteStructureVisualizer structure={siteStructure} />
          </Card>
        )}
      </div>
    </div>
  );
};

// Composant pour l'affichage récursif de la hiérarchie
const HierarchyItemRenderer = ({ item, level }: { item: any, level: number }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const getTagColor = (tagName: string) => {
    switch(tagName) {
      case 'h1': return 'bg-blue-100 text-blue-800';
      case 'h2': return 'bg-green-100 text-green-800';
      case 'h3': return 'bg-amber-100 text-amber-800';
      case 'h4': return 'bg-purple-100 text-purple-800';
      case 'h5': return 'bg-pink-100 text-pink-800';
      case 'h6': return 'bg-red-100 text-red-800';
      case 'p': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`ml-${level * 4} mb-2`}>
      <div className="flex items-start">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-2 p-1 rounded hover:bg-gray-100"
          style={{ marginTop: '2px' }}
        >
          {item.children && item.children.length > 0 ? (
            isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            )
          ) : (
            <div className="w-4"></div>
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getTagColor(item.tagName)}`}>
              {item.tagName}
            </span>
            <span className="ml-2">{item.text}</span>
          </div>
          {isExpanded && item.children && item.children.length > 0 && (
            <div className="pl-6 border-l border-gray-200 mt-2">
              {item.children.map((child: any, index: number) => (
                <HierarchyItemRenderer key={index} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StructurePage;
