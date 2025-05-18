
import React, { useState, useEffect } from 'react';
import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link2, Network, Info, Key, FileText } from 'lucide-react';
import { toast } from 'sonner';
import InternalLinkAnalyzer from '@/components/seo/InternalLinkAnalyzer';
import { PageLinkMetric, OrphanPage, InternalLinkRecommendation } from '@/types/seo/InternalLinks';

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
    recommendations: InternalLinkRecommendation[];
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
      
      // Generate more comprehensive mock data
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
          { url: `${siteUrl}/blog/post-3`, title: "Article de Blog 3", incomingLinks: 1, outgoingLinks: 5, depth: 3, importance: 35 },
          { url: `${siteUrl}/blog/post-4`, title: "Article de Blog 4", incomingLinks: 1, outgoingLinks: 4, depth: 3, importance: 30 },
          { url: `${siteUrl}/services/service-2`, title: "Service 2", incomingLinks: 2, outgoingLinks: 2, depth: 2, importance: 40 }
        ],
        orphanedPages: [
          { url: `${siteUrl}/old-page`, title: "Ancienne Page", suggestions: [`${siteUrl}/about`, `${siteUrl}/blog`] },
          { url: `${siteUrl}/resources/download`, title: "Téléchargements", suggestions: [`${siteUrl}/services`, `${siteUrl}/blog`] },
          { url: `${siteUrl}/faq`, title: "Questions fréquentes", suggestions: [`${siteUrl}/services/service-1`, `${siteUrl}/contact`] }
        ],
        recommendations: [
          {
            type: 'add',
            priority: 'high',
            source: `${siteUrl}/blog`,
            target: `${siteUrl}/old-page`,
            description: `Ajouter un lien depuis "Blog" vers la page orpheline "Ancienne Page"`,
            reason: "Cette page orpheline ne peut pas être indexée car aucune page ne pointe vers elle."
          },
          {
            type: 'add',
            priority: 'high',
            source: `${siteUrl}/services`,
            target: `${siteUrl}/resources/download`,
            description: `Ajouter un lien depuis "Services" vers la page orpheline "Téléchargements"`,
            reason: "Cette page contient des ressources importantes mais n'est pas accessible."
          },
          {
            type: 'modify',
            priority: 'medium',
            source: `${siteUrl}/`,
            target: `${siteUrl}/blog/post-3`,
            description: `Améliorer l'accessibilité de "Article de Blog 3"`,
            reason: `Cette page est profondément enfouie (niveau 3). Ajoutez un lien direct depuis la page d'accueil.`
          },
          {
            type: 'content',
            priority: 'medium',
            source: `${siteUrl}/blog/post-1`,
            target: `${siteUrl}/blog/post-2`,
            description: `Ajouter des liens contextuels depuis "Article de Blog 1" vers "Article de Blog 2"`,
            reason: "Ces articles sont thématiquement liés et gagneraient à être interconnectés."
          },
          {
            type: 'content',
            priority: 'medium',
            source: `${siteUrl}/services/service-1`,
            target: `${siteUrl}/services/service-2`,
            description: `Ajouter des liens contextuels depuis "Service 1" vers "Service 2"`,
            reason: "Ces services sont complémentaires et devraient être interconnectés."
          },
          {
            type: 'pillar',
            priority: 'low',
            source: `${siteUrl}/blog`,
            target: '',
            description: `Utilisez "Blog" comme contenu pilier pour votre stratégie éditoriale`,
            reason: "Cette page a une autorité élevée et pourrait servir de contenu pilier pour structurer votre maillage thématique."
          }
        ],
        totalLinks: 109,
        averageDepth: 1.55,
        depthDistribution: { "0": 1, "1": 4, "2": 4, "3": 2 }
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
                  <TabsTrigger value="guide" className="flex-1">Guide d'optimisation</TabsTrigger>
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

                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Options d'analyse</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Profondeur d'analyse</h4>
                          <select className="w-full p-2 border border-gray-300 rounded">
                            <option value="3">3 niveaux (Rapide)</option>
                            <option value="5">5 niveaux (Standard)</option>
                            <option value="0">Site entier (Approfondi)</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Définit la profondeur maximale de l'analyse des liens.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium mb-2">Exclusions</h4>
                          <Input placeholder="/admin/*, /wp-login.php" className="mb-2" />
                          <p className="text-xs text-gray-500">
                            Pages à exclure de l'analyse (séparées par des virgules).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="guide" className="pt-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium mb-2 text-blue-800 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Guide d'optimisation du maillage interne
                      </h3>
                      <p className="text-sm text-gray-700">
                        Le maillage interne est une stratégie SEO essentielle qui consiste à lier vos pages entre elles de manière stratégique. Voici comment l'optimiser :
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                        <h4 className="font-medium">1. Créez une structure hiérarchique</h4>
                        <p className="text-sm text-gray-600">Organisez votre contenu en catégories et sous-catégories logiques. Liens de navigation vers les pages principales, puis liens contextuels entre pages connexes.</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-green-500 bg-green-50">
                        <h4 className="font-medium">2. Utilisez des ancres pertinentes</h4>
                        <p className="text-sm text-gray-600">Les textes d'ancrage doivent être descriptifs et contenir des mots-clés pertinents. Évitez les "cliquez ici" ou "en savoir plus".</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                        <h4 className="font-medium">3. Créez des contenus piliers</h4>
                        <p className="text-sm text-gray-600">Développez des pages de référence exhaustives sur des thèmes importants, puis liez les articles connexes vers ces pages piliers.</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
                        <h4 className="font-medium">4. Limitez la profondeur</h4>
                        <p className="text-sm text-gray-600">Les pages importantes ne devraient pas être à plus de 3-4 clics de la page d'accueil. Réduisez les niveaux de navigation.</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-red-500 bg-red-50">
                        <h4 className="font-medium">5. Éliminez les pages orphelines</h4>
                        <p className="text-sm text-gray-600">Assurez-vous que toutes vos pages soient accessibles par au moins un lien interne depuis une autre page du site.</p>
                      </div>
                      
                      <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
                        <h4 className="font-medium">6. Équilibrez la densité</h4>
                        <p className="text-sm text-gray-600">Visez 3-10 liens internes par page, placés naturellement dans le contenu pour une meilleure expérience utilisateur.</p>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg mt-4">
                      <h4 className="font-medium mb-2">Modèles de structuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-white rounded border">
                          <h5 className="text-sm font-medium mb-1">Structure en silo</h5>
                          <p className="text-xs text-gray-600">Organisation par thèmes, avec des liens verticaux entre pages de même thème.</p>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <h5 className="text-sm font-medium mb-1">Structure en toile</h5>
                          <p className="text-xs text-gray-600">Interconnexion entre toutes les pages pertinentes, sans hiérarchie stricte.</p>
                        </div>
                        <div className="p-3 bg-white rounded border">
                          <h5 className="text-sm font-medium mb-1">Structure hybride</h5>
                          <p className="text-xs text-gray-600">Combinaison de silos thématiques avec des liens transversaux stratégiques.</p>
                        </div>
                      </div>
                    </div>
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
              recommendations={analysisData.recommendations}
            />
          </div>
        )}
        
        <Card className="p-6 shadow-sm mt-6">
          <h3 className="text-lg font-bold mb-4">Conseils d'optimisation du maillage</h3>
          
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <h4 className="font-medium">Renforcez vos pages importantes</h4>
              <p className="text-sm text-gray-600">Identifiez vos pages stratégiques et assurez-vous qu'elles reçoivent plus de liens internes que les autres.</p>
            </div>
            
            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-medium">Créez des liens contextuels pertinents</h4>
              <p className="text-sm text-gray-600">Les liens dans le corps du texte ont plus de valeur SEO que les liens de navigation ou de pied de page.</p>
            </div>
            
            <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
              <h4 className="font-medium">Mise à jour régulière</h4>
              <p className="text-sm text-gray-600">Actualisez votre maillage interne quand vous ajoutez du contenu pour intégrer les nouveaux articles.</p>
            </div>
            
            <div className="p-4 border-l-4 border-amber-500 bg-amber-50">
              <h4 className="font-medium">Équilibrez le PageRank</h4>
              <p className="text-sm text-gray-600">Distribuez la valeur SEO entre vos pages importantes en créant un réseau de liens stratégique.</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-blue-800 mb-3">
                Pour une analyse complète de votre site et des recommandations personnalisées,
                utilisez notre service d'audit SEO complet
              </p>
              <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                Demander un audit complet
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDashboard>
  );
};

export default InternalLinkingPage;
