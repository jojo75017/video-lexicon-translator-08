
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';
import { CrawlInput } from './crawl/CrawlInput';
import { ResultTabs } from './crawl/ResultTabs';
import '@/styles/scrollbar.css';

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  data?: any[];
  error?: string;
}

export const CrawlForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);
  const [hasPerformedAnalysis, setHasPerformedAnalysis] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "URL requise",
        description: "Veuillez entrer une URL à analyser",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);
    setHasPerformedAnalysis(true);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      console.log('Starting analysis for URL:', url);
      const result = await FirecrawlService.crawlWebsite(url);
      
      clearInterval(progressInterval);
      
      if (result.success) {
        setProgress(100);
        toast({
          title: "Succès",
          description: "Site web analysé avec succès",
        });
        setCrawlResult(result);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Échec de l'analyse du site",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'analyse du site",
        variant: "destructive",
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

        {hasPerformedAnalysis && crawlResult && crawlResult.data && crawlResult.data[0] && (
          <div className="mt-6">
            <ResultTabs data={crawlResult.data[0]} />
          </div>
        )}
        
        {hasPerformedAnalysis && (!crawlResult || !crawlResult.data || !crawlResult.data[0]) && (
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
        <AlertTriangle className="h-4 h-4 mt-0.5" />
        <p>
          Note : Cette analyse est basique et gratuite. Pour une analyse plus approfondie, 
          vous pouvez utiliser des services spécialisés.
        </p>
      </div>
    </div>
  );
};
