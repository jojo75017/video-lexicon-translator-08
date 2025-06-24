
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Network, Brain, Target, Zap, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";
import { SemanticCluster, KeywordSuggestion } from "@/types/seo/Keyword";

interface SemanticAnalysisProps {
  keyword?: string;
}

const SemanticAnalysis: React.FC<SemanticAnalysisProps> = ({ keyword = '' }) => {
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [semanticClusters, setSemanticClusters] = useState<SemanticCluster[]>([]);
  const [entityMapping, setEntityMapping] = useState<any[]>([]);
  const [topicalAuthority, setTopicalAuthority] = useState<any[]>([]);

  const analyzeSemantics = async () => {
    if (!searchKeyword.trim()) {
      toast.error("Veuillez entrer un mot-clé");
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      // Simulation d'analyse sémantique avancée
      const clusters: SemanticCluster[] = [
        {
          mainTopic: `${searchKeyword} - Guide complet`,
          keywords: [`guide ${searchKeyword}`, `tutoriel ${searchKeyword}`, `apprendre ${searchKeyword}`, `débuter avec ${searchKeyword}`],
          intent: 'informational',
          difficulty: 45,
          opportunity: 78,
          contentType: 'Guide détaillé'
        },
        {
          mainTopic: `${searchKeyword} - Comparaison`,
          keywords: [`meilleur ${searchKeyword}`, `${searchKeyword} vs`, `comparatif ${searchKeyword}`, `choisir ${searchKeyword}`],
          intent: 'commercial',
          difficulty: 62,
          opportunity: 65,
          contentType: 'Article comparatif'
        },
        {
          mainTopic: `${searchKeyword} - Achat`,
          keywords: [`acheter ${searchKeyword}`, `prix ${searchKeyword}`, `${searchKeyword} pas cher`, `promo ${searchKeyword}`],
          intent: 'transactional',
          difficulty: 78,
          opportunity: 85,
          contentType: 'Page produit'
        },
        {
          mainTopic: `${searchKeyword} - Problèmes`,
          keywords: [`problème ${searchKeyword}`, `erreur ${searchKeyword}`, `dépannage ${searchKeyword}`, `résoudre ${searchKeyword}`],
          intent: 'informational',
          difficulty: 35,
          opportunity: 72,
          contentType: 'FAQ / Support'
        }
      ];

      const entities = [
        { entity: searchKeyword, relevance: 95, type: 'Main Entity', mentions: 127 },
        { entity: `${searchKeyword} professionnel`, relevance: 78, type: 'Related Entity', mentions: 89 },
        { entity: `alternative ${searchKeyword}`, relevance: 65, type: 'Alternative', mentions: 56 },
        { entity: `${searchKeyword} gratuit`, relevance: 82, type: 'Modifier', mentions: 73 }
      ];

      const authority = [
        { topic: `Bases ${searchKeyword}`, authority: 85, coverage: 92, gaps: 2 },
        { topic: `${searchKeyword} avancé`, authority: 67, coverage: 74, gaps: 8 },
        { topic: `${searchKeyword} technique`, authority: 45, coverage: 58, gaps: 15 },
        { topic: `Tendances ${searchKeyword}`, authority: 72, coverage: 81, gaps: 5 }
      ];

      setSemanticClusters(clusters);
      setEntityMapping(entities);
      setTopicalAuthority(authority);
      setIsAnalyzing(false);
      toast.success(`Analyse sémantique terminée pour "${searchKeyword}"`);
    }, 3000);
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 40) return 'text-green-600';
    if (difficulty < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAuthorityColor = (authority: number) => {
    if (authority >= 80) return 'bg-green-500';
    if (authority >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Analyse Sémantique Avancée
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Mot-clé pour l'analyse sémantique..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1"
          />
          <Button onClick={analyzeSemantics} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyse...' : 'Analyser'}
          </Button>
        </div>

        {semanticClusters.length > 0 && (
          <Tabs defaultValue="clusters">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clusters">Clusters sémantiques</TabsTrigger>
              <TabsTrigger value="entities">Entités</TabsTrigger>
              <TabsTrigger value="authority">Autorité topique</TabsTrigger>
            </TabsList>

            <TabsContent value="clusters" className="space-y-4">
              {semanticClusters.map((cluster, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{cluster.mainTopic}</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {cluster.contentType}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2 text-sm">
                      <span>Intent: <Badge variant="outline">{cluster.intent}</Badge></span>
                      <span className={getDifficultyColor(cluster.difficulty)}>
                        Difficulté: {cluster.difficulty}/100
                      </span>
                      <span className="text-green-600">
                        Opportunité: {cluster.opportunity}%
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Mots-clés du cluster:</p>
                      <div className="flex flex-wrap gap-1">
                        {cluster.keywords.map((kw, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Progress value={cluster.opportunity} className="h-2" />
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="entities" className="space-y-3">
              {entityMapping.map((entity, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{entity.entity}</h4>
                      <p className="text-sm text-gray-600">{entity.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{entity.relevance}%</div>
                      <div className="text-xs text-gray-500">{entity.mentions} mentions</div>
                    </div>
                  </div>
                  <Progress value={entity.relevance} className="mt-2 h-2" />
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="authority" className="space-y-3">
              {topicalAuthority.map((topic, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{topic.topic}</h4>
                      <Badge className={`${getAuthorityColor(topic.authority)} text-white`}>
                        {topic.authority}% autorité
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Couverture:</span>
                        <div className="font-medium">{topic.coverage}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Gaps:</span>
                        <div className="font-medium text-red-600">{topic.gaps}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Score:</span>
                        <div className="font-medium">{topic.authority}/100</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Autorité</span>
                        <span>{topic.authority}%</span>
                      </div>
                      <Progress value={topic.authority} className="h-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticAnalysis;
