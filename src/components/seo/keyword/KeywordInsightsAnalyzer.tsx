
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Eye, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";

interface KeywordInsightsAnalyzerProps {
  keywords: KeywordSuggestion[];
}

interface KeywordInsight {
  keyword: string;
  opportunity: number;
  competition: number;
  seasonality: 'stable' | 'seasonal' | 'trending';
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  difficulty: 'facile' | 'moyen' | 'difficile';
  recommendations: string[];
  timeToRank: number; // en mois
  contentGaps: string[];
}

const KeywordInsightsAnalyzer: React.FC<KeywordInsightsAnalyzerProps> = ({ keywords }) => {
  const [insights, setInsights] = useState<KeywordInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeKeywordInsights = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsAnalyzing(true);

    setTimeout(() => {
      const keywordInsights: KeywordInsight[] = keywords.slice(0, 8).map((keyword) => {
        const difficulty = keyword.difficulty || 50;
        const volume = keyword.volume || 1000;
        
        // Calcul de l'opportunité basé sur volume/difficulté
        const opportunity = Math.max(10, Math.min(100, (volume / 100) - difficulty + Math.random() * 30));
        
        const seasonalities: KeywordInsight['seasonality'][] = ['stable', 'seasonal', 'trending'];
        const difficulties: KeywordInsight['difficulty'][] = ['facile', 'moyen', 'difficile'];
        
        const getDifficultyLevel = (diff: number): KeywordInsight['difficulty'] => {
          if (diff < 30) return 'facile';
          if (diff < 60) return 'moyen';
          return 'difficile';
        };

        const getTimeToRank = (diff: number): number => {
          if (diff < 30) return Math.floor(Math.random() * 3) + 1; // 1-3 mois
          if (diff < 60) return Math.floor(Math.random() * 6) + 3; // 3-8 mois
          return Math.floor(Math.random() * 12) + 6; // 6-17 mois
        };

        const recommendations = [
          `Créer du contenu long-form (2000+ mots) pour "${keyword.keyword}"`,
          `Optimiser pour les featured snippets avec des listes`,
          `Développer des pages piliers autour de "${keyword.keyword}"`,
          `Créer des FAQ détaillées sur le sujet`,
          `Optimiser les images avec alt-text pertinent`
        ];

        const contentGaps = [
          'Guide complet manquant',
          'Comparaisons produits absentes',
          'Témoignages clients insuffisants',
          'Contenu vidéo inexistant',
          'FAQ détaillées manquantes'
        ];

        return {
          keyword: keyword.keyword,
          opportunity: Math.round(opportunity),
          competition: keyword.competition || Math.random(),
          seasonality: seasonalities[Math.floor(Math.random() * seasonalities.length)],
          intent: keyword.intent || 'informational',
          difficulty: getDifficultyLevel(difficulty),
          recommendations: recommendations.slice(0, Math.floor(Math.random() * 3) + 2),
          timeToRank: getTimeToRank(difficulty),
          contentGaps: contentGaps.slice(0, Math.floor(Math.random() * 3) + 2)
        };
      });

      setInsights(keywordInsights);
      setIsAnalyzing(false);
      toast.success(`${keywordInsights.length} analyses d'insights générées`);
    }, 3000);
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity >= 80) return 'bg-green-100 text-green-800';
    if (opportunity >= 60) return 'bg-yellow-100 text-yellow-800';
    if (opportunity >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getDifficultyColor = (difficulty: KeywordInsight['difficulty']) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'difficile': return 'bg-red-100 text-red-800';
    }
  };

  const getSeasonalityIcon = (seasonality: KeywordInsight['seasonality']) => {
    switch (seasonality) {
      case 'stable': return '📊';
      case 'seasonal': return '🌊';
      case 'trending': return '🚀';
    }
  };

  const getIntentIcon = (intent: KeywordInsight['intent']) => {
    switch (intent) {
      case 'informational': return '🔍';
      case 'navigational': return '🧭';
      case 'transactional': return '💳';
      case 'commercial': return '🛒';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          Analyse d'insights des mots-clés
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={analyzeKeywordInsights}
          disabled={isAnalyzing || keywords.length === 0}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>Analyse des insights en cours...</>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Analyser les insights
            </>
          )}
        </Button>

        {insights.length > 0 && (
          <Tabs defaultValue="insights" className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
              <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{insight.keyword}</h4>
                    <div className="flex gap-2">
                      <Badge className={getOpportunityColor(insight.opportunity)}>
                        {insight.opportunity}% opportunité
                      </Badge>
                      <Badge className={getDifficultyColor(insight.difficulty)}>
                        {insight.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span>{getSeasonalityIcon(insight.seasonality)}</span>
                      <span className="capitalize">{insight.seasonality}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{getIntentIcon(insight.intent)}</span>
                      <span className="capitalize">{insight.intent}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Temps estimé:</span>
                      <div className="font-medium">{insight.timeToRank} mois</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Compétition:</span>
                      <div className="font-medium">{(insight.competition * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-3">
              {insights
                .filter(insight => insight.opportunity >= 60)
                .sort((a, b) => b.opportunity - a.opportunity)
                .map((insight, index) => (
                  <div key={index} className="p-4 border-l-4 border-l-green-500 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-green-800">{insight.keyword}</h4>
                      <Badge className="bg-green-100 text-green-800">
                        🎯 {insight.opportunity}% opportunité
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-green-700">Gaps de contenu identifiés:</span>
                        <ul className="mt-1 space-y-1">
                          {insight.contentGaps.map((gap, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    {insight.keyword}
                  </h4>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-blue-700">Actions recommandées:</span>
                    <ul className="space-y-1">
                      {insight.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-xs text-gray-500">
                      Temps estimé pour voir des résultats: {insight.timeToRank} mois
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordInsightsAnalyzer;
