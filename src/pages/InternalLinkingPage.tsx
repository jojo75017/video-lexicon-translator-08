
import React, { useState } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, Network, Info, Search, Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const InternalLinkingPage = () => {
  const [siteUrl, setSiteUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!siteUrl.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Format URL if needed
    let formattedUrl = siteUrl.trim();
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      formattedUrl = 'https://' + siteUrl;
    }

    setIsAnalyzing(true);
    toast.info("Analyse du maillage interne en cours...");
    
    try {
      // Valider l'URL
      new URL(formattedUrl);
      
      console.log("Starting internal link analysis for:", formattedUrl);
      
      // Simuler une analyse
      setTimeout(() => {
        const mockAnalysis = {
          totalPages: 25,
          totalLinks: 156,
          orphanedPages: 3,
          averageDepth: 2.4,
          recommendations: [
            "Créer des liens vers les pages orphelines",
            "Améliorer la structure de navigation",
            "Ajouter des liens contextuels dans le contenu"
          ]
        };
        
        setAnalysisData(mockAnalysis);
        setIsAnalyzing(false);
        toast.success("Analyse terminée avec succès");
      }, 3000);
      
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast.error("Une erreur est survenue lors de l'analyse");
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyze();
  };

  return (
    <UnifiedDashboard>
      <div className="container mx-auto py-4">
        <Card className="p-6 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Link2 className="h-6 w-6 text-blue-600" />
              Analyse des liens internes
            </h2>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Optimisez votre maillage interne</AlertTitle>
              <AlertDescription>
                Analysez et obtenez des suggestions concrètes de liens à ajouter dans vos articles pour améliorer votre référencement.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <Tabs defaultValue="analyze">
                <TabsList className="w-full">
                  <TabsTrigger value="analyze" className="flex-1">Analyse</TabsTrigger>
                  <TabsTrigger value="guide" className="flex-1">Guide d'optimisation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analyze" className="pt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-url" className="text-sm font-medium">URL de votre site</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="site-url"
                            value={siteUrl}
                            onChange={(e) => setSiteUrl(e.target.value)}
                            placeholder="https://example.com"
                            disabled={isAnalyzing}
                            className="pl-10"
                          />
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        <Button 
                          type="submit"
                          disabled={isAnalyzing || !siteUrl.trim()}
                          className="min-w-[140px] bg-blue-600 hover:bg-blue-700"
                        >
                          {isAnalyzing ? (
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
                    </div>
                  </form>
                  
                  {!analysisData && !isAnalyzing && (
                    <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg mt-6">
                      <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Entrez l'URL de votre site pour lancer l'analyse</h3>
                      <p className="text-gray-600">
                        L'outil analysera la structure de liens internes et vous fournira des suggestions concrètes de liens à ajouter dans vos articles.
                      </p>
                    </div>
                  )}
                  
                  {isAnalyzing && (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}

                  {analysisData && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Résultats de l'analyse</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4">
                          <div className="text-sm font-medium text-gray-600">Pages totales</div>
                          <div className="text-2xl font-bold">{analysisData.totalPages}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-sm font-medium text-gray-600">Liens internes</div>
                          <div className="text-2xl font-bold">{analysisData.totalLinks}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-sm font-medium text-gray-600">Pages orphelines</div>
                          <div className="text-2xl font-bold text-red-600">{analysisData.orphanedPages}</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-sm font-medium text-gray-600">Profondeur moyenne</div>
                          <div className="text-2xl font-bold">{analysisData.averageDepth}</div>
                        </Card>
                      </div>
                      
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">Recommandations</h4>
                        <div className="space-y-2">
                          {analysisData.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-gray-700">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="guide" className="pt-4">
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium mb-2 text-blue-800">Guide d'optimisation du maillage interne</h3>
                      <p className="text-sm text-gray-700">
                        Le maillage interne est une stratégie SEO essentielle qui consiste à lier vos pages entre elles de manière stratégique.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                        <h4 className="font-medium">1. Créez une structure hiérarchique</h4>
                        <p className="text-sm text-gray-600">Organisez votre contenu en catégories et sous-catégories logiques.</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-green-500 bg-green-50">
                        <h4 className="font-medium">2. Utilisez des ancres pertinentes</h4>
                        <p className="text-sm text-gray-600">Les textes d'ancrage doivent être descriptifs et contenir des mots-clés pertinents.</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                        <h4 className="font-medium">3. Créez des contenus piliers</h4>
                        <p className="text-sm text-gray-600">Développez des pages de référence exhaustives sur des thèmes importants.</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
                        <h4 className="font-medium">4. Limitez la profondeur</h4>
                        <p className="text-sm text-gray-600">Les pages importantes ne devraient pas être à plus de 3-4 clics de la page d'accueil.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default InternalLinkingPage;
