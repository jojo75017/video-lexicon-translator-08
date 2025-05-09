
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, Gauge, ExternalLink, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SeoResults from "@/components/SeoResults";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisSettings from '@/components/settings/AnalysisSettings';
import SeoAnalysisForm from '@/components/seo/analysis/SeoAnalysisForm';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import SeoRoiAnalyzer from '@/components/seo/SeoRoiAnalyzer';
import SeoAuthorityMetrics from '@/components/seo/SeoAuthorityMetrics';
import LoadingSpeedAnalysis from '@/components/seo/LoadingSpeedAnalysis';

const SeoPage = () => {
  const { 
    url, 
    setUrl, 
    isLoading, 
    showCorsWarning, 
    seoAnalysis, 
    analyzeSite, 
    error, 
    handleActivateProxy,
    proxyEnabled
  } = useSiteAnalyzer();
  
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const [activeTab, setActiveTab] = useState("analyse");
  const [simulatedPerformance, setSimulatedPerformance] = useState<any>(null);

  // Activer automatiquement le proxy au chargement de la page
  useEffect(() => {
    // Toujours activer le proxy
    FirecrawlService.enableProxy();
    console.log("Proxy activé automatiquement au chargement de la page SeoPage");
    
    // Si l'URL est déjà définie, lancer l'analyse automatiquement
    if (url && !isLoading && !seoAnalysis) {
      console.log("URL déjà définie, lancement automatique de l'analyse:", url);
      analyzeSite();
    }
  }, []);

  // Fonction pour activer le proxy depuis la page principale
  const activateProxyHandler = () => {
    FirecrawlService.enableProxy();
    
    if (handleActivateProxy) {
      handleActivateProxy();
    }
    
    toast.success("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes"
    });
  };

  // Fonction pour montrer/masquer le test de vitesse
  const handleToggleSpeedTest = () => {
    setShowSpeedTest(!showSpeedTest);
    
    if (!showSpeedTest) {
      setActiveTab("performance");
      
      if (seoAnalysis?.performance) {
        toast.success("Test de vitesse activé", {
          description: "Analyse des performances de chargement en cours"
        });
      }
    }
  };

  // Fonction pour générer un test de performance simulé
  const handleSimulatePerformance = () => {
    const mockPerformance = {
      loadTime: Math.random() * 3000 + 1000,
      firstContentfulPaint: Math.random() * 1000 + 500,
      largestContentfulPaint: Math.random() * 2000 + 1000,
      speedIndex: Math.random() * 3000 + 1500,
      totalBlockingTime: Math.random() * 300 + 100,
      cumulativeLayoutShift: Math.random() * 0.3,
      performanceScore: Math.floor(Math.random() * 30) + 50,
      domLoadTime: Math.random() * 2000 + 800,
      timeToInteractive: Math.random() * 3500 + 1500,
      resourceBreakdown: {
        images: Math.random() * 2000000,
        scripts: Math.random() * 1000000,
        styles: Math.random() * 500000,
        fonts: Math.random() * 300000,
        other: Math.random() * 200000
      },
      resourceCount: Math.floor(Math.random() * 50) + 20,
      scriptCount: Math.floor(Math.random() * 20) + 5,
      styleCount: Math.floor(Math.random() * 10) + 2,
      imageCount: Math.floor(Math.random() * 30) + 10,
      totalSize: Math.random() * 5000000 + 1000000,
      responseTime: Math.random() * 200 + 50,
      cacheLifetime: 3600
    };
    
    setSimulatedPerformance(mockPerformance);
    
    toast.success("Performance simulée générée", {
      description: "Les données de performance ont été générées avec succès"
    });
    
    setActiveTab("performance");
    setShowSpeedTest(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-white border-b p-4 mb-6">
        <div className="container mx-auto flex items-center">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au tableau de bord
            </Button>
          </Link>
          <h1 className="ml-4 text-xl font-bold">Analyse SEO</h1>
          
          <div className="ml-auto flex items-center gap-2">
            {proxyEnabled ? (
              <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Proxy actif
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={activateProxyHandler} className="text-xs">
                Activer le proxy
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <div className="container mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="analyse" className="flex-1">Analyse SEO</TabsTrigger>
            <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
            <TabsTrigger value="roi" className="flex-1">ROI SEO</TabsTrigger>
            <TabsTrigger value="parametres" className="flex-1">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyse">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Search className="h-6 w-6 mr-2 text-purple-600" />
                Analyse SEO complète
              </h2>
              <p className="text-gray-600 mb-6">
                Obtenez une analyse détaillée des éléments SEO de votre site web.
                Cette analyse vous aidera à optimiser votre site pour les moteurs de recherche.
              </p>
              
              <SeoAnalysisForm
                url={url}
                setUrl={setUrl}
                isLoading={isLoading}
                showCorsWarning={showCorsWarning}
                analyzeSite={analyzeSite}
                error={error}
                handleActivateProxy={activateProxyHandler}
              />
              
              {seoAnalysis && (
                <>
                  <SeoAuthorityMetrics seoAnalysis={seoAnalysis} />
                  
                  <div className="flex flex-wrap justify-center gap-3 my-6">
                    <Button 
                      onClick={handleToggleSpeedTest}
                      variant="purple"
                      className="flex items-center gap-2 animate-pulse bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                    >
                      <Gauge className="h-5 w-5" />
                      Tester la vitesse du site
                    </Button>
                    
                    <Button
                      onClick={() => window.open(url, '_blank')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visiter le site
                    </Button>
                  </div>
                  
                  {showSpeedTest && (seoAnalysis.performance || simulatedPerformance) && (
                    <div className="mb-6 transition-all duration-500 ease-in-out">
                      <LoadingSpeedAnalysis performance={seoAnalysis.performance || simulatedPerformance} />
                    </div>
                  )}
                  
                  <SeoResults seoAnalysis={seoAnalysis} />
                </>
              )}
              
              {!seoAnalysis && !isLoading && url && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                  <p className="text-blue-700 font-medium">
                    Aucun résultat d'analyse disponible
                  </p>
                  <p className="text-blue-600 text-sm mt-1">
                    Cliquez sur "Analyser le site" pour lancer l'analyse SEO de {url}
                  </p>
                </div>
              )}
              
              {error && (
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-medium text-amber-800 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Difficultés d'analyse détectées
                  </h3>
                  <p className="text-amber-700 mt-2">{error}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button 
                      variant="amber"
                      size="sm"
                      onClick={activateProxyHandler}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      Réinitialiser le proxy
                    </Button>
                    
                    <Button 
                      variant="amber"
                      size="sm"
                      onClick={handleSimulatePerformance}
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      Simuler l'analyse de performance
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="performance">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Gauge className="h-6 w-6 mr-2 text-blue-600" />
                Test de performance
              </h2>
              <p className="text-gray-600 mb-6">
                Évaluez la vitesse de chargement de votre site web et obtenez des recommandations
                pour améliorer les performances.
              </p>
              
              <SeoAnalysisForm
                url={url}
                setUrl={setUrl}
                isLoading={isLoading}
                showCorsWarning={showCorsWarning}
                analyzeSite={analyzeSite}
                error={error}
                handleActivateProxy={activateProxyHandler}
              />
              
              {error && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">
                    Vous pouvez générer une analyse de performance simulée pour tester la fonctionnalité.
                  </p>
                  <div className="mt-2">
                    <Button onClick={handleSimulatePerformance} className="bg-blue-600">
                      <Zap className="h-4 w-4 mr-2" />
                      Générer une analyse de performance simulée
                    </Button>
                  </div>
                </div>
              )}
              
              {(seoAnalysis?.performance || simulatedPerformance) && (
                <div className="mt-8">
                  <LoadingSpeedAnalysis performance={seoAnalysis?.performance || simulatedPerformance} />
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="roi">
            <SeoRoiAnalyzer />
          </TabsContent>
          
          <TabsContent value="parametres">
            <AnalysisSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeoPage;
