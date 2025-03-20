import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Search, ListTree, BarChart, Link2, Globe, Database } from "lucide-react";
import { SiteInfo } from "./SiteInfo";
import { SourceCode } from "./SourceCode";
import { toast } from "sonner";
import { useState } from "react";
import { getStructureData } from "@/utils/seo/updateUtils";

interface ResultTabsProps {
  data: any;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  
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
    }
    
    toast.info(`Affichage de l'onglet ${value}`, {
      description: value === "info" 
        ? "Informations générales sur le site"
        : value === "source" 
          ? "Code source de la page" 
          : "Structure du site et hiérarchie"
    });
  };

  // Check data and prepare fallback data
  const hasValidHeadings = data?.headings && Array.isArray(data.headings) && data.headings.length > 0;
  const structureData = hasValidHeadings ? data : getStructureData();
  
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

      <TabsContent value="info" className="mt-6 space-y-6" id="seo" data-section="info" style={{ display: activeTab === "info" ? "block" : "none" }}>
        <div id="backlinks" data-section="backlinks" className="section-backlinks">
          <SiteInfo data={data} />
        </div>
      </TabsContent>

      <TabsContent value="source" className="mt-6" id="source" data-section="source" style={{ display: activeTab === "source" ? "block" : "none" }}>
        <SourceCode sourceCode={data?.sourceCode || "<p>Aucun code source disponible</p>"} />
      </TabsContent>
      
      <TabsContent value="structure" className="mt-6" id="structure" data-section="structure" style={{ display: activeTab === "structure" ? "block" : "none" }}>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Structure du site</h3>
          
          <div id="hierarchy" data-section="hierarchy" className="section-hierarchy space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Hiérarchie des titres</h4>
              <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                {structureData && structureData.headings && structureData.headings.length > 0 ? (
                  structureData.headings.map((heading: any, index: number) => (
                    <div 
                      key={index} 
                      className={`py-1.5 px-3 rounded-md ${
                        heading.level === "h1" ? 'bg-blue-50 font-bold ml-0' : 
                        heading.level === "h2" ? 'bg-blue-50/60 font-semibold ml-4' : 
                        heading.level === "h3" ? 'bg-blue-50/30 ml-8' : 
                        'bg-gray-50 ml-12'
                      }`}
                    >
                      {`${heading.level.toUpperCase()}: ${heading.text}`}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Aucune donnée de titres disponible</div>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Recommandations</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Assurez-vous d'avoir un seul titre H1 par page</li>
                <li>Utilisez des H2 et H3 de manière hiérarchique</li>
                <li>Incluez des mots-clés importants dans vos titres</li>
                <li>Gardez une structure cohérente sur l'ensemble du site</li>
              </ul>
            </div>
            
            {structureData && structureData.recommendations && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Recommandations spécifiques</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  {structureData.recommendations.map((recommendation: string, index: number) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
