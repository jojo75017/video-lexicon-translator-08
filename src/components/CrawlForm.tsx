
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log("CrawlForm rendering with crawlResult:", !!crawlResult);
    
    if (crawlResult) {
      console.log("CrawlResult data exists:", !!crawlResult.data);
      
      if (crawlResult.data) {
        console.log("First data item exists:", !!crawlResult.data[0]);
      }
    }
  }, [crawlResult]);

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

  const reset = () => {
    setCrawlResult(null);
    setHasPerformedAnalysis(false);
    setShowCorsWarning(false);
    setIsForbiddenError(false);
    setProgress(0);
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
    
    // Validate URL format and add protocol if missing
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }
    
    try {
      new URL(formattedUrl);
    } catch {
      toast("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: exemple.com)",
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    reset();
    setHasPerformedAnalysis(true);

    try {
      // Simuler une progression pour une meilleure expérience utilisateur
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      console.log('Starting analysis for URL:', formattedUrl);
      
      // Activation automatique du proxy pour les domaines externes
      if (!formattedUrl.includes('localhost') && !formattedUrl.includes('127.0.0.1')) {
        FirecrawlService.enableProxy();
        console.log("Proxy automatically enabled for external domain");
      }
      
      const result = await FirecrawlService.crawlWebsite(formattedUrl);
      
      clearInterval(progressInterval);
      
      console.log("Crawl result received:", result);
      
      if (result.success) {
        setProgress(100);
        toast.success("Succès", {
          description: "Site web analysé avec succès",
        });
        console.log("Setting crawl result:", result);
        setCrawlResult(result);
      } else {
        // Vérifier le type d'erreur
        if (result.error && result.error.includes('403')) {
          setIsForbiddenError(true);
          toast.warning("Erreur d'accès 403 - Activez le service CORS");
        }
        else if (result.error && (result.error.includes('CORS') || result.error.includes('Failed to fetch'))) {
          setShowCorsWarning(true);
          toast.warning("Erreur CORS détectée - Activation du proxy requise");
        } else {
          toast.error(result.error || "Échec de l'analyse du site");
        }
        
        // Même en cas d'erreur, générer des données de démonstration
        console.log("Setting demo crawl result due to error");
        
        // Extraction du domaine de l'URL
        const cleanUrl = formattedUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
        const domainName = cleanUrl.split('/')[0];
        
        setCrawlResult({
          success: true,
          status: 'demo',
          completed: 1,
          total: 1,
          data: [{
            url: formattedUrl,
            title: `${domainName} - Données de démonstration`,
            meta: [
              { name: "description", content: `Analyse SEO pour ${domainName}` },
              { name: "keywords", content: `${domainName}, seo, analyse, référencement` }
            ],
            links: [
              { href: `${formattedUrl}/page1`, text: "Page d'exemple 1" },
              { href: `${formattedUrl}/page2`, text: "Page d'exemple 2" },
              { href: `${formattedUrl}/contact`, text: "Contact" },
              { href: `${formattedUrl}/a-propos`, text: "À propos" }
            ],
            images: [
              { src: "https://via.placeholder.com/150", alt: "Image d'exemple 1" },
              { src: "https://via.placeholder.com/300", alt: "Image d'exemple 2" },
              { src: "https://via.placeholder.com/200", alt: "" }
            ],
            headings: [
              { level: "h1", text: `Bienvenue sur ${domainName}` },
              { level: "h2", text: "Nos services" },
              { level: "h3", text: "Service premium" },
              { level: "h2", text: "À propos de nous" },
              { level: "h3", text: "Notre histoire" }
            ],
            sourceCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>${domainName} - Démonstration</title>\n  <meta name="description" content="Analyse SEO pour ${domainName}">\n</head>\n<body>\n  <h1>Bienvenue sur ${domainName}</h1>\n  <!-- Contenu de démonstration -->\n</body>\n</html>`,
            recommendations: [
              "Ajoutez une meta description plus détaillée",
              "Utilisez des titres H1, H2 et H3 de manière hiérarchique",
              "Ajoutez des attributs alt à toutes vos images",
              "Optimisez votre contenu pour les mots-clés principaux"
            ]
          }]
        });
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast.error("Erreur lors de l'analyse du site");
      
      // Generate demo data for display
      console.log("Setting demo crawl result due to exception");
      
      // Extraction du domaine de l'URL
      const cleanUrl = formattedUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const domainName = cleanUrl.split('/')[0];
      
      setCrawlResult({
        success: true,
        status: 'demo',
        completed: 1,
        total: 1,
        data: [{
          url: formattedUrl,
          title: `${domainName} - Données après erreur`,
          meta: [
            { name: "description", content: `Analyse SEO alternative pour ${domainName}` }
          ],
          links: [
            { href: `${formattedUrl}/accueil`, text: "Accueil" },
            { href: `${formattedUrl}/blog`, text: "Blog" }
          ],
          images: [
            { src: "https://via.placeholder.com/150", alt: "Image d'exemple" }
          ],
          headings: [
            { level: "h1", text: `${domainName} - Site web` },
            { level: "h2", text: "Contenu principal" }
          ],
          sourceCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>${domainName}</title>\n</head>\n<body>\n  <h1>${domainName} - Site web</h1>\n  <!-- Contenu de démonstration -->\n</body>\n</html>`,
          recommendations: [
            "Assurez-vous que l'URL est correcte et accessible",
            "Vérifiez votre connexion internet",
            "Essayez d'activer le proxy CORS"
          ]
        }]
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
              <h3 className="font-medium text-amber-800">Erreur d'accès CORS détectée</h3>
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
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleProxyDemoClick();
                  }}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                >
                  Activer service CORS externe
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

        {hasPerformedAnalysis && crawlResult && crawlResult.data && crawlResult.data.length > 0 && (
          <div className="mt-6">
            <ResultTabs data={crawlResult.data[0]} />
          </div>
        )}
        
        {hasPerformedAnalysis && (!crawlResult || !crawlResult.data || crawlResult.data.length === 0) && !showCorsWarning && !isForbiddenError && (
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
