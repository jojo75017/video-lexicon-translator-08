
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Search, ListTree } from "lucide-react";
import { SiteInfo } from "./SiteInfo";
import { SourceCode } from "./SourceCode";
import { toast } from "sonner";
import { useEffect } from "react";

interface ResultTabsProps {
  data: any;
}

export const ResultTabs = ({ data }: ResultTabsProps) => {
  // Notification lorsque les données sont chargées
  useEffect(() => {
    if (data) {
      toast.success("Données chargées avec succès", {
        description: "Explorez les différents onglets pour voir les résultats"
      });
    }
  }, [data]);

  // Gestionnaire pour le changement d'onglet
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    toast.info(`Affichage de l'onglet ${value}`, {
      description: value === "info" 
        ? "Informations générales sur le site"
        : value === "source" 
          ? "Code source de la page" 
          : "Structure du site et hiérarchie"
    });
  };

  return (
    <Tabs defaultValue="info" className="w-full" onValueChange={handleTabChange}>
      <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1 rounded-lg">
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
      </TabsList>

      <TabsContent value="info" className="mt-6 space-y-6">
        <SiteInfo data={data} />
      </TabsContent>

      <TabsContent value="source" className="mt-6">
        <SourceCode sourceCode={data.sourceCode} />
      </TabsContent>
      
      <TabsContent value="structure" className="mt-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Structure du site</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Hiérarchie des titres</h4>
              <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                {data.headings ? (
                  data.headings.map((heading: any, index: number) => (
                    <div 
                      key={index} 
                      className={`py-1.5 px-3 rounded-md ${
                        heading.level === 1 ? 'bg-blue-50 font-bold ml-0' : 
                        heading.level === 2 ? 'bg-blue-50/60 font-semibold ml-4' : 
                        heading.level === 3 ? 'bg-blue-50/30 ml-8' : 
                        'bg-gray-50 ml-12'
                      }`}
                    >
                      {`H${heading.level}: ${heading.text}`}
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
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
