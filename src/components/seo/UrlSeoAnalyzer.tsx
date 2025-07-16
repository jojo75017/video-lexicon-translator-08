import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Globe, Loader2, CheckCircle, XCircle, AlertTriangle, Shield, RefreshCw, Key, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { OpenAIService } from '@/utils/seo/openaiService';

interface SeoIssue {
  type: 'error' | 'warning' | 'success';
  category: string;
  message: string;
  impact: 'high' | 'medium' | 'low';
}

interface SeoAnalysisResult {
  score: number;
  issues: SeoIssue[];
  recommendations: string[];
  strengths: string[];
  analysisDetails: {
    title: string | null;
    metaDescription: string | null;
    h1Count: number;
    imagesWithoutAlt: number;
    contentLength: number;
    hasRobots: boolean;
  };
  aiEnhanced?: boolean;
}

const UrlSeoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SeoAnalysisResult | null>(null);
  const [analysisStep, setAnalysisStep] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'unchecked' | 'valid' | 'invalid'>('unchecked');

  // Charger la clé OpenAI depuis localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('openaiKey');
    if (savedKey) {
      setOpenaiKey(savedKey);
      setApiKeyStatus('valid');
    }
  }, []);

  const validateAndSaveApiKey = async () => {
    if (!openaiKey) {
      toast.error('Veuillez entrer une clé API OpenAI');
      return;
    }

    try {
      setApiKeyStatus('unchecked');
      toast.info('Validation de la clé API...');
      
      const isValid = await OpenAIService.validateApiKey(openaiKey);
      
      if (isValid) {
        localStorage.setItem('openaiKey', openaiKey);
        setApiKeyStatus('valid');
        setShowApiConfig(false);
        toast.success('Clé API OpenAI validée et sauvegardée');
      } else {
        setApiKeyStatus('invalid');
        toast.error('Clé API OpenAI invalide');
      }
    } catch (error) {
      setApiKeyStatus('invalid');
      toast.error('Erreur lors de la validation de la clé API');
    }
  };

  const analyzeHtmlContent = async (htmlContent: string, targetUrl: string): Promise<SeoAnalysisResult> => {
    console.log('📊 Analyse du contenu HTML récupéré');
    
    const issues: SeoIssue[] = [];
    const recommendations: string[] = [];
    const strengths: string[] = [];
    let score = 85;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Analyse du titre avec méthodes multiples
    let title = '';
    
    // Méthode 1: Balise title
    const titleElement = doc.querySelector('title');
    if (titleElement?.textContent) {
      title = titleElement.textContent.trim();
    }
    
    // Méthode 2: Open Graph title
    if (!title) {
      const ogTitle = doc.querySelector('meta[property="og:title"]');
      if (ogTitle?.getAttribute('content')) {
        title = ogTitle.getAttribute('content')!.trim();
      }
    }
    
    // Méthode 3: H1 principal
    if (!title) {
      const h1 = doc.querySelector('h1');
      if (h1?.textContent) {
        title = h1.textContent.trim();
      }
    }
    
    // Méthode 4: Recherche dans le contenu HTML brut
    if (!title && htmlContent) {
      const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/&[^;]+;/g, '').trim();
      }
    }
    
    console.log('🔍 Titre final détecté:', title);
    
    // Si on a une clé OpenAI valide, utiliser l'IA pour une analyse plus poussée
    let aiEnhanced = false;
    if (apiKeyStatus === 'valid' && openaiKey) {
      try {
        setAnalysisStep('Analyse IA en cours...');
        const openAIService = new OpenAIService(openaiKey);
        const aiAnalysis = await openAIService.analyzeSeoContent(targetUrl, htmlContent.substring(0, 4000));
        
        if (aiAnalysis) {
          aiEnhanced = true;
          // Améliorer l'analyse avec les données IA
          if (aiAnalysis.title && !title) {
            title = aiAnalysis.title;
          }
          
          // Ajouter les recommandations IA
          if (aiAnalysis.recommendations) {
            recommendations.push(...aiAnalysis.recommendations);
          }
          
          // Ajuster le score avec l'analyse IA
          if (aiAnalysis.score) {
            score = Math.round((score + aiAnalysis.score) / 2);
          }
        }
      } catch (error) {
        console.error('Erreur analyse IA:', error);
        // Continuer avec l'analyse standard
      }
    }
    
    if (!title || title.length === 0) {
      score -= 20;
      issues.push({
        type: 'error',
        category: 'Title',
        message: 'Balise title manquante ou vide',
        impact: 'high'
      });
      recommendations.push('Ajoutez une balise <title> descriptive et unique');
    } else if (title.length < 30) {
      score -= 10;
      issues.push({
        type: 'warning',
        category: 'Title',
        message: `Title trop court (${title.length} caractères) - optimal: 50-60`,
        impact: 'medium'
      });
      recommendations.push('Allongez votre titre pour atteindre 50-60 caractères');
    } else if (title.length > 70) {
      score -= 5;
      issues.push({
        type: 'warning',
        category: 'Title',
        message: `Title trop long (${title.length} caractères) - optimal: 50-60`,
        impact: 'medium'
      });
      recommendations.push('Raccourcissez votre titre pour qu\'il soit visible entièrement dans les résultats');
    } else {
      strengths.push(`Title bien optimisé (${title.length} caractères)`);
    }

    // Analyse de la meta description
    let metaDescription = '';
    
    const metaDescElement = doc.querySelector('meta[name="description"]');
    if (metaDescElement?.getAttribute('content')) {
      metaDescription = metaDescElement.getAttribute('content')!.trim();
    }
    
    if (!metaDescription && htmlContent) {
      const metaMatch = htmlContent.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
      if (metaMatch && metaMatch[1]) {
        metaDescription = metaMatch[1].trim();
      }
    }
    
    console.log('🔍 Meta description détectée:', metaDescription);
    
    if (!metaDescription || metaDescription.length === 0) {
      score -= 15;
      issues.push({
        type: 'error',
        category: 'Meta Description',
        message: 'Meta description manquante',
        impact: 'high'
      });
      recommendations.push('Ajoutez une meta description de 150-160 caractères');
    } else if (metaDescription.length < 120) {
      score -= 8;
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: `Meta description trop courte (${metaDescription.length} caractères)`,
        impact: 'medium'
      });
      recommendations.push('Allongez votre meta description jusqu\'à 150-160 caractères');
    } else if (metaDescription.length > 160) {
      score -= 5;
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: `Meta description trop longue (${metaDescription.length} caractères)`,
        impact: 'medium'
      });
      recommendations.push('Raccourcissez votre meta description à 150-160 caractères');
    } else {
      strengths.push(`Meta description optimisée (${metaDescription.length} caractères)`);
    }

    // Analyse des titres H1-H6
    const h1Elements = doc.querySelectorAll('h1');
    const h2Elements = doc.querySelectorAll('h2');
    
    if (h1Elements.length === 0) {
      score -= 15;
      issues.push({
        type: 'error',
        category: 'Structure',
        message: 'Aucun titre H1 trouvé',
        impact: 'high'
      });
      recommendations.push('Ajoutez un titre H1 principal à votre page');
    } else if (h1Elements.length > 1) {
      score -= 8;
      issues.push({
        type: 'warning',
        category: 'Structure',
        message: `Plusieurs H1 détectés (${h1Elements.length}) - recommandé: 1 seul`,
        impact: 'medium'
      });
      recommendations.push('Utilisez un seul H1 par page et des H2-H6 pour la hiérarchie');
    } else {
      strengths.push('Structure H1 correcte (1 seul H1)');
    }

    // Analyse du contenu textuel
    const textContent = doc.body?.textContent || '';
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    
    console.log('🔍 Nombre de mots détecté:', wordCount);
    
    if (wordCount < 300) {
      score -= 12;
      issues.push({
        type: 'warning',
        category: 'Contenu',
        message: `Contenu textuel insuffisant (${wordCount} mots) - minimum recommandé: 300`,
        impact: 'medium'
      });
      recommendations.push('Ajoutez plus de contenu textuel de qualité (300+ mots)');
    } else if (wordCount >= 500) {
      strengths.push(`Contenu substantiel (${wordCount} mots)`);
    }

    // Analyse des images
    const images = doc.querySelectorAll('img');
    let imagesWithoutAlt = 0;
    images.forEach(img => {
      const alt = img.getAttribute('alt');
      if (!alt || alt.trim() === '') {
        imagesWithoutAlt++;
      }
    });

    if (imagesWithoutAlt > 0) {
      score -= Math.min(10, imagesWithoutAlt * 2);
      issues.push({
        type: 'warning',
        category: 'Accessibilité',
        message: `${imagesWithoutAlt} image(s) sans attribut alt`,
        impact: 'medium'
      });
      recommendations.push('Ajoutez des attributs alt descriptifs à toutes vos images');
    } else if (images.length > 0) {
      strengths.push(`Toutes les images ont un attribut alt (${images.length} images)`);
    }

    // Vérification HTTPS
    if (targetUrl.startsWith('https://')) {
      strengths.push('Site sécurisé (HTTPS)');
    } else {
      score -= 10;
      issues.push({
        type: 'error',
        category: 'Sécurité',
        message: 'Site non sécurisé (HTTP au lieu de HTTPS)',
        impact: 'high'
      });
      recommendations.push('Migrez vers HTTPS pour la sécurité');
    }

    // S'assurer que le score reste dans les limites
    score = Math.max(20, Math.min(100, score));

    return {
      score,
      issues,
      recommendations,
      strengths,
      analysisDetails: {
        title,
        metaDescription,
        h1Count: doc.querySelectorAll('h1').length,
        imagesWithoutAlt: Array.from(doc.querySelectorAll('img')).filter(img => !img.getAttribute('alt')).length,
        contentLength: doc.body?.textContent?.split(/\s+/).filter(word => word.length > 0).length || 0,
        hasRobots: !!doc.querySelector('meta[name="robots"]')
      },
      aiEnhanced
    };
  };

  const analyzeUrlDirectly = async (targetUrl: string): Promise<SeoAnalysisResult> => {
    console.log(`🔍 Analyse de: ${targetUrl}`);
    setAnalysisStep('Récupération du contenu de la page...');
    
    const proxies = [
      'https://api.allorigins.win/get?url=',
      'https://corsproxy.io/?',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    
    for (let i = 0; i < proxies.length; i++) {
      try {
        const proxy = proxies[i];
        console.log(`Tentative avec proxy ${i + 1}: ${proxy}`);
        
        const response = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        let htmlContent = '';
        if (proxy.includes('allorigins')) {
          const data = await response.json();
          htmlContent = data.contents;
        } else {
          htmlContent = await response.text();
        }

        if (!htmlContent) {
          throw new Error('Contenu vide récupéré');
        }

        setAnalysisStep('Analyse du contenu HTML...');
        const analysis = await analyzeHtmlContent(htmlContent, targetUrl);
        
        console.log('📊 Analyse terminée:', analysis);
        return analysis;
        
      } catch (error) {
        console.error(`❌ Proxy ${i + 1} échoué:`, error);
        if (i === proxies.length - 1) {
          console.log('Tous les proxies ont échoué, analyse basique');
          return {
            score: 45,
            issues: [
              {
                type: 'error',
                category: 'Accès',
                message: 'Impossible d\'accéder au contenu de la page pour analyse complète',
                impact: 'high'
              }
            ],
            recommendations: [
              'Vérifiez que l\'URL est accessible publiquement',
              'Le site peut avoir des restrictions d\'accès qui empêchent l\'analyse'
            ],
            strengths: targetUrl.startsWith('https://') ? ['Site sécurisé (HTTPS)'] : [],
            analysisDetails: {
              title: null,
              metaDescription: null,
              h1Count: 0,
              imagesWithoutAlt: 0,
              contentLength: 0,
              hasRobots: false
            }
          };
        }
      }
    }

    throw new Error('Analyse impossible');
  };

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL valide');
      return;
    }

    try {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      new URL(formattedUrl);

      setIsAnalyzing(true);
      setResult(null);
      setAnalysisStep('Démarrage de l\'analyse...');

      console.log(`🚀 Analyse SEO de: ${formattedUrl}`);
      toast.info(`Analyse de ${formattedUrl} en cours...`);
      
      const analysisResult = await analyzeUrlDirectly(formattedUrl);
      setResult(analysisResult);
      
      toast.success(`✅ Analyse terminée - Score SEO: ${analysisResult.score}/100${analysisResult.aiEnhanced ? ' (IA)' : ''}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse:', error);
      
      if (error instanceof Error) {
        toast.error('Erreur d\'analyse', {
          description: error.message
        });
      } else {
        toast.error('Erreur inconnue lors de l\'analyse');
      }
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
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

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Analyseur SEO d'URL
            {apiKeyStatus === 'valid' && (
              <Badge className="bg-green-100 text-green-800 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                IA activée
              </Badge>
            )}
          </h3>
          <p className="text-gray-600 text-sm">
            Analysez le SEO de n'importe quelle URL. 
            {apiKeyStatus !== 'valid' && (
              <span className="text-blue-600 font-medium"> Configurez OpenAI pour une analyse plus précise.</span>
            )}
          </p>
        </div>

        {/* Configuration OpenAI */}
        {(showApiConfig || apiKeyStatus !== 'valid') && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Configuration OpenAI (optionnelle)
            </h4>
            <div className="flex gap-2 mb-2">
              <Input
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={validateAndSaveApiKey} disabled={!openaiKey}>
                Valider
              </Button>
            </div>
            <p className="text-xs text-blue-600">
              Avec OpenAI, obtenez une analyse plus précise du contenu et des recommandations personnalisées.
            </p>
          </Card>
        )}

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="https://exemple.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
              onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && handleAnalyze()}
            />
          </div>
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !url}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Analyser
              </>
            )}
          </Button>
          {apiKeyStatus !== 'valid' && (
            <Button 
              variant="outline"
              onClick={() => setShowApiConfig(!showApiConfig)}
            >
              <Key className="w-4 h-4" />
            </Button>
          )}
        </div>

        {isAnalyzing && analysisStep && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-blue-800 text-sm">{analysisStep}</span>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Score principal */}
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getScoreBgColor(result.score)} flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg`}>
                {result.score}
              </div>
              <h4 className="text-xl font-semibold mb-2">Score SEO</h4>
              <Progress value={result.score} className="w-full max-w-md mx-auto" />
              <p className={`text-sm mt-2 font-medium ${getScoreColor(result.score)}`}>
                {result.score >= 80 ? 'Excellent' :
                 result.score >= 60 ? 'Bon' :
                 result.score >= 40 ? 'Moyen' : 'Nécessite des améliorations'}
              </p>
            </div>

            {/* Détails de l'analyse */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-gray-800">Détails de l'analyse</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Title:</span>
                  <span className="ml-2 font-medium">
                    {result.analysisDetails.title ? '✅ Présent' : '❌ Manquant'}
                  </span>
                  {result.analysisDetails.title && (
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      "{result.analysisDetails.title}"
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-gray-600">Meta desc:</span>
                  <span className="ml-2 font-medium">
                    {result.analysisDetails.metaDescription ? '✅ Présent' : '❌ Manquant'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">H1:</span>
                  <span className="ml-2 font-medium">{result.analysisDetails.h1Count}</span>
                </div>
                <div>
                  <span className="text-gray-600">Images sans alt:</span>
                  <span className="ml-2 font-medium">{result.analysisDetails.imagesWithoutAlt}</span>
                </div>
                <div>
                  <span className="text-gray-600">Contenu:</span>
                  <span className="ml-2 font-medium">{result.analysisDetails.contentLength} mots</span>
                </div>
                <div>
                  <span className="text-gray-600">Robots:</span>
                  <span className="ml-2 font-medium">
                    {result.analysisDetails.hasRobots ? '✅ OK' : '⚠️ Manquant'}
                  </span>
                </div>
              </div>
            </div>

            {/* Points forts */}
            {result.strengths.length > 0 && (
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Points forts ({result.strengths.length})
                </h4>
                <div className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-green-800 text-sm">✅ {strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problèmes détectés */}
            {result.issues.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Problèmes détectés ({result.issues.length})
                </h4>
                <div className="space-y-3">
                  {result.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{issue.category}</span>
                          <Badge variant={issue.impact === 'high' ? 'destructive' : issue.impact === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                            {issue.impact === 'high' ? 'Impact élevé' : issue.impact === 'medium' ? 'Impact moyen' : 'Impact faible'}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-sm">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommandations */}
            {result.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Recommandations ({result.recommendations.length})
                </h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-blue-800 text-sm">💡 {rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton relancer analyse */}
            <div className="text-center pt-4">
              <Button 
                onClick={handleAnalyze}
                variant="outline"
                disabled={isAnalyzing}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Relancer l'analyse
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UrlSeoAnalyzer;
