
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Search, ListTree, BarChart, Link2, Globe, Database } from "lucide-react";
import { SiteInfo } from "./SiteInfo";
import { SourceCode } from "./SourceCode";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getStructureData } from "@/utils/seo/updateUtils";

interface ResultTabsProps {
  data: any;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  const [activeTab, setActiveTab] = useState("info");
  
  // Notification when data is loaded
  useEffect(() => {
    if (data) {
      console.log("ResultTabs received data:", data);
      toast.success("Données chargées avec succès", {
        description: "Explorez les différents onglets pour voir les résultats"
      });
    } else {
      console.log("ResultTabs: No data received");
    }
  }, [data]);

  // Effect to handle URL changes and external interactions
  useEffect(() => {
    // Function to check if a feature card was clicked and update the active tab
    const checkForFeatureCardClick = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const targetSection = urlParams.get('section');
      const targetTab = urlParams.get('tab');
      
      if (targetSection) {
        // Try to find the corresponding tab for this section
        let tabToActivate = targetTab || "info";
        
        if (targetSection === "structure" || targetSection === "hierarchy") {
          tabToActivate = "structure";
        } else if (targetSection === "source") {
          tabToActivate = "source";
        }
        
        setActiveTab(tabToActivate);
        
        // Remove the parameters after handling them
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    // Call once on mount
    checkForFeatureCardClick();
    
    // Listen for clicks on feature cards
    const handleFeatureClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const featureCard = target.closest('[data-feature-id]');
      
      if (featureCard) {
        const featureId = featureCard.getAttribute('data-feature-id') || '';
        const tabValue = featureCard.getAttribute('data-tab-value') || '';
        
        console.log("Feature card clicked:", featureId, "Tab value:", tabValue);
        
        // Determine which tab to activate based on the feature ID
        if (featureId === "structure" || featureId === "hierarchy") {
          setActiveTab("structure");
        } else if (featureId === "source") {
          setActiveTab("source");
        } else {
          setActiveTab(tabValue || "info");
        }
      }
    };

    // Add event listener
    document.addEventListener("click", handleFeatureClick);

    // Cleanup
    return () => {
      document.removeEventListener("click", handleFeatureClick);
    };
  }, []);

  // Tab change handler
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    
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

      <TabsContent value="info" className="mt-6 space-y-6" id="seo" data-section="seo">
        <div id="backlinks" data-section="backlinks" className="section-backlinks">
          <SiteInfo data={data} />
        </div>
      </TabsContent>

      <TabsContent value="source" className="mt-6" id="source" data-section="source">
        <SourceCode sourceCode={data?.sourceCode || "<p>Aucun code source disponible</p>"} />
      </TabsContent>
      
      <TabsContent value="structure" className="mt-6" id="structure" data-section="structure">
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
