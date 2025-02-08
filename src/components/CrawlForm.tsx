
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: string;
  data?: any[];
}

export const CrawlForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);
    
    if (!apiKey) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord entrer votre clé API",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sauvegarde de la clé API
      FirecrawlService.saveApiKey(apiKey);
      
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      console.log('Starting crawl for URL:', url);
      const result = await FirecrawlService.crawlWebsite(url);
      
      clearInterval(progressInterval);
      
      if (result.success) {
        setProgress(100);
        toast({
          title: "Succès",
          description: "Site web crawlé avec succès",
        });
        setCrawlResult(result.data);
      } else {
        toast({
          title: "Erreur",
          description: result.error || "Échec du crawl du site",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error crawling website:', error);
      toast({
        title: "Erreur",
        description: "Échec du crawl du site",
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                Clé API Firecrawl
              </label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
                placeholder="Votre clé API Firecrawl"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Obtenir une clé sur <a href="https://firecrawl.co" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">firecrawl.co</a>
              </p>
            </div>
            
            <div>
              <label htmlFor="url" className="block text-sm font-medium mb-1">
                URL du site
              </label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
                placeholder="https://exemple.com"
                required
              />
            </div>
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">
                Crawl en cours... {progress}%
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Crawl en cours..." : "Démarrer le crawl"}
          </Button>
        </form>

        {crawlResult && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Résultats du crawl</h3>
            <div className="space-y-2 text-sm">
              <p>Statut : {crawlResult.status}</p>
              <p>Pages complétées : {crawlResult.completed}</p>
              <p>Total des pages : {crawlResult.total}</p>
              <p>Crédits utilisés : {crawlResult.creditsUsed}</p>
              {crawlResult.expiresAt && (
                <p>Expire le : {new Date(crawlResult.expiresAt).toLocaleString()}</p>
              )}
            </div>

            {crawlResult.data && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Données crawlées :</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(crawlResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500">
        <AlertTriangle className="h-4 w-4 mt-0.5" />
        <p>
          Note : Cette clé API est temporairement stockée dans votre navigateur. 
          Pour une utilisation en production, il est recommandé d'utiliser un stockage sécurisé côté serveur.
        </p>
      </div>
    </div>
  );
};
