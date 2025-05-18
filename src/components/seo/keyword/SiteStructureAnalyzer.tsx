
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, FolderTree, Link, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StructureSection from '../StructureSection';
import { toast } from "sonner";

interface SiteStructure {
  name: string;
  children: any[];
  [key: string]: any;
}

const SiteStructureAnalyzer: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [siteStructure, setSiteStructure] = useState<SiteStructure | null>(null);
  const [activeTab, setActiveTab] = useState<string>('structure');
  
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };
  
  const analyzeStructure = async () => {
    if (!url || !url.startsWith('http')) {
      toast.error("Veuillez entrer une URL valide commençant par http:// ou https://");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulating API call to analyze site structure
      setTimeout(() => {
        // Example mock data
        const mockStructure: SiteStructure = {
          name: new URL(url).hostname,
          children: [
            {
              name: "Accueil",
              path: "/",
              children: [
                { name: "À propos", path: "/about", children: [] },
                { name: "Services", path: "/services", children: [
                  { name: "Service 1", path: "/services/service-1", children: [] },
                  { name: "Service 2", path: "/services/service-2", children: [] },
                ]},
                { name: "Blog", path: "/blog", children: [
                  { name: "Article 1", path: "/blog/article-1", children: [] },
                  { name: "Article 2", path: "/blog/article-2", children: [] },
                ]},
                { name: "Contact", path: "/contact", children: [] },
              ]
            }
          ],
          headings: [
            { level: 1, text: "Titre principal" },
            { level: 2, text: "Sous-titre 1" },
            { level: 2, text: "Sous-titre 2" },
            { level: 3, text: "Section 1" },
            { level: 3, text: "Section 2" },
          ],
          links: {
            internal: 24,
            external: 8,
            broken: 2
          },
          depth: 3
        };
        
        setSiteStructure(mockStructure);
        setIsLoading(false);
        toast.success("Structure du site analysée avec succès");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      setIsLoading(false);
      toast.error("Une erreur est survenue lors de l'analyse");
    }
  };
  
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl flex items-center">
          <FolderTree className="h-5 w-5 mr-2 text-blue-500" />
          Analyseur de structure de site
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Entrez l'URL du site à analyser"
              value={url}
              onChange={handleUrlChange}
              className="flex-1"
            />
            <Button 
              onClick={analyzeStructure}
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? "Analyse en cours..." : "Analyser la structure"}
            </Button>
          </div>
          
          {(isLoading || siteStructure) && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="structure" className="flex items-center gap-1">
                  <FolderTree className="h-4 w-4" />
                  Structure
                </TabsTrigger>
                <TabsTrigger value="links" className="flex items-center gap-1">
                  <Link className="h-4 w-4" />
                  Liens
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Contenu
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="structure">
                <StructureSection
                  isLoading={isLoading}
                  siteStructure={siteStructure}
                  onAnalyze={analyzeStructure}
                />
              </TabsContent>
              
              <TabsContent value="links">
                <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-blue-500 rounded-full mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <Link className="h-5 w-5 mr-2" />
                      Analyse des liens
                    </h2>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  ) : siteStructure ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-sm text-gray-500 mb-1">Liens internes</div>
                        <div className="text-2xl font-semibold text-gray-800">
                          {siteStructure.links?.internal || 0}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-sm text-gray-500 mb-1">Liens externes</div>
                        <div className="text-2xl font-semibold text-gray-800">
                          {siteStructure.links?.external || 0}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-sm text-gray-500 mb-1">Liens cassés</div>
                        <div className="text-2xl font-semibold text-red-500">
                          {siteStructure.links?.broken || 0}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <Globe className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">
                        Aucune analyse disponible
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="content">
                <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-6 bg-green-500 rounded-full mr-3"></div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Structure du contenu
                    </h2>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                  ) : siteStructure ? (
                    <div>
                      <h3 className="text-md font-medium mb-3">Structure des titres</h3>
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        {siteStructure.headings?.map((heading: {level: number, text: string}, index: number) => (
                          <div 
                            key={index} 
                            className="py-2 border-b last:border-0 border-gray-100"
                            style={{ marginLeft: `${(heading.level - 1) * 20}px` }}
                          >
                            <div className="flex items-center">
                              <div className={`text-xs px-1.5 py-0.5 rounded ${
                                heading.level === 1 ? 'bg-blue-100 text-blue-700' :
                                heading.level === 2 ? 'bg-green-100 text-green-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                H{heading.level}
                              </div>
                              <div className="ml-2 text-sm">{heading.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500">
                        Aucune analyse disponible
                      </p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          {!isLoading && !siteStructure && (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <FolderTree className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-600 font-medium mb-1">
                Analysez la structure de votre site
              </p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Entrez l'URL de votre site pour analyser sa structure, ses liens et son contenu. 
                Ces informations vous aideront à optimiser votre référencement.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteStructureAnalyzer;
