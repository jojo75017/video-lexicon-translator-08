
import React, { useEffect, useRef } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, LineChart } from "lucide-react";
import HierarchyTabContent from './HierarchyTabContent';
import SeoResults from "@/components/SeoResults";
import { CrawlForm } from "@/components/CrawlForm";
import { useSiteAnalyzer } from "@/hooks/useSiteAnalyzer";
import { useNavigate } from "react-router-dom";
import { activateSection } from '@/utils/navigationHelpers';
import { toast } from "sonner";
import RankingTracker from "@/components/seo/RankingTracker";
import { Button } from "@/components/ui/button";

interface TabContentsRendererProps {
  contentTabs: any[];
  activeTab: string;
}

const TabContentsRenderer = ({ contentTabs, activeTab }: TabContentsRendererProps) => {
  const firstLoad = useRef(true);
  const { seoAnalysis } = useSiteAnalyzer();
  const navigate = useNavigate();

  // Effet pour gérer l'affichage au premier chargement
  useEffect(() => {
    console.log(`TabContentsRenderer: Initialisation pour l'onglet actif ${activeTab}`);
    
    if (firstLoad.current) {
      firstLoad.current = false;
      setTimeout(() => {
        // Activer la section appropriée
        activateSection(activeTab);
      }, 100);
    }
  }, []);

  useEffect(() => {
    console.log(`TabContentsRenderer: Active tab changed to ${activeTab}`);
    
    // Mise à jour de l'affichage quand l'onglet actif change
    setTimeout(() => {
      // Activer la section
      activateSection(activeTab);

      // Définir les redirections spéciales
      const specialTabs = {
        'internal-links': '/internal-linking',
        'pinterest': '/pinterest',
        'signature': '/signature',
        'keyword-meta': '/keyword-meta',
        'keyword-generator': '/keyword-generator',
        'quora': '/quora',
        'rankings': '/tracking'
      };
      
      // Ne rediriger que si l'onglet spécial est actif et que nous sommes pas dans une boucle
      if (activeTab in specialTabs) {
        const redirectPath = specialTabs[activeTab as keyof typeof specialTabs];
        const currentPath = window.location.pathname;
        
        if (currentPath !== redirectPath && !sessionStorage.getItem(`redirect_${activeTab}`)) {
          console.log(`Redirecting from ${currentPath} to ${redirectPath}`);
          
          // Marquer cette redirection pour éviter les boucles
          sessionStorage.setItem(`redirect_${activeTab}`, 'true');
          
          navigate(redirectPath);
          
          toast.info(`Navigation vers ${activeTab}`, {
            description: "Chargement de la page...",
            duration: 1500
          });
          
          // Effacer le marqueur après un délai
          setTimeout(() => {
            sessionStorage.removeItem(`redirect_${activeTab}`);
          }, 1000);
        }
      }
    }, 100);
  }, [activeTab, navigate, seoAnalysis]);

  // Si aucun onglet n'est trouvé
  if (!contentTabs || contentTabs.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Aucun onglet disponible. Veuillez vérifier la configuration.
        </AlertDescription>
      </Alert>
    );
  }

  // Le reste du rendu des onglets
  return (
    <>
      {/* Hierarchy Tab */}
      <TabsContent value="hierarchy" id="hierarchy" data-section="hierarchy" style={{
        display: activeTab === "hierarchy" || window.location.pathname === '/' ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <HierarchyTabContent />
      </TabsContent>

      {/* Word Count Tab */}
      <TabsContent value="wordcount" id="wordcount" data-section="wordcount" style={{
        display: activeTab === "wordcount" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Analyse du nombre de mots</h2>
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
      <TabsContent value="suggestions" id="suggestions" data-section="suggestions" style={{
        display: activeTab === "suggestions" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Suggestions d'amélioration</h2>
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
      
      {/* Rankings Tab */}
      <TabsContent value="rankings" id="rankings" data-section="rankings" style={{
        display: activeTab === "rankings" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <LineChart className="h-5 w-5 text-purple-600" />
            Suivi des positions
          </h2>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Suivez vos positions</AlertTitle>
            <AlertDescription>
              Suivez l'évolution de vos positions dans les moteurs de recherche pour vos mots-clés importants.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 rounded-lg">
            <LineChart className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">Suivez vos positions Google</h3>
            <p className="text-gray-600 mb-4 text-center max-w-md">
              Visualisez l'évolution de vos positions dans les moteurs de recherche pour vos mots-clés importants.
            </p>
            <Button onClick={() => navigate('/tracking')} className="bg-purple-600 hover:bg-purple-700">
              Accéder au suivi des positions
            </Button>
          </div>
        </div>
      </TabsContent>

      {/* SEO Tab */}
      <TabsContent value="seo" id="seo" data-section="seo" style={{
        display: activeTab === "seo" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        {seoAnalysis ? (
          <SeoResults seoAnalysis={seoAnalysis} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Analyse SEO</h2>
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
      <TabsContent value="structure" id="structure" data-section="structure" style={{
        display: activeTab === "structure" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Structure du site</h2>
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
      <TabsContent value="backlinks" id="backlinks" data-section="backlinks" style={{
        display: activeTab === "backlinks" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Analyse des backlinks</h2>
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
      <TabsContent value="performance" id="performance" data-section="performance" style={{
        display: activeTab === "performance" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Performance</h2>
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
      <TabsContent value="metrics" id="metrics" data-section="metrics" style={{
        display: activeTab === "metrics" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Métriques</h2>
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
      <TabsContent value="analytics" id="analytics" data-section="analytics" style={{
        display: activeTab === "analytics" ? "block" : "none",
        position: "relative" as "relative",
        top: 0,
        left: 0,
        width: "100%",
        height: "auto",
      }}>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Analytics</h2>
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
      
      {/* Fallback for any other tab */}
      {contentTabs
        .filter(tab => !['hierarchy', 'wordcount', 'suggestions', 'seo', 'structure', 'backlinks', 'performance', 'metrics', 'analytics', 'keyword-meta', 'internal-links', 'rankings'].includes(tab.id))
        .map(tab => (
          <TabsContent key={tab.id} value={tab.id} id={tab.id} data-section={tab.id} style={{
            display: activeTab === tab.id ? "block" : "none",
            position: "relative" as "relative",
            top: 0,
            left: 0,
            width: "100%",
            height: "auto",
          }}>
            <Skeleton className="h-[200px] w-full rounded-md" />
          </TabsContent>
        ))}
    </>
  );
};

export default TabContentsRenderer;
