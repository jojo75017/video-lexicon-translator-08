
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Search, ListTree, BarChart, Link2, Globe, Database } from "lucide-react";
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
    // Notify user that results are available
    if (data) {
      toast.success("Résultats d'analyse disponibles", {
        description: "Consultez les différents onglets pour voir les détails",
        duration: 3000
      });
    }
  }, [data]);
  
  // Tab change handler
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    
    toast.info(`Onglet ${value} activé`, {
      description: value === "info" 
        ? "Informations générales sur le site"
        : value === "source" 
          ? "Code source de la page" 
          : value === "structure"
            ? "Structure du site et hiérarchie"
            : value === "performance"
              ? "Analyse de la vitesse et performance"
              : "Analyse de l'accessibilité",
      duration: 1500
    });
  };

  // Format headings data correctly
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

  // Check data and prepare fallback data
  const hasValidHeadings = data?.headings && Array.isArray(data.headings) && data.headings.length > 0;
  const formattedHeadings = formatHeadings(data);
  
  // Extract paragraphs if available
  const paragraphs = data?.paragraphs || [];
  
  // Create a simple hierarchy if none provided
  const hierarchyData = data?.hierarchy || [];

  // Create recommendations
  const recommendations = data?.recommendations || [
    "Utilisez une seule balise H1 par page",
    "Structurez votre contenu avec des H2 et H3",
    "Ajoutez des alt-texts à toutes vos images"
  ];
  
  // If no data is provided, show a placeholder
  if (!data) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-500">Aucune donnée disponible</h3>
        <p className="text-sm text-gray-400">Analysez un site web pour voir les résultats</p>
      </div>
    );
  }

  // Extract metadata for SEO info
  const metaTags = data.meta || [];
  const title = data.title || "";
  const description = metaTags.find((meta: any) => meta.name === "description")?.content || "";
  const keywords = metaTags.find((meta: any) => meta.name === "keywords")?.content?.split(",").map((k: string) => k.trim()) || [];
  
  // Count headings by level
  const h1Count = formattedHeadings.filter(h => h.level === 1).length;
  const h2Count = formattedHeadings.filter(h => h.level === 2).length;
  const h3Count = formattedHeadings.filter(h => h.level === 3).length;
  const imgCount = data.images?.length || 0;

  // Create mock performance data if not available
  const performanceData = data.performance || {
    loadTime: 2500,
    firstContentfulPaint: 850,
    domLoadTime: 1500,
    speedIndex: 1800,
    largestContentfulPaint: 1600,
    timeToInteractive: 2200,
    score: 75,
    resourceBreakdown: {
      images: 580000,
      scripts: 480000,
      styles: 120000,
      fonts: 60000,
      other: 10000
    }
  };

  // Create mock mobile data if not available
  const mobileData = data.mobileAnalysis || {
    score: 80,
    viewportMeta: true,
    responsiveImages: true,
    touchTargetSize: true,
    fontScale: true
  };

  console.log("RENDERING TABS with data:", { 
    title,
    headings: formattedHeadings.length, 
    h1Count, 
    h2Count, 
    h3Count,
    imgCount,
    hasSourceCode: !!data.sourceCode,
    sourceLength: data.sourceCode?.length || 0,
    activeTab
  });

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-5 bg-muted/50 p-1 rounded-lg">
        <TabsTrigger 
          value="info"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <Search className="w-4 h-4 mr-2" />
          Informations
        </TabsTrigger>
        <TabsTrigger 
          value="source"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <Code className="w-4 h-4 mr-2" />
          Code Source
        </TabsTrigger>
        <TabsTrigger 
          value="structure"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <ListTree className="w-4 h-4 mr-2" />
          Structure
        </TabsTrigger>
        <TabsTrigger 
          value="performance"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <BarChart className="w-4 h-4 mr-2" />
          Performance
        </TabsTrigger>
        <TabsTrigger 
          value="accessibility"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
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
        <LoadingSpeedAnalysis performance={performanceData} />
      </TabsContent>

      <TabsContent 
        value="accessibility"
        className="mt-6 bg-white p-4 rounded-lg border border-gray-200"
      >
        <h3 className="font-medium mb-4 text-lg border-b pb-2">Compatibilité mobile et accessibilité</h3>
        <MobileAnalysis 
          viewportMeta={mobileData.viewportMeta}
          responsiveImages={mobileData.responsiveImages}
          touchTargetSize={mobileData.touchTargetSize}
          fontScale={mobileData.fontScale}
          score={mobileData.score}
        />
      </TabsContent>
    </Tabs>
  );
};
