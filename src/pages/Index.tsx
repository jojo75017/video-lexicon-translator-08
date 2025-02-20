
import React from 'react';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  Search, 
  Globe, 
  AlertCircle,
  Link2, 
  ChartBar, 
  Database,
  Hash, 
  Trophy,
  Zap,
  BarChart3,
  Settings
} from "lucide-react";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ContentHierarchy from '@/components/ContentHierarchy';
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BacklinksAnalysis from '@/components/seo/BacklinksAnalysis';
import KeywordSuggestions from '@/components/seo/KeywordSuggestions';
import MobileAnalysis from '@/components/seo/MobileAnalysis';
import SeoSuggestions from '@/components/seo/SeoSuggestions';
import AdvancedOptimizations from '@/components/seo/AdvancedOptimizations';
import AnalyticsOverview from '@/components/seo/AnalyticsOverview';

const Index = () => {
  const {
    url,
    setUrl,
    isLoading,
    showCorsWarning,
    seoAnalysis,
    siteStructure,
    analyzeSite,
    error
  } = useSiteAnalyzer();

  const handleActivateProxy = () => {
    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
  };

  const features = [
    {
      icon: Search,
      title: "Analyse SEO complète",
      description: "Obtenez une analyse détaillée des facteurs SEO clés de votre site"
    },
    {
      icon: Trophy,
      title: "Meilleures pratiques",
      description: "Recommandations basées sur les standards actuels du web"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Mesures de performances et suggestions d'optimisation"
    },
    {
      icon: BarChart3,
      title: "Statistiques avancées",
      description: "Métriques détaillées et graphiques interactifs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Analyseur SEO
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analysez et optimisez votre site web avec nos outils professionnels
          </p>
          
          {showCorsWarning && (
            <Button 
              onClick={handleActivateProxy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Activer le Proxy CORS 
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-12">
          <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm border-t-4 border-t-blue-600">
            <UrlInput 
              url={url}
              setUrl={setUrl}
              onAnalyze={analyzeSite}
              isLoading={isLoading}
            />
          </Card>

          {error && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-8">
            <Tabs defaultValue="seo" className="space-y-6">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="seo" className="space-x-2">
                  <Search className="h-4 w-4" />
                  <span>SEO</span>
                </TabsTrigger>
                <TabsTrigger value="structure" className="space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Structure</span>
                </TabsTrigger>
                <TabsTrigger value="hierarchy" className="space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Hiérarchie</span>
                </TabsTrigger>
                <TabsTrigger value="backlinks" className="space-x-2">
                  <Link2 className="h-4 w-4" />
                  <span>Backlinks</span>
                </TabsTrigger>
                <TabsTrigger value="metrics" className="space-x-2">
                  <ChartBar className="h-4 w-4" />
                  <span>Métriques</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Avancé</span>
                </TabsTrigger>
                <TabsTrigger value="integrations" className="space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>Intégrations</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seo">
                {isLoading ? (
                  <Card className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </Card>
                ) : seoAnalysis ? (
                  <div className="space-y-6">
                    <SeoResults seoAnalysis={seoAnalysis} />
                    <KeywordSuggestions suggestions={seoAnalysis.keywordSuggestions || []} />
                    <MobileAnalysis 
                      viewportMeta={seoAnalysis.mobileAnalysis?.viewportMeta || false}
                      responsiveImages={seoAnalysis.mobileAnalysis?.responsiveImages || false}
                      touchTargetSize={seoAnalysis.mobileAnalysis?.touchTargetSize || false}
                      fontScale={seoAnalysis.mobileAnalysis?.fontScale || false}
                      score={seoAnalysis.mobileAnalysis?.score || 0}
                    />
                    <SeoSuggestions suggestions={seoAnalysis.technicalSuggestions || []} />
                  </div>
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-gray-500">Entrez une URL et lancez l'analyse pour voir les résultats SEO</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="structure">
                {isLoading ? (
                  <Card className="p-6">
                    <Skeleton className="h-[400px]" />
                  </Card>
                ) : siteStructure ? (
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Structure du Site</h2>
                    <SiteStructureVisualizer structure={siteStructure} />
                  </Card>
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-gray-500">Entrez une URL et lancez l'analyse pour voir la structure du site</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="hierarchy">
                {isLoading ? (
                  <Card className="p-6">
                    <Skeleton className="h-[300px]" />
                  </Card>
                ) : seoAnalysis ? (
                  <ContentHierarchy 
                    headings={seoAnalysis.headings || []} 
                    paragraphs={seoAnalysis.paragraphs || []} 
                  />
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-gray-500">Entrez une URL et lancez l'analyse pour voir la hiérarchie du contenu</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="backlinks">
                {isLoading ? (
                  <Card className="p-6">
                    <Skeleton className="h-[300px]" />
                  </Card>
                ) : seoAnalysis ? (
                  <BacklinksAnalysis 
                    backlinks={seoAnalysis.backlinks}
                    backlinkDetails={seoAnalysis.backlinkDetails}
                    topBacklinkDomains={seoAnalysis.topBacklinkDomains}
                    doFollowBacklinks={seoAnalysis.doFollowBacklinks}
                    noFollowBacklinks={seoAnalysis.noFollowBacklinks}
                  />
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-gray-500">Entrez une URL et lancez l'analyse pour voir les backlinks</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="metrics">
                {isLoading ? (
                  <Card className="p-6">
                    <Skeleton className="h-[400px]" />
                  </Card>
                ) : (
                  <AnalyticsOverview />
                )}
              </TabsContent>

              <TabsContent value="advanced">
                {isLoading ? (
                  <Card className="p-6">
                    <Skeleton className="h-[300px]" />
                  </Card>
                ) : seoAnalysis ? (
                  <AdvancedOptimizations 
                    content={seoAnalysis.paragraphs.map(p => p.text).join(' ')}
                    links={seoAnalysis.backlinkDetails.map(b => b.url)}
                  />
                ) : (
                  <Card className="p-6">
                    <p className="text-center text-gray-500">Entrez une URL et lancez l'analyse pour voir les optimisations avancées</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="integrations">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Intégrations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Button
                      variant="outline"
                      className="p-6 h-auto flex flex-col items-center gap-4"
                      onClick={() => window.open('https://search.google.com/search-console', '_blank')}
                    >
                      <Search className="h-8 w-8" />
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Google Search Console</h3>
                        <p className="text-sm text-gray-600">Connectez-vous pour voir les données en temps réel</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="p-6 h-auto flex flex-col items-center gap-4"
                      onClick={() => window.open('https://analytics.google.com', '_blank')}
                    >
                      <BarChart3 className="h-8 w-8" />
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Google Analytics</h3>
                        <p className="text-sm text-gray-600">Visualisez vos statistiques de trafic</p>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="p-6 h-auto flex flex-col items-center gap-4"
                      disabled
                    >
                      <Hash className="h-8 w-8" />
                      <div className="text-center">
                        <h3 className="font-semibold mb-2">Réseaux Sociaux</h3>
                        <p className="text-sm text-gray-600">Bientôt disponible</p>
                      </div>
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
