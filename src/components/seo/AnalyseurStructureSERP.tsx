
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ListTree, Code, AlertTriangle, Loader2, ExternalLink, Shield } from 'lucide-react';
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const AnalyseurStructureSERP = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showCorsWarning, setShowCorsWarning] = useState<boolean>(false);

  const handleActivateProxy = () => {
    FirecrawlService.enableProxy();
    setShowCorsWarning(false);
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes",
    });
  };

  const handleProxyDemoClick = () => {
    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
    toast("Redirection vers CORS demo", {
      description: "Activez le service de démo, puis revenez ici",
    });
  };

  const analyzeSite = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Vérifier si l'URL contient un protocole
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    try {
      // Valider le format de l'URL
      new URL(formattedUrl);
    } catch {
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    setShowCorsWarning(false);
    setResult(null);

    try {
      // Simuler une progression pour une meilleure expérience utilisateur
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      console.log('Analyse du site en cours:', formattedUrl);
      const crawlResult = await FirecrawlService.crawlWebsite(formattedUrl);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (crawlResult.success) {
        setResult(crawlResult.data);
        toast.success("Analyse terminée", {
          description: "Site analysé avec succès",
        });
      } else {
        if (crawlResult.error && (crawlResult.error.includes('CORS') || crawlResult.error.includes('Failed to fetch'))) {
          setShowCorsWarning(true);
          toast.warning("Erreur CORS détectée", {
            description: "Activez le proxy pour analyser ce site",
          });
        } else {
          setError(crawlResult.error || "Erreur d'analyse inconnue");
          toast.error("Erreur d'analyse", {
            description: crawlResult.error || "Une erreur s'est produite lors de l'analyse",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse du site:', error);
      setError(error instanceof Error ? error.message : "Une erreur s'est produite");
      toast.error("Erreur lors de l'analyse", {
        description: "Impossible d'analyser le site web",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">
          Analyse de la structure SERP
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4 text-gray-600">
          Analysez un site web pour comprendre sa structure et son apparence dans les résultats de recherche
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Entrez une URL (ex: exemple.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && analyzeSite()}
            />
            <Button 
              onClick={analyzeSite} 
              disabled={isLoading || !url}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>

          {isLoading && (
            <div className="space-y-2 py-4">
              <p className="text-sm text-center text-gray-500">Analyse en cours...</p>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {showCorsWarning && (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Erreur d'accès CORS détectée
              </h3>
              <p className="text-yellow-700 mb-3">
                Les restrictions de sécurité du navigateur empêchent l'accès au site. 
                Activez notre proxy CORS pour contourner cette limitation et continuer l'analyse.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleActivateProxy}
                  className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Activer le proxy CORS
                </Button>
                <Button
                  variant="outline"
                  onClick={handleProxyDemoClick}
                  className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Activer service CORS externe
                </Button>
              </div>
            </div>
          )}

          {error && !showCorsWarning && (
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <h3 className="font-medium text-red-800 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Erreur d'analyse
              </h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!result && !isLoading && !error && !showCorsWarning && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-500">Aucun site web analysé</h3>
              <p className="text-sm text-gray-400">
                Pour voir l'analyse de la structure SERP, commencez par analyser un site web.
              </p>
            </div>
          )}

          {result && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
              <TabsList className="w-full grid grid-cols-3 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="info"
                  className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Aperçu SERP
                </TabsTrigger>
                <TabsTrigger 
                  value="structure"
                  className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  <ListTree className="w-4 h-4 mr-2" />
                  Structure
                </TabsTrigger>
                <TabsTrigger 
                  value="source"
                  className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Code Source
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Aperçu SERP</h3>
                  
                  <div className="mb-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center mb-1 text-xs text-gray-500">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {result.url || url}
                    </div>
                    <h4 className="text-xl text-blue-600 font-medium mb-1 hover:underline cursor-pointer">
                      {result.title || "Titre non défini"}
                    </h4>
                    <p className="text-sm text-gray-800">
                      {result.meta?.find((m: any) => m.name === 'description')?.content || "Aucune description trouvée pour cette page."}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Métadonnées</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Titre</span>
                          <span className="text-sm">{result.title ? `${result.title.length} caractères` : "Non défini"}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Description</span>
                          <span className="text-sm">
                            {result.meta?.find((m: any) => m.name === 'description')?.content 
                              ? `${result.meta.find((m: any) => m.name === 'description').content.length} caractères` 
                              : "Non définie"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Balises Open Graph</span>
                          <span className="text-sm">
                            {result.meta?.some((m: any) => m.property?.startsWith('og:')) ? "Présentes" : "Absentes"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Balises Twitter Card</span>
                          <span className="text-sm">
                            {result.meta?.some((m: any) => m.name?.startsWith('twitter:')) ? "Présentes" : "Absentes"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Structure du contenu</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Titres H1</span>
                          <span className="text-sm">{result.headings?.filter((h: any) => h.level === 'h1')?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Titres H2</span>
                          <span className="text-sm">{result.headings?.filter((h: any) => h.level === 'h2')?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Titres H3</span>
                          <span className="text-sm">{result.headings?.filter((h: any) => h.level === 'h3')?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100">
                          <span className="text-sm font-medium">Images</span>
                          <span className="text-sm">{result.images?.length || 0} (dont {result.images?.filter((img: any) => !img.alt)?.length || 0} sans alt)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="structure" className="mt-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Structure Hiérarchique</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Hiérarchie des titres</h4>
                    <div className="pl-4 border-l-2 border-blue-200 space-y-2">
                      {result.headings && result.headings.length > 0 ? (
                        result.headings.map((heading: any, index: number) => (
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
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Recommandations</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Assurez-vous d'avoir un seul titre H1 par page</li>
                      <li>Utilisez des H2 et H3 de manière hiérarchique</li>
                      <li>Incluez des mots-clés importants dans vos titres</li>
                      <li>Gardez une structure cohérente sur l'ensemble du site</li>
                      {result.headings?.filter((h: any) => h.level === 'h1')?.length !== 1 && (
                        <li className="text-red-600">Cette page contient {result.headings?.filter((h: any) => h.level === 'h1')?.length || 0} titre(s) H1. Il est recommandé d'avoir exactement un H1 par page.</li>
                      )}
                      {result.images?.filter((img: any) => !img.alt)?.length > 0 && (
                        <li className="text-amber-600">Cette page contient {result.images?.filter((img: any) => !img.alt)?.length || 0} image(s) sans attribut alt. Ajoutez des descriptions alt pour l'accessibilité et le SEO.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="source" className="mt-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold mb-4">Code Source</h3>
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
                      <code className="language-html">
                        {result.sourceCode || "<p>Aucun code source disponible</p>"}
                      </code>
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyseurStructureSERP;
