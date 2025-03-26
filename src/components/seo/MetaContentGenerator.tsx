
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ExternalLink, AlertTriangle, Search, Gift, Link2, Globe, Info, ImageIcon, Loader2, Shield } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { analyzeMetaTags, MetaAnalysis } from '@/utils/seo/metaAnalyzer';
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MetaContentGenerator = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metaAnalysis, setMetaAnalysis] = useState<MetaAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [headingCounts, setHeadingCounts] = useState<{h1: number; h2: number; h3: number}>({ h1: 0, h2: 0, h3: 0 });
  const [imageStats, setImageStats] = useState<{total: number; withoutAlt: number}>({ total: 0, withoutAlt: 0 });
  const [showCorsWarning, setShowCorsWarning] = useState<boolean>(false);
  const [proxyEnabled, setProxyEnabled] = useState<boolean>(false);

  const handleActivateProxy = () => {
    setProxyEnabled(true);
    toast.success("Proxy CORS activé", {
      description: "Les requêtes utiliseront désormais un proxy pour contourner les restrictions CORS",
    });
  };

  const analyzeMeta = async () => {
    if (!url) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    let formattedUrl = url;
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = 'https://' + url;
    }

    try {
      // Validate URL format
      new URL(formattedUrl);
    } catch {
      toast.error("URL invalide", {
        description: "Veuillez entrer une URL valide (ex: https://exemple.com)",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowCorsWarning(false);

    try {
      // Using multiple CORS proxies in case one fails
      const proxyUrls = proxyEnabled ? [
        `https://corsproxy.io/?${encodeURIComponent(formattedUrl)}`,
        `https://cors-anywhere.herokuapp.com/${formattedUrl}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(formattedUrl)}`
      ] : [formattedUrl]; // Try direct URL first if proxy not enabled

      let response = null;
      let html = '';
      let corsError = false;

      for (const proxyUrl of proxyUrls) {
        try {
          console.log(`Tentative d'accès via ${proxyUrl}`);
          response = await fetch(proxyUrl);
          if (response.ok) {
            html = await response.text();
            console.log(`Succès avec ${proxyUrl}, taille de la réponse: ${html.length} caractères`);
            break;
          }
        } catch (err) {
          console.error(`Erreur avec ${proxyUrl}:`, err);
          if (
            err instanceof Error && 
            (err.message.includes("CORS") || 
             err.message.includes("cross-origin") ||
             err.message.includes("network error"))
          ) {
            corsError = true;
          }
        }
      }

      if (!html) {
        if (corsError) {
          setShowCorsWarning(true);
          throw new Error("Erreur CORS: Impossible d'accéder au contenu - activez le proxy CORS pour continuer");
        } else {
          throw new Error("Impossible d'accéder au contenu du site. Vérifiez que l'URL est correcte et accessible.");
        }
      }

      // Store the HTML content for debugging
      setHtmlContent(html);

      // Parse the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Count headings
      const h1Count = doc.querySelectorAll('h1').length;
      const h2Count = doc.querySelectorAll('h2').length;
      const h3Count = doc.querySelectorAll('h3').length;
      setHeadingCounts({ h1: h1Count, h2: h2Count, h3: h3Count });
      
      // Count images and those without alt
      const images = doc.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.hasAttribute('alt') || img.getAttribute('alt') === '').length;
      setImageStats({ total: images.length, withoutAlt: imagesWithoutAlt });
      
      // Analyze meta tags
      const analysis = analyzeMetaTags(doc);
      console.log("Meta analysis:", analysis);
      
      setMetaAnalysis(analysis);
      toast.success("Analyse complétée", {
        description: "Résultats générés avec succès"
      });
    } catch (err) {
      console.error("Error analyzing meta tags:", err);
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
      toast.error("Erreur lors de l'analyse", {
        description: err instanceof Error ? err.message : "Une erreur s'est produite"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const truncateString = (str: string, length: number) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-600" />
          Aperçu SERP & Analyseur de balises méta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Entrez une URL (ex: exemple.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && analyzeMeta()}
            />
            <Button 
              onClick={analyzeMeta} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>

          {isLoading && (
            <div className="space-y-2 py-4">
              <p className="text-sm text-center text-gray-500">Analyse en cours...</p>
              <Progress value={45} className="h-2" />
            </div>
          )}

          {error && !showCorsWarning && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showCorsWarning && (
            <div className="mt-4 bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Erreur d'accès CORS détectée
              </h3>
              <p className="text-yellow-700 mb-3">
                Les restrictions de sécurité du navigateur empêchent l'accès au site. 
                Activez notre proxy CORS pour contourner cette limitation et continuer l'analyse.
              </p>
              <Button 
                variant="outline" 
                onClick={handleActivateProxy}
                className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
              >
                <Shield className="mr-2 h-4 w-4" />
                Activer le proxy CORS
              </Button>
            </div>
          )}

          {metaAnalysis && (
            <Tabs defaultValue="summary" className="w-full mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="summary" className="flex items-center gap-1.5">
                  <Info className="h-4 w-4" />
                  <span>Résumé</span>
                </TabsTrigger>
                <TabsTrigger value="serp" className="flex items-center gap-1.5">
                  <Search className="h-4 w-4" />
                  <span>Aperçu SERP</span>
                </TabsTrigger>
                <TabsTrigger value="meta" className="flex items-center gap-1.5">
                  <Link2 className="h-4 w-4" />
                  <span>Balises Méta</span>
                </TabsTrigger>
                <TabsTrigger value="og" className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span>Open Graph</span>
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center gap-1.5">
                  <Gift className="h-4 w-4" />
                  <span>Suggestions</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-medium mb-4">Résultats de l'analyse pour {url}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Titre:</span>
                      <span>{metaAnalysis.title || "Titre non défini"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Balises Meta:</span>
                      <span>
                        {metaAnalysis.description ? (
                          <Badge className="bg-green-100 text-green-800">Description présente</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600">Description manquante</Badge>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Titres H1:</span>
                      <span className={`${headingCounts.h1 === 1 ? 'text-green-600' : 'text-red-600'}`}>
                        {headingCounts.h1}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Titres H2:</span>
                      <span>{headingCounts.h2}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Titres H3:</span>
                      <span>{headingCounts.h3}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Images:</span>
                      <span>
                        {imageStats.total} (dont {imageStats.withoutAlt} sans attribut alt)
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">URL Canonique:</span>
                      <span>
                        {metaAnalysis.canonical ? (
                          <Badge className="bg-green-100 text-green-800">Présente</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600">Manquante</Badge>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Open Graph:</span>
                      <span>
                        {metaAnalysis.hasOgTags ? (
                          <Badge className="bg-green-100 text-green-800">Présent</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600">Manquant</Badge>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium">Twitter Cards:</span>
                      <span>
                        {metaAnalysis.hasTwitterTags ? (
                          <Badge className="bg-green-100 text-green-800">Présent</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600">Manquant</Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="serp" className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center mb-1 text-xs text-gray-500">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {url}
                  </div>
                  <h3 className="text-xl text-blue-600 font-medium mb-1 hover:underline cursor-pointer">
                    {metaAnalysis.title || "Titre non défini"}
                  </h3>
                  <p className="text-sm text-gray-800">
                    {metaAnalysis.description || "Aucune description trouvée pour cette page."}
                  </p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {metaAnalysis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Analyse SERP
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Titre</span>
                      <span className="text-sm font-medium">{metaAnalysis.title ? `${metaAnalysis.title.length} caractères` : 'Manquant'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Description</span>
                      <span className="text-sm font-medium">{metaAnalysis.description ? `${metaAnalysis.description.length} caractères` : 'Manquante'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">URL canonique</span>
                      <span className="text-sm font-medium">{metaAnalysis.canonical ? 'Présente' : 'Manquante'}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="meta" className="space-y-4">
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Méta balises principales</h4>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Title</span>
                          <code className="bg-gray-100 p-2 rounded-md text-sm break-all">{metaAnalysis.title}</code>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Description</span>
                          <code className="bg-gray-100 p-2 rounded-md text-sm break-all">{metaAnalysis.description}</code>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Keywords</span>
                          <code className="bg-gray-100 p-2 rounded-md text-sm break-all">{metaAnalysis.keywords.join(', ')}</code>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Canonical</span>
                          <code className="bg-gray-100 p-2 rounded-md text-sm break-all">{metaAnalysis.canonical || 'Non définie'}</code>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Robots</span>
                          <code className="bg-gray-100 p-2 rounded-md text-sm break-all">{metaAnalysis.robots || 'Non définie'}</code>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Autres balises méta</h4>
                      {metaAnalysis.otherTags.length > 0 ? (
                        <div className="grid gap-2">
                          {metaAnalysis.otherTags.map((tag, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded-md">
                              <span className="text-xs font-mono text-blue-600">{tag.name}</span>
                              <p className="text-sm mt-1 break-all">{truncateString(tag.content, 100)}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Aucune autre balise méta trouvée</p>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="og" className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Open Graph Tags {metaAnalysis.hasOgTags ? 
                    <Badge className="bg-green-100 text-green-800 ml-2">Présentes</Badge> : 
                    <Badge variant="outline" className="bg-red-50 text-red-800 ml-2">Manquantes</Badge>}
                  </h4>
                  
                  {metaAnalysis.hasOgTags ? (
                    <div className="space-y-3">
                      {Object.entries(metaAnalysis.ogTags).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-sm font-medium">og:{key}</span>
                          <code className="bg-white p-2 rounded-md text-sm break-all border border-gray-200">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Aucune balise Open Graph trouvée. Les balises Open Graph améliorent l'apparence de votre contenu lorsqu'il est partagé sur les réseaux sociaux.
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Twitter Card Tags {metaAnalysis.hasTwitterTags ? 
                    <Badge className="bg-green-100 text-green-800 ml-2">Présentes</Badge> : 
                    <Badge variant="outline" className="bg-red-50 text-red-800 ml-2">Manquantes</Badge>}
                  </h4>
                  
                  {metaAnalysis.hasTwitterTags ? (
                    <div className="space-y-3">
                      {Object.entries(metaAnalysis.twitterTags).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <span className="text-sm font-medium">twitter:{key}</span>
                          <code className="bg-white p-2 rounded-md text-sm break-all border border-gray-200">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Aucune balise Twitter Card trouvée. Les balises Twitter Card permettent de contrôler l'apparence des liens partagés sur Twitter.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    Suggestions d'amélioration
                  </h4>
                  
                  <ul className="space-y-2">
                    {!metaAnalysis.title && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Ajoutez une balise title unique et descriptive (idéalement 50-60 caractères)</span>
                      </li>
                    )}
                    
                    {metaAnalysis.title && metaAnalysis.title.length < 30 && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Votre titre est trop court ({metaAnalysis.title.length} caractères). Visez 50-60 caractères</span>
                      </li>
                    )}
                    
                    {metaAnalysis.title && metaAnalysis.title.length > 60 && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Votre titre est trop long ({metaAnalysis.title.length} caractères). Google peut le tronquer</span>
                      </li>
                    )}
                    
                    {!metaAnalysis.description && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Ajoutez une meta description (idéalement 150-160 caractères)</span>
                      </li>
                    )}
                    
                    {metaAnalysis.description && metaAnalysis.description.length < 100 && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Votre description est trop courte ({metaAnalysis.description.length} caractères). Visez 150-160 caractères</span>
                      </li>
                    )}
                    
                    {metaAnalysis.description && metaAnalysis.description.length > 160 && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Votre description est trop longue ({metaAnalysis.description.length} caractères). Google peut la tronquer</span>
                      </li>
                    )}
                    
                    {!metaAnalysis.canonical && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Ajoutez une balise canonique pour prévenir les problèmes de contenu dupliqué</span>
                      </li>
                    )}
                    
                    {!metaAnalysis.hasOgTags && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Ajoutez des balises Open Graph pour améliorer l'apparence sur les réseaux sociaux</span>
                      </li>
                    )}
                    
                    {!metaAnalysis.hasTwitterTags && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Ajoutez des balises Twitter Card pour améliorer l'apparence sur Twitter</span>
                      </li>
                    )}
                    
                    {metaAnalysis.keywords.length === 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Considérez ajouter des mots-clés pertinents (bien que moins important pour Google aujourd'hui)</span>
                      </li>
                    )}
                    
                    {headingCounts.h1 !== 1 && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Assurez-vous d'avoir exactement une balise H1 sur votre page</span>
                      </li>
                    )}
                    
                    {imageStats.withoutAlt > 0 && (
                      <li className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>Ajoutez des attributs alt descriptifs aux {imageStats.withoutAlt} images qui en manquent</span>
                      </li>
                    )}
                    
                    {/* Afficher un message positif si tout est bien configuré */}
                    {metaAnalysis.title && 
                     metaAnalysis.title.length >= 30 && 
                     metaAnalysis.title.length <= 60 &&
                     metaAnalysis.description && 
                     metaAnalysis.description.length >= 100 && 
                     metaAnalysis.description.length <= 160 &&
                     metaAnalysis.canonical &&
                     metaAnalysis.hasOgTags &&
                     metaAnalysis.hasTwitterTags &&
                     headingCounts.h1 === 1 &&
                     imageStats.withoutAlt === 0 && (
                      <li className="flex items-start gap-2 text-sm bg-green-50 p-2 rounded-md">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-green-700">Vos balises méta sont bien optimisées pour le SEO !</span>
                      </li>
                    )}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaContentGenerator;
