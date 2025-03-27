
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Search, ListTree, BarChart, Link2, Globe, Database } from "lucide-react";
import { SiteInfo } from "./SiteInfo";
import { SourceCode } from "./SourceCode";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import ContentHierarchy from "../ContentHierarchy";
import SeoMainTags from "../seo/SeoMainTags";

interface ResultTabsProps {
  data: any;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const initialRenderRef = useRef(true);
  const tabsInitializedRef = useRef(false);
  
  // Initialize component - show first tab, hide others
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      // Ensure all TabsContent are properly configured
      document.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
        const value = panel.getAttribute('value');
        if (value !== activeTab) {
          (panel as HTMLElement).style.display = 'none';
        } else {
          (panel as HTMLElement).style.display = 'block';
        }
      });
      
      console.log("ResultTabs initialized - showing info tab");
      
      // Notify user that results are available
      if (data) {
        toast.success("Résultats d'analyse disponibles", {
          description: "Consultez les différents onglets pour voir les détails",
          duration: 3000
        });
      }
    }
  }, [data, activeTab]);
  
  // Make sure tabs are properly set up when data changes
  useEffect(() => {
    if (data && !tabsInitializedRef.current) {
      tabsInitializedRef.current = true;
      
      // Reset all tabs
      document.querySelectorAll('[role="tabpanel"]').forEach((el) => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Show active tab
      const activePanel = document.querySelector(`[role="tabpanel"][value="${activeTab}"]`);
      if (activePanel) {
        (activePanel as HTMLElement).style.display = 'block';
      }
      
      console.log("Tabs initialized with new data, active tab:", activeTab);
    }
  }, [data, activeTab]);
  
  // Tab change handler
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    
    // Hide all content first
    document.querySelectorAll('[role="tabpanel"]').forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Show only selected content with a slight delay
    setTimeout(() => {
      // Find TabsContent with the matching value
      const selectedContent = document.querySelector(`[role="tabpanel"][value="${value}"]`);
      if (selectedContent) {
        (selectedContent as HTMLElement).style.display = 'block';
        
        toast.info(`Affichage de l'onglet ${value}`, {
          description: value === "info" 
            ? "Informations générales sur le site"
            : value === "source" 
              ? "Code source de la page" 
              : "Structure du site et hiérarchie",
          duration: 1500
        });
      }
    }, 100);
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

  console.log("RENDERING TABS with data:", { 
    title,
    headings: formattedHeadings.length, 
    h1Count, 
    h2Count, 
    h3Count,
    imgCount,
    hasSourceCode: !!data.sourceCode,
    sourceLength: data.sourceCode?.length || 0
  });

  return (
    <Tabs defaultValue="info" value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1 rounded-lg">
        <TabsTrigger 
          value="info"
          data-value="info"
          id="tab-info"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <Search className="w-4 h-4 mr-2" />
          Informations
        </TabsTrigger>
        <TabsTrigger 
          value="source"
          data-value="source"
          id="tab-source"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <Code className="w-4 h-4 mr-2" />
          Code Source
        </TabsTrigger>
        <TabsTrigger 
          value="structure"
          data-value="structure"
          id="tab-structure"
          className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
        >
          <ListTree className="w-4 h-4 mr-2" />
          Structure
        </TabsTrigger>
      </TabsList>

      <TabsContent 
        value="info" 
        data-value="info"
        className="mt-6 space-y-6"
      >
        <div className="bg-white p-4 rounded-lg border border-gray-200">
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
        </div>
      </TabsContent>

      <TabsContent 
        value="source" 
        data-value="source"
        className="mt-6"
      >
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-4 text-lg border-b pb-2">Code source de la page</h3>
          <SourceCode sourceCode={data?.sourceCode || "<p>Aucun code source disponible</p>"} />
        </div>
      </TabsContent>
      
      <TabsContent 
        value="structure" 
        data-value="structure"
        className="mt-6"
      >
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-4 text-lg border-b pb-2">Structure et hiérarchie du contenu</h3>
          <ContentHierarchy 
            headings={formattedHeadings}
            paragraphs={paragraphs}
            hierarchy={hierarchyData}
            recommendations={recommendations}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
