
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, Loader2, Hash, AlertTriangle, CheckCircle, 
  XCircle, FileText, Eye, Lightbulb, Shield
} from "lucide-react";
import { toast } from "sonner";
import { analyzeHeadings, HeadingStructure } from '@/utils/seo/headingAnalyzer';

interface ContentAnalysis {
  url: string;
  headingStructure: HeadingStructure;
  contentLength: number;
  title: string | null;
  metaDescription: string | null;
  issues: Array<{ type: 'error' | 'warning' | 'success'; message: string }>;
  recommendations: string[];
  seoScore: number;
}

const UrlContentAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);

  const analyzeUrlContent = async () => {
    if (!url.trim()) {
      toast.error("Veuillez entrer une URL valide");
      return;
    }

    // Nettoyer et valider l'URL
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      new URL(cleanUrl);
    } catch (error) {
      toast.error("URL invalide");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log(`🔍 Analyse de: ${cleanUrl}`);
      
      // Liste de proxies CORS améliorée
      const proxies = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://thingproxy.freeboard.io/fetch/'
      ];
      
      let htmlContent = '';
      let proxyUsed = '';
      
      // Essayer chaque proxy
      for (let i = 0; i < proxies.length; i++) {
        const proxy = proxies[i];
        console.log(`Tentative avec proxy ${i + 1}: ${proxy}`);
        
        try {
          const response = await fetch(`${proxy}${encodeURIComponent(cleanUrl)}`, {
            method: 'GET',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            signal: AbortSignal.timeout(10000) // Timeout de 10 secondes
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          if (proxy.includes('allorigins')) {
            const data = await response.json();
            htmlContent = data.contents;
          } else {
            htmlContent = await response.text();
          }

          if (htmlContent && htmlContent.length > 100) {
            proxyUsed = proxy;
            console.log(`✅ Succès avec proxy: ${proxy}`);
            break;
          }
          
        } catch (proxyError) {
          console.error(`❌ Proxy ${i + 1} échoué:`, proxyError);
          continue;
        }
      }

      if (!htmlContent || htmlContent.length < 100) {
        throw new Error('Impossible de récupérer le contenu de la page');
      }

      // Parser le HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Analyser la structure des titres
      const headingStructure = analyzeHeadings(doc);

      // Extraire les métadonnées
      const titleElement = doc.querySelector('title');
      const title = titleElement?.textContent?.trim() || null;

      const metaDescElement = doc.querySelector('meta[name="description"]');
      const metaDescription = metaDescElement?.getAttribute('content')?.trim() || null;

      // Calculer la longueur du contenu
      const textContent = doc.body?.textContent || '';
      const contentLength = textContent.split(/\s+/).filter(word => word.length > 0).length;

      // Générer les issues et recommandations
      const issues: Array<{ type: 'error' | 'warning' | 'success'; message: string }> = [];
      const recommendations: string[] = [];
      let seoScore = 100;

      // Vérifications SEO
      if (headingStructure.h1Count === 0) {
        issues.push({ type: 'error', message: 'Aucune balise H1 trouvée' });
        recommendations.push('Ajoutez une balise H1 unique et descriptive');
        seoScore -= 20;
      } else if (headingStructure.h1Count > 1) {
        issues.push({ type: 'warning', message: `${headingStructure.h1Count} balises H1 trouvées (recommandé: 1 seule)` });
        recommendations.push('Utilisez une seule balise H1 par page');
        seoScore -= 15;
      } else {
        issues.push({ type: 'success', message: 'Structure H1 correcte (1 seule balise H1)' });
      }

      if (headingStructure.h2Count === 0) {
        issues.push({ type: 'warning', message: 'Aucune balise H2 trouvée' });
        recommendations.push('Ajoutez des sous-titres H2 pour structurer votre contenu');
        seoScore -= 10;
      } else {
        issues.push({ type: 'success', message: `Structure avec ${headingStructure.h2Count} balises H2` });
      }

      if (!title) {
        issues.push({ type: 'error', message: 'Balise title manquante' });
        recommendations.push('Ajoutez une balise title unique et descriptive (50-60 caractères)');
        seoScore -= 25;
      } else if (title.length < 30) {
        issues.push({ type: 'warning', message: `Title trop court (${title.length} caractères)` });
        recommendations.push('Allongez votre title pour atteindre 50-60 caractères');
        seoScore -= 10;
      } else if (title.length > 70) {
        issues.push({ type: 'warning', message: `Title trop long (${title.length} caractères)` });
        recommendations.push('Raccourcissez votre title à 50-60 caractères');
        seoScore -= 5;
      } else {
        issues.push({ type: 'success', message: `Title bien optimisé (${title.length} caractères)` });
      }

      if (!metaDescription) {
        issues.push({ type: 'warning', message: 'Meta description manquante' });
        recommendations.push('Ajoutez une meta description de 150-160 caractères');
        seoScore -= 15;
      } else if (metaDescription.length < 120) {
        issues.push({ type: 'warning', message: `Meta description trop courte (${metaDescription.length} caractères)` });
        recommendations.push('Allongez votre meta description jusqu\'à 150-160 caractères');
        seoScore -= 8;
      } else if (metaDescription.length > 160) {
        issues.push({ type: 'warning', message: `Meta description trop longue (${metaDescription.length} caractères)` });
        recommendations.push('Raccourcissez votre meta description à 150-160 caractères');
        seoScore -= 5;
      } else {
        issues.push({ type: 'success', message: `Meta description optimisée (${metaDescription.length} caractères)` });
      }

      if (contentLength < 300) {
        issues.push({ type: 'warning', message: `Contenu insuffisant (${contentLength} mots)` });
        recommendations.push('Ajoutez plus de contenu textuel (minimum 300 mots)');
        seoScore -= 15;
      } else {
        issues.push({ type: 'success', message: `Contenu substantiel (${contentLength} mots)` });
      }

      // Vérification HTTPS
      if (cleanUrl.startsWith('https://')) {
        issues.push({ type: 'success', message: 'Site sécurisé (HTTPS)' });
      } else {
        issues.push({ type: 'warning', message: 'Site non sécurisé (HTTP)' });
        recommendations.push('Migrez vers HTTPS pour la sécurité');
        seoScore -= 10;
      }

      // S'assurer que le score reste positif
      seoScore = Math.max(20, seoScore);

      const analysisResult: ContentAnalysis = {
        url: cleanUrl,
        headingStructure,
        contentLength,
        title,
        metaDescription,
        issues,
        recommendations,
        seoScore
      };

      setAnalysis(analysisResult);
      toast.success(`Analyse terminée - Score SEO: ${seoScore}/100`);

    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Impossible d\'analyser cette URL', {
        description: 'Vérifiez que l\'URL est accessible et essayez une autre page'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Analyseur de Contenu URL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">
            📊 Analyse de structure de contenu
          </h3>
          <p className="text-blue-800 text-sm">
            Analysez la structure H1-H6 d'une page web, vérifiez l'optimisation SEO 
            et obtenez des recommandations pour améliorer votre contenu.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="https://exemple.com/page"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isAnalyzing}
            onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyzeUrlContent()}
            className="flex-1"
          />
          <Button 
            onClick={analyzeUrlContent}
            disabled={isAnalyzing || !url.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Analyser
              </>
            )}
          </Button>
        </div>

        {analysis && (
          <div className="space-y-6">
            {/* Score SEO */}
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getScoreBgColor(analysis.seoScore)} flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg`}>
                {analysis.seoScore}
              </div>
              <h4 className="text-lg font-semibold mb-2">Score SEO</h4>
              <p className={`text-sm font-medium ${getScoreColor(analysis.seoScore)}`}>
                {analysis.seoScore >= 80 ? 'Excellent' :
                 analysis.seoScore >= 60 ? 'Bon' :
                 analysis.seoScore >= 40 ? 'Moyen' : 'À améliorer'}
              </p>
            </div>

            {/* Structure des titres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-purple-600" />
                  Structure des Titres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysis.headingStructure.h1Count}</div>
                    <div className="text-sm text-gray-600">H1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysis.headingStructure.h2Count}</div>
                    <div className="text-sm text-gray-600">H2</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysis.headingStructure.h3Count}</div>
                    <div className="text-sm text-gray-600">H3</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysis.headingStructure.h4Count}</div>
                    <div className="text-sm text-gray-600">H4</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysis.headingStructure.h5Count}</div>
                    <div className="text-sm text-gray-600">H5</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{analysis.headingStructure.h6Count}</div>
                    <div className="text-sm text-gray-600">H6</div>
                  </div>
                </div>

                {analysis.headingStructure.headings.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Hiérarchie des titres :</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {analysis.headingStructure.headings.map((heading, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                          <Badge variant="outline" className="text-xs">
                            H{heading.level}
                          </Badge>
                          <span className="flex-1 truncate">{heading.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Métadonnées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Métadonnées de la page
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Title :</h4>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                    {analysis.title || 'Aucun title trouvé'}
                  </p>
                  {analysis.title && (
                    <p className="text-xs text-gray-500 mt-1">
                      {analysis.title.length} caractères
                    </p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Meta Description :</h4>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                    {analysis.metaDescription || 'Aucune meta description trouvée'}
                  </p>
                  {analysis.metaDescription && (
                    <p className="text-xs text-gray-500 mt-1">
                      {analysis.metaDescription.length} caractères
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700">Contenu textuel :</h4>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                    {analysis.contentLength} mots
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Issues détectées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Analyse SEO ({analysis.issues.length} points)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {analysis.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getIssueIcon(issue.type)}
                    <p className="text-sm flex-1">{issue.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommandations */}
            {analysis.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    Recommandations ({analysis.recommendations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-blue-800 text-sm">💡 {rec}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlContentAnalyzer;
