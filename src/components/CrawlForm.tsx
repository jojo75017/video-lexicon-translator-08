
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
          <Tabs defaultValue="info" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="source">
                <Code className="w-4 h-4 mr-2" />
                Code Source
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div>
                <h4 className="font-medium">Titre du site</h4>
                <p className="text-sm">{crawlResult.data[0].title}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Méta-données</h4>
                <div className="text-sm space-y-1">
                  {crawlResult.data[0].meta.map((meta: any, index: number) => (
                    <p key={index}>
                      {meta.name}: {meta.content}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Structure</h4>
                <div className="text-sm space-y-1">
                  {crawlResult.data[0].headings.map((heading: any, index: number) => (
                    <p key={index} className={`ml-${heading.level === 'h1' ? '0' : heading.level === 'h2' ? '2' : '4'}`}>
                      {heading.level}: {heading.text}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Liens trouvés ({crawlResult.data[0].links.length})</h4>
                <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
                  {crawlResult.data[0].links.map((link: any, index: number) => (
                    <p key={index}>
                      {link.text || link.href}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Images ({crawlResult.data[0].images.length})</h4>
                <div className="text-sm space-y-1 max-h-40 overflow-y-auto">
                  {crawlResult.data[0].images.map((img: any, index: number) => (
                    <p key={index}>
                      {img.alt || img.src}
                    </p>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="source">
              <div className="mt-4">
                <h4 className="font-medium mb-2">Code Source HTML</h4>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div 
                    className="text-sm font-mono overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: crawlResult.data[0].sourceCode }}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
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

