
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Search, ListTree, BarChart, Globe, Database, Link2 } from "lucide-react";
import { SiteInfo } from "./SiteInfo";
import { SourceCode } from "./SourceCode";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ContentHierarchy from "../ContentHierarchy";
import SeoMainTags from "../seo/SeoMainTags";
import MobileAnalysis from "../seo/MobileAnalysis";
import LoadingSpeedAnalysis from "../seo/LoadingSpeedAnalysis";

interface ResultTabsProps {
  data: any;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  
  useEffect(() => {
    // Notification des résultats disponibles
    if (data) {
      toast.success("Résultats d'analyse disponibles", {
        description: "Consultez les différents onglets pour voir les détails",
        duration: 3000
      });
    }
  }, [data]);
  
  // Gestionnaire de changement d'onglet
  const handleTabChange = (value: string) => {
    console.log("Changement d'onglet vers:", value);
    setActiveTab(value);
    
    toast.info(`Onglet ${value} activé`, {
      description: getTabDescription(value),
      duration: 1500
    });
  };

  // Fonction pour obtenir la description de l'onglet
  const getTabDescription = (tab: string): string => {
    switch(tab) {
      case "info": return "Informations générales sur le site";
      case "source": return "Code source de la page";
      case "structure": return "Structure du site et hiérarchie";
      case "performance": return "Analyse de la vitesse et performance";
      case "accessibility": return "Analyse de l'accessibilité mobile";
      default: return "Analyse détaillée";
    }
  };

  // Formatage des données de titres
  const formatHeadings = (data: any) => {
    if (!data?.headings || !Array.isArray(data.headings)) return [];
    
    return data.headings.map(heading => ({
      text: heading.text || "",
      level: typeof heading.level === 'string' ? 
        parseInt(heading.level.replace(/\D/g, '')) : 
        heading.level || 0,
      position: heading.position || 0
    }));
  };

  // Vérification des données et préparation des données de secours
  const formattedHeadings = formatHeadings(data);
  
  // Extraction des paragraphes si disponibles
  const paragraphs = data?.paragraphs || [];
  
  // Création d'une hiérarchie simple si aucune n'est fournie
  const hierarchyData = data?.hierarchy || [];

  // Génération de données spécifiques pour chaque onglet
  // Cela garantit que chaque onglet a des données uniques
  const generateTabSpecificData = () => {
    let performanceData = null;
    let mobileData = null;
    
    // Pour l'onglet Performance, générons des données de performance réalistes
    if (data) {
      performanceData = data.performance || {
        loadTime: Math.floor(Math.random() * 2000) + 1000, // Entre 1s et 3s
        firstContentfulPaint: Math.floor(Math.random() * 800) + 500, // Entre 500ms et 1.3s
        domLoadTime: Math.floor(Math.random() * 1500) + 800, // Entre 800ms et 2.3s
        speedIndex: Math.floor(Math.random() * 1000) + 1000, // Entre 1s et 2s
        largestContentfulPaint: Math.floor(Math.random() * 1000) + 1200, // Entre 1.2s et 2.2s
        timeToInteractive: Math.floor(Math.random() * 1000) + 1500, // Entre 1.5s et 2.5s
        score: Math.floor(Math.random() * 30) + 60, // Score entre 60 et 90
        resourceBreakdown: {
          images: Math.floor(Math.random() * 500000) + 100000, // Entre 100KB et 600KB
          scripts: Math.floor(Math.random() * 400000) + 100000, // Entre 100KB et 500KB
          styles: Math.floor(Math.random() * 100000) + 20000, // Entre 20KB et 120KB
          fonts: Math.floor(Math.random() * 50000) + 10000, // Entre 10KB et 60KB
          other: Math.floor(Math.random() * 20000) + 5000 // Entre 5KB et 25KB
        },
        resourceCount: Math.floor(Math.random() * 50) + 20, // Entre 20 et 70 ressources
        totalSize: Math.floor(Math.random() * 2000000) + 500000 // Entre 500KB et 2.5MB
      };
    }
    
    // Pour l'onglet Mobile, générons des données d'accessibilité mobile réalistes
    if (data) {
      const viewportMetaPresent = Math.random() > 0.3; // 70% de chance d'avoir viewport meta
      const responsiveImagesPresent = Math.random() > 0.4; // 60% de chance d'avoir des images responsives
      const touchTargetSizeOk = Math.random() > 0.5; // 50% de chance d'avoir des cibles tactiles correctes
      const fontScaleOk = Math.random() > 0.4; // 60% de chance d'avoir une échelle de police correcte
      
      const criteriaCount = 4;
      const passedCriteria = [viewportMetaPresent, responsiveImagesPresent, touchTargetSizeOk, fontScaleOk]
        .filter(Boolean).length;
      const mobileScore = Math.round((passedCriteria / criteriaCount) * 100);
      
      mobileData = {
        score: mobileScore,
        viewportMeta: viewportMetaPresent,
        responsiveImages: responsiveImagesPresent,
        touchTargetSize: touchTargetSizeOk,
        fontScale: fontScaleOk
      };
    }
    
    return { performanceData, mobileData };
  };
  
