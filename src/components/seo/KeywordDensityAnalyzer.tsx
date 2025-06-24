
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
  position: number;
  isOptimal: boolean;
  recommendation: string;
}

interface DensityAnalysisResult {
  url: string;
  title: string;
  wordCount: number;
  keywordDensities: KeywordDensity[];
  overallScore: number;
  recommendations: string[];
}

const KeywordDensityAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DensityAnalysisResult | null>(null);

  const analyzeKeywordDensity = async () => {
    if (!url.trim()) {
      toast.error('Veuillez entrer une URL');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulation d'analyse (en production, vous utiliseriez une vraie API)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Données simulées d'analyse de densité
      const mockResult: DensityAnalysisResult = {
        url,
        title: `Analyse de densité pour ${new URL(url).hostname}`,
        wordCount: Math.floor(Math.random() * 1500) + 500,
        keywordDensities: generateMockDensities(targetKeyword),
        overallScore: Math.floor(Math.random() * 30) + 70,
        recommendations: [
          "Augmentez la densité du mot-clé principal (actuellement trop faible)",
          "Réduisez la sur-optimisation de certains termes secondaires",
          "Ajoutez des variantes sémantiques du mot-clé principal",
          "Optimisez la répartition des mots-clés dans les titres H2-H3"
        ]
      };
      
      setAnalysisResult(mockResult);
      toast.success('Analyse de densité terminée !');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMockDensities = (mainKeyword: string): KeywordDensity[] => {
    const baseKeywords = [
      mainKeyword || 'seo',
      'optimisation',
      'contenu',
      'web',
      'site',
      'marketing',
      'digital',
      'référencement',
      'google',
      'recherche'
    ];

    return baseKeywords.map((keyword, index) => {
      const count = Math.floor(Math.random() * 20) + 1;
      const density = parseFloat((Math.random() * 5 + 0.5).toFixed(2));
      const isOptimal = density >= 1 && density <= 3;
      
      return {
        keyword,
        count,
        density,
        position: index + 1,
        isOptimal,
        recommendation: isOptimal 
          ? 'Densité optimale' 
          : density < 1 
            ? 'Augmenter la densité' 
            : 'Réduire la densité'
      };
    }).sort((a, b) => b.density - a.density);
  };

  const getDensityColor = (density: number, isOptimal: boolean) => {
    if (isOptimal) return 'text-green-600 bg-green-50';
    if (density < 1) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getDensityIcon = (isOptimal: boolean, density: number) => {
    if (isOptimal) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (density < 1) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Formulaire d'analyse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Analyseur de Densité de Mots-Clés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">URL du site à analyser</label>
              <Input
                placeholder="https://exemple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mot-clé cible (optionnel)</label>
              <Input
                placeholder="Ex: référencement SEO"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
          </div>
          
          <Button
            onClick={analyzeKeywordDensity}
            disabled={isAnalyzing || !url.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyser la densité
              </>
            )}
          </Button>
          
          {isAnalyzing && (
            <div className="space-y-2">
              <Progress value={65} />
              <p className="text-sm text-center text-gray-500">
                Extraction du contenu et analyse des mots-clés...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats d'analyse */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Score global */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Score d'Optimisation Global</span>
                <Badge 
                  className={analysisResult.overallScore >= 80 
                    ? 'bg-green-100 text-green-800' 
                    : analysisResult.overallScore >= 60 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {analysisResult.overallScore}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{analysisResult.wordCount}</div>
                  <div className="text-sm text-gray-500">Mots analysés</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResult.keywordDensities.filter(k => k.isOptimal).length}
                  </div>
                  <div className="text-sm text-gray-500">Densités optimales</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analysisResult.keywordDensities.length}
                  </div>
                  <div className="text-sm text-gray-500">Mots-clés détectés</div>
                </div>
              </div>
              
              <Progress 
                value={analysisResult.overallScore} 
                className="h-3"
              />
            </CardContent>
          </Card>

          {/* Tableau de densité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Analyse Détaillée des Densités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.keywordDensities.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {getDensityIcon(item.isOptimal, item.density)}
                      <div>
                        <div className="font-semibold">{item.keyword}</div>
                        <div className="text-sm text-gray-500">{item.recommendation}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-sm text-gray-500">Occurrences</div>
                        <div className="font-bold">{item.count}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Densité</div>
                        <Badge 
                          className={getDensityColor(item.density, item.isOptimal)}
                        >
                          {item.density}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations d'Optimisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KeywordDensityAnalyzer;
