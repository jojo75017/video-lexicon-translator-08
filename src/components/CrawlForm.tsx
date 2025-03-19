
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card } from "@/components/ui/card";
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { CrawlInput } from './crawl/CrawlInput';
import { ResultTabs } from './crawl/ResultTabs';
import '@/styles/scrollbar.css';
import { toast } from "sonner";

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  data?: any[];
  error?: string;
}

export const CrawlForm = () => {
  const { toast: uiToast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [hasPerformedAnalysis, setHasPerformedAnalysis] = useState(false);
  const [showCorsWarning, setShowCorsWarning] = useState(false);
  const [isForbiddenError, setIsForbiddenError] = useState(false);

  const handleActivateProxy = () => {
    console.log("Activating proxy in CrawlForm");
    FirecrawlService.enableProxy();
    setShowCorsWarning(false);
    toast("Proxy CORS activé", {
      description: "Vous pouvez maintenant analyser des sites externes",
    });
  };

  const handleProxyDemoClick = () => {
    console.log("Opening CORS demo in CrawlForm");
    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
    toast("Redirection vers CORS demo", {
      description: "Activez le service de démo, puis revenez ici",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with URL:", url);
    
    if (!url) {
      toast("URL requise", {
        description: "Veuillez entrer une URL à analyser",
      });
      return;
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      toast("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)",
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);
    setHasPerformedAnalysis(true);
    setShowCorsWarning(false);
    setIsForbiddenError(false);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      console.log('Starting analysis for URL:', url);
      const result = await FirecrawlService.crawlWebsite(url);
      
      clearInterval(progressInterval);
      
      if (result.success) {
        setProgress(100);
        toast("Succès", {
          description: "Site web analysé avec succès",
        });
        setCrawlResult(result);
      } else {
        // Check if this is a 403 CORS error
        if (result.error && result.error.includes('403')) {
          setIsForbiddenError(true);
        }
        // Check if this is a CORS error
        else if (result.error && (result.error.includes('CORS') || result.error.includes('proxy'))) {
          setShowCorsWarning(true);
        }
        
        toast("Erreur", {
          description: result.error || "Échec de l'analyse du site",
        });
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast("Erreur", {
        description: "Échec de l'analyse du site",
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <Card className="p-6 backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-gray-200 dark:border-gray-800">
        <CrawlInput
          url={url}
          isLoading={isLoading}
          progress={progress}
          onUrlChange={(e) => setUrl(e.target.value)}
          onSubmit={handleSubmit}
        />

        {showCorsWarning && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Erreur d'accès CORS</h3>
              <p className="text-amber-700 text-sm mb-2">
                Pour analyser des sites externes, vous devez activer le proxy CORS.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    handleActivateProxy();
                  }}
                  className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-md"
                >
                  Activer le proxy CORS
                </Button>
              </div>
            </div>
          </div>
        )}

        {isForbiddenError && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Erreur 403 Forbidden</h3>
              <p className="text-red-700 text-sm mb-2">
                Le service de proxy CORS a retourné une erreur 403 Forbidden. Vous devez d'abord activer le service de démo CORS.
              </p>
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  handleProxyDemoClick();
                }}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center"
              >
                <ExternalLink className="mr-1.5 h-4 w-4" />
                Activer le service de démo CORS
              </Button>
            </div>
          </div>
        )}

        {hasPerformedAnalysis && crawlResult && crawlResult.data && crawlResult.data[0] && (
          <div className="mt-6">
            <ResultTabs data={crawlResult.data[0]} />
          </div>
        )}
        
        {hasPerformedAnalysis && (!crawlResult || !crawlResult.data || !crawlResult.data[0]) && !showCorsWarning && !isForbiddenError && (
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Aucun résultat disponible</h3>
              <p className="text-amber-700 text-sm">
                L'analyse n'a pas pu être complétée ou n'a pas retourné de données valides. Veuillez vérifier l'URL et réessayer.
              </p>
            </div>
          </div>
        )}
        
        {!hasPerformedAnalysis && !isLoading && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <p className="text-blue-700">
              Entrez l'URL d'un site web et cliquez sur "Analyser" pour commencer l'analyse.
            </p>
          </div>
        )}
      </Card>

      <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
        <AlertTriangle className="h-4 w-4 mt-0.5" />
        <p>
          Note : Cette analyse est basique et gratuite. Pour une analyse plus approfondie, 
          vous pouvez utiliser des services spécialisés.
        </p>
      </div>
    </div>
  );
};
