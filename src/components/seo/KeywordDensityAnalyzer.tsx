
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { BarChart3, Target, Lightbulb, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../utils/seo/openaiService';

interface KeywordSuggestion {
  keyword: string;
  density: number;
  recommended: number;
  status: 'low' | 'good' | 'high';
}

interface AnalysisResult {
  score: number;
  suggestions: KeywordSuggestion[];
  recommendations: string[];
  totalWords: number;
  mainKeywordDensity: number;
}

const KeywordDensityAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [apiKey] = useState(() => localStorage.getItem('openaiKey') || '');

  const analyzeKeywordDensity = async () => {
    if (!targetKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé cible');
      return;
    }

    if (!url.trim() && !content.trim()) {
      toast.error('Veuillez entrer une URL ou du contenu à analyser');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      let textToAnalyze = content;
      
      // Si URL fournie, récupérer le contenu
      if (url.trim() && !content.trim()) {
        try {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
          const data = await response.json();
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, 'text/html');
          textToAnalyze = doc.body?.textContent || '';
        } catch (error) {
          toast.error('Impossible de récupérer le contenu de l\'URL');
          return;
        }
      }

      if (!textToAnalyze.trim()) {
        toast.error('Aucun contenu à analyser');
        return;
      }

      let analysisResult: AnalysisResult;

      if (apiKey) {
        // Analyse avec IA
        const openAIService = new OpenAIService(apiKey);
        const aiResult = await openAIService.analyzeSeoContent(textToAnalyze, targetKeyword);
        
        // Générer des suggestions de mots-clés pour atteindre un score de 90
        const suggestions = await generateKeywordSuggestions(textToAnalyze, targetKeyword, aiResult.score);
        
        analysisResult = {
          score: aiResult.score,
          suggestions,
          recommendations: aiResult.suggestions,
          totalWords: textToAnalyze.split(/\s+/).length,
          mainKeywordDensity: aiResult.keywordDensity
        };
        
        toast.success('Analyse IA terminée !');
      } else {
        // Analyse basique
        analysisResult = performBasicAnalysis(textToAnalyze, targetKeyword);
        toast.info('Analyse basique (configurez OpenAI pour plus de précision)');
      }

      setResult(analysisResult);
    } catch (error) {
      toast.error('Erreur lors de l\'analyse');
      console.error('Erreur analyse:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateKeywordSuggestions = async (text: string, mainKeyword: string, currentScore: number): Promise<KeywordSuggestion[]> => {
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    // Calculer la densité actuelle des mots-clés principaux
    const keywordOccurrences = words.filter(word => word.includes(mainKeyword.toLowerCase())).length;
    const mainDensity = (keywordOccurrences / totalWords) * 100;
    
    const suggestions: KeywordSuggestion[] = [
      {
        keyword: mainKeyword,
        density: Math.round(mainDensity * 100) / 100,
        recommended: 2.5,
        status: mainDensity < 1.5 ? 'low' : mainDensity > 4 ? 'high' : 'good'
      }
    ];

    // Si on a une clé API, utiliser l'IA pour suggérer des mots-clés complémentaires
    if (apiKey && currentScore < 90) {
      try {
        const openAIService = new OpenAIService(apiKey);
        const semanticKeywords = await openAIService.generateSemanticKeywords(mainKeyword);
        
        semanticKeywords.slice(0, 5).forEach(keyword => {
          const occurrences = words.filter(word => word.includes(keyword.toLowerCase())).length;
          const density = (occurrences / totalWords) * 100;
          
          suggestions.push({
            keyword,
            density: Math.round(density * 100) / 100,
            recommended: 1.5,
            status: density < 0.5 ? 'low' : density > 2.5 ? 'high' : 'good'
          });
        });
      } catch (error) {
        console.error('Erreur génération suggestions IA:', error);
      }
    }

    // Ajouter des mots-clés basiques si pas d'IA
    if (!apiKey || suggestions.length === 1) {
      const basicKeywords = [
        `${mainKeyword} gratuit`,
        `${mainKeyword} en ligne`,
        `meilleur ${mainKeyword}`,
        `comment ${mainKeyword}`
      ];
      
      basicKeywords.forEach(keyword => {
        const occurrences = words.filter(word => 
          keyword.toLowerCase().split(' ').every(kw => word.includes(kw))
        ).length;
        const density = (occurrences / totalWords) * 100;
        
        suggestions.push({
          keyword,
          density: Math.round(density * 100) / 100,
          recommended: 1.0,
          status: density < 0.3 ? 'low' : density > 1.5 ? 'high' : 'good'
        });
      });
    }

    return suggestions;
  };

  const performBasicAnalysis = (text: string, targetKeyword: string): AnalysisResult => {
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    const keywordOccurrences = words.filter(word => word.includes(targetKeyword.toLowerCase())).length;
    const density = (keywordOccurrences / totalWords) * 100;
    
    // Score basique basé sur la densité
    let score = 0;
    if (density >= 1.5 && density <= 3) score = 90;
    else if (density >= 1 && density <= 4) score = 75;
    else if (density >= 0.5 && density <= 5) score = 60;
    else score = 30;
    
    const suggestions: KeywordSuggestion[] = [
      {
        keyword: targetKeyword,
        density: Math.round(density * 100) / 100,
        recommended: 2.5,
        status: density < 1.5 ? 'low' : density > 4 ? 'high' : 'good'
      }
    ];

    const recommendations = [
      density < 1.5 ? `Augmentez l'usage de "${targetKeyword}" dans le contenu` : '',
      density > 4 ? `Réduisez l'usage de "${targetKeyword}" pour éviter le sur-optimisation` : '',
      'Ajoutez des synonymes et variations du mot-clé principal',
      'Optimisez les titres H1, H2 avec le mot-clé cible',
      'Intégrez le mot-clé dans les balises alt des images'
    ].filter(rec => rec.length > 0);

    return {
      score,
      suggestions,
      recommendations,
      totalWords,
      mainKeywordDensity: Math.round(density * 100) / 100
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'low': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Analyseur de Densité de Mots-Clés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">URL à analyser</label>
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mot-clé cible</label>
              <Input
                placeholder="mot-clé principal"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Ou collez votre contenu directement
            </label>
            <Textarea
              placeholder="Collez votre contenu ici pour l'analyser..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button
            onClick={analyzeKeywordDensity}
            disabled={isAnalyzing || (!url.trim() && !content.trim()) || !targetKeyword.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Target className="h-4 w-4 mr-2" />
            )}
            Analyser avec l'IA
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Score SEO Global
                <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}/100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={result.score} className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Mots totaux:</span>
                  <span className="font-semibold ml-2">{result.totalWords.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Densité principale:</span>
                  <span className="font-semibold ml-2">{result.mainKeywordDensity}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Mots-clés analysés:</span>
                  <span className="font-semibold ml-2">{result.suggestions.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Recommandations:</span>
                  <span className="font-semibold ml-2">{result.recommendations.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Analyse des Mots-Clés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(suggestion.status)}
                        <span className="font-medium">{suggestion.keyword}</span>
                        <Badge className={getStatusColor(suggestion.status)}>
                          {suggestion.status === 'low' ? 'Trop faible' : 
                           suggestion.status === 'high' ? 'Trop élevée' : 'Optimal'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">
                        {suggestion.density}% (recommandé: {suggestion.recommended}%)
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(suggestion.density / suggestion.recommended * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Recommandations d'Optimisation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default KeywordDensityAnalyzer;
