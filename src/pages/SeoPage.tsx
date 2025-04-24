
import React, { useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CrawlForm } from "@/components/CrawlForm";
import SeoResults from "@/components/SeoResults";
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalysisSettings from '@/components/settings/AnalysisSettings';

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
    apiKey
  } = useSiteAnalyzer();

  useEffect(() => {
    // Debug log
    console.log("SeoPage - API Key status: ", apiKey ? "Présente" : "Absente");
  }, [apiKey]);

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
              
              <CrawlForm />
              
              {seoAnalysis && <SeoResults seoAnalysis={seoAnalysis} />}
            </Card>
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
