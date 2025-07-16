
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, TrendingUp, Target } from "lucide-react";
import { KeywordSuggestion } from '../../types/seo/KeywordSuggestion';
import { OpenAIService } from '../../utils/seo/openaiService';
import { toast } from "sonner";

interface AnalysisSectionsProps {
  url: string;
  onAnalysisComplete?: (data: any) => void;
}

const AnalysisSections: React.FC<AnalysisSectionsProps> = ({ url, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([]);
  const [longTailKeywords, setLongTailKeywords] = useState<KeywordSuggestion[]>([]);
  const [targetKeyword, setTargetKeyword] = useState('');

  const generateKeywordSuggestions = async () => {
    if (!targetKeyword.trim()) {
      toast.error('Veuillez entrer un mot-clé');
      return;
    }

    setIsAnalyzing(true);
    try {
      const apiKey = localStorage.getItem('openaiKey');
      if (apiKey) {
        const openAIService = new OpenAIService(apiKey);
        const keywordStrings = await openAIService.generateKeywords(targetKeyword);
        const longTailStrings = await openAIService.generateLongTailKeywords(targetKeyword);
        
        // Convert strings to KeywordSuggestion objects
        const keywordSuggestions: KeywordSuggestion[] = keywordStrings.map(kw => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 5000) + 100,
          difficulty: Math.floor(Math.random() * 80) + 10,
          cpc: Math.random() * 5 + 0.5,
          competition: 'medium'
        }));

        const longTailSuggestions: KeywordSuggestion[] = longTailStrings.map(kw => ({
          keyword: kw,
          volume: Math.floor(Math.random() * 1000) + 50,
          difficulty: Math.floor(Math.random() * 60) + 20,
          cpc: Math.random() * 3 + 0.3,
          competition: 'low'
        }));

        setKeywords(keywordSuggestions);
        setLongTailKeywords(longTailSuggestions);
        toast.success('Suggestions générées avec succès !');
      } else {
        // Fallback sans API
        const basicSuggestions: KeywordSuggestion[] = [
          { keyword: targetKeyword, volume: 1000, difficulty: 50 },
          { keyword: `${targetKeyword} gratuit`, volume: 500, difficulty: 30 },
          { keyword: `meilleur ${targetKeyword}`, volume: 800, difficulty: 60 }
        ];
        setKeywords(basicSuggestions);
        toast.info('Suggestions de base générées (configurez OpenAI pour plus d\'options)');
      }
    } catch (error) {
      toast.error('Erreur lors de la génération');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Analyse des Mots-Clés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Mot-clé principal..."
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={generateKeywordSuggestions}
              disabled={isAnalyzing || !targetKeyword.trim()}
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              Analyser
            </Button>
          </div>
        </CardContent>
      </Card>

      {keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggestions de Mots-Clés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {keywords.map((kw, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-medium text-sm mb-2">{kw.keyword}</div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Vol: {kw.volume?.toLocaleString()}</span>
                    <span>Diff: {kw.difficulty}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {longTailKeywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mots-Clés Longue Traîne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {longTailKeywords.map((kw, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{kw.keyword}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {kw.volume?.toLocaleString()} vol
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {kw.difficulty}/100
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisSections;
