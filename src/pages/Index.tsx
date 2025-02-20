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
  Settings,
  Rocket
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ContentHierarchy from '@/components/ContentHierarchy';
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6 drop-shadow-sm">
                Optimisez votre visibilité
              </h1>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Une suite complète d'outils professionnels pour analyser et améliorer votre SEO
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
            <Card 
              className="group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-purple-500"
              onClick={() => document.getElementById('seo')?.click()}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-purple-100 transform transition-all duration-300 group-hover:scale-110">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">SEO</h3>
                <p className="text-xs text-gray-500 hidden lg:block">Analyse complète des facteurs SEO</p>
              </div>
            </Card>

            <Card 
              className="group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-red-500"
              onClick={() => document.getElementById('structure')?.click()}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-red-100 transform transition-all duration-300 group-hover:scale-110">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Structure</h3>
                <p className="text-xs text-gray-500 hidden lg:block">Architecture du site</p>
              </div>
            </Card>

            <Card 
              className="group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-green-500"
              onClick={() => document.getElementById('hierarchy')?.click()}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-green-100 transform transition-all duration-300 group-hover:scale-110">
                  <Database className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Hiérarchie</h3>
                <p className="text-xs text-gray-500 hidden lg:block">Organisation du contenu</p>
              </div>
            </Card>

            <Card 
              className="group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-orange-500"
              onClick={() => document.getElementById('backlinks')?.click()}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-orange-100 transform transition-all duration-300 group-hover:scale-110">
                  <Link2 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Backlinks</h3>
                <p className="text-xs text-gray-500 hidden lg:block">Analyse des liens</p>
              </div>
            </Card>

            <Card 
              className="group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-pink-500"
              onClick={() => document.getElementById('metrics')?.click()}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-pink-100 transform transition-all duration-300 group-hover:scale-110">
                  <ChartBar className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Métriques</h3>
                <p className="text-xs text-gray-500 hidden lg:block">Statistiques</p>
              </div>
            </Card>

            <Card 
              className="group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-yellow-500"
              onClick={() => document.getElementById('advanced')?.click()}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-yellow-100 transform transition-all duration-300 group-hover:scale-110">
                  <Settings className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Avancé</h3>
                <p className="text-xs text-gray-500 hidden lg:block">Options avancées</p>
              </div>
            </Card>

            <Card 
              className="group p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-teal-500"
              onClick={() => document.getElementById('integrations')?.click()}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-xl bg-teal-100 transform transition-all duration-300 group-hover:scale-110">
                  <Hash className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Intégrations</h3>
                <p className="text-xs text-gray-500 hidden lg:block">Outils externes</p>
              </div>
            </Card>
          </div>

          <Card className="p-8 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-0">
            <UrlInput 
              url={url}
              setUrl={setUrl}
              onAnalyze={analyzeSite}
              isLoading={isLoading}
            />
            {showCorsWarning && (
              <div className="mt-6">
                <Alert className="bg-yellow-50 border-yellow-200 mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Pour accéder aux sites web, vous devez d'abord activer le proxy CORS. Cliquez sur le bouton ci-dessous, puis sur "Request temporary access".
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleActivateProxy}
                  variant="outline"
                  className="w-full bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-400 text-yellow-700 font-medium h-auto py-4"
                >
                  <div className="flex flex-col items-center w-full">
                    <span className="flex items-center mb-1">
                      Étape 1: Activer le Proxy CORS
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </span>
                    <span className="text-sm text-yellow-600">
                      Une fois activé, revenez ici pour analyser votre site
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </Card>

          {error && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="seo" className="space-y-6">
          <TabsList className="hidden">
            <TabsTrigger value="seo" id="seo">SEO</TabsTrigger>
            <TabsTrigger value="structure" id="structure">Structure</TabsTrigger>
            <TabsTrigger value="hierarchy" id="hierarchy">Hiérarchie</TabsTrigger>
            <TabsTrigger value="backlinks" id="backlinks">Backlinks</TabsTrigger>
            <TabsTrigger value="metrics" id="metrics">Métriques</TabsTrigger>
            <TabsTrigger value="advanced" id="advanced">Avancé</TabsTrigger>
            <TabsTrigger value="integrations" id="integrations">Intégrations</TabsTrigger>
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
              <Card className="p-12 text-center bg-gradient-to-br from-purple-50 to-blue-50">
                <Rocket className="h-16 w-16 mx-auto mb-6 text-purple-600" />
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Prêt à commencer ?</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Entrez l'URL de votre site ci-dessus pour obtenir une analyse SEO complète et détaillée
                </p>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 font-medium px-8 py-3"
                  onClick={() => document.querySelector('input')?.focus()}
                >
                  Commencer l'analyse
                  <Search className="ml-2 h-5 w-5" />
                </Button>
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
  );
};

export default Index;
