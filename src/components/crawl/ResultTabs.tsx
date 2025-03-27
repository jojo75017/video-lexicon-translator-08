
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Search, ListTree, BarChart, Link2, Globe, Database } from "lucide-react";
import { SiteInfo } from "./SiteInfo";
import { SourceCode } from "./SourceCode";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { getStructureData } from "@/utils/seo/updateUtils";
import ContentHierarchy from "../ContentHierarchy";

interface ResultTabsProps {
  data: any;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  const initialRenderRef = useRef(true);
  
  // Initialize component - show first tab, hide others
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      
      // Set first tab content to be visible and hide the rest
      const sections = document.querySelectorAll('[data-section]');
      sections.forEach((section) => {
        const sectionId = section.getAttribute('data-section');
        (section as HTMLElement).style.display = sectionId === "info" ? "block" : "none";
      });
      
      console.log("ResultTabs initialized - showing info tab");
      
      // Notify user that results are available
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
    
    // Hide all content first
    const allContent = document.querySelectorAll('[data-section]');
    allContent.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Show only selected content
    const selectedContent = document.querySelector(`[data-section="${value}"]`);
    if (selectedContent) {
      (selectedContent as HTMLElement).style.display = 'block';
      
      toast.info(`Affichage de l'onglet ${value}`, {
        description: value === "info" 
          ? "Informations générales sur le site"
          : value === "source" 
            ? "Code source de la page" 
            : "Structure du site et hiérarchie"
      });
    }
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
  const structureData = hasValidHeadings ? data : getStructureData();
  const formattedHeadings = formatHeadings(structureData);
  
  // Extract paragraphs if available
  const paragraphs = data?.paragraphs || [];
  
  // Create a simple hierarchy if none provided
  const hierarchyData = data?.hierarchy || structureData?.hierarchy || [];

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

  console.log("RENDERING TABS with headings:", formattedHeadings.length, "paragraphs:", paragraphs.length);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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

      <TabsContent value="info" className="mt-6 space-y-6">
        <div id="info" data-section="info" className="section-info" style={{display: 'block'}}>
          <SiteInfo data={data} />
        </div>
      </TabsContent>

      <TabsContent value="source" className="mt-6">
        <div id="source" data-section="source" className="section-source" style={{display: 'none'}}>
          <SourceCode sourceCode={data?.sourceCode || "<p>Aucun code source disponible</p>"} />
        </div>
      </TabsContent>
      
      <TabsContent value="structure" className="mt-6">
        <div id="structure" data-section="structure" className="section-structure" style={{display: 'none'}}>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <ContentHierarchy 
              headings={formattedHeadings}
              paragraphs={paragraphs}
              hierarchy={hierarchyData}
              recommendations={recommendations}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
