
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, LineChart, Link2, Target, BarChart2, Zap, PieChart, Search, FilePenLine, CheckCircle2 } from "lucide-react";
import HierarchyTabContent from './HierarchyTabContent';
import SeoResults from "@/components/SeoResults";
import { CrawlForm } from "@/components/CrawlForm";
import { useSiteAnalyzer } from "@/hooks/useSiteAnalyzer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TabContentsRendererProps {
  contentTabs: any[];
  activeTab: string;
}

const TabContentsRenderer = ({ contentTabs, activeTab }: TabContentsRendererProps) => {
  const { seoAnalysis } = useSiteAnalyzer();
  const navigate = useNavigate();

  return (
    <>
      {/* Hierarchy Tab */}
      <TabsContent value="hierarchy" className="space-y-4">
        <HierarchyTabContent />
      </TabsContent>

      {/* Word Count Tab */}
      <TabsContent value="wordcount" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold">Audit de contenu</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Analysez un site web</AlertTitle>
            <AlertDescription>
              Utilisez l'outil d'analyse ci-dessous pour évaluer le contenu textuel d'un site.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </div>
      </TabsContent>

      {/* Suggestions Tab */}
      <TabsContent value="suggestions" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Suggestions d'amélioration</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Analysez un site web</AlertTitle>
            <AlertDescription>
              Utilisez l'outil d'analyse ci-dessous pour obtenir des suggestions sur votre contenu.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </div>
      </TabsContent>

      {/* SEO Tab */}
      <TabsContent value="seo" className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold">Analyse SEO</h2>
        </div>
        {seoAnalysis ? (
          <SeoResults seoAnalysis={seoAnalysis} />
        ) : (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Analysez un site web</AlertTitle>
              <AlertDescription>
                Utilisez l'outil d'analyse ci-dessous pour évaluer les performances SEO d'un site.
              </AlertDescription>
            </Alert>
            <CrawlForm />
          </div>
        )}
      </TabsContent>

      {/* Structure Tab */}
      <TabsContent value="structure" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-bold">Structure du site</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Analysez un site web</AlertTitle>
            <AlertDescription>
              Utilisez l'outil d'analyse ci-dessous pour évaluer la structure d'un site.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </div>
      </TabsContent>

      {/* Backlinks Tab */}
      <TabsContent value="backlinks" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold">Analyse des backlinks</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Analysez un site web</AlertTitle>
            <AlertDescription>
              Utilisez l'outil d'analyse ci-dessous pour évaluer les backlinks d'un site.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </div>
      </TabsContent>

      {/* Performance Tab */}
      <TabsContent value="performance" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-bold">Performance</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Analysez un site web</AlertTitle>
            <AlertDescription>
              Utilisez l'outil d'analyse ci-dessous pour évaluer les performances d'un site.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </div>
      </TabsContent>

      {/* Metrics Tab */}
      <TabsContent value="metrics" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="h-6 w-6 text-amber-600" />
            <h2 className="text-xl font-bold">Métriques</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Analysez un site web</AlertTitle>
            <AlertDescription>
              Utilisez l'outil d'analyse ci-dessous pour obtenir les métriques d'un site.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </div>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold">Analytics</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Analysez un site web</AlertTitle>
            <AlertDescription>
              Utilisez l'outil d'analyse ci-dessous pour voir les données analytiques d'un site.
            </AlertDescription>
          </Alert>
          <CrawlForm />
        </div>
      </TabsContent>

      {/* Internal Links Tab */}
      <TabsContent value="internal-links" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold">Liens internes</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Optimisez votre maillage interne</AlertTitle>
            <AlertDescription>
              Analysez et améliorez la structure de liens internes de votre site web.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => navigate('/internal-linking')} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              size="lg"
            >
              <Link2 className="h-5 w-5 mr-2" />
              Accéder à l'analyse des liens internes
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Keyword Meta Tab */}
      <TabsContent value="keyword-meta" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-6 w-6 text-cyan-600" />
            <h2 className="text-xl font-bold">Titles & Meta</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Optimisez vos balises</AlertTitle>
            <AlertDescription>
              Optimisez vos balises title et meta descriptions pour améliorer votre SEO.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => navigate('/keyword-meta')} 
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              size="lg"
            >
              <Target className="h-5 w-5 mr-2" />
              Accéder à l'optimisation des balises
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Keyword Generator Tab */}
      <TabsContent value="keyword-generator" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold">Générateur de mots-clés</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Découvrez de nouveaux mots-clés</AlertTitle>
            <AlertDescription>
              Générez des mots-clés pertinents pour améliorer votre stratégie SEO.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => navigate('/keyword-generator')} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Accéder au générateur de mots-clés
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Quora Tab */}
      <TabsContent value="quora" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold">Quora & Forums</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Réponses optimisées</AlertTitle>
            <AlertDescription>
              Générez des réponses optimisées pour Quora et autres forums.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => navigate('/quora')} 
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Accéder à l'outil Quora
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Signature Tab */}
      <TabsContent value="signature" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FilePenLine className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold">Signature Email</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Créez votre signature</AlertTitle>
            <AlertDescription>
              Créez une signature email professionnelle et personnalisée.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => navigate('/signature')} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <FilePenLine className="h-5 w-5 mr-2" />
              Accéder au générateur de signature
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* Pinterest Tab */}
      <TabsContent value="pinterest" className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FilePenLine className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold">Pinterest</h2>
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Générateur Pinterest</AlertTitle>
            <AlertDescription>
              Créez des images optimisées pour Pinterest avec des descriptions engageantes.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => navigate('/pinterest')} 
              className="bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <FilePenLine className="h-5 w-5 mr-2" />
              Accéder au générateur Pinterest
            </Button>
          </div>
        </div>
      </TabsContent>
    </>
  );
};

export default TabContentsRenderer;
