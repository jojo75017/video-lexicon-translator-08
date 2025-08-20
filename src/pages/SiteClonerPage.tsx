import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Globe, Copy, Download, AlertCircle, CheckCircle, Code, FileText, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FirecrawlApp from '@mendable/firecrawl-js';

interface CrawlResult {
  success: boolean;
  status?: string;
  completed?: number;
  total?: number;
  creditsUsed?: number;
  expiresAt?: Date | string;
  data?: any[];
}

interface ClonedSite {
  url: string;
  title: string;
  content: string;
  html: string;
  images: string[];
  links: string[];
  metadata: any;
}

const SiteClonerPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [clonedSite, setClonedSite] = useState<ClonedSite | null>(null);
  const [crawlResult, setCrawlResult] = useState<CrawlResult | null>(null);

  const handleClone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('Veuillez entrer votre clé API Firecrawl');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setClonedSite(null);
    setCrawlResult(null);
    
    try {
      const firecrawl = new FirecrawlApp({ apiKey });
      
      setProgress(25);
      toast.info('Démarrage du clonage...');

      const crawlResponse = await firecrawl.crawlUrl(url, {
        limit: 50,
        scrapeOptions: {
          formats: ['markdown', 'html'],
          includeTags: ['title', 'meta', 'h1', 'h2', 'h3', 'p', 'a', 'img'],
          onlyMainContent: false
        }
      });

      setProgress(75);

      if (!crawlResponse.success) {
        throw new Error('Échec du clonage');
      }

      setCrawlResult(crawlResponse);
      
      // Traitement des données pour créer le site cloné
      const firstPage = crawlResponse.data?.[0];
      if (firstPage) {
        const cloned: ClonedSite = {
          url: firstPage.metadata?.sourceURL || url,
          title: firstPage.metadata?.title || 'Site cloné',
          content: firstPage.markdown || '',
          html: firstPage.html || '',
          images: extractImages(firstPage.html || ''),
          links: extractLinks(firstPage.html || ''),
          metadata: firstPage.metadata || {}
        };
        setClonedSite(cloned);
      }

      setProgress(100);
      toast.success('Site cloné avec succès !');
      
    } catch (error) {
      console.error('Erreur lors du clonage:', error);
      toast.error('Erreur lors du clonage du site');
    } finally {
      setIsLoading(false);
    }
  };

  const extractImages = (html: string): string[] => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const images: string[] = [];
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      images.push(match[1]);
    }
    return images;
  };

  const extractLinks = (html: string): string[] => {
    const linkRegex = /<a[^>]+href="([^">]+)"/g;
    const links: string[] = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      links.push(match[1]);
    }
    return [...new Set(links)]; // Supprimer les doublons
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copié dans le presse-papiers !');
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Fichier téléchargé !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Clonage de Site</h1>
              <p className="text-muted-foreground">Clonez n'importe quel site web en entrant son URL</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de clonage */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleClone} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">URL du site à cloner</label>
                    <Input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Clé API Firecrawl</label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="fc-..."
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Obtenez votre clé API sur{' '}
                      <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        firecrawl.dev
                      </a>
                    </p>
                  </div>

                  {isLoading && (
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full" />
                      <p className="text-sm text-muted-foreground text-center">
                        Clonage en cours... {progress}%
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Clonage..." : "Cloner le site"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informations sur le crawl */}
            {crawlResult && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Résultats du crawl
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">{crawlResult.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pages analysées:</span>
                    <span className="font-medium">{crawlResult.completed}/{crawlResult.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Crédits utilisés:</span>
                    <span className="font-medium">{crawlResult.creditsUsed}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Résultats */}
          <div className="lg:col-span-2">
            {clonedSite ? (
              <div className="space-y-6">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle>{clonedSite.title}</CardTitle>
                    <p className="text-muted-foreground">{clonedSite.url}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">{clonedSite.images.length}</div>
                        <div className="text-sm text-muted-foreground">Images</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{clonedSite.links.length}</div>
                        <div className="text-sm text-muted-foreground">Liens</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{Math.round(clonedSite.content.length / 1000)}k</div>
                        <div className="text-sm text-muted-foreground">Caractères</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contenu Markdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Contenu Markdown
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(clonedSite.content)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadFile(clonedSite.content, 'contenu.md')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm whitespace-pre-wrap">{clonedSite.content}</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Code HTML */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Code HTML
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(clonedSite.html)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadFile(clonedSite.html, 'page.html')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                      <pre className="text-sm">{clonedSite.html}</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Images trouvées */}
                {clonedSite.images.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        Images trouvées ({clonedSite.images.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {clonedSite.images.map((img, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                            <Image className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{img}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(img)}
                              className="ml-auto flex-shrink-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun site cloné</h3>
                  <p className="text-muted-foreground">
                    Entrez une URL et votre clé API pour commencer le clonage
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteClonerPage;