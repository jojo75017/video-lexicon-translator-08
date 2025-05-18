
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import ContentHierarchy from '@/components/ContentHierarchy';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Globe, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { analyzeHeadings } from '@/utils/seo/headingAnalyzer';
import { analyzePageStructure } from '@/utils/seo/semanticAnalyzer';
import { Alert, AlertDescription } from "@/components/ui/alert";
import SiteStructureVisualizer from '@/components/SiteStructureVisualizer';
import ApiKeyConfig from '@/components/seo/analysis/ApiKeyConfig';

const HierarchyTabContent = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState('');
  const [showCorsWarning, setShowCorsWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // OpenAI API key management - Mise en évidence pour faciliter la compréhension
  const [openaiKey, setOpenaiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    console.log("HierarchyTabContent - Mounted/Updated");
    console.log("Current analyze result:", analyzeResult);
    
    // Chargement de la clé API depuis le localStorage si disponible
    const savedKey = localStorage.getItem('openaiKey');
    if (savedKey) {
      setOpenaiKey(savedKey);
      setApiKeyStatus('unchecked');
      setValidationMessage('Clé API chargée, mais non vérifiée');
    }
  }, [analyzeResult]);

  const handleActivateProxy = () => {
    FirecrawlService.enableProxy();
    toast.success("Proxy CORS activé", {
      description: "L'analyse devrait maintenant fonctionner correctement"
    });
    setShowCorsWarning(false);
    
    // Relancer l'analyse automatiquement
    if (url) {
      handleAnalyze();
    }
  };
  
  const handleApiKeyValidated = () => {
    if (url) {
      handleAnalyze();
    } else {
      toast.info("Clé API validée. Entrez une URL pour analyser un site");
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Reset previous errors
    setError(null);
    setShowCorsWarning(false);

    // Format URL if needed
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    setIsLoading(true);
    
    try {
      // Validate URL format
      new URL(formattedUrl);
      
      toast.info("Analyse en cours", {
        description: "Récupération des données de la page..."
      });
      
      // Activer le proxy pour éviter les problèmes CORS
      FirecrawlService.enableProxy();
      
      // Analyser le site
      const result = await FirecrawlService.crawlWebsite(formattedUrl, true);
      console.log("FirecrawlService result:", result);
      
      if (result.success && result.data) {
        console.log("Données récupérées:", result.data);
        
        // Traitement des données
        const parser = new DOMParser();
        let doc;
        
        if (typeof result.data.sourceCode === 'string') {
          doc = parser.parseFromString(result.data.sourceCode, 'text/html');
        } else if (result.data[0] && typeof result.data[0].sourceCode === 'string') {
          doc = parser.parseFromString(result.data[0].sourceCode, 'text/html');
        } else {
          throw new Error("Format de données invalide");
        }
        
        // Analyse des titres
        const headingStructure = analyzeHeadings(doc);
        const pageStructure = analyzePageStructure(doc);
        
        console.log("Heading structure analyzed:", headingStructure);
        console.log("Page structure analyzed:", pageStructure);
        
        if (headingStructure) {
          // Merge the optimization status from pageStructure
          const enhancedResult = {
            ...headingStructure,
            optimizationStatus: pageStructure.optimizationStatus
          };
          
          setAnalyzeResult(enhancedResult);
          setAnalyzedUrl(formattedUrl);
          toast.success("Analyse terminée avec succès");
          
          // Si une clé OpenAI est disponible et valide, essayer d'améliorer l'analyse avec l'IA
          if (apiKeyStatus === 'valid' && openaiKey) {
            try {
              toast.info("Amélioration de l'analyse avec OpenAI...");
              // Ici, vous pourriez appeler un service OpenAI pour améliorer l'analyse
              // Par exemple: const enhancedAnalysis = await OpenAIService.analyzeContent(...)
            } catch (e) {
              console.error("Erreur lors de l'analyse OpenAI:", e);
              toast.warning("L'analyse OpenAI a échoué, mais l'analyse de base est disponible");
            }
          }
        } else {
          throw new Error("Impossible d'analyser la structure des titres");
        }
      } else {
        console.error("Erreur dans la réponse de FirecrawlService:", result);
        
        // Check if it might be a CORS error
        if (result.error && (
            result.error.includes("CORS") || 
            result.error.includes("cross-origin") ||
            result.error.includes("network") ||
            result.error.includes("failed to fetch")
        )) {
          setShowCorsWarning(true);
          setError("Problème d'accès au site (CORS)");
        } else {
          throw new Error(result.error || "Échec de l'analyse du site");
        }
      }
    } catch (err) {
      console.error("Erreur d'analyse:", err);
      
      // Check if it might be a CORS error
      if (err instanceof Error && (
          err.message.includes("CORS") || 
          err.message.includes("cross-origin") ||
          err.message.includes("network") ||
          err.message.includes("failed to fetch")
      )) {
        setShowCorsWarning(true);
        setError("Problème d'accès au site (CORS)");
      } else {
        toast.error("Erreur d'analyse", {
          description: err instanceof Error ? err.message : "Une erreur s'est produite"
        });
        setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Analyse de hiérarchie</h2>
        
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple.com"
              className="pl-10"
              disabled={isLoading}
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button
            onClick={handleAnalyze}
            className="min-w-[180px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyser le site
              </>
            )}
          </Button>
        </div>
        
        {showCorsWarning && (
          <Alert variant="destructive" className="mt-4 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex justify-between items-center">
              <span>
                Impossible d'accéder au site à cause des restrictions CORS. 
                Activez le proxy pour contourner cette limitation.
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleActivateProxy}
                className="ml-4 whitespace-nowrap"
              >
                Activer le proxy
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {error && !showCorsWarning && (
          <Alert variant="destructive" className="mt-4 mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-6">
          {/* Section de configuration de la clé API - Mise en évidence avec un style distinctif */}
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
            <h3 className="font-medium text-blue-900 mb-2">🔑 Configuration de la clé API OpenAI</h3>
            <p className="text-sm text-blue-800 mb-3">
              Entrez votre clé API OpenAI ci-dessous pour débloquer les fonctionnalités d'analyse avancées
            </p>
            <ApiKeyConfig 
              openaiKey={openaiKey}
              setOpenaiKey={setOpenaiKey}
              apiKeyStatus={apiKeyStatus}
              setApiKeyStatus={setApiKeyStatus}
              validationMessage={validationMessage}
              setValidationMessage={setValidationMessage}
              onKeyValidated={handleApiKeyValidated}
            />
          </div>
        </div>
      </Card>
      
      {analyzeResult ? (
        <ContentHierarchy 
          headings={analyzeResult?.headings || []} 
          paragraphs={analyzeResult?.paragraphs || []} 
          hierarchy={analyzeResult?.hierarchy || []}
          url={analyzedUrl}
          recommendations={[
            "Assurez-vous d'avoir exactement une balise H1",
            "Utilisez des titres H2 et H3 pour structurer votre contenu",
            "Incluez vos mots-clés dans vos titres principaux",
            "Maintenez une structure hiérarchique logique",
            "Évitez les titres trop longs (moins de 70 caractères)"
          ]}
          optimizationStatus={analyzeResult?.optimizationStatus}
        />
      ) : (
        <Card className="p-6 bg-white/50 backdrop-blur-sm text-center">
          <div className="py-12">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Analyse en cours...</h3>
                <p className="text-gray-500 max-w-md mt-2">
                  Nous récupérons et analysons les données du site. Veuillez patienter...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Aucun site analysé</h3>
                <p className="text-gray-500 max-w-md mt-2">
                  Entrez l'URL d'un site web et cliquez sur "Analyser le site" pour voir sa structure hiérarchique.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HierarchyTabContent;
