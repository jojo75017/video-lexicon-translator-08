
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, BarChart3, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OpenAIService } from '../../../utils/seo/openaiService';

const KeywordDensityAnalyzer = () => {
  const [content, setContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey] = useState(() => localStorage.getItem('openaiKey') || '');

  const analyzeContent = async () => {
    if (!content.trim() || !targetKeyword.trim()) {
      toast.error('Veuillez entrer le contenu et le mot-clé cible');
      return;
    }

    setIsAnalyzing(true);
    try {
      if (apiKey) {
        const openAIService = new OpenAIService(apiKey);
        const result = await openAIService.analyzeSeoContent(content, targetKeyword);
        setAnalysis(result);
        toast.success('Analyse terminée avec l\'IA !');
      } else {
        // Analyse basique sans IA
        const words = content.toLowerCase().split(/\s+/);
        const keywordOccurrences = words.filter(word => 
          word.includes(targetKeyword.toLowerCase())
        ).length;
        const density = (keywordOccurrences / words.length) * 100;
        
        const basicAnalysis = {
          keywordDensity: Math.round(density * 100) / 100,
          suggestions: [
            'Optimiser la densité de mots-clés (2-3% recommandé)',
            'Ajouter des variations du mot-clé principal',
            'Améliorer la structure du contenu',
            'Utiliser des synonymes et mots-clés connexes'
          ],
          score: Math.min(density * 20, 100)
        };
        
        setAnalysis(basicAnalysis);
        toast.info('Analyse de base effectuée (configurez OpenAI pour plus d\'options)');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDensityColor = (density: number) => {
    if (density < 1) return 'text-yellow-600';
    if (density <= 3) return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Analyseur de Densité de Mots-Clés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Mot-clé cible</label>
            <Input
              placeholder="Entrez votre mot-clé principal..."
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Contenu à analyser</label>
            <Textarea
              placeholder="Collez votre contenu ici..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>
          
          <Button
            onClick={analyzeContent}
            disabled={isAnalyzing || !content.trim() || !targetKeyword.trim()}
            className="w-full"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            Analyser le contenu
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats de l'analyse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className={`text-2xl font-bold ${getDensityColor(analysis.keywordDensity)}`}>
                  {analysis.keywordDensity}%
                </div>
                <div className="text-sm text-gray-600">Densité</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(analysis.score || 0)}
                </div>
                <div className="text-sm text-gray-600">Score SEO</div>
              </div>
              <div>
                <Badge className={analysis.keywordDensity >= 1 && analysis.keywordDensity <= 3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {analysis.keywordDensity >= 1 && analysis.keywordDensity <= 3 ? 'Optimal' : 'À optimiser'}
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Suggestions d'amélioration</h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KeywordDensityAnalyzer;
