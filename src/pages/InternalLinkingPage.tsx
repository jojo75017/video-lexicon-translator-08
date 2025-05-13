
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from 'react-i18next';
import { Network, AlertCircle, Search, ArrowRight } from 'lucide-react';
import { useSiteAnalyzer } from '@/hooks/useSiteAnalyzer';
import InternalLinkAnalyzer from '@/components/seo/InternalLinkAnalyzer';
import { analyzeInternalLinks } from '@/utils/seo/internal-link';
import { toast } from 'sonner';

const InternalLinkingPage = () => {
  const { t } = useTranslation();
  const { 
    url, 
    setUrl, 
    isLoading, 
    analyzeSite, 
    seoAnalysis, 
    handleActivateProxy, 
    showCorsWarning 
  } = useSiteAnalyzer();
  const [urlInput, setUrlInput] = useState(url || '');

  // Activer automatiquement le proxy au chargement pour éviter les problèmes CORS
  useEffect(() => {
    console.log("Internal Linking Page: Initializing");
    // Auto-enable proxy to avoid CORS issues
    handleActivateProxy();
  }, []);

  const handleAnalyze = async () => {
    if (!urlInput) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    // Format URL if needed
    let formattedUrl = urlInput;
    if (!urlInput.startsWith('http://') && !urlInput.startsWith('https://')) {
      formattedUrl = 'https://' + urlInput;
      setUrlInput(formattedUrl);
    }

    // Set URL in the analyzer context
    setUrl(formattedUrl);
    
    // Start analysis
    try {
      await analyzeSite();
      toast.success("Analyse des liens internes terminée", {
        description: "Les données sont disponibles ci-dessous"
      });
    } catch (error) {
      console.error("Error analyzing site:", error);
      toast.error("Erreur lors de l'analyse", {
        description: "Veuillez vérifier l'URL et réessayer"
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold flex items-center mb-8">
        <Network className="mr-2 h-6 w-6 text-blue-600" />
        {t('internalLinks.pageTitle', 'Analyse des liens internes')}
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">
            {t('internalLinks.analyzeTitle', 'Analyser les liens internes de votre site')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              {t('internalLinks.description', 'Optimisez la structure des liens internes de votre site pour améliorer le référencement, la navigation et l\'expérience utilisateur.')}
            </p>
            
            {showCorsWarning && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{t('common.corsWarning', 'Attention CORS')}</AlertTitle>
                <AlertDescription>
                  {t('common.corsDescription', 'Le proxy est activé pour contourner les restrictions CORS.')}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder={t('common.enterUrl', 'Entrez l\'URL de votre site') as string}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={isLoading || !urlInput}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">◌</span>
                    {t('common.analyzing', 'Analyse...')}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    {t('common.analyze', 'Analyser')}
                  </span>
                )}
              </Button>
            </div>
            
            <Alert>
              <AlertDescription className="text-sm text-gray-600">
                {t('internalLinks.analysisTip', 'L\'analyse des liens internes peut prendre quelques minutes en fonction de la taille de votre site.')}
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Search className="h-4 w-4 text-blue-600" />
              </div>
              {t('internalLinks.benefit1.title', 'Amélioration du SEO')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('internalLinks.benefit1.description', 'Des liens internes optimisés permettent aux moteurs de recherche de mieux comprendre et indexer votre site.')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
              </div>
              {t('internalLinks.benefit2.title', 'Meilleure navigation')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('internalLinks.benefit2.description', 'Créez un parcours utilisateur fluide en reliant logiquement les pages connexes de votre site.')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2 flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <Network className="h-4 w-4 text-purple-600" />
              </div>
              {t('internalLinks.benefit3.title', 'Structure optimisée')}
            </h3>
            <p className="text-sm text-gray-600">
              {t('internalLinks.benefit3.description', 'Identifiez et corrigez les problèmes structurels comme les pages orphelines ou trop profondes.')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Results Section */}
      {seoAnalysis && (
        <InternalLinkAnalyzer 
          analysis={seoAnalysis.internalLinkAnalysis} 
          url={seoAnalysis.url}
        />
      )}
      
      {/* Information Section if no results */}
      {!seoAnalysis && !isLoading && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t('internalLinks.infoTitle', 'Pourquoi les liens internes sont importants')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {t('internalLinks.infoDescription', 'Les liens internes sont essentiels pour une stratégie SEO efficace. Ils permettent de :')}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>{t('internalLinks.infoBullet1', 'Établir une hiérarchie claire du contenu de votre site')}</li>
              <li>{t('internalLinks.infoBullet2', 'Distribuer la puissance des pages à forte autorité vers d\'autres pages')}</li>
              <li>{t('internalLinks.infoBullet3', 'Aider les moteurs de recherche à découvrir et indexer toutes vos pages')}</li>
              <li>{t('internalLinks.infoBullet4', 'Réduire le taux de rebond en gardant les visiteurs plus longtemps sur votre site')}</li>
              <li>{t('internalLinks.infoBullet5', 'Faciliter la navigation et améliorer l\'expérience utilisateur')}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InternalLinkingPage;