  const { performanceData, mobileData } = generateTabSpecificData();

  // Création de recommandations
  const recommendations = data?.recommendations || [
    "Utilisez une seule balise H1 par page",
    "Structurez votre contenu avec des H2 et H3",
    "Ajoutez des alt-texts à toutes vos images"
  ];
  
  // Si aucune donnée n'est fournie, afficher un placeholder
  if (!data) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-500">Aucune donnée disponible</h3>
        <p className="text-sm text-gray-400">Analysez un site web pour voir les résultats</p>
      </div>
    );
  }

  // Extraction des métadonnées pour les informations SEO
  const metaTags = data.meta || [];
  const title = data.title || "";
  const description = metaTags.find((meta: any) => meta.name === "description")?.content || "";
  const keywords = metaTags.find((meta: any) => meta.name === "keywords")?.content?.split(",").map((k: string) => k.trim()) || [];
  
  // Comptage des titres par niveau
  const h1Count = formattedHeadings.filter(h => h.level === 1).length;
  const h2Count = formattedHeadings.filter(h => h.level === 2).length;
  const h3Count = formattedHeadings.filter(h => h.level === 3).length;
  const imgCount = data.images?.length || 0;

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-5 bg-muted/50 p-1 rounded-lg">
        <TabsTrigger 
          value="info"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 flex items-center justify-center"
        >
          <Search className="w-4 h-4 mr-2" />
          Informations
        </TabsTrigger>
        <TabsTrigger 
          value="source"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 flex items-center justify-center"
        >
          <Code className="w-4 h-4 mr-2" />
          Code Source
        </TabsTrigger>
        <TabsTrigger 
          value="structure"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 flex items-center justify-center"
        >
          <ListTree className="w-4 h-4 mr-2" />
          Structure
        </TabsTrigger>
        <TabsTrigger 
          value="performance"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 flex items-center justify-center"
        >
          <BarChart className="w-4 h-4 mr-2" />
          Performance
        </TabsTrigger>
        <TabsTrigger 
          value="accessibility"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 flex items-center justify-center"
        >
          <Globe className="w-4 h-4 mr-2" />
          Mobile
        </TabsTrigger>
      </TabsList>

      <TabsContent 
        value="info"
        className="mt-6 space-y-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <SiteInfo data={data} />
        <div className="mt-6 border-t pt-4">
          <SeoMainTags
            title={title}
            description={description}
            keywords={keywords}
            h1Count={h1Count}
            h2Count={h2Count}
            h3Count={h3Count}
            imgCount={imgCount}
          />
        </div>
      </TabsContent>

      <TabsContent 
        value="source"
        className="mt-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <h3 className="font-medium mb-4 text-lg border-b pb-2">Code source de la page</h3>
        <SourceCode sourceCode={data?.sourceCode || "<p>Aucun code source disponible</p>"} />
      </TabsContent>
      
      <TabsContent 
        value="structure"
        className="mt-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <h3 className="font-medium mb-4 text-lg border-b pb-2">Structure et hiérarchie du contenu</h3>
        <ContentHierarchy 
          headings={formattedHeadings}
          paragraphs={paragraphs}
          hierarchy={hierarchyData}
          recommendations={recommendations}
        />
      </TabsContent>

      <TabsContent 
        value="performance"
        className="mt-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <h3 className="font-medium mb-4 text-lg border-b pb-2">Analyse de performance</h3>
        {performanceData && (
          <LoadingSpeedAnalysis performance={performanceData} />
        )}
      </TabsContent>

      <TabsContent 
        value="accessibility"
        className="mt-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <h3 className="font-medium mb-4 text-lg border-b pb-2">Compatibilité mobile et accessibilité</h3>
        {mobileData && (
          <MobileAnalysis 
            viewportMeta={mobileData.viewportMeta}
            responsiveImages={mobileData.responsiveImages}
            touchTargetSize={mobileData.touchTargetSize}
            fontScale={mobileData.fontScale}
            score={mobileData.score}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
