
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, MessageCircle, Star, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { KeywordSuggestion } from "@/types/seo/Keyword";
import { VoiceSearchData } from "@/types/seo";

interface VoiceSearchAnalysisProps {
  keywords: KeywordSuggestion[];
}

const VoiceSearchAnalysis: React.FC<VoiceSearchAnalysisProps> = ({ keywords }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceResults, setVoiceResults] = useState<VoiceSearchData[]>([]);
  const [featuredSnippets, setFeaturedSnippets] = useState<any[]>([]);

  const analyzeVoiceSearch = async () => {
    if (keywords.length === 0) {
      toast.error("Aucun mot-clé à analyser");
      return;
    }

    setIsAnalyzing(true);

    // Simulation d'analyse de recherche vocale
    setTimeout(() => {
      const voiceData: VoiceSearchData[] = keywords.slice(0, 6).map((keyword) => {
        const isQuestion = Math.random() > 0.6;
        const questionWords = ['comment', 'pourquoi', 'quoi', 'où', 'quand', 'qui'];
        const randomQuestion = questionWords[Math.floor(Math.random() * questionWords.length)];
        
        return {
          keyword: keyword.keyword,
          isVoiceOptimized: Math.random() > 0.4,
          questionFormat: isQuestion ? `${randomQuestion} ${keyword.keyword}` : keyword.keyword,
          conversationalVariants: [
            `dis-moi ${keyword.keyword}`,
            `je cherche ${keyword.keyword}`,
            `peux-tu m'expliquer ${keyword.keyword}`,
            `${keyword.keyword} près de moi`
          ],
          avgQuestionLength: Math.floor(Math.random() * 10) + 15,
          featuredSnippetChance: Math.floor(Math.random() * 80) + 20
        };
      });

      const snippets = voiceData.filter(v => v.featuredSnippetChance > 60).map((voice, index) => ({
        keyword: voice.keyword,
        type: ['paragraph', 'list', 'table'][index % 3],
        currentHolder: `site-concurrent-${index + 1}.com`,
        opportunity: voice.featuredSnippetChance,
        optimizationTips: [
          'Structurer le contenu en paragraphe de 40-50 mots',
          'Utiliser des listes à puces ou numérotées',
          'Inclure des tableaux comparatifs',
          'Répondre directement à la question'
        ]
      }));

      setVoiceResults(voiceData);
      setFeaturedSnippets(snippets);
      setIsAnalyzing(false);
      toast.success(`${voiceData.length} mots-clés analysés pour la recherche vocale`);
    }, 3000);
  };

  const getVoiceOptimizationScore = (data: VoiceSearchData) => {
    let score = 0;
    if (data.isVoiceOptimized) score += 30;
    if (data.avgQuestionLength >= 15) score += 25;
    if (data.featuredSnippetChance > 50) score += 25;
    if (data.conversationalVariants.length >= 3) score += 20;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSnippetTypeIcon = (type: string) => {
    switch (type) {
      case 'paragraph': return '📝';
      case 'list': return '📋';
      case 'table': return '📊';
      default: return '📄';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-purple-500" />
          Recherche vocale & Featured Snippets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={analyzeVoiceSearch}
          disabled={isAnalyzing || keywords.length === 0}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>Analyse en cours...</>
          ) : (
            <>
              <MessageCircle className="h-4 w-4" />
              Analyser la recherche vocale
            </>
          )}
        </Button>

        {voiceResults.length > 0 && (
          <Tabs defaultValue="voice" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="voice" className="flex items-center gap-1">
                <Mic className="h-4 w-4" />
                Recherche vocale
              </TabsTrigger>
              <TabsTrigger value="snippets" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Featured Snippets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="voice" className="space-y-3">
              {voiceResults.map((voice, index) => {
                const score = getVoiceOptimizationScore(voice);
                return (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{voice.keyword}</h4>
                      <Badge className={getScoreColor(score)}>
                        Score: {score}/100
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Format question:</span>
                        <div className="font-medium">{voice.questionFormat}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Longueur moyenne:</span>
                        <div className="font-medium">{voice.avgQuestionLength} mots</div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-500 block mb-2">Variantes conversationnelles:</span>
                      <div className="flex flex-wrap gap-1">
                        {voice.conversationalVariants.map((variant, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            "{variant}"
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Chance de Featured Snippet:</span>
                      <Badge variant={voice.featuredSnippetChance > 60 ? "default" : "secondary"}>
                        {voice.featuredSnippetChance}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="snippets" className="space-y-3">
              {featuredSnippets.map((snippet, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>{getSnippetTypeIcon(snippet.type)}</span>
                      <h4 className="font-medium">{snippet.keyword}</h4>
                    </div>
                    <Badge variant="outline">
                      {snippet.opportunity}% opportunité
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Type de snippet:</span>
                      <div className="font-medium capitalize">{snippet.type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Détenteur actuel:</span>
                      <div className="font-medium text-blue-600">{snippet.currentHolder}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-2">
                      <HelpCircle className="h-4 w-4 inline mr-1" />
                      Conseils d'optimisation:
                    </span>
                    <ul className="text-xs space-y-1">
                      {snippet.optimizationTips.map((tip: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-green-500 mt-0.5">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
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

export default VoiceSearchAnalysis;
