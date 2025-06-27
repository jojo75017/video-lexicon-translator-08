
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TreePine, Globe, Search, FileText, Target, ArrowRight, Info, Layout, Link, Image, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PageElement {
  tag: string;
  text: string;
  attributes: Record<string, string>;
  level?: number;
}

interface PageStructureData {
  url: string;
  title: string;
  metaDescription: string;
  headings: PageElement[];
  links: {
    internal: PageElement[];
    external: PageElement[];
    total: number;
  };
  images: PageElement[];
  content: {
    wordCount: number;
    paragraphs: number;
    lists: number;
    tables: number;
  };
  seoScore: number;
  issues: string[];
  suggestions: string[];
}

const PageStructurePlanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [structureData, setStructureData] = useState<PageStructureData | null>(null);
  const [currentStep, setCurrentStep] = useState('');

  const fetchPageContent = async (targetUrl: string): Promise<string> => {
    console.log(`🔍 Tentative de récupération: ${targetUrl}`);
    
    // Liste de proxies CORS fiables
    const proxies = [
      'https://api.codetabs.com/v1/proxy?quest=',
      'https://api.allorigins.win/get?url=',
      'https://cors-anywhere.herokuapp.com/',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    
    let lastError = '';
    
    for (let i = 0; i < proxies.length; i++) {
      try {
        const proxy = proxies[i];
        setCurrentStep(`Tentative ${i + 1}/${proxies.length}: ${proxy.split('/')[2]}...`);
        
        console.log(`Proxy ${i + 1}: ${proxy}`);
        
        const response = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`, {
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
            'Cache-Control': 'no-cache',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        let content = '';
        
        if (proxy.includes('allorigins')) {
          const data = await response.json();
          content = data.contents || '';
        } else {
          content = await response.text();
        }

        if (!content || content.length < 100) {
          throw new Error('Contenu vide ou trop court');
        }

        console.log(`✅ Succès avec ${proxy} - Contenu: ${content.length} caractères`);
        return content;
        
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error(`❌ Proxy ${i + 1} échoué:`, lastError);
        
        if (i < proxies.length - 1) {
          // Attendre 1 seconde avant le prochain essai
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    throw new Error(`Impossible de récupérer le contenu. Dernière erreur: ${lastError}`);
  };

  const analyzePageStructure = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    setIsAnalyzing(true);
    setStructureData(null);
    setCurrentStep('Préparation de l\'analyse...');
    
    try {
      // Formatage de l'URL
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }

      // Validation de l'URL
      try {
        new URL(formattedUrl);
      } catch {
        throw new Error('URL invalide');
      }

      toast.info('Récupération du contenu...', {
        description: `Analyse de ${formattedUrl}`
      });

      setCurrentStep('Récupération du contenu HTML...');
      const htmlContent = await fetchPageContent(formattedUrl);
      
      setCurrentStep('Analyse du contenu...');
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Analyse des éléments de la page
      const title = doc.title || doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 'Sans titre';
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 
                            doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

      // Analyse des titres avec vérification
      const headings: PageElement[] = [];
      const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headingElements.forEach(heading => {
        const text = heading.textContent?.trim();
        if (text && text.length > 0) {
          headings.push({
            tag: heading.tagName.toLowerCase(),
            text,
            attributes: {},
            level: parseInt(heading.tagName.charAt(1))
          });
        }
      });

      // Analyse des liens avec validation
      const allLinks = Array.from(doc.querySelectorAll('a[href]'));
      const internal: PageElement[] = [];
      const external: PageElement[] = [];
      const hostname = new URL(formattedUrl).hostname;

      allLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent?.trim();
        
        if (href && text) {
          const linkData: PageElement = {
            tag: 'a',
            text,
            attributes: { 
              href, 
              rel: link.getAttribute('rel') || '',
              target: link.getAttribute('target') || ''
            }
          };

          try {
            if (href.startsWith('/') || href.includes(hostname)) {
              internal.push(linkData);
            } else if (href.startsWith('http')) {
              external.push(linkData);
            }
          } catch (e) {
            // Ignorer les liens malformés
          }
        }
      });

      // Analyse des images avec validation
      const images: PageElement[] = [];
      const imageElements = doc.querySelectorAll('img');
      imageElements.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          images.push({
            tag: 'img',
            text: img.getAttribute('alt') || 'Sans alt',
            attributes: {
              src,
              alt: img.getAttribute('alt') || '',
              width: img.getAttribute('width') || '',
              height: img.getAttribute('height') || '',
              loading: img.getAttribute('loading') || ''
            }
          });
        }
      });

      // Analyse du contenu textuel
      const bodyText = doc.body?.textContent || '';
      const wordCount = bodyText.trim().split(/\s+/).filter(word => word.length > 0).length;
      const paragraphs = doc.querySelectorAll('p').length;
      const lists = doc.querySelectorAll('ul, ol').length;
      const tables = doc.querySelectorAll('table').length;

      // Calcul du score SEO et identification des problèmes
      const issues: string[] = [];
      const suggestions: string[] = [];
      let seoScore = 100;

      // Vérifications SEO détaillées
      if (!title || title === 'Sans titre') {
        issues.push('Titre manquant');
        seoScore -= 15;
      } else if (title.length < 30) {
        issues.push(`Titre trop court (${title.length} caractères)`);
        seoScore -= 8;
      } else if (title.length > 60) {
        issues.push(`Titre trop long (${title.length} caractères)`);
        seoScore -= 5;
      }

      if (!metaDescription) {
        issues.push('Meta description manquante');
        seoScore -= 12;
      } else if (metaDescription.length < 120) {
        issues.push(`Meta description trop courte (${metaDescription.length} caractères)`);
        seoScore -= 8;
      } else if (metaDescription.length > 160) {
        issues.push(`Meta description trop longue (${metaDescription.length} caractères)`);
        seoScore -= 5;
      }

      const h1Count = headings.filter(h => h.level === 1).length;
      if (h1Count === 0) {
        issues.push('Aucun titre H1 trouvé');
        seoScore -= 12;
      } else if (h1Count > 1) {
        issues.push(`Plusieurs titres H1 (${h1Count})`);
        seoScore -= 6;
      }

      const imagesWithoutAlt = images.filter(img => !img.attributes.alt || img.attributes.alt.trim() === '');
      if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} image(s) sans attribut alt`);
        seoScore -= Math.min(15, imagesWithoutAlt.length * 2);
      }

      if (wordCount < 300) {
        issues.push(`Contenu trop court (${wordCount} mots)`);
        seoScore -= 10;
      }

      if (internal.length < 2) {
        issues.push('Peu de liens internes');
        seoScore -= 5;
      }

      // Suggestions d'amélioration
      if (headings.length < 3) {
        suggestions.push('Ajoutez plus de sous-titres (H2, H3) pour structurer le contenu');
      }

      if (internal.length < 5) {
        suggestions.push('Augmentez le nombre de liens internes vers d\'autres pages pertinentes');
      }

      if (lists.length === 0) {
        suggestions.push('Utilisez des listes à puces pour améliorer la lisibilité');
      }

      if (!doc.querySelector('meta[name="robots"]')) {
        suggestions.push('Ajoutez une balise meta robots pour contrôler l\'indexation');
      }

      suggestions.push('Optimisez les images avec des formats modernes (WebP, AVIF)');
      suggestions.push('Ajoutez des données structurées Schema.org');

      const analysisData: PageStructureData = {
        url: formattedUrl,
        title,
        metaDescription,
        headings,
        links: {
          internal,
          external,
          total: internal.length + external.length
        },
        images,
        content: {
          wordCount,
          paragraphs,
          lists,
          tables
        },
        seoScore: Math.max(0, Math.min(100, seoScore)),
        issues,
        suggestions
      };

      setStructureData(analysisData);
      toast.success(`Analyse terminée - Score SEO: ${analysisData.seoScore}/100`);
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      toast.error('Erreur lors de l\'analyse', {
        description: errorMessage
      });
      
      // Afficher des informations de diagnostic
      setStructureData({
        url: url,
        title: 'Analyse impossible',
        metaDescription: '',
        headings: [],
        links: { internal: [], external: [], total: 0 },
        images: [],
        content: { wordCount: 0, paragraphs: 0, lists: 0, tables: 0 },
        seoScore: 0,
        issues: [`Impossible d'analyser cette page: ${errorMessage}`],
        suggestions: [
          'Vérifiez que l\'URL est accessible publiquement',
          'Certains sites bloquent l\'analyse automatique',
          'Essayez avec une autre URL'
        ]
      });
      
    } finally {
      setIsAnalyzing(false);
      setCurrentStep('');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-teal-500" />
            Analyseur de structure de page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="https://example.com/page"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
                disabled={isAnalyzing}
              />
            </div>
            <Button 
              onClick={analyzePageStructure}
              disabled={isAnalyzing || !url}
              className="flex items-center gap-2 min-w-[120px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyse...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>

          {isAnalyzing && currentStep && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                {currentStep}
              </AlertDescription>
            </Alert>
          )}

          {!structureData && !isAnalyzing && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Entrez l'URL d'une page pour analyser sa structure réelle et obtenir des recommandations d'optimisation SEO.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {structureData && (
        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Informations de la page
                </span>
                <Badge className={`${getScoreColor(structureData.seoScore)} text-lg px-3 py-1`}>
                  {structureData.seoScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-lg">{structureData.title}</h3>
                  <p className="text-sm text-gray-600 break-all">{structureData.url}</p>
                </div>
                {structureData.metaDescription && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Meta Description</h4>
                    <p className="text-sm text-gray-600">{structureData.metaDescription}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Structure des titres */}
          {structureData.headings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-purple-500" />
                  Structure des titres ({structureData.headings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {structureData.headings.map((heading, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 border rounded-lg">
                      <Badge variant="outline" className="text-xs flex-shrink-0">
                        {heading.tag.toUpperCase()}
                      </Badge>
                      <span className="flex-1 text-sm break-words">{heading.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistiques de liens et images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-blue-500" />
                  Liens ({structureData.links.total})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Liens internes</span>
                    <Badge variant="secondary">{structureData.links.internal.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Liens externes</span>
                    <Badge variant="secondary">{structureData.links.external.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-green-500" />
                  Images ({structureData.images.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Avec alt</span>
                    <Badge variant="secondary">
                      {structureData.images.filter(img => img.attributes.alt && img.attributes.alt.trim()).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Sans alt</span>
                    <Badge variant="destructive">
                      {structureData.images.filter(img => !img.attributes.alt || !img.attributes.alt.trim()).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-500" />
                Analyse du contenu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Mots</div>
                  <div className="text-lg font-semibold">{structureData.content.wordCount}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Paragraphes</div>
                  <div className="text-lg font-semibold">{structureData.content.paragraphs}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Listes</div>
                  <div className="text-lg font-semibold">{structureData.content.lists}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm text-gray-600">Tableaux</div>
                  <div className="text-lg font-semibold">{structureData.content.tables}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problèmes et suggestions */}
          {(structureData.issues.length > 0 || structureData.suggestions.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {structureData.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Problèmes détectés ({structureData.issues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {structureData.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {structureData.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Suggestions d'amélioration ({structureData.suggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {structureData.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded">
                          <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-green-700">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageStructurePlanner;
