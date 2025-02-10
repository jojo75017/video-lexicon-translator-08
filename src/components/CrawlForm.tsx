
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { FirecrawlService } from '@/utils/FirecrawlService';
import { Card } from "@/components/ui/card";
import { AlertTriangle, Code } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  data?: any[];
}

export const CrawlForm = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    setCrawlResult(null);

    try {
      // Simulation de progression
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
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">
                Analyse en cours... {progress}%
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Analyse en cours..." : "Analyser le site"}
          </Button>
        </form>

        {crawlResult && crawlResult.data && crawlResult.data[0] && (
          <div className="mt-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-2 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="info"
                  className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  Informations
                </TabsTrigger>
                <TabsTrigger 
                  value="source"
                  className="flex-1 py-2.5 font-medium rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Code Source
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-6 space-y-6">
                <div className="bg-muted/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Titre du site</h4>
                  <p className="text-sm">{crawlResult.data[0].title}</p>
                </div>
                
                <div className="bg-muted/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Méta-données</h4>
                  <div className="text-sm space-y-1">
                    {crawlResult.data[0].meta.map((meta: any, index: number) => (
                      <p key={index} className="flex gap-2">
                        <span className="font-medium">{meta.name}:</span>
                        <span>{meta.content}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Structure</h4>
                  <div className="text-sm space-y-1">
                    {crawlResult.data[0].headings.map((heading: any, index: number) => (
                      <p key={index} className="flex gap-2">
                        <span className="font-medium">{heading.level}:</span>
                        <span>{heading.text}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Liens trouvés ({crawlResult.data[0].links.length})
                  </h4>
                  <div className="text-sm space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                    {crawlResult.data[0].links.map((link: any, index: number) => (
                      <a 
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:underline text-blue-600 dark:text-blue-400"
                      >
                        {link.text || link.href}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Images ({crawlResult.data[0].images.length})
                  </h4>
                  <div className="text-sm space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                    {crawlResult.data[0].images.map((img: any, index: number) => (
                      <div key={index} className="flex gap-2">
                        <span className="font-medium">Alt:</span>
                        <span>{img.alt || 'Aucun texte alternatif'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="source" className="mt-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <h4 className="font-medium text-sm">Code Source HTML</h4>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4">
                    <pre className="text-sm font-mono overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                      {crawlResult.data[0].sourceCode}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};
