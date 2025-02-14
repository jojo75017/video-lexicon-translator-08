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
  BookOpen
} from "lucide-react";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ContentHierarchy from '@/components/ContentHierarchy';
import UrlInput from '@/components/UrlInput';
import SeoResults from '@/components/SeoResults';
import UrlShortener from '@/components/UrlShortener';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BacklinksAnalysis from '@/components/seo/BacklinksAnalysis';
import { CrawlForm } from '@/components/CrawlForm';
import SocialTags from '@/components/seo/SocialTags';
import { motion } from "framer-motion";
import EbookMockupGenerator from '@/components/ebook/EbookMockupGenerator';

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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Optimisez votre présence en ligne
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Analysez, optimisez et suivez les performances de votre site web avec nos outils professionnels
            </p>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleActivateProxy}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Activer le Proxy CORS 
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
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
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {showCorsWarning && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800">
              Pour utiliser cet outil, vous devez d'abord activer le proxy CORS en cliquant sur le bouton ci-dessus.
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6 shadow-lg bg-white/50 backdrop-blur-sm border-t-4 border-t-blue-600">
          <UrlInput 
            url={url}
            setUrl={setUrl}
            onAnalyze={analyzeSite}
            isLoading={isLoading}
          />
        </Card>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-800">
              Erreur lors de l'analyse : {error}
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          </div>
        )}

        {url && !isLoading && !error && (
          <Tabs defaultValue="seo" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="seo" className="space-x-2 data-[state=active]:bg-blue-50">
                <Search className="h-4 w-4" />
                <span>SEO</span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="space-x-2 data-[state=active]:bg-blue-50">
                <Globe className="h-4 w-4" />
                <span>Structure</span>
              </TabsTrigger>
              <TabsTrigger value="hierarchy" className="space-x-2 data-[state=active]:bg-blue-50">
                <Database className="h-4 w-4" />
                <span>Hiérarchie</span>
              </TabsTrigger>
              <TabsTrigger value="backlinks" className="space-x-2 data-[state=active]:bg-blue-50">
                <Link2 className="h-4 w-4" />
                <span>Backlinks</span>
              </TabsTrigger>
              <TabsTrigger value="metrics" className="space-x-2 data-[state=active]:bg-blue-50">
                <ChartBar className="h-4 w-4" />
                <span>Métriques</span>
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="space-x-2 data-[state=active]:bg-blue-50">
                <Hash className="h-4 w-4" />
                <span>Hashtags</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="space-x-2 data-[state=active]:bg-blue-50">
                <Globe className="h-4 w-4" />
                <span>Outils</span>
              </TabsTrigger>
              <TabsTrigger value="ebook" className="space-x-2 data-[state=active]:bg-blue-50">
                <BookOpen className="h-4 w-4" />
                <span>eBook</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seo" className="space-y-6">
              {seoAnalysis && (
                <SeoResults seoAnalysis={seoAnalysis} />
              )}
            </TabsContent>

            <TabsContent value="structure">
              {siteStructure && (
                <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold mb-4">Structure du Site</h2>
                  <SiteStructureVisualizer structure={siteStructure} />
                </Card>
              )}
            </TabsContent>

            <TabsContent value="hierarchy">
              {seoAnalysis && (
                <ContentHierarchy 
                  headings={seoAnalysis.headings || []} 
                  paragraphs={seoAnalysis.paragraphs || []} 
                />
              )}
            </TabsContent>

            <TabsContent value="backlinks">
              {seoAnalysis && (
                <BacklinksAnalysis 
                  backlinks={seoAnalysis.backlinks}
                  backlinkDetails={seoAnalysis.backlinkDetails}
                  topBacklinkDomains={seoAnalysis.topBacklinkDomains}
                  doFollowBacklinks={seoAnalysis.doFollowBacklinks}
                  noFollowBacklinks={seoAnalysis.noFollowBacklinks}
                />
              )}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-4">Métriques Détaillées</h2>
                {seoAnalysis && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Pages Indexées</p>
                      <p className="text-2xl font-bold text-blue-600">{seoAnalysis.indexability.indexablePages || 0}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Score de Performance</p>
                      <p className="text-2xl font-bold text-green-600">{seoAnalysis.performance.score || 0}/100</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Score Mobile</p>
                      <p className="text-2xl font-bold text-purple-600">{seoAnalysis.mobilePerformance.score || 0}/100</p>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="hashtags" className="space-y-6">
              {seoAnalysis && (
                <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm">
                  <h2 className="text-2xl font-semibold mb-4">Suggestions de Hashtags</h2>
                  <SocialTags socialTags={seoAnalysis.socialTags} />
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <Card className="p-6 shadow-md bg-white/50 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-4">Outils SEO</h2>
                <div className="space-y-6">
                  <CrawlForm />
                  <UrlShortener longUrl={url} />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="ebook" className="space-y-6">
              <EbookMockupGenerator />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <footer className="bg-gray-50 mt-20 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">À propos</h3>
              <p className="text-gray-600">
                Notre plateforme vous aide à optimiser votre présence en ligne avec des outils d'analyse professionnels.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Analyse SEO complète</li>
                <li>Suivi des performances</li>
                <li>Analyse des backlinks</li>
                <li>Suggestions d'optimisation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Guide d'utilisation</li>
                <li>Meilleures pratiques SEO</li>
                <li>Blog</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
