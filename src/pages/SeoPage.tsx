
import React, { useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
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

const SeoPage = () => {
  const { 
    url, 
    setUrl, 
    isLoading, 
    showCorsWarning, 
    seoAnalysis, 
    analyzeSite, 
    error, 
    handleActivateProxy
  } = useSiteAnalyzer();

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
        </div>
      </header>
      
      <div className="container mx-auto">
        <Tabs defaultValue="analyse" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="analyse" className="flex-1">Analyse SEO</TabsTrigger>
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
