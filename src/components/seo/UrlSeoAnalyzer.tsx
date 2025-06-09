
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Globe, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SeoAnalysisResult {
  score: number;
  issues: {
    type: 'error' | 'warning' | 'success';
    category: string;
    message: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  recommendations: string[];
  strengths: string[];
}

const UrlSeoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SeoAnalysisResult | null>(null);

  const analyzeSeoWithOpenAI = async (targetUrl: string): Promise<SeoAnalysisResult> => {
    const openaiKey = localStorage.getItem('openaiKey');
    if (!openaiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    try {
      // Récupérer le contenu de la page avec un proxy CORS
      console.log(`Récupération du contenu pour: ${targetUrl}`);
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Impossible de récupérer le contenu: ${response.status}`);
      }
      
      const data = await response.json();
      const htmlContent = data.contents;
      
      if (!htmlContent) {
        throw new Error('Contenu HTML vide');
      }
      
      console.log(`Contenu récupéré, taille: ${htmlContent.length} caractères`);
      
      // Extraire des informations basiques du HTML
      const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
      const metaDescMatch = htmlContent.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
      const h1Matches = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/gi);
      const imgMatches = htmlContent.match(/<img[^>]*>/gi);
      const imgWithoutAlt = imgMatches ? imgMatches.filter(img => !img.includes('alt=')).length : 0;
      
      // Créer un prompt d'analyse détaillé
      const prompt = `Analysez ce site web et donnez un score SEO précis basé sur l'analyse réelle du contenu.

URL: ${targetUrl}
Title: ${titleMatch ? titleMatch[1] : 'Aucun'}
Meta description: ${metaDescMatch ? metaDescMatch[1] : 'Aucune'}
Nombre de H1: ${h1Matches ? h1Matches.length : 0}
Images sans alt: ${imgWithoutAlt}

Contenu HTML (extrait): ${htmlContent.substring(0, 2000)}

Analysez et donnez un score SEO réaliste entre 0 et 100 basé sur:
- Présence et qualité du title (15 points)
- Meta description (10 points)
- Structure des titres H1-H6 (15 points)
- Optimisation des images (10 points)
- Contenu et mots-clés (20 points)
- Performance technique visible (15 points)
- Structure générale (15 points)

Répondez UNIQUEMENT en JSON valide:
{
  "score": number (score réel entre 0-100),
  "issues": [{"type": "error|warning|success", "category": string, "message": string, "impact": "high|medium|low"}],
  "recommendations": [string],
  "strengths": [string]
}`;

      // Appel à OpenAI
      console.log('Envoi de la requête à OpenAI...');
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert SEO qui analyse précisément les sites web. Donne des scores réalistes basés sur l\'analyse réelle du contenu. Sois critique et précis. Réponds uniquement en JSON valide.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 1500
        }),
      });

      if (!openAIResponse.ok) {
        const errorText = await openAIResponse.text();
        console.error('Erreur OpenAI:', openAIResponse.status, errorText);
        throw new Error(`Erreur OpenAI: ${openAIResponse.status}`);
      }

      const openAIData = await openAIResponse.json();
      const content = openAIData.choices[0].message.content;
      
      console.log('Réponse OpenAI reçue:', content);
      
      try {
        const parsedResult = JSON.parse(content);
        console.log('Analyse parsed:', parsedResult);
        return parsedResult;
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', content);
        
        // Fallback intelligent basé sur l'analyse réelle du contenu
        let score = 50; // Score de base
        const issues: any[] = [];
        const recommendations: string[] = [];
        const strengths: string[] = [];
        
        // Analyse du title
        if (!titleMatch) {
          score -= 15;
          issues.push({
            type: 'error',
            category: 'Title',
            message: 'Balise title manquante',
            impact: 'high'
          });
          recommendations.push('Ajoutez une balise title descriptive');
        } else {
          strengths.push('Balise title présente');
          if (titleMatch[1].length > 60) {
            score -= 5;
            issues.push({
              type: 'warning',
              category: 'Title',
              message: 'Title trop long (>60 caractères)',
              impact: 'medium'
            });
          }
        }
        
        // Analyse meta description
        if (!metaDescMatch) {
          score -= 10;
          issues.push({
            type: 'error',
            category: 'Meta Description',
            message: 'Meta description manquante',
            impact: 'high'
          });
          recommendations.push('Ajoutez une meta description de 150-160 caractères');
        } else {
          strengths.push('Meta description présente');
        }
        
        // Analyse H1
        if (!h1Matches || h1Matches.length === 0) {
          score -= 10;
          issues.push({
            type: 'error',
            category: 'Structure',
            message: 'Aucune balise H1 trouvée',
            impact: 'high'
          });
        } else if (h1Matches.length > 1) {
          score -= 5;
          issues.push({
            type: 'warning',
            category: 'Structure',
            message: `${h1Matches.length} balises H1 trouvées (recommandé: 1 seule)`,
            impact: 'medium'
          });
        } else {
          strengths.push('Structure H1 correcte');
        }
        
        // Analyse images
        if (imgWithoutAlt > 0) {
          score -= Math.min(imgWithoutAlt * 2, 10);
          issues.push({
            type: 'warning',
            category: 'Images',
            message: `${imgWithoutAlt} image(s) sans attribut alt`,
            impact: 'medium'
          });
          recommendations.push('Ajoutez des attributs alt à toutes les images');
        }
        
        // Vérifier la longueur du contenu
        const textContent = htmlContent.replace(/<[^>]*>/g, ' ').trim();
        if (textContent.length < 300) {
          score -= 10;
          issues.push({
            type: 'warning',
            category: 'Contenu',
            message: 'Contenu textuel insuffisant',
            impact: 'medium'
          });
          recommendations.push('Ajoutez plus de contenu textuel (minimum 300 mots)');
        } else {
          strengths.push('Contenu textuel suffisant');
        }
        
        // S'assurer que le score reste dans les limites
        score = Math.max(0, Math.min(100, score));
        
        return {
          score,
          issues,
          recommendations,
          strengths
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse OpenAI:', error);
      throw error;
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    const openaiKey = localStorage.getItem('openaiKey');
    if (!openaiKey) {
      toast.error('Veuillez configurer votre clé API OpenAI dans les paramètres');
      return;
    }

    try {
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = `https://${url}`;
      }

      // Validation URL
      new URL(formattedUrl);

      setIsAnalyzing(true);
      setResult(null);

      toast.info(`Analyse de ${formattedUrl} en cours...`);
      
      const analysisResult = await analyzeSeoWithOpenAI(formattedUrl);
      setResult(analysisResult);
      
      toast.success(`Analyse terminée - Score SEO: ${analysisResult.score}/100`);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('OpenAI')) {
          toast.error('Erreur API OpenAI', {
            description: 'Vérifiez votre clé API OpenAI'
          });
        } else if (error.message.includes('récupérer')) {
          toast.error('Impossible d\'accéder à l\'URL', {
            description: 'Vérifiez que l\'URL est accessible publiquement'
          });
        } else {
          toast.error('Erreur d\'analyse', {
            description: error.message
          });
        }
      } else {
        toast.error('Erreur inconnue lors de l\'analyse');
      }
    } finally {
      setIsAnalyzing(false);
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
            Analyse SEO par URL avec IA
          </h3>
          <p className="text-gray-600 text-sm">
            Analysez le SEO de n'importe quelle URL et obtenez un score détaillé avec des recommandations personnalisées.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="https://exemple.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
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
        </div>

        {result && (
          <div className="space-y-6">
            {/* Score principal */}
            <div className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getScoreBgColor(result.score)} flex items-center justify-center text-white text-2xl font-bold mb-4`}>
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
                      <p className="text-green-800 text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problèmes détectés */}
            {result.issues.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
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
                  <CheckCircle className="w-5 h-5" />
                  Recommandations ({result.recommendations.length})
                </h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-blue-800 text-sm">• {rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!localStorage.getItem('openaiKey') && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm">
              <strong>Configuration requise :</strong> Veuillez configurer votre clé API OpenAI pour utiliser cette fonctionnalité.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UrlSeoAnalyzer;
