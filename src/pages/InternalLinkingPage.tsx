
import React, { useState, useEffect } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, Network, Info, Key } from 'lucide-react';
import { toast } from 'sonner';
import InternalLinkAnalyzer from '@/components/seo/InternalLinkAnalyzer';
import { PageLinkMetric, OrphanPage } from '@/types/seo/PageLinkMetric';

const InternalLinkingPage = () => {
  const [siteUrl, setSiteUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('seoApiKey') || '');
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<{
    pages: PageLinkMetric[];
    orphanedPages: OrphanPage[];
    totalLinks: number;
    averageDepth: number;
    depthDistribution: Record<string, number>;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!siteUrl) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    setIsAnalyzing(true);
    toast.info("Analyse du maillage interne en cours...");
    
    // For demonstration, we're using mock data
    // In production, this would be a real API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data for demonstration
      const mockData = {
        pages: [
          { url: `${siteUrl}/`, title: "Page d'accueil", incomingLinks: 15, outgoingLinks: 24, depth: 0, importance: 100 },
          { url: `${siteUrl}/about`, title: "À propos", incomingLinks: 8, outgoingLinks: 6, depth: 1, importance: 75 },
          { url: `${siteUrl}/services`, title: "Services", incomingLinks: 10, outgoingLinks: 12, depth: 1, importance: 80 },
          { url: `${siteUrl}/blog`, title: "Blog", incomingLinks: 12, outgoingLinks: 35, depth: 1, importance: 85 },
          { url: `${siteUrl}/contact`, title: "Contact", incomingLinks: 7, outgoingLinks: 2, depth: 1, importance: 60 },
          { url: `${siteUrl}/blog/post-1`, title: "Article de Blog 1", incomingLinks: 3, outgoingLinks: 8, depth: 2, importance: 50 },
          { url: `${siteUrl}/blog/post-2`, title: "Article de Blog 2", incomingLinks: 2, outgoingLinks: 7, depth: 2, importance: 45 },
          { url: `${siteUrl}/services/service-1`, title: "Service 1", incomingLinks: 3, outgoingLinks: 4, depth: 2, importance: 55 },
        ],
        orphanedPages: [
          { url: `${siteUrl}/old-page`, title: "Ancienne Page" },
          { url: `${siteUrl}/resources/download`, title: "Téléchargements" }
        ],
        totalLinks: 98,
        averageDepth: 1.25,
        depthDistribution: { "0": 1, "1": 4, "2": 3 }
      };
      
      setAnalysisData(mockData);
      toast.success("Analyse terminée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast.error("Une erreur est survenue lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('seoApiKey', apiKey);
      toast.success("Clé API sauvegardée avec succès");
      setShowConfig(false);
    } else {
      toast.error("Veuillez entrer une clé API valide");
    }
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
                Analysez et améliorez la structure des liens internes de votre site pour renforcer votre référencement.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <Tabs defaultValue="analyze">
                <TabsList className="w-full">
                  <TabsTrigger value="analyze" className="flex-1">Analyse</TabsTrigger>
                  <TabsTrigger value="settings" className="flex-1">Configuration</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analyze" className="pt-4">
                  <div>
                    <label htmlFor="site-url" className="block text-sm font-medium text-gray-700 mb-1">
                      URL de votre site
                    </label>
                    <div className="flex gap-2">
                      <Input
                        id="site-url"
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !siteUrl}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
                      </Button>
                    </div>
                  </div>
                  
                  {!analysisData && !isAnalyzing && (
                    <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg mt-6">
                      <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Entrez l'URL de votre site pour lancer l'analyse</h3>
                      <p className="text-gray-600">
                        L'outil analysera la structure de liens internes et vous fournira des recommandations d'optimisation.
                      </p>
                    </div>
                  )}
                  
                  {isAnalyzing && (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Configuration de l'API SEO
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Entrez votre clé API"
                          className="flex-1"
                        />
                        <Button 
                          onClick={saveApiKey}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Une clé API est nécessaire pour l'analyse complète. La clé est stockée uniquement dans votre navigateur.
                      </p>
                    </div>
                    
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertDescription className="text-amber-700 text-sm">
                        L'analyse des liens internes nécessite un accès à votre site web.
                        Assurez-vous que votre site est accessible publiquement ou que vous avez autorisé notre crawler.
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Card>
        
        {analysisData && (
          <div className="mt-6">
            <InternalLinkAnalyzer
              pages={analysisData.pages}
              orphanedPages={analysisData.orphanedPages}
              totalLinks={analysisData.totalLinks}
              averageDepth={analysisData.averageDepth}
              depthDistribution={analysisData.depthDistribution}
              siteUrl={siteUrl}
            />
          </div>
        )}
        
        <Card className="p-6 shadow-sm mt-6">
          <h3 className="text-lg font-bold mb-4">Bonnes pratiques pour les liens internes</h3>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-medium">Créez une structure hiérarchique claire</h4>
              <p className="text-sm text-gray-600">Organisez votre contenu de manière logique avec des catégories et sous-catégories bien définies.</p>
            </div>
            
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-medium">Utilisez des ancres pertinentes</h4>
              <p className="text-sm text-gray-600">Évitez les ancres génériques comme "cliquez ici" et préférez des mots-clés descriptifs.</p>
            </div>
            
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-medium">Liez vos pages importantes</h4>
              <p className="text-sm text-gray-600">Assurez-vous que vos pages stratégiques reçoivent suffisamment de liens internes.</p>
            </div>
            
            <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
              <h4 className="font-medium">Limitez la profondeur de navigation</h4>
              <p className="text-sm text-gray-600">Les pages importantes ne devraient pas être à plus de 3-4 clics de la page d'accueil.</p>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default InternalLinkingPage;
