
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TreePine, Globe, Search, FileText, Target, ArrowRight, Info, Layout, Link, Image, CheckCircle, AlertCircle } from "lucide-react";
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

  const analyzePageStructure = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Formatage de l'URL
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = 'https://' + url;
      }

      toast.info('Analyse en cours...', {
        description: 'Récupération et analyse de la structure de la page'
      });

      // Utilisation d'un proxy CORS pour récupérer le contenu
      const proxyUrl = 'https://corsproxy.io/?';
      const response = await fetch(proxyUrl + encodeURIComponent(formattedUrl));
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Analyse des éléments de la page
      const title = doc.title || 'Sans titre';
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      // Analyse des titres
      const headings: PageElement[] = [];
      doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        headings.push({
          tag: heading.tagName.toLowerCase(),
          text: heading.textContent?.trim() || '',
          attributes: {},
          level: parseInt(heading.tagName.charAt(1))
        });
      });

      // Analyse des liens
      const allLinks = Array.from(doc.querySelectorAll('a[href]'));
      const internal: PageElement[] = [];
      const external: PageElement[] = [];

      allLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent?.trim() || '';
        const linkData: PageElement = {
          tag: 'a',
          text,
          attributes: { href, rel: link.getAttribute('rel') || '' }
        };

        if (href.startsWith('/') || href.includes(new URL(formattedUrl).hostname)) {
          internal.push(linkData);
        } else if (href.startsWith('http')) {
          external.push(linkData);
        }
      });

      // Analyse des images
      const images: PageElement[] = [];
      doc.querySelectorAll('img').forEach(img => {
        images.push({
          tag: 'img',
          text: img.getAttribute('alt') || 'Sans alt',
          attributes: {
            src: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || '',
            width: img.getAttribute('width') || '',
            height: img.getAttribute('height') || ''
          }
        });
      });

      // Analyse du contenu
      const bodyText = doc.body?.textContent || '';
      const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;
      const paragraphs = doc.querySelectorAll('p').length;
      const lists = doc.querySelectorAll('ul, ol').length;
      const tables = doc.querySelectorAll('table').length;

      // Calcul du score SEO et des problèmes
      const issues: string[] = [];
      const suggestions: string[] = [];
      let seoScore = 100;

      // Vérifications SEO
      if (!title) {
        issues.push('Titre manquant');
        seoScore -= 15;
      } else if (title.length < 30 || title.length > 60) {
        issues.push(`Titre trop ${title.length < 30 ? 'court' : 'long'} (${title.length} caractères)`);
        seoScore -= 5;
      }

      if (!metaDescription) {
        issues.push('Meta description manquante');
        seoScore -= 10;
      } else if (metaDescription.length < 120 || metaDescription.length > 160) {
        issues.push(`Meta description trop ${metaDescription.length < 120 ? 'courte' : 'longue'} (${metaDescription.length} caractères)`);
        seoScore -= 5;
      }

      const h1Count = headings.filter(h => h.level === 1).length;
      if (h1Count === 0) {
        issues.push('Aucun titre H1 trouvé');
        seoScore -= 10;
      } else if (h1Count > 1) {
        issues.push(`Plusieurs titres H1 (${h1Count})`);
        seoScore -= 5;
      }

      const imagesWithoutAlt = images.filter(img => !img.attributes.alt);
      if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} image(s) sans attribut alt`);
        seoScore -= Math.min(10, imagesWithoutAlt.length);
      }

      if (wordCount < 300) {
        issues.push('Contenu trop court (moins de 300 mots)');
        seoScore -= 8;
      }

      // Suggestions d'amélioration
      if (headings.length < 3) {
        suggestions.push('Ajoutez plus de sous-titres pour structurer le contenu');
      }

      if (internal.length < 3) {
        suggestions.push('Ajoutez plus de liens internes vers d\'autres pages');
      }

      if (lists.length === 0) {
        suggestions.push('Utilisez des listes à puces pour améliorer la lisibilité');
      }

      suggestions.push('Optimisez les images avec des formats WebP pour de meilleures performances');
      suggestions.push('Ajoutez des données structurées pour améliorer l\'affichage dans les résultats de recherche');

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
        seoScore: Math.max(0, seoScore),
        issues,
        suggestions
      };

      setStructureData(analysisData);
      toast.success('Analyse terminée avec succès');
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse', {
        description: 'Impossible d\'analyser cette page. Vérifiez l\'URL.'
      });
    } finally {
      setIsAnalyzing(false);
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
              />
            </div>
            <Button 
              onClick={analyzePageStructure}
              disabled={isAnalyzing || !url}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>Analyse en cours...</>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>

          {!structureData && !isAnalyzing && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Entrez l'URL d'une page pour analyser sa structure réelle et obtenir des recommandations d'optimisation.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyse de la structure de la page en cours...</p>
          </CardContent>
        </Card>
      )}

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
                  <p className="text-sm text-gray-600">{structureData.url}</p>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-purple-500" />
                Structure des titres ({structureData.headings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {structureData.headings.map((heading, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 border rounded-lg">
                    <Badge variant="outline" className="text-xs">
                      {heading.tag.toUpperCase()}
                    </Badge>
                    <span className="flex-1 text-sm">{heading.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liens et images */}
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
                      {structureData.images.filter(img => img.attributes.alt).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">Sans alt</span>
                    <Badge variant="destructive">
                      {structureData.images.filter(img => !img.attributes.alt).length}
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
                      Problèmes détectés
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {structureData.issues.map((issue, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded">
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
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
                      Suggestions d'amélioration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {structureData.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded">
                          <ArrowRight className="h-4 w-4 text-green-500 mt-0.5" />
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
