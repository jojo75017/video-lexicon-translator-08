
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
  
  // Notification lorsque les données sont chargées
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

  // Effet pour gérer les changements d'URL et les interactions externes
  useEffect(() => {
    // Écouteur pour les clics sur les cartes de fonctionnalités
    const handleFeatureClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const featureCard = target.closest('[id^="feature-card-"]');
      
      if (featureCard) {
        const cardId = featureCard.id;
        console.log("Feature card clicked:", cardId);
        
        // Déterminer quel onglet activer en fonction de l'ID de la carte
        if (cardId.includes("structure")) {
          setActiveTab("structure");
        } else if (cardId.includes("backlinks")) {
          setActiveTab("info");
        } else if (cardId.includes("seo")) {
          setActiveTab("info");
        } else if (cardId.includes("hierarchy")) {
          setActiveTab("structure");
        }
      }
    };

    // Ajouter l'écouteur d'événement
    document.addEventListener("click", handleFeatureClick);

    // Nettoyage
    return () => {
      document.removeEventListener("click", handleFeatureClick);
    };
  }, []);

  // Gestionnaire pour le changement d'onglet
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

  // Vérification des données et préparation des données de secours
  const hasValidHeadings = data?.headings && Array.isArray(data.headings) && data.headings.length > 0;
  const structureData = hasValidHeadings ? data : getStructureData();
  console.log("Using structure data:", structureData);

  // Si aucune donnée n'est fournie, ne rien afficher
  if (!data) {
    return null;
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

      <TabsContent value="info" className="mt-6 space-y-6" id="seo">
        <SiteInfo data={data} />
      </TabsContent>

      <TabsContent value="source" className="mt-6" id="source">
        <SourceCode sourceCode={data?.sourceCode || "<p>Aucun code source disponible</p>"} />
      </TabsContent>
      
      <TabsContent value="structure" className="mt-6" id="hierarchy">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Structure du site</h3>
          
          <div className="space-y-4">
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
